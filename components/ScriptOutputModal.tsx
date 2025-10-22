import React from 'react';
import { CodeBlock } from './CodeBlock';

interface ScriptOutputModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    scriptContent: string;
}

export const ScriptOutputModal: React.FC<ScriptOutputModalProps> = ({ isOpen, onClose, title, description, scriptContent }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <div 
                className="bg-[#111111] border border-gray-800 rounded-lg shadow-lg shadow-black/50 max-w-3xl w-full max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-green-300">{title}</h2>
                    <p className="text-sm text-gray-400 mt-1">{description}</p>
                </div>
                <div className="p-4 overflow-y-auto">
                    <CodeBlock code={scriptContent} language="bash" />
                </div>
                <div className="p-4 border-t border-gray-700 text-right">
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
