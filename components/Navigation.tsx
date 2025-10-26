import React from 'react';
import { useApp } from '../context/AppContext';
import { Tooltip } from './Tooltip';
import {
    CloudIcon,
    Share2Icon,
    ArchiveIcon,
    TerminalIcon,
    PackageIcon,
    CodeIcon,
    CpuIcon,
    ShieldIcon,
    SettingsIcon,
    ZapIcon,
    HistoryIcon,
    BugIcon,
} from './Icons';

interface Tool {
    id: string;
    name: string;
    icon: React.ReactNode;
    description: string;
}

interface ToolGroup {
    title: string;
    tools: Tool[];
}

const toolGroups: ToolGroup[] = [
    {
        title: 'Core Tools',
        tools: [
            { id: 'script-lab', name: 'Script Lab', icon: <TerminalIcon className="w-5 h-5" />, description: "Generate production-grade scripts from blueprints." },
            { id: 'package-manager', name: 'Packages', icon: <PackageIcon className="w-5 h-5" />, description: "A nala-inspired UI for managing Termux packages." },
            { id: 'apk-fusion', name: 'APK Fusion', icon: <PackageIcon className="w-5 h-5" />, description: "Modify, rebrand, and rebuild Android APKs." },
        ]
    },
    {
        title: 'Compute & Environment',
        tools: [
            { id: 'sandbox', name: 'Local Shell', icon: <CodeIcon className="w-5 h-5" />, description: "Autonomous Local ARM64 Shell (WASM) with a persistent virtual file system." },
            { id: 'head-honcho-controller', name: 'Head Honcho', icon: <CloudIcon className="w-5 h-5" />, description: "Remote IDE & PTY for your x86-64 AI compute backend." },
            { id: 'inspector-gateway', name: 'Inspector Gateway', icon: <BugIcon className="w-5 h-5" />, description: "Connect native Chrome DevTools to your backend." },
            { id: 'environment-breakout', name: 'Env Breakout', icon: <ZapIcon className="w-5 h-5" />, description: "Scripts to escape restricted cloud notebook environments." },
            { id: 'environment-forcer', name: 'Env Forcer', icon: <ZapIcon className="w-5 h-5" />, description: "Advanced scripts to get a real shell in cloud notebooks." },
        ]
    },
    {
        title: 'Agentic Engines',
        tools: [
             { id: 'genesis-engine', name: 'Genesis Engine', icon: <Share2Icon className="w-5 h-5" />, description: "Design and simulate multi-agent systems." },
             { id: 'evolution-engine', name: 'Evolution Engine', icon: <CpuIcon className="w-5 h-5" />, description: "Run a self-healing CI system on your code." },
        ]
    },
    {
        title: 'Project',
        tools: [
            { id: 'architecture-map', name: 'Architecture', icon: <Share2Icon className="w-5 h-5" />, description: "View the live system architecture." },
            { id: 'artifact-registry', name: 'Artifacts', icon: <ArchiveIcon className="w-5 h-5" />, description: "Manage MLOps assets like models and datasets." },
            { id: 'guardian', name: 'Guardian', icon: <ShieldIcon className="w-5 h-5" />, description: "Configure security, permissions, and persistence." },
            { id: 'config-env', name: 'Config & Env', icon: <SettingsIcon className="w-5 h-5" />, description: "View and manage project environment variables." },
            { id: 'changelog', name: 'Changelog', icon: <HistoryIcon className="w-5 h-5" />, description: "View the application's version history and updates." },
            { id: 'export-project', name: 'Export Project', icon: <ArchiveIcon className="w-5 h-5" />, description: "Download the complete source code of this application." },
        ]
    }
];


export const Navigation: React.FC = () => {
    const { activeTool, setActiveTool } = useApp();

    return (
        <nav className="flex flex-col gap-4 pr-4 border-r border-gray-800">
            {toolGroups.map(group => (
                <div key={group.title}>
                    <h3 className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">{group.title}</h3>
                    <div className="flex flex-col gap-1 mt-1">
                        {group.tools.map(tool => (
                             <Tooltip key={tool.id} text={tool.description}>
                                <button
                                    onClick={() => setActiveTool(tool.id)}
                                    className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                        activeTool === tool.id
                                            ? 'bg-green-900/50 text-green-300'
                                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                                >
                                    {tool.icon}
                                    <span>{tool.name}</span>
                                </button>
                            </Tooltip>
                        ))}
                    </div>
                </div>
            ))}
        </nav>
    );
};