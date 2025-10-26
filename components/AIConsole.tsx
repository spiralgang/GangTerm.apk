import React, { useState, useRef, useEffect } from 'react';
import { BotIcon, SendIcon, UserIcon, Settings2Icon, WifiIcon, WifiOffIcon, ChevronLeftIcon, ChevronRightIcon, ClipboardPlusIcon, CloudIcon } from './Icons';
import { Tooltip } from './Tooltip';
import { useApp } from '../context/AppContext';

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

const determineCurrentFsmState = (guardianState: ReturnType<typeof useApp>['guardianState']) => {
    const { securityLevel, allowNetworkAccess, allowFileSystemAccess, allowPackageInstallation } = guardianState;
    if (securityLevel === 'Lockdown') {
        return {
            name: 'Secure Mode',
            description: 'The environment is in a high-security lockdown state. Network, filesystem, and package installation are restricted by default, awaiting explicit override. Ideal for executing untrusted code.'
        };
    }
    if (securityLevel === 'Development') {
        return {
            name: 'Development Mode',
            description: 'The environment is in a permissive state to facilitate rapid development. Security warnings are minimized, and most operations are allowed. Not suitable for production.'
        };
    }
    if (securityLevel === 'Standard') {
        if (!allowNetworkAccess || !allowFileSystemAccess || !allowPackageInstallation) {
             return {
                name: 'Restricted Operation',
                description: 'The environment is running with standard protections, but one or more key permissions (Network, Filesystem, or Package Installation) have been manually revoked.'
            };
        }
        return {
            name: 'Nominal Operation',
            description: 'The environment is operating under standard security protocols with all core permissions enabled. This is the recommended balanced state.'
        };
    }
     return {
        name: 'Initializing',
        description: 'The FSM state is being determined based on current Guardian settings.'
    };
};


