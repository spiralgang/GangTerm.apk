import React from 'react';
import { GhostIcon } from './Icons';

export const Header: React.FC = () => {
    return (
        <header className="text-center mb-10 border-b border-green-900 pb-8">
            <div className="flex justify-center items-center gap-4 mb-4">
                 <GhostIcon className="w-12 h-12 text-green-400" />
                <h1 className="text-4xl md:text-5xl font-bold text-green-400 tracking-wider">
                    Termux DevUtility
                </h1>
            </div>
            <p className="text-gray-400 max-w-3xl mx-auto">
                An AI-powered "superlab" for your Android device. Generate scripts, manage packages, and fuse APKs with forensic precision. Inspired by Nala, ICEDMAN, and agentic AI principles.
            </p>
        </header>
    );
};
