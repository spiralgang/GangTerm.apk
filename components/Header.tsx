import React from 'react';
import { GhostIcon, CheckIcon } from './Icons';
import { Tooltip } from './Tooltip';

export const Header: React.FC = () => {
    return (
        <header className="mb-8 border-b border-gray-800 pb-4">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <GhostIcon className="w-10 h-10 text-green-400" />
                        <h1 className="text-3xl font-bold text-green-400 tracking-wide font-fira">
                            GangTerm
                        </h1>
                    </div>
                    <p className="text-gray-400 max-w-4xl text-sm">
                        The AI-powered superlab for your Android device. An agentic development environment for script generation, package management, and APK fusion.
                    </p>
                </div>
                <Tooltip text="All changes you make in any tool are automatically saved to your browser's local storage. Your work is safe even if you refresh the page.">
                    <div className="flex items-center gap-1.5 bg-green-900/40 border border-green-500/30 text-green-300 text-xs px-2 py-1 rounded-full mt-1">
                        <CheckIcon className="w-3 h-3" />
                        <span>Auto-Save Active</span>
                    </div>
                </Tooltip>
            </div>
        </header>
    );
};