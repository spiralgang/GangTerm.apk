import React, { useState } from 'react';
import { CopyIcon, CheckIcon } from './Icons';

interface CodeBlockProps {
    code: string;
    language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'bash' }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="bg-black rounded-lg overflow-hidden relative border border-gray-700 h-full flex flex-col">
            <div className="bg-gray-900/50 text-gray-400 px-3 py-1.5 text-xs font-sans flex justify-between items-center border-b border-gray-700">
                <span>{language}</span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
                >
                    {isCopied ? (
                        <>
                            <CheckIcon className="w-3 h-3 text-green-400" />
                            Copied!
                        </>
                    ) : (
                        <>
                            <CopyIcon className="w-3 h-3" />
                            Copy
                        </>
                    )}
                </button>
            </div>
            <pre className="p-3 text-sm overflow-auto text-white flex-grow font-fira">
                <code>{code}</code>
            </pre>
        </div>
    );
};