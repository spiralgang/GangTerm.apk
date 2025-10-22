import React from 'react';
import { GhostIcon, TerminalIcon, PackageIcon } from './Icons';

type Tool = 'apk-fusion' | 'script-lab' | 'package-manager';

interface NavigationProps {
    activeTool: Tool;
    setActiveTool: (tool: Tool) => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-4 w-full h-24 text-xs transition-colors duration-200 ${
            isActive
                ? 'bg-green-900/50 text-green-300 border-r-4 border-green-400'
                : 'text-gray-400 hover:bg-gray-800 hover:text-green-400'
        }`}
    >
        {icon}
        <span className="mt-2">{label}</span>
    </button>
);

export const Navigation: React.FC<NavigationProps> = ({ activeTool, setActiveTool }) => {
    return (
        <nav className="w-24 bg-black border-r border-gray-800 min-h-screen flex flex-col pt-8">
            <NavItem
                icon={<GhostIcon className="w-8 h-8" />}
                label="APK Fusion"
                isActive={activeTool === 'apk-fusion'}
                onClick={() => setActiveTool('apk-fusion')}
            />
            <NavItem
                icon={<TerminalIcon className="w-8 h-8" />}
                label="Script Lab"
                isActive={activeTool === 'script-lab'}
                onClick={() => setActiveTool('script-lab')}
            />
             <NavItem
                icon={<PackageIcon className="w-8 h-8" />}
                label="Packages"
                isActive={activeTool === 'package-manager'}
                onClick={() => setActiveTool('package-manager')}
            />
        </nav>
    );
};
