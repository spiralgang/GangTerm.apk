import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { PackageIcon, TerminalIcon, SpinnerIcon } from './Icons';
import { Tooltip } from './Tooltip';
import { useApp } from '../context/AppContext';


interface PackageManagerToolProps {
    onGenerate: (title: string, description:string, script: string) => void;
}

type NalaAction = 'Install' | 'Remove' | 'System' | 'Show';

const popularPackages = [
    { name: 'build-essential', desc: 'Informational list of build-essential packages.' },
    { name: 'clang', desc: 'C language family frontend for LLVM.' },
    { name: 'python', desc: 'Python 3 programming language.' },
    { name: 'nodejs-lts', desc: 'Open-source, cross-platform JavaScript runtime environment.' },
    { name: 'git', desc: 'Fast, scalable, distributed revision control system.' },
    { name: 'openssh', desc: 'Secure shell client and server.' },
    { name: 'neovim', desc: 'Ambitious refactor of the Vim text editor.' },
    { name: 'proot', desc: 'Emulate chroot, mount --bind, and binfmt_misc for non-root users.' },
    { name: 'wget', desc: 'Network utility to retrieve files from the Web.' },
    { name: 'curl', desc: 'Tool to transfer data from or to a server.' },
    { name: 'unzip', desc: 'Utility to extract files from a ZIP archive.' },
    { name: 'tar', desc: 'Manipulating archive files.' },
    { name: 'nala', desc: 'A prettier frontend for the APT package manager.'},
    { name: 'htop', desc: 'Interactive process viewer.'},
    { name: 'openssl-tool', desc: 'Toolkit for SSL/TLS and cryptography.'},
    { name: 'termux-api', desc: 'Access Android and Chrome hardware features.'},
    { name: 'pandoc', desc: 'Universal markup converter.'},
    { name: 'jp2a', desc: 'JPEG to ASCII converter.'},
];