export const AIConsole: React.FC = () => {
    const { 
        activeTool, 
        apkFusionState, 
        scriptLabState, 
        packageManagerState,
        guardianState,
        guardianAuditLog,
        sandboxScript,
        setSandboxScript,
        setActiveTool,
        addGuardianLogEntry,
        headHonchoState,
        ws,
        conversation,
        setConversation,
    } = useApp();

    const [isOpen, setIsOpen] = useState(true);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { connectionStatus, remoteWsUrl } = headHonchoState;
    
    const chatHistoryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [conversation]);
    
    useEffect(() => {
        // When a message from the AI arrives, stop the loading indicator
        if (conversation.length > 0 && conversation[conversation.length - 1].sender === 'ai') {
            setIsLoading(false);
        }
    }, [conversation]);


    const getSystemContext = (): string => {
        const fsmState = determineCurrentFsmState(guardianState);
        let context = `The user is currently in the "${activeTool}" tool.\n`;
        context += `Current FSM State: ${fsmState.name} (${fsmState.description})\n`;

        switch(activeTool) {
            case 'apk-fusion':
                context += `APK Fusion State: ${JSON.stringify(apkFusionState)}\n`;
                break;
            case 'script-lab':
                context += `Script Lab State: ${JSON.stringify(scriptLabState)}\n`;
                break;
            case 'package-manager':
                context += `Package Manager State: ${JSON.stringify(packageManagerState)}\n`;
                break;
            case 'sandbox':
                context += `The user is viewing the sandbox. The current script in the editor is:\n\`\`\`bash\n${sandboxScript}\n\`\`\`\n`;
                break;
            case 'guardian':
                context += `Guardian Settings: ${JSON.stringify(guardianState)}\n`;
                context += `Recent Guardian Audit Log (most recent first):\n${JSON.stringify(guardianAuditLog.slice(0, 5), null, 2)}\n`;
                break;
        }
        return context;
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || connectionStatus !== 'connected') return;

        const userMessage: Message = { sender: 'user', text: input };
        setConversation(prev => [...prev, userMessage]);
        
        ws.current?.send(JSON.stringify({
            action: 'AI_QUERY',
            context: getSystemContext(),
            message: input,
            guardian_mode: guardianState.securityLevel,
        }));

        setInput('');
        setIsLoading(true);
    };

    const handleInsertIntoSandbox = (code: string) => {
        setSandboxScript(prev => `${prev}\n\n# --- Inserted by AI ---\n${code.trim()}\n`);
        setActiveTool('sandbox');
        addGuardianLogEntry('AI Code Insertion', 'Code was inserted into the Sandbox editor.');
    };

    const StatusIndicator = () => {
        const statusMap = {
            disconnected: { icon: <WifiOffIcon className="w-4 h-4 text-red-400" />, text: 'Disconnected', color: 'text-red-400' },
            connecting: { icon: <WifiIcon className="w-4 h-4 text-yellow-400 animate-pulse" />, text: 'Connecting...', color: 'text-yellow-400' },
            connected: { icon: <WifiIcon className="w-4 h-4 text-green-400" />, text: 'Connected', color: 'text-green-400' },
        };
        const current = statusMap[connectionStatus];
        return (
             <Tooltip text={`Head Honcho Status: ${current.text}. URL: ${remoteWsUrl || 'Not set'}`}>
                <div className="flex items-center gap-1.5">
                    {current.icon}
                    <span className={`text-xs font-semibold ${current.color}`}>{current.text}</span>
                </div>
            </Tooltip>
        );
    };
    
    const AIMessage: React.FC<{ message: Message }> = ({ message }) => {
        const codeBlockRegex = /```(?:bash|sh|python|json|text|markdown)?\s*([\s\S]*?)```/g;
        
        const codeBlocks = [...message.text.matchAll(codeBlockRegex)];
    
        return (
            <div className="flex gap-2 items-start">
                <BotIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                <div className="max-w-xs p-2 rounded-lg text-sm bg-gray-800 text-gray-300 relative group text-left">
                    <pre className="whitespace-pre-wrap font-sans">{message.text}</pre>
                     {codeBlocks.length > 0 && (
                         <Tooltip text="Insert the last code block into the Sandbox editor and switch to the Sandbox tool.">
                            <button 
                                onClick={() => handleInsertIntoSandbox(codeBlocks[codeBlocks.length - 1][1])}
                                className="absolute -bottom-2 -right-2 flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1 px-2 rounded-full transition-opacity opacity-0 group-hover:opacity-100"
                            >
                                <ClipboardPlusIcon className="w-3 h-3" />
                                Insert
                            </button>
                        </Tooltip>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className={`fixed bottom-4 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0 right-4' : 'translate-x-full right-0'}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute right-full top-1/2 -translate-y-1/2 bg-[#161b22] border border-gray-700 border-r-0 p-2 rounded-l-md"
            >
                {isOpen ? <ChevronRightIcon className="w-5 h-5 text-gray-300" /> : <ChevronLeftIcon className="w-5 h-5 text-gray-300" />}
            </button>
            <div className="w-96 h-[32rem] bg-[#161b22] border border-gray-700 rounded-lg shadow-2xl shadow-black/50 flex flex-col">
                <header className="flex justify-between items-center p-2 border-b border-gray-700">
                    <div className="flex items-center gap-2">
                        <BotIcon className="w-5 h-5 text-green-400" />
                        <h3 className="font-bold text-sm text-green-300">AI Console</h3>
                    </div>
                    <div className="flex items-center gap-2">
                       <StatusIndicator />
                        <Tooltip text="Go to Head Honcho Controller">
                            <button onClick={() => setActiveTool('head-honcho-controller')} className="text-gray-400 hover:text-white">
                                <CloudIcon className="w-5 h-5" />
                            </button>
                        </Tooltip>
                    </div>
                </header>
                
                <>
                    <div ref={chatHistoryRef} className="flex-grow p-2 space-y-3 overflow-y-auto">
                        {conversation.map((msg, index) => {
                            if (msg.sender === 'ai') {
                                return <AIMessage key={index} message={msg} />;
                            }
                            return (
                                <div key={index} className="flex gap-2 items-start justify-end">
                                    <div className="max-w-xs p-2 rounded-lg text-sm bg-gray-700 text-gray-200 text-left">
                                        <pre className="whitespace-pre-wrap font-sans">{msg.text}</pre>
                                    </div>
                                    <UserIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                                </div>
                            );
                        })}
                        {isLoading && (
                            <div className="flex gap-2 items-start">
                                <BotIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                                <div className="max-w-xs p-2 rounded-lg text-sm bg-gray-800 text-gray-300">
                                    <div className="flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                                    </div>
                                </div>
                            </div>
                        )}
                         {conversation.length === 0 && !isLoading && (
                            <div className="text-center text-xs text-gray-500 pt-4">
                                {connectionStatus === 'connected' 
                                    ? 'AI Console is active. Ask a question to begin.'
                                    : 'Connect to a Head Honcho backend to activate the AI.'
                                }
                            </div>
                        )}
                    </div>
                    <form onSubmit={handleSubmit} className="p-2 border-t border-gray-700 flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-grow bg-[#010409] border border-gray-700 rounded-md px-3 py-1.5 text-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none text-sm"
                            placeholder={connectionStatus !== 'connected' ? 'Connect to backend first...' : 'Ask the agent...'}
                            disabled={isLoading || connectionStatus !== 'connected'}
                        />
                        <Tooltip text="Send message">
                            <button type="submit" disabled={isLoading || connectionStatus !== 'connected'} className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-md disabled:bg-gray-700 disabled:cursor-not-allowed">
                                <SendIcon className="w-4 h-4" />
                            </button>
                        </Tooltip>
                    </form>
                </>
            </div>
        </div>
    );
};