
import React, { useState } from 'react';
import { ArchiveIcon, TrashIcon, SettingsIcon } from './Icons';
import { Tooltip } from './Tooltip';
import { useApp } from '../context/AppContext';
import type { ArtifactType } from '../context/AppContext';

export const ArtifactRegistryTool: React.FC = () => {
    const { artifacts, addArtifact, deleteArtifact, setWorkspaceTarget, setActiveTool } = useApp();
    const [name, setName] = useState('');
    const [type, setType] = useState<ArtifactType>('Git Repository');
    const [source, setSource] = useState('');
    const [isWorkspaceTarget, setIsWorkspaceTarget] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !source.trim()) {
            setError('Artifact name and source URL cannot be empty.');
            return;
        }
        if (type === 'Git Repository' && !source.endsWith('.git')) {
             setError('Git repository URL must end with .git');
            return;
        }

        setError('');
        addArtifact(name, type, source, isWorkspaceTarget);
        setName('');
        setSource('');
        setIsWorkspaceTarget(false);
    };

    return (
        <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 shadow-lg shadow-black/30 space-y-6">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <ArchiveIcon className="w-7 h-7 text-green-300" />
                    <h2 className="text-xl font-bold text-green-300">Artifact Registry</h2>
                </div>
                <p className="text-sm text-gray-400">Manage versioned assets for your MLOps pipelines. Define named artifacts here to use them across other tools like the Script Lab.</p>
            </div>

            {/* Contextual Link to Config Tool */}
            <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <SettingsIcon className="w-6 h-6 text-blue-300" />
                    <p className="text-sm text-gray-300">
                        The <strong className="text-white">Workspace Sync Target</strong> is a core part of the project's environment.
                    </p>
                </div>
                <button
                    onClick={() => setActiveTool('config-env')}
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    View Full Configuration
                </button>
            </div>
            
            {/* Add Artifact Form */}
            <form onSubmit={handleSubmit} className="p-4 bg-[#010409] border border-gray-800 rounded-lg space-y-4">
                <h3 className="text-lg font-semibold text-green-400">Register New Artifact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Tooltip text="A unique, human-readable name for this asset.">
                            <label className="block text-sm font-medium text-gray-400 mb-2 cursor-help">Artifact Name</label>
                        </Tooltip>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-[#0d1117] border border-gray-700 rounded-md px-3 py-1.5 text-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none font-fira text-sm"
                            placeholder="e.g., Qwen 1.5 Chat Weights"
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Artifact Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as ArtifactType)}
                            className="w-full bg-[#0d1117] border border-gray-700 rounded-md px-3 py-1.5 text-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none text-sm"
                        >
                            <option value="Git Repository">Git Repository</option>
                            <option value="Kaggle Dataset" disabled>Kaggle Dataset (coming soon)</option>
                        </select>
                    </div>
                </div>
                 <div>
                    <Tooltip text="The full URL to the asset. For Git, use the HTTPS clone URL.">
                        <label className="block text-sm font-medium text-gray-400 mb-2 cursor-help">Source URL</label>
                    </Tooltip>
                    <input
                        type="text"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className="w-full bg-[#0d1117] border border-gray-700 rounded-md px-3 py-1.5 text-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none font-fira text-sm"
                        placeholder="https://github.com/user/my-model-repo.git"
                    />
                </div>
                 <div className="border-t border-gray-800 pt-4">
                     <Tooltip text="Designate this Git repository as the persistent storage for your Head Honcho's workspace. Only one can be active.">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isWorkspaceTarget}
                                onChange={(e) => setIsWorkspaceTarget(e.target.checked)}
                                className="h-4 w-4 rounded bg-gray-800 border-gray-600 text-green-500 focus:ring-green-600 cursor-pointer"
                            />
                            <span className="text-sm text-yellow-300 font-semibold">Use as Workspace Sync Target</span>
                        </label>
                    </Tooltip>
                </div>
                {error && <p className="text-xs text-red-400">{error}</p>}
                <div className="pt-2">
                    <button
                        type="submit"
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-700"
                    >
                        Add Artifact
                    </button>
                </div>
            </form>
            
            {/* Registered Artifacts List */}
             <div className="p-4 bg-[#010409] border border-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold text-green-400 mb-3">Registered Artifacts</h3>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                    {artifacts.length > 0 ? artifacts.map(artifact => (
                        <div key={artifact.id} className={`p-3 rounded-md border flex justify-between items-center gap-4 ${artifact.isWorkspaceTarget ? 'bg-yellow-900/30 border-yellow-500/50' : 'bg-[#161b22] border-gray-700'}`}>
                            <div className="flex-grow min-w-0">
                                <p className="font-bold text-gray-200 truncate">{artifact.name}</p>
                                <p className="text-xs text-gray-400 font-fira truncate">{artifact.source}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs font-semibold bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded-full inline-block">{artifact.type}</span>
                                    {artifact.isWorkspaceTarget && <span className="text-xs font-bold text-yellow-300">WORKSPACE TARGET</span>}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {!artifact.isWorkspaceTarget && artifact.type === 'Git Repository' && (
                                    <Tooltip text="Set as Workspace Sync Target">
                                        <button onClick={() => setWorkspaceTarget(artifact.id)} className="text-gray-400 hover:text-yellow-400 text-xs font-semibold">Set Target</button>
                                    </Tooltip>
                                )}
                                <Tooltip text="Delete this artifact">
                                    <button onClick={() => deleteArtifact(artifact.id)} className="text-red-500 hover:text-red-400">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </Tooltip>
                            </div>
                        </div>
                    )) : (
                        <p className="text-sm text-center text-gray-500 py-4">No artifacts have been registered yet.</p>
                    )}
                </div>
            </div>

        </div>
    );
};