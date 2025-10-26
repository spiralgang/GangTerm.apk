
import React from 'react';
import { SettingsIcon, TerminalIcon } from './Icons';
import { Tooltip } from './Tooltip';
import { CodeBlock } from './CodeBlock';

interface ConfigEnvToolProps {
    onGenerate: (title: string, description: string, script: string) => void;
}

const environmentConfig = {
    'WORKSPACE_SYNC_TARGET_REPO': {
        value: 'https://github.com/spiralgang/Workspace_Sync_Target',
        description: 'The canonical Git repository for the Head Honcho\'s persistent state (Storage Plane).'
    },
    'HEAD_HONCHO_DEFAULT_NAME': {
        value: 'persistent-head-honcho',
        description: 'The default name for Kaggle kernels deployed via the Script Lab.'
    },
    'KAGGLE_SECRETS_REQUIRED': {
        value: 'GIT_AUTH_TOKEN, NGROK_AUTH_TOKEN',
        description: 'Secrets that must be set in your Kaggle account for the Head Honcho to operate.'
    },
    'TERMUX_BRIDGE_SCRIPT': {
        value: '~/bin/termux-url-opener',
        description: 'The required script for the "Run in Termux" functionality to work correctly.'
    }
};

export const ConfigEnvTool: React.FC<ConfigEnvToolProps> = ({ onGenerate }) => {
    
    const generateEnvScript = () => {
        const script = `#!/bin/bash
# GangTerm Environment Configuration
# Source this file to apply settings to your current shell: source <(./this_script.sh)

echo "Setting GangTerm environment variables..."

# The canonical repository for the Head Honcho's persistent state.
export WORKSPACE_SYNC_TARGET_REPO='${environmentConfig.WORKSPACE_SYNC_TARGET_REPO.value}'

# The default name for deployed Kaggle kernels.
export HEAD_HONCHO_DEFAULT_NAME='${environmentConfig.HEAD_HONCHO_DEFAULT_NAME.value}'

echo "---"
echo "✅ Environment variables have been exported."
echo "---"
echo "REMINDER: The following secrets must be set in your Kaggle account settings:"
echo "  - GIT_AUTH_TOKEN: A GitHub Personal Access Token with repo scope."
echo "  - NGROK_AUTH_TOKEN: Your auth token from the ngrok dashboard."
echo "  - KAGGLE_KEY: Your kaggle.json file uploaded as a secret."
echo ""
echo "For local execution, ensure your kaggle.json is at ~/.kaggle/kaggle.json"
`;
        onGenerate(
            "GangTerm Environment Setup Script",
            "This script exports the core configuration variables for the project. You can source it in your shell to easily set up your development environment.",
            script
        );
    };

    return (
        <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 shadow-lg shadow-black/30 space-y-6">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <SettingsIcon className="w-7 h-7 text-green-300" />
                    <h2 className="text-xl font-bold text-green-300">Configuration & Environment</h2>
                </div>
                <p className="text-sm text-gray-400">This is the 'manual set' for the GangTerm project, defining the core configuration and environmental constants.</p>
            </div>
            
            <div className="p-4 bg-[#010409] border border-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold text-green-400 mb-4">Project Environment Variables</h3>
                <div className="space-y-4">
                    {Object.entries(environmentConfig).map(([key, { value, description }]) => (
                        <div key={key} className="border-t border-gray-800 pt-3">
                            <Tooltip text={description}>
                                <p className="font-fira text-sm text-green-300 cursor-help">{key}</p>
                            </Tooltip>
                            <div className="mt-1 h-12">
                                <CodeBlock code={value} language="text" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-2">
                <Tooltip text="Generates a shell script that exports these variables for easy setup.">
                    <button
                        onClick={generateEnvScript}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-200"
                    >
                        <TerminalIcon className="w-5 h-5" />
                        Generate .env Script
                    </button>
                </Tooltip>
            </div>
        </div>
    );
};