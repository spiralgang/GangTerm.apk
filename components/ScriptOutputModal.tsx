import React, { useState, useRef, useEffect } from 'react';
import { CodeBlock } from './CodeBlock';
import { TerminalIcon, PlayIcon } from './Icons';
import { Tooltip } from './Tooltip';


interface ScriptOutputModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    scriptContent: string;
}

const BlinkingCursor: React.FC = () => (
    <span className="inline-block w-2 h-4 bg-green-400 animate-pulse ml-1" />
);

export const ScriptOutputModal: React.FC<ScriptOutputModalProps> = ({ isOpen, onClose, title, description, scriptContent }) => {
    const [isExecuting, setIsExecuting] = useState(false);
    const [outputLines, setOutputLines] = useState<string[]>([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const outputRef = useRef<HTMLDivElement>(null);
    const timeoutIds = useRef<number[]>([]);

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [outputLines]);

    useEffect(() => {
        // Cleanup timeouts on unmount
        return () => {
            timeoutIds.current.forEach(clearTimeout);
        };
    }, []);
    
    useEffect(() => {
        // Reset whenever a new script is passed in
        resetExecution();
    }, [scriptContent]);

    const resetExecution = () => {
        timeoutIds.current.forEach(clearTimeout);
        timeoutIds.current = [];
        setIsExecuting(false);
        setOutputLines([]);
        setShowConfirmation(false);
    }
    
    const startExecution = () => {
        setShowConfirmation(false);
        simulateLiveExecution();
    };

    const simulateLiveExecution = () => {
        resetExecution();
        setIsExecuting(true);
        setOutputLines(prev => [...prev, "[SYSTEM] Staging script for execution in sandboxed environment..."]);

        const lines = scriptContent.split('\n');
        const executionSteps: { line: string, delay: number }[] = [];
        let totalDelay = 500; // Initial delay

        const isShellConstruct = (line: string): boolean => {
            const trimmed = line.trim();
            // Variable assignment: VAR=... or EXPORT VAR=...
            if (/^\s*(export\s+)?[a-zA-Z_][a-zA-Z0-9_]*=/.test(trimmed)) return true;
            // Control flow keywords or braces
            const keywords = ['if', 'then', 'else', 'elif', 'fi', 'for', 'in', 'do', 'done', 'while', 'case', 'esac', '{', '}'];
            const firstWord = trimmed.split(/\s+|;/)[0];
            if (keywords.includes(firstWord)) return true;
            // Function definition: my_func() {
            if (trimmed.endsWith('{') && trimmed.includes('()')) return true;
            return false;
        };

        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine && !trimmedLine.startsWith('#') && !isShellConstruct(line)) {
                 // This is likely a command
                 totalDelay += Math.random() * 150 + 50; 
                 executionSteps.push({ line: `$ ${trimmedLine}`, delay: totalDelay });

                 // Simulate brief output/work
                 totalDelay += Math.random() * 300 + 100;
            } else {
                 // This is a comment, empty line, or shell construct. Display as is.
                 executionSteps.push({ line: line, delay: totalDelay });
            }
        });


        const finalId = setTimeout(() => {
            setOutputLines(prev => [...prev, "[SYSTEM] Execution finished."]);
            setIsExecuting(false);
        }, totalDelay + 500);
        timeoutIds.current.push(finalId);
    };

    if (!isOpen) return null;

    const encodedScript = encodeURIComponent(scriptContent);
    const termuxIntentUrl = `intent:#Intent;action=com.termux.RUN_COMMAND;package=com.termux;S.com.termux.RUN_COMMAND_PATH=${encodedScript};S.com.termux.RUN_COMMAND_WORKDIR=/data/data/com.termux/files/home;B.com.termux.RUN_COMMAND_BACKGROUND=false;B.com.termux.RUN_COMMAND_SESSION_ACTION=0;end`;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="relative bg-[#0d1117] border border-gray-800 rounded-lg shadow-lg shadow-black/50 max-w-6xl w-full max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {showConfirmation && (
                    <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-10 rounded-lg">
                        <div className="bg-[#1e1e1e] border border-gray-600 rounded-lg p-6 text-center shadow-2xl">
                            <h3 className="text-lg font-bold text-white mb-4">Confirm Live Execution</h3>
                            <p className="text-gray-300 mb-6">This will run a line-by-line visualization of the script. This is a <span className="font-bold text-yellow-300">BETA</span> feature. Are you sure?</p>
                            <div className="flex justify-center gap-4">
                                <button onClick={() => setShowConfirmation(false)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">Cancel</button>
                                <button onClick={startExecution} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">Confirm & Run</button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="p-3 border-b border-gray-800">
                    <h2 className="text-lg font-bold text-green-300">{title}</h2>
                    <p className="text-sm text-gray-400">{description}</p>
                </div>
                <div className="p-3 overflow-y-auto flex-grow grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <h3 className="text-base font-semibold text-gray-300 mb-2">Script Code</h3>
                        <div className="h-[calc(100%-2rem)]">
                            <CodeBlock code={scriptContent} language="bash" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-gray-300 mb-2">Live Execution Log</h3>
                        <div ref={outputRef} className="bg-black border border-gray-700 rounded-md p-3 h-[calc(100%-2rem)] text-xs text-gray-200 font-fira overflow-y-auto">
                            {outputLines.map((line, index) => (
                                <p key={index} className="whitespace-pre-wrap">{line.startsWith('$') ? <><span className="text-green-400 mr-1">$</span>{line.substring(1)}</> : <span className="text-gray-400">{line}</span>}</p>
                            ))}
                            {isExecuting && <BlinkingCursor />}
                        </div>
                    </div>
                </div>
                <div className="p-3 border-t border-gray-800 flex justify-end items-center gap-3">
                     <div className="flex-col items-end text-right">
                        <Tooltip text="Directly sends the script to a new Termux session for execution.">
                             <a
                                href={termuxIntentUrl}
                                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                            >
                                <PlayIcon className="w-5 h-5" />
                                Run in Termux
                            </a>
                        </Tooltip>
                        <p className="text-xs text-yellow-400/80 mt-1">
                            ⚠️ Requires the `termux-url-opener` script. See Guardian for setup.
                        </p>
                     </div>
                    <Tooltip text="Visualize the script's execution flow. This is a high-level simulation and does not produce real output.">
                        <button
                            onClick={() => setShowConfirmation(true)}
                            disabled={isExecuting}
                            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                            <TerminalIcon className="w-5 h-5" />
                            Live Execute (Beta)
                        </button>
                    </Tooltip>
                    {outputLines.length > 0 && !isExecuting && (
                        <button onClick={resetExecution} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                            Reset
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};