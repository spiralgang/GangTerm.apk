import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CloudIcon, WifiIcon, WifiOffIcon, TerminalIcon, SaveIcon, TrashIcon, PlayIcon, ArchiveIcon, SpinnerIcon } from './Icons';
import { Tooltip } from './Tooltip';
import { useApp } from '../context/AppContext';

declare const Terminal: any;
declare const FitAddon: any;
declare const WebLinksAddon: any;

export const HeadHonchoControllerTool: React.FC = () => {
    const { 
        headHonchoState, 
        setHeadHonchoState, 
        connectToHeadHoncho, 
        disconnectFromHeadHoncho,
        sandboxScript, 
        setSandboxScript, 
        snippets, 
        addSnippet, 
        deleteSnippet,
        isExecutingScript,
        isSnapshotting,
        createWorkspaceSnapshot,
        setTerminalWriteHandler,
        clearTerminal,
        ws,
    } = useApp();

    const { remoteWsUrl, connectionStatus, logs } = headHonchoState;
    const logsEndRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<'ide' | 'pty' | 'logs'>('ide');
    
    const remoteTerminalRef = useRef<HTMLDivElement>(null);
    const xtermRemoteRef = useRef<any>(null);
    const remoteFitAddon = useRef<any>(null);
    
    const [snippetName, setSnippetName] = useState('');
    const [showSavePrompt, setShowSavePrompt] = useState(false);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHeadHonchoState(prev => ({ ...prev, remoteWsUrl: e.target.value }));
    };
    
    const executeScriptRemotely = (script: string) => {
         if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            // Switch to PTY to show output, clear it, then send script
            setActiveTab('pty');
            setTimeout(() => { // Allow time for PTY to render
                clearTerminal.current?.();
                ws.current?.send(JSON.stringify({ action: 'PTY_INPUT', data: script + '\\n' }));
            }, 100);
        }
    };
    
    const initializeTerminal = useCallback(() => {
        if (remoteTerminalRef.current && !xtermRemoteRef.current) {
            const term = new Terminal({
                cursorBlink: true, convertEol: true, fontFamily: `'Fira Code', monospace`, fontSize: 13,
                theme: { background: '#010409', foreground: '#c9d1d9', cursor: '#c9d1d9', selectionBackground: '#1f6feb' },
            });

            remoteFitAddon.current = new FitAddon.FitAddon();
            term.loadAddon(remoteFitAddon.current);
            term.loadAddon(new WebLinksAddon.WebLinksAddon());
            term.open(remoteTerminalRef.current);
            
            xtermRemoteRef.current = term;

            setTerminalWriteHandler((data: string) => term.write(data));
            term.onData((data: string) => {
                if(ws.current && ws.current.readyState === WebSocket.OPEN) {
                    ws.current.send(JSON.stringify({ action: 'PTY_INPUT', data }));
                }
            });

            clearTerminal.current = () => term.clear();
            term.write('\\x1b[32mWelcome to the Head Honcho Remote PTY.\\x1b[0m\\r\\n');
            setTimeout(() => remoteFitAddon.current.fit(), 100);
        }
    }, [setTerminalWriteHandler, clearTerminal, ws]);
    
    useEffect(() => {
        if (activeTab === 'pty' && connectionStatus === 'connected') {
            initializeTerminal();
        }
    }, [activeTab, connectionStatus, initializeTerminal]);
    
    useEffect(() => {
        const handleResize = () => remoteFitAddon.current?.fit();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSaveClick = () => {
        setSnippetName(`Remote Snippet ${snippets.length + 1}`);
        setShowSavePrompt(true);
    };
    
    const handleConfirmSave = () => {
        if(snippetName) {
            addSnippet(snippetName, sandboxScript);
            setShowSavePrompt(false);
            setSnippetName('');
        }
    };

    const StatusIndicator = () => {
        const statusMap = {
            disconnected: { text: 'DISCONNECTED', color: 'bg-red-500', icon: <WifiOffIcon className="w-4 h-4" /> },
            connecting: { text: 'CONNECTING', color: 'bg-yellow-500 animate-pulse', icon: <WifiIcon className="w-4 h-4" /> },
            connected: { text: 'CONNECTED', color: 'bg-green-500', icon: <WifiIcon className="w-4 h-4" /> },
        };
        const current = statusMap[connectionStatus];
        return (
            <div className={`flex items-center gap-2 text-white text-xs font-bold px-3 py-1 rounded-full ${current.color}`}>
                {current.icon}
                <span>{current.text}</span>
            </div>
        );
    };

    return (
        <div className="relative bg-[#0d1117] border border-gray-800 rounded-lg p-4 shadow-lg shadow-black/30 flex flex-col h-[calc(100vh-12rem)]">
             {showSavePrompt && (
                 <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-20 rounded-lg">
                    <div className="bg-[#1e1e1e] border border-gray-600 rounded-lg p-6 text-center shadow-2xl w-full max-w-sm">
                        <h3 className="text-lg font-bold text-white mb-4">Save Snippet</h3>
                        <input type="text" value={snippetName} onChange={(e) => setSnippetName(e.target.value)} className="w-full bg-[#010409] border border-gray-700 rounded-md px-3 py-1.5 text-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none font-fira text-sm mb-4" placeholder="Enter snippet name" />
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setShowSavePrompt(false)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">Cancel</button>
                            <button onClick={handleConfirmSave} disabled={!snippetName} className="bg-blue-600 hover:blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:bg-gray-500">Save</button>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex-shrink-0">
                <div className="flex items-center gap-3 mb-2">
                    <CloudIcon className="w-7 h-7 text-green-300" />
                    <h2 className="text-xl font-bold text-green-300">Head Honcho Controller (x86-64)</h2>
                </div>
                <p className="text-sm text-gray-400">The dashboard for your remote AI compute backend. Connect, edit scripts, and interact with the remote shell.</p>
            </div>
            
            <div className="p-4 bg-[#010409] border border-gray-800 rounded-lg mt-6 flex-shrink-0">
                 <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-green-400">Connection Management</h3>
                        <p className="text-xs text-gray-500">Enter the WebSocket URL provided by your backend.</p>
                    </div>
                    <StatusIndicator />
                </div>
                <div className="flex gap-4">
                    <input id="ws-url" type="text" value={remoteWsUrl} onChange={handleUrlChange} className="w-full bg-[#0d1117] border border-gray-700 rounded-md px-3 py-1.5 text-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none font-fira text-sm" placeholder="wss://your-backend.ngrok-free.app" disabled={connectionStatus !== 'disconnected'}/>
                    <Tooltip text="Attempt to connect to the specified WebSocket URL."><button onClick={connectToHeadHoncho} disabled={connectionStatus !== 'disconnected' || !remoteWsUrl} className="w-40 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed">Connect</button></Tooltip>
                    <Tooltip text="Close the active connection."><button onClick={disconnectFromHeadHoncho} disabled={connectionStatus === 'disconnected'} className="w-40 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed">Disconnect</button></Tooltip>
                </div>
            </div>

            <div className="mt-4 flex-grow flex flex-col min-h-0">
                <div className="flex border-b border-gray-800">
                    {(['ide', 'pty', 'logs'] as const).map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} disabled={tab !== 'logs' && connectionStatus !== 'connected'} className={`px-4 py-2 text-sm font-medium transition-colors disabled:text-gray-600 disabled:cursor-not-allowed ${activeTab === tab ? 'border-b-2 border-green-400 text-green-300' : 'text-gray-400 hover:text-white border-b-2 border-transparent'}`}>
                            {tab.toUpperCase()}
                        </button>
                    ))}
                </div>

                <div className="flex-grow min-h-0 pt-2">
                    {activeTab === 'ide' && connectionStatus === 'connected' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                            <div className="md:col-span-2 flex flex-col h-full">
                                <h3 className="text-base font-semibold text-gray-300 mb-2">Script Editor</h3>
                                <textarea value={sandboxScript} onChange={(e) => setSandboxScript(e.target.value)} className="w-full h-full bg-[#010409] border border-gray-700 rounded-md px-3 py-2 text-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none font-fira text-sm resize-none" placeholder="Write or load a script to execute..." spellCheck="false" />
                                <div className="mt-2 flex gap-2 flex-wrap">
                                    <Tooltip text="Save script as a named snippet."><button onClick={handleSaveClick} disabled={!sandboxScript.trim()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg text-sm disabled:bg-gray-700"><SaveIcon className="w-4 h-4" /> Save</button></Tooltip>
                                    <Tooltip text="Execute script in the remote PTY."><button onClick={() => executeScriptRemotely(sandboxScript)} disabled={!sandboxScript.trim() || isExecutingScript || isSnapshotting} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-lg text-sm disabled:bg-gray-700">{isExecutingScript ? <SpinnerIcon className="w-4 h-4" /> : <TerminalIcon className="w-4 h-4" />}{isExecutingScript ? 'Executing...' : 'Execute'}</button></Tooltip>
                                    <Tooltip text="Snapshot the Head Honcho's workspace."><button onClick={createWorkspaceSnapshot} disabled={isExecutingScript || isSnapshotting} className={`flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-3 rounded-lg text-sm disabled:bg-gray-700 ${isSnapshotting ? 'animate-pulse' : ''}`}>{isSnapshotting ? <SpinnerIcon className="w-4 h-4" /> : <ArchiveIcon className="w-4 h-4" />}{isSnapshotting ? 'Snapshotting...' : 'Snapshot'}</button></Tooltip>
                                </div>
                            </div>
                            <div className="h-full flex flex-col bg-[#010409] border border-gray-800 rounded-md p-2">
                                <h3 className="text-base font-bold text-green-300 mb-2 px-1">Saved Snippets</h3>
                                <div className="space-y-2 overflow-y-auto pr-1 flex-grow">
                                    {snippets.length > 0 ? snippets.map(snippet => (
                                        <div key={snippet.id} className="bg-[#161b22] p-2 rounded-md border border-gray-700 flex justify-between items-center">
                                            <span className="font-fira text-xs text-gray-300 truncate pr-2">{snippet.name}</span>
                                            <div className="flex gap-2 flex-shrink-0">
                                                <Tooltip text={`Load '${snippet.name}'`}><button onClick={() => setSandboxScript(snippet.script)} className="text-gray-400 hover:text-green-400 text-xs font-semibold">Load</button></Tooltip>
                                                <Tooltip text="Delete snippet"><button onClick={() => deleteSnippet(snippet.id)} className="text-gray-400 hover:text-red-400"><TrashIcon className="w-3.5 h-3.5" /></button></Tooltip>
                                            </div>
                                        </div>
                                    )) : (<p className="text-sm text-gray-500 text-center py-4">No snippets saved.</p>)}
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'pty' && connectionStatus === 'connected' && (
                        <div ref={remoteTerminalRef} className="bg-[#010409] border border-gray-700 rounded-md p-1 h-full w-full terminal-container"></div>
                    )}
                    {activeTab === 'logs' && (
                        <div className="h-full bg-black rounded-md p-2 font-fira text-xs text-gray-400 overflow-y-auto border border-gray-700">
                             {logs.length > 0 ? logs.map((log, index) => ( <p key={index} className="whitespace-pre-wrap">{log}</p>)) : <p>No connection logs yet.</p>}
                            <div ref={logsEndRef} />
                        </div>
                    )}
                    {(activeTab !== 'logs' && connectionStatus !== 'connected') && (
                        <div className="text-center text-gray-500 pt-10">Please connect to the Head Honcho to use the IDE and PTY.</div>
                    )}
                </div>
            </div>
        </div>
    );
};