// Fix: Initialize GoogleGenAI according to guidelines without type casting.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const NalaShow: React.FC = () => {
    const [pkgName, setPkgName] = useState('nala');
    const [isLoading, setIsLoading] = useState(false);
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem('pkgManager_searchHistory');
            if (savedHistory) {
                setSearchHistory(JSON.parse(savedHistory));
            }
        } catch (e) {
            console.error("Failed to parse search history from localStorage", e);
            setSearchHistory([]);
        }
    }, []);

    const updateHistory = (newPkgName: string) => {
        const updatedHistory = [newPkgName, ...searchHistory.filter(item => item.toLowerCase() !== newPkgName.toLowerCase())].slice(0, 5);
        setSearchHistory(updatedHistory);
        localStorage.setItem('pkgManager_searchHistory', JSON.stringify(updatedHistory));
    };

    const handleShow = async () => {
        if (!pkgName) return;
        updateHistory(pkgName);
        setShowSuggestions(false); 

        setIsLoading(true);
        setError('');
        setDescription('');
        try {
            const systemInstruction = "You are an expert on Linux packages, specifically for Debian/Ubuntu based systems like Termux. The user will provide a package name. Your task is to provide a concise, one-paragraph description of that package and its primary use case, as if you were the `nala show` or `apt show` command. Do not add any extra conversational text. Just provide the description.";
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Describe the package: ${pkgName}`,
                config: { systemInstruction }
            });
            setDescription(response.text);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch package description.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearHistory = () => {
        setSearchHistory([]);
        localStorage.removeItem('pkgManager_searchHistory');
        setShowSuggestions(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPkgName(value);

        if (value.trim().length > 0) {
            const filtered = popularPackages
                .filter(p => p.name.toLowerCase().startsWith(value.toLowerCase()))
                .map(p => p.name);
            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setSuggestions(searchHistory);
            setShowSuggestions(searchHistory.length > 0);
        }
    };
    
    const handleFocus = () => {
        if (pkgName.trim().length === 0) {
            setSuggestions(searchHistory);
            setShowSuggestions(searchHistory.length > 0);
        } else {
             const filtered = popularPackages
                .filter(p => p.name.toLowerCase().startsWith(pkgName.toLowerCase()))
                .map(p => p.name);
            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        }
    };

    const isHistory = pkgName.trim().length === 0 && suggestions.length > 0 && searchHistory.length > 0;

    return (
        <div className="space-y-3">
            <p className="text-sm text-gray-400">Enter a package name to get a brief, AI-generated description. Autocompletes from popular packages.</p>
            <div className="relative">
                <div className="flex gap-2">
                    <Tooltip text="Enter the exact name of a package to fetch its description.">
                         <input
                            type="text"
                            value={pkgName}
                            onChange={handleInputChange}
                            onFocus={handleFocus}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                            className="flex-grow bg-[#010409] border border-gray-700 rounded-md px-3 py-1.5 text-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none font-fira text-sm"
                            placeholder="e.g., nala"
                            onKeyDown={(e) => {if (e.key === 'Enter') handleShow()}}
                        />
                    </Tooltip>
                    <Tooltip text="Fetch an AI-generated description for the specified package.">
                        <span className="block">
                            <button onClick={handleShow} disabled={isLoading || !pkgName} className="bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed w-20 flex justify-center items-center h-full">
                                {isLoading ? <SpinnerIcon className="w-5 h-5" /> : 'Show'}
                            </button>
                        </span>
                    </Tooltip>
                </div>
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#161b22] border border-gray-700 rounded-md shadow-lg z-10 p-2">
                        <ul className="space-y-1">
                            {suggestions.map((item, index) => (
                                <li 
                                    key={index} 
                                    onMouseDown={() => {
                                        setPkgName(item);
                                        setShowSuggestions(false);
                                    }}
                                    className="text-sm text-gray-300 px-3 py-1.5 rounded cursor-pointer hover:bg-gray-800/50"
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                        {isHistory && (
                             <div className="border-t border-gray-700 mt-2 pt-2 flex justify-between items-center">
                                <span className="text-xs text-gray-500 px-3">Recent Searches</span>
                                <Tooltip text="Permanently delete your package search history.">
                                    <button 
                                        onClick={handleClearHistory} 
                                        className="text-xs text-red-400 hover:text-red-300 pr-2"
                                    >
                                        Clear History
                                    </button>
                                </Tooltip>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
            {description && (
                <div className="bg-[#010409] border border-gray-700 p-3 rounded-md mt-2">
                    <p className="text-sm text-gray-300">{description}</p>
                </div>
            )}
        </div>
    );
};


export const PackageManagerTool: React.FC<PackageManagerToolProps> = ({ onGenerate }) => {
    const { packageManagerState, setPackageManagerState } = useApp();
    const { activeTab, selectedPackages, customPackages, removePackages } = packageManagerState;

    const setState = (field: keyof typeof packageManagerState, value: any) => {
        setPackageManagerState(prev => ({ ...prev, [field]: value }));
    };

    const handleTogglePackage = (packageName: string) => {
        const updated = selectedPackages.includes(packageName)
            ? selectedPackages.filter(p => p !== packageName)
            : [...selectedPackages, packageName];
        setState('selectedPackages', updated);
    };

    const generateScript = (action: NalaAction) => {
        let script = `#!/data/data/com.termux/files/usr/bin/bash
# Nala-inspired package management script
# Generated by GangTerm
set -e
`;
        let title = "Generated Package Script";
        let description = "Execute this script in Termux.";

        switch (action) {
            case 'Install':
                const allPackages = [...selectedPackages, ...customPackages.split(' ').filter(p => p)];
                if (allPackages.length === 0) return;
                script += `
echo "Updating package lists..."
pkg update -y

echo "Installing ${allPackages.length} selected package(s)..."
pkg install -y ${allPackages.join(' ')}

echo "Installation complete."
`;
                title = `Install Script (${allPackages.length} packages)`;
                description = "Executes `pkg update` and `pkg install` for the selected packages.";
                break;
            case 'Remove':
                const packagesToRemove = removePackages.split(' ').filter(p => p);
                if (packagesToRemove.length === 0) return;
                script += `
echo "Removing ${packagesToRemove.length} package(s) using 'pkg uninstall'..."
echo "This will NOT remove system-wide configuration files."
pkg uninstall -y ${packagesToRemove.join(' ')}

echo "Removal complete."
`;
                title = `Remove Script`;
                description = `Executes \`pkg uninstall\` for the specified packages. This is a safe operation that leaves configuration files intact.`;
                break;

            case 'System':
                return;
        }

        onGenerate(title, description, script);
    };
    
    const generateSystemScript = (systemCommand: 'upgrade' | 'autoremove' | 'clean' | 'cleanup-extended') => {
         let script = `#!/data/data/com.termux/files/usr/bin/bash
# Nala-inspired system management script
set -e
`;
        let title = "System Management Script";
        let description = "";

        switch(systemCommand) {
            case 'upgrade':
                script += `
echo "Updating package lists..."
pkg update -y
echo "Upgrading installed packages..."
pkg upgrade -y
echo "System upgrade complete."`;
                title = "System Update & Upgrade";
                description = "Executes `pkg update` and `pkg upgrade`."
                break;
            case 'autoremove':
                script += `
echo "Removing unused packages..."
pkg autoremove -y
echo "Autoremove complete."`;
                title = "Autoremove Unused Packages";
                description = "Executes `pkg autoremove` to clean up orphaned dependencies.";
                break;
            case 'clean':
                script += `
echo "Cleaning APT cache..."
pkg clean
echo "Cache cleaned."`;
                title = "Clean Package Cache";
                description = "Executes `pkg clean` to free up space by removing downloaded .deb files.";
                break;
            case 'cleanup-extended':
                script += `
# --- Targeted Cache & Bin Cleanup ---
# This script FINDS and REPORTS on common 'dead weight' files and directories.
# IT IS NON-DESTRUCTIVE BY DEFAULT. Review the output before taking action.

echo "--- Searching for Python cache directories (__pycache__)..."
find $HOME -type d -name "__pycache__" -print

echo ""
echo "--- Searching for Node.js dependency directories (node_modules)..."
find $HOME -type d -name "node_modules" -print

echo ""
echo "--- Searching for large log files (*.log > 1MB)..."
find $HOME -type f -name "*.log" -size +1M -print

echo ""
echo "--- ANALYSIS COMPLETE ---"
echo "The items listed above are candidates for deletion to save space."
echo "To delete them, you can re-run the find commands and pipe them to xargs."
echo ""
echo "EXAMPLE (use with caution):"
echo "# find $HOME -type d -name '__pycache__' -print0 | xargs -0 rm -rf"
echo "# find $HOME -type d -name 'node_modules' -print0 | xargs -0 rm -rf"
`;
                title = "Targeted Cache & Bin Cleanup";
                description = "Generates a NON-DESTRUCTIVE script to find and report on caches and temporary files. You must manually execute the deletion commands provided in the script's output.";
                break;
        }
        onGenerate(title, description, script);
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'Install':
                return (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-2 mb-4">
                            {popularPackages.map(pkg => (
                                <div key={pkg.name} className="flex items-start bg-[#161b22] p-2 rounded-md border border-gray-800/50">
                                    <input type="checkbox" id={`pkg-${pkg.name}`} checked={selectedPackages.includes(pkg.name)} onChange={() => handleTogglePackage(pkg.name)} className="h-4 w-4 mt-1 rounded bg-gray-800 border-gray-600 text-green-500 focus:ring-green-600 cursor-pointer" />
                                    <div className="ml-3 text-sm">
                                        <label htmlFor={`pkg-${pkg.name}`} className="font-semibold text-green-400 cursor-pointer">{pkg.name}</label>
                                        <p className="text-xs text-gray-500">{pkg.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div>
                             <Tooltip text="Enter any extra packages you want to install, separated by spaces (e.g., htop nala).">
                                <label className="block text-sm font-medium text-gray-400 mb-2 cursor-help">Additional Packages</label>
                            </Tooltip>
                            <input type="text" value={customPackages} onChange={(e) => setState('customPackages', e.target.value)} className="w-full bg-[#010409] border border-gray-700 rounded-md px-3 py-1.5 text-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none font-fira text-sm" placeholder="e.g., htop nala" />
                        </div>
                         <div className="pt-4">
                            <Tooltip text="Generates a shell script to update package lists and install all selected and additional packages.">
                                <span className="block w-full">
                                    <button onClick={() => generateScript('Install')} disabled={[...selectedPackages, ...customPackages.split(' ').filter(p => p)].length === 0} className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed">
                                        <TerminalIcon className="w-5 h-5" />
                                        Generate Install Script
                                    </button>
                                </span>
                            </Tooltip>
                        </div>
                    </>
                );
            case 'Remove':
                return (
                    <div className="space-y-4">
                        <div>
                            <Tooltip text="Enter the names of packages you want to remove, separated by spaces. This will use 'pkg uninstall' and will not remove configuration files.">
                                <label className="block text-sm font-medium text-gray-400 mb-2 cursor-help">Packages to Remove (space-separated)</label>
                            </Tooltip>
                            <textarea value={removePackages} onChange={(e) => setState('removePackages', e.target.value)} className="w-full h-24 bg-[#010409] border border-gray-700 rounded-md px-3 py-2 text-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none font-fira text-sm" placeholder="e.g., old-package unused-tool" />
                        </div>
                        <div className="pt-2">
                            <Tooltip text="Generates a script to remove the specified packages using the safe 'pkg uninstall' command.">
                                <span className="block w-full">
                                    <button onClick={() => generateScript('Remove')} disabled={removePackages.trim().length === 0} className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed">
                                        <TerminalIcon className="w-5 h-5" />
                                        Generate Remove Script
                                    </button>
                                </span>
                            </Tooltip>
                        </div>
                    </div>
                );
            case 'System':
                return (
                    <div className="space-y-3">
                        <p className="text-sm text-gray-400">Generate scripts for common system maintenance tasks.</p>
                        <Tooltip text="Generate a script to run 'pkg update' and 'pkg upgrade' to keep your system up-to-date.">
                            <button onClick={() => generateSystemScript('upgrade')} className="w-full text-left bg-[#161b22] p-3 rounded-md border border-gray-700 hover:border-green-500/70">
                                <h3 className="font-semibold text-green-400">Update & Upgrade</h3>
                                <p className="text-xs text-gray-500">Updates package lists and upgrades all installed packages (`pkg update && pkg upgrade`).</p>
                            </button>
                        </Tooltip>
                        <Tooltip text="Generate a script to run 'pkg autoremove' and clean up orphaned dependencies.">
                            <button onClick={() => generateSystemScript('autoremove')} className="w-full text-left bg-[#161b22] p-3 rounded-md border border-gray-700 hover:border-green-500/70">
                                <h3 className="font-semibold text-green-400">Autoremove Unused Packages</h3>
                                <p className="text-xs text-gray-500">Removes packages that were automatically installed to satisfy dependencies but are no longer needed (`pkg autoremove`).</p>
                            </button>
                        </Tooltip>
                        <Tooltip text="Generate a script to run 'pkg clean' and free up space by deleting downloaded package files from the cache.">
                            <button onClick={() => generateSystemScript('clean')} className="w-full text-left bg-[#161b22] p-3 rounded-md border border-gray-700 hover:border-green-500/70">
                                 <h3 className="font-semibold text-green-400">Clean Cache</h3>
                                <p className="text-xs text-gray-500">Clears out the local repository of downloaded package files (`pkg clean`).</p>
                            </button>
                        </Tooltip>
                         <Tooltip text="Generate a non-destructive script to find and report on common 'dead weight' like caches and temporary build files.">
                            <button onClick={() => generateSystemScript('cleanup-extended')} className="w-full text-left bg-[#161b22] p-3 rounded-md border border-yellow-500/50 hover:border-yellow-400/70">
                                 <h3 className="font-semibold text-yellow-300">Targeted Cache & Bin Cleanup (Audit)</h3>
                                <p className="text-xs text-gray-500">Finds and lists `__pycache__`, `node_modules`, and large log files. Does NOT delete anything automatically.</p>
                            </button>
                        </Tooltip>
                    </div>
                );
             case 'Show':
                return <NalaShow />;
        }
    };

    return (
        <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 shadow-lg shadow-black/30">
            <div className="flex items-center gap-3 mb-4 border-b border-gray-800 pb-2">
                 <PackageIcon className="w-6 h-6 text-green-300" />
                 <h2 className="text-xl font-bold text-green-300">Package Manager Utility</h2>
            </div>
            <p className="text-sm text-gray-400 mb-4">A `nala`-inspired interface for managing your Termux packages. Select an action to generate a clean, reliable script.</p>
            
            <div className="flex border-b border-gray-800 mb-4">
                {(['Install', 'Remove', 'System', 'Show'] as NalaAction[]).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setState('activeTab', tab)}
                        className={`px-3 py-2 text-sm font-medium transition-colors ${
                            activeTab === tab 
                                ? 'border-b-2 border-green-400 text-green-300' 
                                : 'text-gray-400 hover:text-white border-b-2 border-transparent'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            
            <div>
                {renderContent()}
            </div>
        </div>
    );
};