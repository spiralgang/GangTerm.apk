import React, { useRef, useEffect, useCallback, useState } from 'react';
import { TerminalIcon, FileSystemIcon, SpinnerIcon } from './Icons';
import { WASI } from '@wasmer/wasi';
import { WasmFs } from '@wasmer/wasmfs';

declare const Terminal: any;
declare const FitAddon: any;

export const SandboxTool: React.FC = () => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<any>(null);
    const fitAddonRef = useRef<any>(null);
    const wasmFsRef = useRef<any>(null);
    const wasiRef = useRef<any>(null);
    const [status, setStatus] = useState<'initializing' | 'ready' | 'error'>('initializing');

    const initializeWasm = useCallback(async (term: any) => {
        try {
            if (!wasmFsRef.current) {
                term.write('Initializing persistent virtual file system...\r\n');
                const wasmFs = new WasmFs();
                
                const savedFs = localStorage.getItem('gangterm_local_vfs_v2');
                if (savedFs) {
                    try {
                        const fsJson = JSON.parse(savedFs);
                        Object.keys(fsJson).forEach(path => {
                            if (path !== '/') {
                                const dir = path.substring(0, path.lastIndexOf('/'));
                                if(dir) wasmFs.fs.mkdirSync(dir, { recursive: true });
                                wasmFs.fs.writeFileSync(path, fsJson[path]);
                            }
                        });
                        term.write('Restored file system from last session.\r\n');
                    } catch (e) {
                         term.write('Could not parse saved file system. Starting fresh.\r\n');
                    }
                } else {
                     wasmFs.fs.mkdirSync('/home/user', { recursive: true });
                }
                
                wasmFsRef.current = wasmFs;
                term.write('Virtual file system ready.\r\n');
            }
            
            term.write('Loading WebAssembly shell (dash)...\r\n');
            const wasi = new WASI({
                args: ['/bin/dash', '-l'],
                env: { 'PATH': '/bin', 'HOME': '/home/user' },
                preopens: { '/': '/', '/bin': '/bin' },
                bindings: { ...WASI.defaultBindings, fs: wasmFsRef.current.fs },
            });
            wasiRef.current = wasi;
            
            const response = await fetch('https://webassembly.sh/api/command?command=dash');
            const wasmBytes = await response.arrayBuffer();
            const module = await WebAssembly.compile(wasmBytes);
            const instance = await wasi.instantiate(module, {});
            
            term.write('Shell loaded. Welcome to GangTerm Local Shell.\r\n');
            term.write('This is a sandboxed POSIX environment running in your browser.\r\n\r\n');
            
            // Non-blocking start
            wasi.start(instance);

            const originalStdout = wasi.getStdoutBuffer;
            const processStdout = () => {
                const stdout = originalStdout.call(wasi);
                if (stdout.length > 0) {
                    term.write(stdout);
                }
                requestAnimationFrame(processStdout);
            };
            processStdout();
            
            const originalStderr = wasi.getStderrBuffer;
            const processStderr = () => {
                const stderr = originalStderr.call(wasi);
                if (stderr.length > 0) {
                    term.write(stderr);
                }
                requestAnimationFrame(processStderr);
            };
            processStderr();
            
            setStatus('ready');
            term.focus();

        } catch (error) {
            console.error("WASM Shell Error:", error);
            term.write(`\r\n\x1b[31mFATAL ERROR: Could not initialize WebAssembly shell.\x1b[0m`);
            term.write(`\r\n\x1b[33mPlease ensure your browser supports WebAssembly and try refreshing the page.\x1b[0m`);
            setStatus('error');
        }
    }, []);

    const initializeTerminal = useCallback(() => {
        if (terminalRef.current && !xtermRef.current) {
            const term = new Terminal({
                cursorBlink: true,
                convertEol: true,
                fontFamily: `'Fira Code', monospace`,
                fontSize: 14,
                theme: { background: '#010409', foreground: '#c9d1d9', cursor: '#c9d1d9' },
            });

            const fitAddon = new FitAddon.FitAddon();
            fitAddonRef.current = fitAddon;
            term.loadAddon(fitAddon);
            term.open(terminalRef.current);
            fitAddon.fit();
            
            term.onData((data: string) => {
                if (wasiRef.current) {
                    wasiRef.current.stdin.write(data);
                }
            });

            xtermRef.current = term;
            initializeWasm(term);
        }
    }, [initializeWasm]);
    
    useEffect(() => {
        initializeTerminal();
        
        const handleResize = () => fitAddonRef.current?.fit();
        window.addEventListener('resize', handleResize);
        
        const saveInterval = setInterval(() => {
             if (wasmFsRef.current && status === 'ready') {
                try {
                    const fsJson: { [key: string]: string } = {};
                    const readdirRecursive = (path: string) => {
                        const entries = wasmFsRef.current.fs.readdirSync(path);
                        for (const entry of entries) {
                            const fullPath = `${path === '/' ? '' : path}/${entry}`;
                            const stats = wasmFsRef.current.fs.statSync(fullPath);
                            if (stats.isDirectory()) {
                                readdirRecursive(fullPath);
                            } else {
                                fsJson[fullPath] = wasmFsRef.current.fs.readFileSync(fullPath, 'utf8');
                            }
                        }
                    };
                    readdirRecursive('/');
                    localStorage.setItem('gangterm_local_vfs_v2', JSON.stringify(fsJson));
                } catch(e) {
                    console.error("Failed to save VFS:", e);
                }
            }
        }, 10000);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearInterval(saveInterval);
            xtermRef.current?.dispose();
            xtermRef.current = null;
        };
    }, [initializeTerminal, status]);

    return (
        <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 shadow-lg shadow-black/30 flex flex-col h-[calc(100vh-12rem)]">
            <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
                 <h2 className="text-xl font-bold text-green-300">Local Shell (ARM64/WASM)</h2>
                 <div className="flex items-center gap-2">
                    {status === 'initializing' && <SpinnerIcon className="w-4 h-4 text-yellow-400" />}
                    <span className={`text-xs font-semibold ${status === 'ready' ? 'text-green-400' : status === 'error' ? 'text-red-400' : 'text-yellow-400'}`}>
                        {status.toUpperCase()}
                    </span>
                 </div>
            </div>
            <p className="text-sm text-gray-400 mb-2">A persistent, autonomous shell environment running directly on your device. Your work here is saved locally and is independent of the remote Head Honcho.</p>

            <div className="flex-grow min-h-0">
                <div ref={terminalRef} className="bg-[#010409] border border-gray-700 rounded-md p-1 h-full w-full terminal-container">
                    {/* xterm.js instance attaches here */}
                </div>
            </div>
             <div className="mt-4 flex items-center gap-3 text-xs text-gray-500">
                <FileSystemIcon className="w-4 h-4"/>
                <span>Virtual file system is persistent and auto-saves to local storage every 10 seconds.</span>
            </div>
        </div>
    );
};