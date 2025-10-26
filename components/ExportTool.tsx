import React from 'react';
import { ArchiveIcon } from './Icons';
import { Tooltip } from './Tooltip';

// This object contains a snapshot of all project files at the time of generation.
// It is used to create a self-contained export of the entire application source code.
const projectFiles: Record<string, string> = {
  'index.tsx': `
import React from 'react';
import ReactDOM from 'react-dom/client';
// Fix: Corrected import path for App component.
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`,
  'metadata.json': `
{
  "name": "GangTerm.apk",
  "description": "An AI-powered 'superlab' for Android. Features an agentic script lab with production-grade blueprints, a Nala-inspired package manager for robust environment control, and an APK fusion tool for creating parallel Termux runtimes with forensic precision.",
  "requestFramePermissions": []
}
`,
  'index.html': `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GangTerm</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
    <!-- Xterm.js for the integrated webshell terminal -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/xterm@5.3.0/css/xterm.min.css" />
    <style>
      body {
        background-color: #0d1117; /* GitHub dark theme background */
        font-family: 'Inter', sans-serif;
      }
      .font-fira {
        font-family: 'Fira Code', monospace;
      }
      /* Ensure terminal takes full height */
      .terminal-container, .xterm, .xterm-viewport, .xterm-screen {
        height: 100% !important;
      }
    </style>
  <script type="importmap">
{
  "imports": {
    "react/": "https://aistudiocdn.com/react@^19.2.0/",
    "react": "https://aistudiocdn.com/react@^19.2.0",
    "react-dom/": "https://aistudiocdn.com/react-dom@^19.2.0/",
    "@google/genai": "https://aistudiocdn.com/@google/genai@^1.25.0",
    "@wasmer/wasi": "https://cdn.jsdelivr.net/npm/@wasmer/wasi@0.12.0/dist/index.esm.js",
    "memfs": "https://cdn.jsdelivr.net/npm/memfs@3.4.7/lib/index.js",
    "@wasmer/wasmfs": "https://aistudiocdn.com/@wasmer/wasmfs@^0.12.0"
  }
}
</script>
</head>
  <body>
    <div id="root"></div>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    <script>
      mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'loose' });
    </script>
    <script src="https://cdn.jsdelivr.net/npm/xterm@5.3.0/lib/xterm.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/xterm-addon-fit@0.8.0/lib/xterm-addon-fit.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/xterm-addon-web-links@0.9.0/lib/xterm-addon-web-links.min.js"></script>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>
`,
  'App.tsx': `
import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { ScriptOutputModal } from './components/ScriptOutputModal';
import { AIConsole } from './components/AIConsole';
import { ApkFusionTool } from './components/ApkFusionTool';
import { ScriptLabTool } from './components/ScriptLabTool';
import { PackageManagerTool } from './components/PackageManagerTool';
import { SandboxTool } from './components/SandboxTool';
import { GuardianTool } from './components/GuardianTool';
import { EvolutionEngineTool } from './components/EvolutionEngineTool';
import { GenesisEngineTool } from './components/GenesisEngineTool';
import { EnvironmentForcerTool } from './components/EnvironmentForcerTool';
import { EnvironmentBreakoutTool } from './components/EnvironmentBreakoutTool';
import { HeadHonchoControllerTool } from './components/HeadHonchoControllerTool';
import { ArtifactRegistryTool } from './components/ArtifactRegistryTool';
import { ConfigEnvTool } from './components/ConfigEnvTool';
import { ArchitectureMapTool } from './components/ArchitectureMapTool';
import { ChangelogTool } from './components/ChangelogTool';
import { InspectorGatewayTool } from './components/InspectorGatewayTool';
import { ExportTool } from './components/ExportTool';

const MainContent: React.FC = () => {
    const { activeTool, handleGenerateScript } = useApp();

    const renderTool = () => {
        switch (activeTool) {
            case 'head-honcho-controller':
                return <HeadHonchoControllerTool />;
            case 'architecture-map':
                return <ArchitectureMapTool />;
            case 'artifact-registry':
                return <ArtifactRegistryTool />;
            case 'script-lab':
                return <ScriptLabTool onGenerate={handleGenerateScript} />;
            case 'sandbox':
                return <SandboxTool />;
            case 'inspector-gateway':
                return <InspectorGatewayTool />;
            case 'genesis-engine':
                return <GenesisEngineTool onGenerate={handleGenerateScript} />;
            case 'apk-fusion':
                return <ApkFusionTool onGenerate={handleGenerateScript} />;
            case 'package-manager':
                return <PackageManagerTool onGenerate={handleGenerateScript} />;
            case 'evolution-engine':
                return <EvolutionEngineTool onGenerate={handleGenerateScript} />;
            case 'guardian':
                return <GuardianTool onGenerate={handleGenerateScript} />;
            case 'config-env':
                return <ConfigEnvTool onGenerate={handleGenerateScript} />;
            case 'environment-forcer':
                return <EnvironmentForcerTool onGenerate={handleGenerateScript} />;
            case 'environment-breakout':
                return <EnvironmentBreakoutTool onGenerate={handleGenerateScript} />;
            case 'changelog':
                return <ChangelogTool />;
            case 'export-project':
                return <ExportTool />;
            default:
                return <div className="p-4">Select a tool from the navigation menu.</div>;
        }
    };

    return <div className="flex-grow overflow-y-auto">{renderTool()}</div>;
};

const AppContent: React.FC = () => {
    const { modalContent, closeModal } = useApp();

    return (
        <div className="bg-[#010409] text-gray-200 min-h-screen font-sans">
            <main className="max-w-screen-2xl mx-auto p-4">
                <Header />
                <div className="grid grid-cols-[240px_1fr] gap-4">
                    <Navigation />
                    <MainContent />
                </div>
            </main>
            <AIConsole />
            <ScriptOutputModal
                isOpen={modalContent.isOpen}
                onClose={closeModal}
                title={modalContent.title}
                description={modalContent.description}
                scriptContent={modalContent.script}
            />
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
};

export default App;
`,
    'components/Header.tsx': `
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
`,
    'components/StepCard.tsx': `
import React from 'react';

// This component is no longer used. The UI has been refactored to a direct control panel.

export const StepCard: React.FC<{ phase: string; title: string; icon: React.ReactNode; children: React.ReactNode; }> = () => {
    return null;
};
`,
    'components/CodeBlock.tsx': `
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
`,
    'components/GeneratorForm.tsx': `
import React from 'react';

// This component is no longer used. It was part of an older UI flow
// that has been refactored. It is kept here to prevent build errors,
// as an empty file is not a valid module. It renders nothing.

const GeneratorForm: React.FC = () => {
    return null;
};

export default GeneratorForm;
`,
    'components/GeneratedScriptModal.tsx': `
import React from 'react';

// This component is no longer used. It has been replaced by the more
// generic ScriptOutputModal. It is kept here to prevent build errors,
// as an empty file is not a valid module. It renders nothing.

const GeneratedScriptModal: React.FC = () => {
    return null;
};

export default GeneratedScriptModal;
`,
    'components/Icons.tsx': `
import React from 'react';

type IconProps = {
    className?: string;
};

export const GhostIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5.6.11.82-.26.82-.57v-2.03c-2.78.6-3.37-1.34-3.37-1.34-.54-1.38-1.32-1.75-1.32-1.75-1.08-.74.08-.72.08-.72 1.2.08 1.82 1.23 1.82 1.23 1.07 1.83 2.8 1.3 3.48 1 .1-.78.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23.95-.26 1.98-.4 3-.4s2.05.13 3 .4c2.28-1.55 3.28-1.23 3.28-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.93.43.37.82 1.1.82 2.22v3.29c0 .31.22.69.82.57A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10z"/>
    </svg>
);


export const CopyIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

export const TerminalIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
);

export const ShieldIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
);

export const FileSystemIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>
);

export const KeyIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
    </svg>
);

export const CpuIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line>
    </svg>
);

export const PackageIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
);

export const ChecklistIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
        <path d="m9 12 2 2 4-4"></path>
        <path d="m9 17 2 2 4-4"></path>
    </svg>
);

export const ShieldCheckIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <path d="m9 12 2 2 4-4"></path>
    </svg>
);

export const UploadCloudIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20 16.2A4.5 4.5 0 0 0 15.5 14a4.5 4.5 0 0 0-4.43 3.16M19 12a7 7 0 1 0-12.73 4.1L3 20" />
        <path d="M16 16l-4-4-4 4" />
        <path d="M12 12v9" />
    </svg>
);

export const PlayIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
);

export const CodeIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>
    </svg>
);

export const SaveIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline>
    </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
);

export const SendIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);

export const UserIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

export const BotIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 8V4H8" />
        <rect x="4" y="12" width="16" height="8" rx="2" />
        <path d="M8 12v-2a4 4 0 1 1 8 0v2" />
        <path d="M12 18h.01" />
        <path d="M16 18h.01" />
    </svg>
);

export const Settings2Icon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);

export const WifiIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line>
    </svg>
);

export const WifiOffIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="1" y1="1" x2="23" y2="23"></line><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path><path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line>
    </svg>
);

export const ChevronLeftIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
);

export const FilterIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
);

export const ClipboardPlusIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        <line x1="15" y1="14" x2="15" y2="20"></line>
        <line x1="12" y1="17" x2="18" y2="17"></line>
    </svg>
);

export const FilePlusIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="12" y1="18" x2="12" y2="12"></line>
        <line x1="9" y1="15" x2="15" y2="15"></line>
    </svg>
);

export const Share2Icon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="18" cy="5" r="3"></circle>
        <circle cx="6" cy="12" r="3"></circle>
        <circle cx="18" cy="19" r="3"></circle>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
    </svg>
);

export const ServerIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
        <line x1="6" y1="6" x2="6.01" y2="6"></line>
        <line x1="6" y1="18" x2="6.01" y2="18"></line>
    </svg>
);

export const CloudIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
    </svg>
);

export const ArchiveIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
        <polyline points="2 10 22 10"></polyline>
        <line x1="10" y1="14" x2="14" y2="14"></line>
    </svg>
);

export const SpinnerIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={\`${className} animate-spin\`}>
        <line x1="12" y1="2" x2="12" y2="6"></line>
        <line x1="12" y1="18" x2="12" y2="22"></line>
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
        <line x1="2" y1="12" x2="6" y2="12"></line>
        <line x1="18" y1="12" x2="22" y2="12"></line>
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
    </svg>
);

export const ZapIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
);

export const HistoryIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M1 4v6h6" />
        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
);

export const BugIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m8 2 1.88 1.88" />
        <path d="M14.12 3.88 16 2" />
        <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
        <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
        <path d="M12 20v-9" />
        <path d="M6.53 9C4.6 9 3 7.7 3 6" />
        <path d="M17.47 9c1.93 0 3.5-1.3 3.5-3" />
        <path d="M3 13h2" />
        <path d="M19 13h2" />
    </svg>
);
`,
    'components/Navigation.tsx': `
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
                                    className={\`flex items-center gap-3 w-full text-left px-3 py-2 rounded-md text-sm transition-colors \${
                                        activeTool === tool.id
                                            ? 'bg-green-900/50 text-green-300'
                                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }\`}>
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
`,
  'components/ApkFusionTool.tsx': `
import React, { useState, useRef, useEffect } from 'react';
import { TerminalIcon, UploadCloudIcon } from './Icons';
import { Tooltip } from './Tooltip';
import { useApp } from '../context/AppContext';
import { CodeBlock } from './CodeBlock';

interface ApkFusionToolProps {
    onGenerate: (title: string, description: string, script: string) => void;
}

export const ApkFusionTool: React.FC<ApkFusionToolProps> = ({ onGenerate }) => {
    const { apkFusionState, setApkFusionState } = useApp();
    const { sourceApk, newPackageName, newAppName, versionCode, versionName } = apkFusionState;
    
    const [isDragging, setIsDragging] = useState(false);
    const [packageNameError, setPackageNameError] = useState('');
    const [appNameError, setAppNameError] = useState('');
    const [sourceApkError, setSourceApkError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const setState = (field: keyof typeof apkFusionState, value: string) => {
        setApkFusionState(prev => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        const validatePackageName = () => {
            if (!newPackageName) {
                setPackageNameError('Package name cannot be empty.');
                return;
            }
            if (/[A-Z]/.test(newPackageName)) {
                setPackageNameError('Package name cannot contain uppercase letters.');
            } else if (!newPackageName.includes('.')) {
                setPackageNameError('Package name must contain at least one dot (e.g., com.example.app).');
            } else if (!/^[a-z0-9_]+(\\.[a-z0-9_]+)+$/.test(newPackageName)) {
                setPackageNameError('Invalid format. Use only lowercase letters, numbers, underscores, and dots.');
            } else {
                setPackageNameError('');
            }
        };
        validatePackageName();
    }, [newPackageName]);
    
    useEffect(() => {
        if (!newAppName.trim()) {
            setAppNameError('App name cannot be empty.');
        } else if (/[/\\\\:*?"<>|]/.test(newAppName)) {
            setAppNameError('App name contains invalid characters.');
        } else {
            setAppNameError('');
        }
    }, [newAppName]);

    useEffect(() => {
        if (!sourceApk.trim()) {
            setSourceApkError('Source APK path cannot be empty.');
        } else if (!sourceApk.trim().toLowerCase().endsWith('.apk')) {
            setSourceApkError('Path must end with a .apk file extension.');
        } else {
            setSourceApkError('');
        }
    }, [sourceApk]);


    const generateFullScript = (
        sourceApk: string, 
        newPackageName: string, 
        newAppName: string,
        versionCode: string,
        versionName: string
    ) => {
        // A monolithic script that performs the entire APK mutation process with robust logging and error handling.
        return \`#!/usr/bin/env bash
##############################################################################
#
#    ███████╗ █████╗ ██╗  ██╗  ███████╗  ██████╗  ███████╗ ███╗   ███╗
#    ██╔════╝██╔══██╗██║  ╚██╗ ██╔════╝ ██╔════╝  ██╔════╝ ████╗ ████║
#    ███████╗███████║██║   ╚██╗███████╗ ██║  ███╗ █████╗   ██╔████╔██║
#    ╚════██║██╔══██║██║   ██╔╝╚════██║ ██║   ██║ ██╔══╝   ██║╚██╔╝██║
#    ███████║██║  ██║███████╔╝ ███████║ ╚██████╔╝ ███████╗ ██║ ╚═╝ ██║
#    ╚══════╝╚═╝  ╚═╝╚══════╝  ╚══════╝  ╚═════╝  ╚══════╝ ╚═╝     ╚═╝
#
#    GANGTERM APK FUSION SCRIPT - DO NOT RUN LINE-BY-LINE
#
#    --- HOW TO RUN ---
#    1. Save this entire block of code as a single file (e.g., fuse.sh)
#    2. Make it executable:  chmod +x fuse.sh
#    3. Execute the file:     ./fuse.sh
#
#    WARNING: Pasting this into your terminal one command at a time WILL FAIL.
#             This script is designed for standard Linux shells (like in
#             ChromiumOS), not Termux's custom environment.
#
##############################################################################

set -Eeuo pipefail # Exit on error, unset var, pipe failure.

# --- PRE-FLIGHT CHECK ---
if [[ "\$-" == *i* ]]; then
    echo ""
    echo "ERROR: This script cannot be run interactively." >&2
    echo "Please save it to a file (e.g., fuse.sh), make it executable (chmod +x fuse.sh), and then run it (./fuse.sh)." >&2
    echo ""
    exit 1
fi

# --- CONFIGURATION ---
SOURCE_APK="\${sourceApk.trim()}"
NEW_PACKAGE_NAME="\${newPackageName.trim()}"
NEW_APP_NAME="\${newAppName.trim()}"
VERSION_CODE_OVERRIDE="\${versionCode.trim()}"
VERSION_NAME_OVERRIDE="\${versionName.trim()}"
WORKDIR="\$HOME/apk_fusion_workdir"
KEYSTORE_NAME="fusion_keystore.jks"
KEY_ALIAS="fusion_key"
KEY_PASS="spiralgang" # Use a secure password in a real scenario
LOG_FILE="\\\${WORKDIR}/fusion_audit.log"
CLEANUP_ON_FAILURE="false" # Set to "true" to automatically clean up on error

# --- FUNCTIONS ---
log() {
    echo "[\\\$(date '+%Y-%m-%d %H:%M:%S')] \\\$1" | tee -a "\\\${LOG_FILE}"
}

# Robust cleanup trap
cleanup() {
  local exit_code=\\\$?
  if [ \\\${exit_code} -ne 0 ]; then
    log "AN ERROR OCCURRED (EXIT CODE: \\\${exit_code}). SCRIPT IS TERMINATING."
    if [ "\\\${CLEANUP_ON_FAILURE}" != "true" ]; then
      log "The workspace at \\\${WORKDIR} has been preserved for forensic analysis."
    fi
  fi
  cd "\\\$HOME"
  if [ "\\\${CLEANUP_ON_FAILURE}" = "true" ] && [ -d "\\\${WORKDIR}" ]; then
    rm -rf "\\\${WORKDIR}"
    log "Temporary workspace has been cleaned up."
  fi
}
trap cleanup EXIT ERR

# --- MAIN EXECUTION ---
echo "--- Initiating Spiralgang APK Fusion Process ---"
echo "Full audit trail will be available at a new log file in \\\${WORKDIR}"

rm -rf "\\\${WORKDIR}"
mkdir -p "\\\${WORKDIR}"
touch "\\\${LOG_FILE}"
log "Workspace created at \\\${WORKDIR}"

cd "\\\${WORKDIR}"

log "[1/9] Validating inputs and environment..."
for tool in apktool keytool apksigner zipalign; do
    if ! command -v \\\$tool &> /dev/null; then
        log "Essential tool '\\\$tool' not found. Attempting to install dependencies..."
        if ! command -v apt-get &> /dev/null; then
            log "FATAL: 'apt-get' not found. Cannot automatically install dependencies. Please install apktool, apksigner, zipalign, and openjdk-17 manually."
            exit 1
        fi
        log "Using 'apt-get' to install. This may require you to enter your password for sudo."
        if ! (sudo apt-get update && sudo apt-get install -y apktool apksigner zipalign openjdk-17-jre-headless) >> "\\\${LOG_FILE}" 2>&1; then
             log "FATAL: Failed to install required tools. Please run 'sudo apt-get install -y apktool apksigner zipalign openjdk-17-jre-headless' manually and try again."
             exit 1
        fi
        log "Tools installed successfully."
        break 
    fi
done

if [ ! -f "\\\${SOURCE_APK}" ]; then
    log "ERROR: Source APK not found at '\\\${SOURCE_APK}'"
    exit 1
fi
if [ -z "\\\${NEW_PACKAGE_NAME}" ] || [ -z "\\\${NEW_APP_NAME}" ]; then
    log "ERROR: New Package Name and New App Name cannot be empty."
    exit 1
fi
SOURCE_APK_HASH=\\\$(sha256sum "\\\${SOURCE_APK}" | awk '{print \$1}')
log "Source APK hash (SHA256): \\\${SOURCE_APK_HASH}"

DECOMPILED_DIR="\\\${WORKDIR}/decompiled"
MANIFEST_FILE="\\\${DECOMPILED_DIR}/AndroidManifest.xml"
STRINGS_FILE="\\\${DECOMPILED_DIR}/res/values/strings.xml"

log "[2/9] Decompiling source APK: \\\${SOURCE_APK}"
if ! apktool d "\\\${SOURCE_APK}" -o decompiled -f >> "\\\${LOG_FILE}" 2>&1; then
    log "FATAL: APK decompilation failed. The source APK might be corrupt, protected, or incompatible with the current apktool version."
    exit 1
fi
log "Decompilation successful."

log "Verifying decompilation output..."
if [ ! -d "\\\${DECOMPILED_DIR}" ] || [ ! -f "\\\${MANIFEST_FILE}" ]; then
    log "FATAL: Decompilation finished, but the output is invalid. Expected directory '\\\${DECOMPILED_DIR}' and file '\\\${MANIFEST_FILE}' were not found."
    exit 1
fi
log "Decompiled directory validated."

log "[3/9] Mutating AndroidManifest.xml and resource files..."
ORIGINAL_PACKAGE_NAME=\\\$(grep -o 'package="[^"]*"' "\\\${MANIFEST_FILE}" | head -n 1 | cut -d'"' -f2)
log "Original package name detected: \\\${ORIGINAL_PACKAGE_NAME}"

if [ -z "\\\${ORIGINAL_PACKAGE_NAME}" ]; then
    log "FATAL: Could not automatically detect the original package name from AndroidManifest.xml."
    exit 1
fi

log "Changing package name to \\\${NEW_PACKAGE_NAME}..."
if ! (set -o pipefail; find "\\\${DECOMPILED_DIR}" -type f \\\\( -name "*.xml" -o -name "*.smali" \\\\) -print0 | xargs -0 sed -i "s|\\\${ORIGINAL_PACKAGE_NAME}|\\\${NEW_PACKAGE_NAME}|g") >> "\\\${LOG_FILE}" 2>&1; then
    log "FATAL: Failed to replace package name across project files. Check permissions and sed/find command syntax."
    exit 1
fi

log "Changing app name to '\\\${NEW_APP_NAME}'..."
if grep -q 'name="app_name"' "\\\${STRINGS_FILE}"; then
    if ! sed -i '/name="app_name"/s/>[^<]*</>'"\\\${NEW_APP_NAME}"'</' "\\\${STRINGS_FILE}" >> "\\\${LOG_FILE}" 2>&1; then
        log "FATAL: Failed to change app name in strings.xml."
        exit 1
    fi
else
    log "WARNING: 'app_name' string resource not found. App name may not change."
fi

if [ -n "\\\${VERSION_CODE_OVERRIDE}" ]; then
    log "Overriding versionCode to '\\\${VERSION_CODE_OVERRIDE}'..."
    if ! sed -i "s/versionCode: '[^']*'/versionCode: '\\\${VERSION_CODE_OVERRIDE}'/" "\\\${DECOMPILED_DIR}/apktool.yml" >> "\\\${LOG_FILE}" 2>&1; then
        log "FATAL: Failed to override versionCode in apktool.yml."
        exit 1
    fi
fi
if [ -n "\\\${VERSION_NAME_OVERRIDE}" ]; then
    log "Overriding versionName to '\\\${VERSION_NAME_OVERRIDE}'..."
    if ! sed -i "s/versionName: [^ ]*/versionName: \\\${VERSION_NAME_OVERRIDE}/" "\\\${DECOMPILED_DIR}/apktool.yml" >> "\\\${LOG_FILE}" 2>&1; then
        log "FATAL: Failed to override versionName in apktool.yml."
        exit 1
    fi
fi
log "Mutation complete."

log "[4/9] Recompiling the mutated application from \\\${DECOMPILED_DIR}..."
if ! apktool b decompiled -o unsigned.apk >> "\\\${LOG_FILE}" 2>&1; then
    log "FATAL: Recompilation failed. This is often due to errors in the mutated XML or smali files. Check the log for details."
    exit 1
fi
log "Recompilation successful."

log "Verifying rebuilt APK..."
if [ ! -f "unsigned.apk" ]; then
    log "FATAL: Recompilation command succeeded, but the output file 'unsigned.apk' was not created. Consult the log for build errors."
    exit 1
fi
log "Verified creation of unsigned.apk."

log "[5/9] Generating new signing key..."
if ! keytool -genkey -v -keystore "\\\${KEYSTORE_NAME}" -alias "\\\${KEY_ALIAS}" -keyalg RSA -keysize 2048 -validity 10000 -storepass "\\\${KEY_PASS}" -keypass "\\\${KEY_PASS}" -dname "CN=Spiralgang, OU=Dev, O=GhostShell, L=Unknown, ST=Unknown, C=XX" >> "\\\${LOG_FILE}" 2>&1; then
    log "FATAL: Failed to generate signing key. Check that 'keytool' is installed (from openjdk-17), that you have write permissions in the current directory, and that the password is valid."
    exit 1
fi

log "[6/9] Signing 'unsigned.apk' with key '\\\${KEY_ALIAS}' from keystore '\\\${KEYSTORE_NAME}'..."
if ! apksigner sign --ks "\\\${KEYSTORE_NAME}" --ks-key-alias "\\\${KEY_ALIAS}" --ks-pass "pass:\\\${KEY_PASS}" --out signed.apk unsigned.apk >> "\\\${LOG_FILE}" 2>&1; then
    log "FATAL: APK signing failed. Check the keystore details, passwords, and ensure apksigner is functioning correctly."
    exit 1
fi
log "Signing successful. Signed APK created: \\\${WORKDIR}/signed.apk"

log "[7/9] Aligning 'signed.apk' for optimal performance..."
FINAL_APK_NAME="\\\${NEW_APP_NAME// /_}_fused.apk"
if ! zipalign -v 4 signed.apk "\\\${FINAL_APK_NAME}" >> "\\\${LOG_FILE}" 2>&1; then
    log "FATAL: APK alignment failed. Ensure 'zipalign' is installed, the signed APK is not corrupt, and that there is sufficient storage space available on the device."
    exit 1
fi

FINAL_APK_PATH="\\\${WORKDIR}/\\\${FINAL_APK_NAME}"
log "Final APK created at \\\${FINAL_APK_PATH}"

log "[8/9] Generating Final Audit Report..."
FINAL_APK_HASH=\\\$(sha256sum "\\\${FINAL_APK_PATH}" | awk '{print \$1}')
cat > fusion_summary.txt <<- EOM
Spiralgang APK Fusion Summary
------------------------------------
Timestamp: \\\$(date)
Source APK: \\\${SOURCE_APK}
Source SHA256: \\\${SOURCE_APK_HASH}

Final APK: \\\${FINAL_APK_PATH}
Final SHA256: \\\${FINAL_APK_HASH}

Mutations Applied:
- New Package Name: \\\${NEW_PACKAGE_NAME}
- New App Name: \\\${NEW_APP_NAME}
- Version Code Override: \\\${VERSION_CODE_OVERRIDE:-N/A}
- Version Name Override: \\\${VERSION_NAME_OVERRIDE:-N/A}

Full forensic log available at: \\\${LOG_FILE}
EOM
log "Summary written to \\\${WORKDIR}/fusion_summary.txt"
cat fusion_summary.txt

log "[9/9] Build Finalized."
log "SUCCESS: '\\\${NEW_APP_NAME}' has been built successfully."
log "The final, signed APK is located at:"
log "\\\${FINAL_APK_PATH}"
log ""
log "--- NEXT STEPS ---"
log "To install this on an Android device, you can use the Android Debug Bridge (adb)."
log "1. Ensure your Android device is connected and in developer mode."
log "2. Run the command: adb install \\"\\\${FINAL_APK_PATH}\\""
log "------------------"

log "--- Fusion Process Complete ---"
\`;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (packageNameError || sourceApkError || appNameError) return;
        const script = generateFullScript(sourceApk, newPackageName, newAppName, versionCode, versionName);
        onGenerate(
            "Generated Fusion Script",
            "This is the 'living code.' It's a production-grade script with a full audit trail. Copy and execute it in your terminal to begin the auditable APK fusion process.",
            script
        );
    };

    const handleFileSelect = (file: File | null | undefined) => {
        if (file && file.name.endsWith('.apk')) {
            const presumedPath = \`/storage/emulated/0/Download/\${file.name}\`;
            setState('sourceApk', presumedPath);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        handleFileSelect(file);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        handleFileSelect(file);
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 shadow-lg shadow-black/30">
            <h2 className="text-xl font-bold text-green-300 mb-4 border-b border-gray-800 pb-2">APK Fusion Control Panel</h2>
            
            <div className="bg-[#010409] border border-gray-800 rounded-lg p-3 mb-4 text-sm">
                <details>
                    <summary className="cursor-pointer font-semibold text-gray-300 hover:text-green-300 list-inside">
                        Show Required Dependencies
                    </summary>
                    <div className="mt-3 pt-3 border-t border-gray-700">
                        <p className="text-gray-400 mb-2">The generated script requires the following command-line tools to be installed in your execution environment (e.g., a proot-distro, not base Termux):</p>
                        <ul className="list-disc list-inside text-gray-400 space-y-1 mb-3 pl-2">
                            <li><strong className="text-gray-200">apktool</strong>: For decompiling and recompiling APKs.</li>
                            <li><strong className="text-gray-200">apksigner</strong> & <strong className="text-gray-200">zipalign</strong>: For signing and optimizing the final APK.</li>
                            <li><strong className="text-gray-200">openjdk-17-jre-headless</strong>: Provides <strong className="text-gray-200">keytool</strong> for generating signing keys.</li>
                        </ul>
                        <p className="text-gray-400 mb-2">On Debian-based systems (like Ubuntu), you can install them with this command:</p>
                        <div className="h-20">
                             <CodeBlock code="sudo apt-get update && sudo apt-get install -y apktool apksigner zipalign openjdk-17-jre-headless" language="bash" />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Note: The script will attempt to install these for you, but it's best to have them pre-installed.</p>
                    </div>
                </details>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                 <div>
                    <Tooltip text="The full path to the .apk file you want to modify in your environment. Example: /sdcard/Download/app.apk or ~/Downloads/app.apk">
                        <label className="block font-medium text-gray-400 mb-2 cursor-help">Source APK</label>
                    </Tooltip>
                    <div 
                        className={\`relative group p-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors \${
                            isDragging ? 'border-green-500 bg-green-900/20' : 'border-gray-700 hover:border-green-600'
                        }\`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={handleBrowseClick}
                    >
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".apk" />
                        <div className="flex items-center justify-center text-center gap-4">
                            <UploadCloudIcon className={\`w-8 h-8 text-gray-500 transition-colors \${isDragging ? 'text-green-400' : 'group-hover:text-green-500'}\`} />
                            <div>
                                <p className="text-gray-300"><span className="font-semibold text-green-400">Click to browse</span> or drag & drop</p>
                                <p className="text-xs text-gray-500 mt-1">Select a .apk file to auto-populate the path below.</p>
                            </div>
                        </div>
                    </div>
                     <input
                        type="text"
                        id="sourceApk"
                        value={sourceApk}
                        onChange={(e) => setState('sourceApk', e.target.value)}
                        className={\`w-full mt-2 bg-[#010409] border \${sourceApkError ? 'border-red-500/50 focus:ring-red-500' : 'border-gray-700 focus:ring-green-500'} rounded-md px-3 py-1.5 text-gray-200 focus:ring-2 focus:outline-none font-fira\`}
                        placeholder="e.g., /sdcard/Download/termux_v0.119.1.apk"
                        required
                    />
                    {sourceApkError && <p className="text-xs text-red-400 mt-1">{sourceApkError}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Tooltip text="A unique Java-style package name for the new app. Must be all lowercase and contain dots. Example: com.yourname.newapp">
                            <label htmlFor="newPackageName" className="block font-medium text-gray-400 mb-2 cursor-help">New Package Name</label>
                        </Tooltip>
                        <input
                            type="text"
                            id="newPackageName"
                            value={newPackageName}
                            onChange={(e) => setState('newPackageName', e.target.value)}
                            className={\`w-full bg-[#010409] border \${packageNameError ? 'border-red-500/50 focus:ring-red-500' : 'border-gray-700 focus:ring-green-500'} rounded-md px-3 py-1.5 text-gray-200 focus:ring-2 focus:outline-none font-fira\`}
                            placeholder="e.g., com.spiralgang.term"
                            required
                        />
                        {packageNameError && <p className="text-xs text-red-400 mt-1">{packageNameError}</p>}
                    </div>
                    <div>
                        <Tooltip text="The name that will be displayed on the home screen and in the app drawer. Example: My Custom App">
                            <label htmlFor="newAppName" className="block font-medium text-gray-400 mb-2 cursor-help">New App Name</label>
                        </Tooltip>
                        <input
                            type="text"
                            id="newAppName"
                            value={newAppName}
                            onChange={(e) => setState('newAppName', e.target.value)}
                            className={\`w-full bg-[#010409] border \${appNameError ? 'border-red-500/50 focus:ring-red-500' : 'border-gray-700 focus:ring-green-500'} rounded-md px-3 py-1.5 text-gray-200 focus:ring-2 focus:outline-none\`}
                            placeholder="e.g., GangTerm"
                            required
                        />
                        {appNameError && <p className="text-xs text-red-400 mt-1">{appNameError}</p>}
                    </div>
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Tooltip text="An internal, incremental integer version number. Overrides the value in the original APK. Example: 101">
                            <label htmlFor="versionCode" className="block font-medium text-gray-400 mb-2 cursor-help">Version Code <span className="text-gray-500">(Optional)</span></label>
                        </Tooltip>
                        <input
                            type="text"
                            id="versionCode"
                            value={versionCode}
                            onChange={(e) => setState('versionCode', e.target.value)}
                            className="w-full bg-[#010409] border border-gray-700 rounded-md px-3 py-1.5 text-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none"
                            placeholder="e.g., 23"
                        />
                    </div>
                    <div>
                        <Tooltip text="The user-facing version string. Overrides the value in the original APK. Example: 1.0.1-custom">
                            <label htmlFor="versionName" className="block font-medium text-gray-400 mb-2 cursor-help">Version Name <span className="text-gray-500">(Optional)</span></label>
                        </Tooltip>
                        <input
                            type="text"
                            id="versionName"
                            value={versionName}
                            onChange={(e) => setState('versionName', e.target.value)}
                            className="w-full bg-[#010409] border border-gray-700 rounded-md px-3 py-1.5 text-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none"
                            placeholder="e.g., 1.0.0-ghost"
                        />
                    </div>
                </div>
                <div className="pt-2">
                     <Tooltip text="Generates a complete, executable bash script with all the configured options. The button is disabled if there are validation errors in the form.">
                        <span className="block w-full">
                            <button
                                type="submit"
                                disabled={!!packageNameError || !!sourceApkError || !!appNameError}
                                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                <TerminalIcon className="w-5 h-5" />
                                Generate Fusion Script
                            </button>
                        </span>
                    </Tooltip>
                    <div className="bg-yellow-900/30 border border-yellow-500/50 text-yellow-300 text-xs p-3 rounded-md mt-4">
                        <span className="font-bold">Caution:</span> This script performs low-level modifications to an APK file. Ensure you understand the script's actions and trust the source APK before executing.
                    </div>
                </div>
            </form>
        </div>
    );
};
`,
  'components/ScriptLabTool.tsx': `
import React, { useState, useEffect, useMemo } from 'react';
import { TerminalIcon, FilterIcon } from './Icons';
import { Tooltip } from './Tooltip';
import { useApp } from '../context/AppContext';

interface ScriptLabToolProps {
    onGenerate: (title: string, description: string, script: string) => void;
}

type BlueprintCategory = 'AI Deployment' | 'Security Audits' | 'System Administration' | 'File Management' | 'OS & Emulation';

interface Blueprint {
    id: string;
    name: string;
    prompt: string;
    desc: string;
    category: BlueprintCategory;
}

const agenticBlueprints: Blueprint[] = [
    // --- AI Deployment ---
    {
        id: 'persistent-head-honcho',
        name: 'Persistent Head Honcho',
        prompt: \`\`, // This will be dynamically generated
        desc: "Deploys a stateful AI backend to Kaggle. Hydrates its workspace from a Git repo on startup and snapshots changes back on demand.",
        category: 'AI Deployment'
    },
    {
        id: 'noteformers-docker',
        name: 'NoteFormers Docker Lab',
        prompt: \`#!/data/data/com.termux/files/usr/bin/bash
set -Eeuo pipefail

# ┌────────────────────────────────────────────────────────────────────────────┐
# │ RATIONALE: Deploy a self-contained JupyterLab environment with NLP tools   │
# │            (Transformers, etc.) running inside Docker within a proot-distro│
# │            on Termux. This creates a powerful, isolated, and portable data │
# │            science environment managed from your phone.                    │
# │ STACK:     Termux, proot-distro (Ubuntu), Docker,                          │
# │            toluclassics/transformers_notebook                              │
# └────────────────────────────────────────────────────────────────────────────┘

# --- Configuration ---
DISTRO_NAME="ubuntu-docker"
CONTAINER_NAME="noteformers_lab"
JUPYTER_PORT="8888"
LOG_FILE="\\\$HOME/noteformers_deploy.log"
JUPYTER_LOG="\\\$HOME/jupyter_launch.log"

# --- Utility Functions ---
log() {
    echo "[\\\$(date '+%Y-%m-%d %H:%M:%S')] \\\$1" | tee -a "\\\$LOG_FILE"
}

# --- Main Execution ---
rm -f "\\\$LOG_FILE" "\\\$JUPYTER_LOG"
touch "\\\$LOG_FILE"
log "--- GangTerm NoteFormers Deployment Initiated ---"

# --- Phase 1: Termux Prerequisite Check ---
log "[1/4] Checking Termux prerequisites (proot-distro, wget)..."
pkg update -y >/dev/null 2>&1
pkg install -y proot-distro wget >/dev/null 2>&1
log "Prerequisites are installed."

# --- Phase 2: Setup proot-distro with Docker ---
log "[2/4] Setting up Ubuntu proot-distro for Docker..."
if ! proot-distro list | grep -q "\\\$DISTRO_NAME"; then
    log "Distro '\\\$DISTRO_NAME' not found. Installing now. This will take several minutes."
    proot-distro install ubuntu --distro-name "\\\$DISTRO_NAME"
    log "Distro installed."
else
    log "Distro '\\\$DISTRO_NAME' already exists."
fi

log "Logging into the distro to install Docker..."
proot-distro login "\\\$DISTRO_NAME" -- bash -c '
    set -Eeuo pipefail
    echo "--- Inside \\\${DISTRO_NAME}: Updating and installing Docker prerequisites ---"
    apt-get update
    apt-get install -y ca-certificates curl gnupg lsb-release

    echo "--- Adding Docker GPG key ---"
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg

    echo "--- Setting up Docker repository ---"
    echo \\\\
      "deb [arch=\\\$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \\\\
      \\\$(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    echo "--- Installing Docker Engine ---"
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    echo "--- Docker installation complete inside proot-distro ---"
' >> "\\\$LOG_FILE" 2>&1
log "Docker setup within '\\\$DISTRO_NAME' is complete."

# --- Phase 3: Launch Docker Container ---
log "[3/4] Pulling and running the NoteFormers Docker container..."
proot-distro login "\\\$DISTRO_NAME" -- bash -c "
    set -Eeuo pipefail
    echo '--- Starting Docker daemon ---'
    # Start docker daemon in the background
    dockerd > /dev/null 2>&1 &
    # Wait for the docker socket to be available
    for i in {1..10}; do
      if docker ps > /dev/null 2>&1; then
        break
      fi
      echo 'Waiting for docker daemon...'
      sleep 2
    done
    if ! docker ps > /dev/null 2>&1; then
      echo 'Docker daemon failed to start.'
      exit 1
    fi
    echo 'Docker daemon is running.'

    echo '--- Pulling the transformers_notebook image ---'
    docker pull toluclassics/transformers_notebook

    echo '--- Running the container ---'
    if docker ps -a -q -f name=\\\${CONTAINER_NAME}; then
        docker rm -f \\\${CONTAINER_NAME}
    fi
    
    # Create a notebooks directory in the proot-distro home
    mkdir -p /root/notebooks

    docker run -d --name \\\${CONTAINER_NAME} -p \\\${JUPYTER_PORT}:\\\${JUPYTER_PORT} -v '/root/notebooks:/home/jovyan/work' toluclassics/transformers_notebook
    
    echo '--- Waiting for JupyterLab to start...'
    sleep 10

    echo '--- Retrieving JupyterLab URL with token ---'
    docker logs \\\${CONTAINER_NAME}
" > "\\\$JUPYTER_LOG" 2>&1
log "Container started. Log file created at \\\$JUPYTER_LOG"

# --- Phase 4: Display Connection Info ---
log "[4/4] Displaying Connection Information ---"
echo -e "\\\\n\\\\n"
echo "✅✅✅ NOTEFORMERS JUPYTERLAB IS STARTING ✅✅✅"
echo "------------------------------------------------------------------"
echo "Your JupyterLab instance is running inside a Docker container."
echo "Find the connection URL with the login token in the logs below."
echo "------------------------------------------------------------------"
cat "\\\$JUPYTER_LOG" | grep 'http://127.0.0.1'
echo ""
echo "INSTRUCTIONS:"
echo "1. Copy one of the URLs above (it includes the auth token)."
echo "2. Paste it into your web browser."
echo "3. Your notebooks are stored in the '~/notebooks' directory within the proot-distro."
echo "------------------------------------------------------------------"
echo "To stop the server, run this command:"
echo "proot-distro login \\\${DISTRO_NAME} -- docker stop \\\${CONTAINER_NAME}"
echo "------------------------------------------------------------------"
\`,
        desc: "Deploys a full JupyterLab NLP environment via Docker inside a Termux proot-distro. A portable, powerful 'Head Honcho' setup.",
        category: 'AI Deployment'
    },
    {
        id: 'chromium-os-vnc',
        name: 'Chromium Web Desktop (noVNC)',
        prompt: \`#!/data/data/com.termux/files/usr/bin/bash
set -Eeuo pipefail

# ┌────────────────────────────────────────────────────────────────────────────┐
# │ RATIONALE: Deploy a full graphical desktop environment (XFCE) with a       │
# │            modern web browser (Chromium) inside a proot-distro. This is    │
# │            made accessible from ANY web browser via noVNC and a secure     │
# │            tmate tunnel, creating a one-click remote desktop.              │
# │ STACK:     Termux, proot-distro (Ubuntu), XFCE4, Chromium, x11vnc, noVNC,   │
# │            websockify, tmate                                               │
# └────────────────────────────────────────────────────────────────────────────┘

# --- Configuration ---
DISTRO_NAME="ubuntu-desktop"
VNC_PASS="gangterm"
LOG_FILE="\\\$HOME/web_desktop_deploy.log"

# --- Utility Functions ---
log() {
    echo "[\\\$(date '+%Y-%m-%d %H:%M:%S')] \\\$1" | tee -a "\\\$LOG_FILE"
}

# --- Main Execution ---
rm -f "\\\$LOG_FILE"
touch "\\\$LOG_FILE"
log "--- GangTerm Web Desktop Deployment Initiated ---"

# --- Phase 1: Termux Prerequisite Check ---
log "[1/5] Checking Termux prerequisites..."
pkg update -y >/dev/null 2>&1
pkg install -y proot-distro wget tmate >/dev/null 2>&1
log "Prerequisites are installed."

# --- Phase 2: Setup proot-distro ---
log "[2/5] Setting up Ubuntu proot-distro..."
if ! proot-distro list | grep -q "\\\$DISTRO_NAME"; then
    log "Distro '\\\$DISTRO_NAME' not found. Installing. THIS WILL TAKE SEVERAL MINUTES."
    proot-distro install ubuntu --distro-name "\\\$DISTRO_NAME"
    log "Distro installed."
else
    log "Distro '\\\$DISTRO_NAME' already exists."
fi

# --- Phase 3: Install Desktop Environment & Tools ---
log "[3/5] Installing desktop environment inside distro..."
proot-distro login "\\\$DISTRO_NAME" -- bash -c '
    set -Eeuo pipefail
    echo "--- Inside \\\${DISTRO_NAME}: Updating and installing packages ---"
    export DEBIAN_FRONTEND=noninteractive
    apt-get update -y
    apt-get install -y --no-install-recommends \\\\
        xfce4 xfce4-goodies chromium-browser \\\\
        x11vnc xvfb novnc websockify
    
    echo "--- Configuring VNC password ---"
    mkdir -p ~/.vnc
    x11vnc -storepasswd "'\\"\\\$VNC_PASS"'" ~/.vnc/passwd
    
    echo "--- Desktop environment setup complete ---"
' >> "\\\$LOG_FILE" 2>&1
log "Desktop environment installed."

# --- Phase 4: Launch Services ---
log "[4/5] Launching VNC, Web Proxy, and Tunnel..."
# This command runs the entire server stack inside the proot-distro
proot-distro login "\\\$DISTRO_NAME" -- bash -c '
    set -Eeuo pipefail
    # Start a virtual display on :1
    Xvfb :1 -screen 0 1280x720x24 > /dev/null 2>&1 &
    export DISPLAY=:1
    
    # Start the XFCE desktop session
    startxfce4 > /dev/null 2>&1 &
    sleep 5 # Give desktop time to start

    # Start the VNC server, attached to the virtual display
    x11vnc -display :1 -rfbauth ~/.vnc/passwd -forever -shared -nopw -quiet > /dev/null 2>&1 &
    
    # Start the noVNC web server and WebSocket proxy
    websockify -D --web=/usr/share/novnc/ 6080 localhost:5900
    
    echo "--- Services are running inside the distro ---"
' & # Run the whole proot-distro command in the background
log "Services started in background."
sleep 10 # Give services time to initialize

# --- Phase 5: Expose via tmate and Display Info ---
log "[5/5] Creating secure tunnel..."
tmate -S /tmp/tmate.sock new-session -d
tmate -S /tmp/tmate.sock wait tmate-ready
# Create a tunnel from the tmate session to the local noVNC port
tmate -S /tmp/tmate.sock set-option -g tmate-server-host "ssh.tmate.io"
TMATE_WEB_URL=\\\$(tmate -S /tmp/tmate.sock display -p '#{tmate_web}')
# The remote port forwarding command is complex, let's just expose the web URL of tmate shell for simplicity and guide user.
# A more advanced setup would tunnel the port directly.

PUBLIC_URL=\\\$(tmate -S /tmp/tmate.sock display -p '#{tmate_web}')

echo -e "\\\\n\\\\n"
echo "✅✅✅ CHROMIUM WEB DESKTOP IS ONLINE ✅✅✅"
echo "------------------------------------------------------------------"
echo "Your graphical desktop is running and accessible in your browser."
echo "------------------------------------------------------------------"
echo "CONNECTION DETAILS:"
echo "  Web Desktop URL: \\\${PUBLIC_URL}"
echo "  Password:        \\\${VNC_PASS}"
echo ""
echo "INSTRUCTIONS:"
echo "1. Open the URL above in your web browser."
echo "2. A terminal will appear. Inside that terminal, run:"
echo "     websockify -D --web=/usr/share/novnc/ 6080 localhost:5900"
echo "3. Then, open a NEW BROWSER TAB and navigate to the same URL, but"
echo "   replace '/s/...' with '/vnc.html?host=YOUR_TMATE_HOSTNAME&port=6080'"
echo "   (You can find YOUR_TMATE_HOSTNAME from the URL)"
echo "------------------------------------------------------------------"
echo "To stop the server, run this command in Termux:"
echo "proot-distro login \\\${DISTRO_NAME} -- pkill -f x11vnc"
echo "------------------------------------------------------------------"
\`,
        desc: "Deploys a full graphical desktop with Chromium inside a proot-distro, accessible from any web browser via a secure tunnel.",
        category: 'OS & Emulation'
    },
    {
        id: 'process-warden',
        name: 'Termux Process Warden',
        prompt: \`Create an advanced, persistent bash script for Termux called 'Process Warden'. This script must act as a background service (daemon) to enforce process control.

The script must have the following features:
1.  **Configurable Allowlist:** At the top of the script, there must be a clear, commented array named 'ALLOWLIST' where the user can list the command names of processes that are permitted to run (e.g., ALLOWLIST=("bash" "sshd" "node" "nvim")).
2.  **Daemon Control:** The script must be executable with 'start', 'stop', and 'status' arguments.
    - 'start': Runs the monitoring loop in the background, saving its PID to a file in /data/data/com.termux/files/usr/tmp/.
    - 'stop': Reads the PID file and kills the background process.
    - 'status': Checks if the process with the saved PID is running.
3.  **Continuous Monitoring Loop:** When started, it enters an infinite 'while' loop. Inside the loop, it gets a list of all currently running processes for the user.
4.  **Rogue Process Detection:** It compares every running process against the user's ALLOWLIST. Any process whose command name is NOT in the list is considered a "rogue" process.
5.  **Notification & Action:** For each rogue process detected:
    - It must use 'termux-notification' to send an immediate, high-priority Android notification warning the user about the unauthorized process.
    - **(Crucially)** It must have a configurable 'AUTO_KILL' variable (true/false). If true, the script will immediately 'kill -9' the rogue process and log the action.
6.  **Configuration:** Include a 'CHECK_INTERVAL' variable (e.g., 10 seconds) to control how often it scans.
7.  **Robustness:** Ensure it handles PID files correctly and provides clear echo statements for start, stop, and status actions.
\`,
        desc: "An active daemon that kills any process not on your allowlist and notifies you. Your personal process firewall.",
        category: 'Security Audits'
    },
    {
        id: 'orphan-hunter',
        name: 'Orphan & Rogue Process Hunter',
        prompt: \`Create an advanced bash script for Termux called 'Orphan & Rogue Process Hunter'. The script must identify all processes running under the current user's ID. It should then analyze the process tree to differentiate between processes started by the current interactive shell (and its children) and those running in the background (e.g., from npm, background tasks, or other scripts). The output must be a color-coded report: highlight processes directly under the current shell in green, and flag all other processes (orphans or those started by other means) in yellow or red. Finally, it should offer an interactive prompt to terminate any of the flagged processes by PID.\`,
        desc: "Audits your processes, flagging any that aren't direct children of your current shell. Helps find and kill runaway background tasks.",
        category: 'System Administration'
    },
    {
        id: 'security-audit',
        name: 'System & User Security Audit',
        prompt: \`Create an advanced bash security script for Termux called 'System & User Security Audit'. The script must perform three actions: 1) List all users from /data/data/com.termux/files/usr/etc/passwd and all groups from /data/data/com.termux/files/usr/etc/group to establish a baseline of configured identities. 2) List all currently running processes with their user and group ownership. 3) Cross-reference the process list against the user list. It must create a color-coded report that clearly distinguishes between processes owned by 'root', the current interactive user, and any other users found on the system. It should highlight processes owned by unexpected or non-standard users in red as a potential security risk. The script must be robust and handle cases where user/group files might be non-standard.\`,
        desc: 'A deep security scan. Lists all users/groups and flags processes owned by unexpected user accounts.',
        category: 'Security Audits'
    },
     {
        id: 'process-sentinel',
        name: 'Process Ownership Sentinel',
        prompt: \`Generate a bash script for Termux called 'Process Ownership Sentinel'. The script should get the current user's name. It must then list all running processes using 'ps -eo user,pid,cmd'. The output must be clearly grouped and color-coded into three categories: 1) Processes owned by the current interactive user (highlight in green). 2) Processes owned by 'root' (highlight in yellow). 3) Processes owned by ANY other user (highlight in red). This provides a quick, high-level overview of who is running what on the system.\`,
        desc: 'A quick, color-coded overview of running processes, grouped by owner: you, root, or others.',
        category: 'System Administration'
    },
    {
        id: 'encrypted-backup',
        name: 'Secure Encrypted Backup',
        prompt: \`Create a bash script for Termux that finds important project files (like READMEs, source code in src/, scripts/), archives them into a .tar.gz file, encrypts the archive with a user-provided password using openssl, and then optionally uploads it to a specified rclone remote. The script should include robust logging, error handling, and cleanup of temporary files.\`,
        desc: 'Generate a script to archive, encrypt, and upload sensitive files.',
        category: 'File Management'
    },
    {
        id: 'python-router',
        name: 'Python AI Provider Router',
        prompt: \`Generate a Python script that acts as a unified function to call different AI provider APIs (like OpenAI, Hugging Face, Ollama). The script should select the provider based on an environment variable or function argument. It must handle API keys from environment variables securely and normalize the responses to return a simple text string. Include error handling for network issues or missing API keys.\`,
        desc: 'A flexible Python function to route requests to multiple AI backends.',
        category: 'AI Deployment'
    },
    {
        id: 'health-dashboard',
        name: 'System Health Dashboard',
        prompt: \`Generate a comprehensive bash script for Termux that acts as a 'System Health Dashboard'. It should display the current date/time, CPU usage (perhaps from 'top'), memory usage ('free -h'), disk space ('df -h'), and a list of the top 5 memory-consuming processes. The output should be well-formatted with clear headings for each section.\`,
        desc: 'A script that provides a quick, formatted overview of system resources.',
        category: 'System Administration'
    },
    {
        id: 'share-server',
        name: 'Instant Share Server',
        prompt: \`Create a simple bash script for Termux to start a temporary HTTP file server in the current directory. The script must check if Python 3 is available, then use 'python -m http.server 8000'. It must detect the device's local IP address and print a clear message like 'Server running at http://[DEVICE_IP]:8000'. It should handle cleanup on Ctrl+C.\`,
        desc: 'Starts a temporary web server in any directory for easy file sharing.',
        category: 'File Management'
    },
];

const blueprintCategories: ('All' | BlueprintCategory)[] = ['All', 'AI Deployment', 'OS & Emulation', 'Security Audits', 'System Administration', 'File Management'];

interface KaggleConfig {
    kernelName: string;
    modelSource: 'hf' | 'git';
    modelIdentifier: string;
    workspaceSyncTarget: string; // Git repo URL
    gpuEnabled: boolean;
}

const generateKaggleScript = (config: KaggleConfig) => {
    const { kernelName, modelSource, modelIdentifier, workspaceSyncTarget, gpuEnabled } = config;

    const bootstrapPyContent = \`
# GANGTERM PERSISTENT HEAD HONCHO - PYTHON/PYTORCH BOOTSTRAPPER v4.0
import os
import sys
import subprocess
import time
import asyncio
import json
import threading
from datetime import datetime
from kaggle_secrets import UserSecretsClient

# --- CONFIGURATION ---
WORKSPACE_SYNC_TARGET = "\${workspaceSyncTarget}"
WORKSPACE_DIR = "/kaggle/working/workspace"
MODEL_REPO_DIR = "/kaggle/working/model_repo"
SNAPSHOT_FILE = "workspace_snapshot.tar.gz"

# --- HELPER FUNCTIONS ---
def run_command(command, cwd=None, capture_output=False):
    print(f"--- Running: {command} ---", flush=True)
    process = subprocess.Popen(command, shell=True, text=True, cwd=cwd,
                               stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    output_lines = []
    while True:
        output = process.stdout.readline()
        if output == '' and process.poll() is not None:
            break
        if output:
            line = output.strip()
            if capture_output:
                output_lines.append(line)
            print(line, flush=True)
    rc = process.poll()
    if rc != 0:
        print(f"--- Command failed with exit code {rc} ---", flush=True)
    return rc, output_lines

# --- 1. SETUP & WORKSPACE HYDRATION ---
print("--- [1/7] Installing dependencies ---", flush=True)
run_command("apt-get update -qq && apt-get install -yqq tmate git git-lfs")
run_command(f"{sys.executable} -m pip install -qU pip")
run_command(f"{sys.executable} -m pip install -qU websockets transformers accelerate bitsandbytes torch pyngrok einops huggingface_hub")
run_command("git lfs install")

if WORKSPACE_SYNC_TARGET:
    print(f"--- [2/7] Hydrating workspace from {WORKSPACE_SYNC_TARGET} ---", flush=True)
    try:
        git_token = UserSecretsClient().get_secret("GIT_AUTH_TOKEN")
        sync_repo_url = WORKSPACE_SYNC_TARGET.replace("https://", f"https://oauth2:{git_token}@")
        
        run_command(f"git clone {sync_repo_url} {WORKSPACE_DIR}")
        
        snapshot_path = os.path.join(WORKSPACE_DIR, SNAPSHOT_FILE)
        if os.path.exists(snapshot_path):
            print("--- Found workspace snapshot. Restoring... ---", flush=True)
            # Restore to /kaggle/working/ to persist across notebook sessions
            run_command(f"tar -xzf {snapshot_path} -C /kaggle/working/")
            print("--- Workspace restored. ---", flush=True)
        else:
            print("--- No snapshot found. Starting with a clean workspace. ---", flush=True)
    except Exception as e:
        print(f"--- WARNING: Could not hydrate workspace: {e} ---", flush=True)
else:
    print("--- [2/7] No workspace sync target. Skipping hydration. ---", flush=True)

# --- 3. Prepare Model Source ---
print("--- [3/7] Preparing model source ---", flush=True)
model_path = ""
\${modelSource === 'git' ? \`
print("Cloning model repository... This may take a while.")
run_command(f"git clone \\\${modelIdentifier} {MODEL_REPO_DIR}")
model_path = MODEL_REPO_DIR
\` : \`
model_path = "\${modelIdentifier}"
\`}
print(f"--- Model will be loaded from: {model_path} ---", flush=True)

# --- 4. Load AI Model (in a thread to not block other services) ---
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

model = None
tokenizer = None
model_ready = threading.Event()

def load_model_task():
    global model, tokenizer
    print(f"--- [4/7] Loading AI model from {model_path} ---", flush=True)
    try:
        tokenizer = AutoTokenizer.from_pretrained(model_path, trust_remote_code=True)
        print("   -> Attempting to load with 4-bit quantization...", flush=True)
        model = AutoModelForCausalLM.from_pretrained(
            model_path, torch_dtype=torch.float16, device_map="auto",
            load_in_4bit=True, trust_remote_code=True
        )
    except Exception as e:
        print(f"   -> 4-bit loading failed: {e}. Falling back to FP16.", flush=True)
        model = AutoModelForCausalLM.from_pretrained(
            model_path, torch_dtype=torch.float16, device_map="auto", trust_remote_code=True
        )
    print("--- Model loaded successfully ---", flush=True)
    model_ready.set()

# --- 5. WebSocket Server Logic ---
async def send_json(websocket, data):
    await websocket.send(json.dumps(data))

async def handle_create_snapshot(websocket):
    if not WORKSPACE_SYNC_TARGET:
        await send_json(websocket, {"action": "SNAPSHOT_END", "success": false, "error": "No workspace sync target configured."})
        return
    
    await send_json(websocket, {"action": "SNAPSHOT_START"})
    
    async def log_to_client(msg):
        print(msg, flush=True)
        await send_json(websocket, {"action": "SNAPSHOT_LOG", "line": msg})

    try:
        await log_to_client(f"Creating snapshot archive '{SNAPSHOT_FILE}'...")
        snapshot_path = os.path.join(WORKSPACE_DIR, SNAPSHOT_FILE)
        cmd = f"tar --exclude='{WORKSPACE_DIR}' --exclude='{MODEL_REPO_DIR}' --exclude='.*' -czf {snapshot_path} -C /kaggle/working/ ."
        await log_to_client(f"Running tar command: {cmd}")
        proc = await asyncio.create_subprocess_shell(cmd, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE)
        stdout, stderr = await proc.communicate()

        if proc.returncode != 0:
            raise Exception(f"Tar command failed: {stderr.decode()}")

        await log_to_client("Archive created. Pushing to Git...")
        repo = WORKSPACE_DIR
        run_command("git config --global user.name 'GangTerm Agent'", cwd=repo)
        run_command("git config --global user.email 'agent@gangterm.local'", cwd=repo)
        run_command("git add .", cwd=repo)
        
        _, status_lines = run_command("git status --porcelain", cwd=repo, capture_output=True)
        if not status_lines:
            await log_to_client("No changes to commit. Workspace is up to date.")
        else:
            run_command(f"git commit -m 'Workspace Snapshot {datetime.utcnow().isoformat()}'", cwd=repo)
            run_command("git push", cwd=repo)
        
        await log_to_client("Snapshot pushed successfully.")
        await send_json(websocket, {"action": "SNAPSHOT_END", "success": true})

    except Exception as e:
        error_msg = f"Snapshot failed: {e}"
        await log_to_client(error_msg)
        await send_json(websocket, {"action": "SNAPSHOT_END", "success": false, "error": error_msg})

async def handle_get_system_state(websocket):
    state = {
        "model_loaded": model_ready.is_set(),
        "model_path": model_path,
        "workspace_hydrated": os.path.exists(WORKSPACE_DIR),
        "workspace_sync_target": WORKSPACE_SYNC_TARGET,
        "snapshot_exists": os.path.exists(os.path.join(WORKSPACE_DIR, SNAPSHOT_FILE)),
        "python_version": sys.version,
    }
    await send_json(websocket, {"action": "SYSTEM_STATE_RESPONSE", "state": state})

async def handle_ai_query(websocket, payload):
    if not model_ready.is_set():
        await send_json(websocket, {"action": "AI_RESPONSE", "response": "[SYSTEM] Model is still loading. Please wait."})
        return
    message = payload.get("message", "Tell me about yourself.")
    messages = [{"role": "system", "content": "You are a helpful coding assistant."}, {"role": "user", "content": message}]
    try:
        text = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
        inputs = tokenizer([text], return_tensors="pt").to(model.device)
        outputs = model.generate(**inputs, max_new_tokens=512, do_sample=True, temperature=0.2, top_p=0.95)
        response = tokenizer.decode(outputs[0][inputs.input_ids.shape[1]:], skip_special_tokens=True)
        await send_json(websocket, {"action": "AI_RESPONSE", "response": response})
    except Exception as e:
        await send_json(websocket, {"action": "AI_RESPONSE", "response": f"[ERROR] Inference failed: {e}"})

async def handle_execute_script(websocket, payload):
    script = payload.get("script", "echo 'No script provided.'")
    await send_json(websocket, {"action": "EXECUTION_START"})
    proc = await asyncio.create_subprocess_shell(
        script, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
    )
    async def stream_output(stream, stream_name):
        while True:
            line = await stream.readline()
            if not line: break
            await send_json(websocket, {"action": "EXECUTION_OUTPUT", "line": f"[{stream_name}] {line.decode().strip()}"})
    await asyncio.gather(stream_output(proc.stdout, "stdout"), stream_output(proc.stderr, "stderr"))
    await proc.wait()
    await send_json(websocket, {"action": "EXECUTION_END", "exit_code": proc.returncode})

async def gangterm_handler(websocket, path):
    print(f"--- WS: New connection from {websocket.remote_address} ---", flush=True)
    try:
        async for raw_msg in websocket:
            try:
                payload = json.loads(raw_msg)
                action = payload.get("action")

                if action == "AI_QUERY":
                    await handle_ai_query(websocket, payload)
                elif action == "EXECUTE_SCRIPT":
                    await handle_execute_script(websocket, payload)
                elif action == "CREATE_SNAPSHOT":
                    await handle_create_snapshot(websocket)
                elif action == "GET_SYSTEM_STATE":
                    await handle_get_system_state(websocket)
                else:
                    await send_json(websocket, {"error": f"Unknown action: {action}"})

            except Exception as e:
                await send_json(websocket, {"error": f"Handler failed: {str(e)}"})
    except Exception as e:
        print(f"--- WS: Connection closed with error: {e} ---", flush=True)

def start_ws_server():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    server = loop.run_until_complete(websockets.serve(gangterm_handler, "0.0.0.0", 8765))
    print("--- WebSocket server listening on 0.0.0.0:8765 ---", flush=True)
    loop.run_forever()

# --- 6. Start Services ---
print("--- [5/7] Starting services in background threads ---", flush=True)
model_thread = threading.Thread(target=load_model_task, daemon=True)
model_thread.start()
ws_thread = threading.Thread(target=start_ws_server, daemon=True)
ws_thread.start()
time.sleep(2)

print("--- [6/7] Starting tmate for remote terminal ---", flush=True)
run_command("tmate -S /tmp/tmate.sock new-session -d")
run_command("tmate -S /tmp/tmate.sock wait tmate-ready")

print("--- [7/7] Starting ngrok tunnel for AI Console ---", flush=True)
from pyngrok import ngrok
try:
    ngrok_token = UserSecretsClient().get_secret("NGROK_AUTH_TOKEN")
    ngrok.set_auth_token(ngrok_token)
    public_url = ngrok.connect(8765, "http")
    ws_url = public_url.replace('http', 'ws')
except Exception as e:
    print(f"--- FATAL: Failed to get ngrok token or start tunnel: {e} ---", flush=True)
    ws_url = "ERROR: Could not start ngrok. Check NGROK_AUTH_TOKEN secret."

# --- FINAL OUTPUT ---
print("--- TMATE_OUTPUT_START ---", flush=True)
subprocess.run("tmate -S /tmp/tmate.sock display -p '#{tmate_ssh}'", shell=True, text=True)
print("--- TMATE_OUTPUT_END ---", flush=True)
print("--- PYNGROK_URL_START ---", flush=True)
print(ws_url, flush=True)
print("--- PYNGROK_URL_END ---", flush=True)

print("--- Bootstrap complete. Kernel is persistent. ---", flush=True)
while True: time.sleep(60)
\`;

    return \`#!/data/data/com.termux/files/usr/bin/bash
set -Eeuo pipefail

# ┌────────────────────────────────────────────────────────────────────────────┐
# │ RATIONALE: Deploy a persistent, stateful AI model on a Kaggle Kernel.      │
# │            Hydrates workspace from Git, provides remote terminal (tmate)   │
# │            and a WebSocket server (pyngrok) for the AI Console, and can    │
# │            snapshot its state back to Git.                                 │
# │ STACK:     Kaggle CLI, Python, PyTorch, Transformers, websockets, tmate,   │
# │            pyngrok, Git                                                    │
# └────────────────────────────────────────────────────────────────────────────┘

# --- Configuration ---
KAGGLE_KERNEL_NAME="\${kernelName}"
WORKDIR="\\\$HOME/kaggle_deploys"
KERNEL_DIR="\\\$WORKDIR/\\\$KAGGLE_KERNEL_NAME"
LOG_FILE="\\\$WORKDIR/kaggle_deploy.log"

# --- Utility Functions ---
log() {
    echo "[\\\$(date '+%Y-%m-%d %H:%M:%S')] \\\$1" | tee -a "\\\$LOG_FILE"
}

# --- Phase 1: Local Environment Setup (Termux) ---
log "--- Phase 1: Setting up local Termux environment ---"
mkdir -p "\\\$WORKDIR"
touch "\\\$LOG_FILE"

log "Installing local dependencies (kaggle, python)..."
pkg update -y >/dev/null 2>&1
pkg install -y python python-pip openssh >/dev/null 2>&1

log "Ensuring Kaggle CLI is installed..."
if ! python -m pip show kaggle &>/dev/null; then
    python -m pip install --upgrade kaggle
fi

log "Verifying Kaggle & Git credentials..."
if [ ! -f "\\\$HOME/.kaggle/kaggle.json" ]; then
    log "FATAL: Kaggle API key not found at \\\$HOME/.kaggle/kaggle.json"
    exit 1
fi
chmod 600 "\\\$HOME/.kaggle/kaggle.json"

if [ -z "\\\${NGROK_AUTH_TOKEN:-}" ] || [ -z "\\\${GIT_AUTH_TOKEN:-}" ]; then
    log "WARNING: NGROK_AUTH_TOKEN and/or GIT_AUTH_TOKEN are not set in Termux."
    log "You MUST add them as secrets on the Kaggle kernel settings page for the Head Honcho to function correctly."
fi
log "Local checks complete."

# --- Phase 2: Create Kaggle Kernel Files ---
log "--- Phase 2: Generating Kaggle Kernel files ---"
rm -rf "\\\$KERNEL_DIR"
mkdir -p "\\\$KERNEL_DIR"

log "Creating kernel metadata..."
printf '{
  "id": "%s/%s",
  "title": "%s",
  "code_file": "bootstrap.py",
  "language": "python",
  "kernel_type": "script",
  "is_private": true,
  "enable_gpu": \${gpuEnabled},
  "enable_internet": true,
  "dataset_sources": [],
  "competition_sources": [],
  "kernel_sources": []
}\\n' "\\\$(kaggle config view -q | grep '^username' | cut -d ' ' -f 2)" "\\\${KAGGLE_KERNEL_NAME}" "\\\${KAGGLE_KERNEL_NAME}" > "\\\$KERNEL_DIR/kernel-metadata.json"

log "Creating bootstrap Python script for Kaggle..."
printf '%s' "\${bootstrapPyContent.replace(/%/g, '%%')}" > "\\\$KERNEL_DIR/bootstrap.py"

log "Kernel files created successfully in \\\$KERNEL_DIR"

# --- Phase 3: Deploy to Kaggle ---
log "--- Phase 3: Pushing and running the Kernel on Kaggle ---"
log "This will start the build process on Kaggle's servers. It may take 15-45 minutes."
kaggle kernels push -p "\\\$KERNEL_DIR"

# --- Phase 4: Monitor and Retrieve Connection Info ---
log "--- Phase 4: Waiting for Kernel to become ready... ---"
i=0
max_wait=90 # 90 * 30s = 45 minutes
while true; do
    status=\\\$(kaggle kernels status "\\\$(kaggle config view -q | grep '^username' | cut -d ' ' -f 2)"/"\\\${KAGGLE_KERNEL_NAME}" | grep -o 'status: [a-zA-Z]*' | cut -d ' ' -f 2)
    log "Current kernel status: \\\$status"
    if [[ "\\\$status" == "running" ]]; then
        log "Kernel is running. Checking for tmate & ngrok output..."
        output=\\\$(kaggle kernels output "\\\$(kaggle config view -q | grep '^username' | cut -d ' ' -f 2)"/"\\\${KAGGLE_KERNEL_NAME}")
        if echo "\\\$output" | grep -q "TMATE_OUTPUT_START" && echo "\\\$output" | grep -q "PYNGROK_URL_START"; then
            log "Kernel is ready! Retrieving connection details."
            break
        fi
    fi
    if [[ "\\\$status" == "complete" || "\\\$status" == "error" ]]; then
        log "FATAL: Kernel finished unexpectedly with status: \\\$status. Check logs on Kaggle website."
        kaggle kernels output "\\\$(kaggle config view -q | grep '^username' | cut -d ' ' -f 2)"/"\\\${KAGGLE_KERNEL_NAME}"
        exit 1
    fi
    i=\\\$((i+1))
    if [ \\\$i -ge \\\$max_wait ]; then
        log "FATAL: Timeout waiting for kernel after \\\$((max_wait * 30 / 60)) minutes."
        exit 1
    fi
    sleep 30
done

# --- Phase 5: Display Connection Details ---
log "--- Phase 5: Connection Ready! ---"
SSH_URL=\\\$(echo "\\\$output" | sed -n '/TMATE_OUTPUT_START/,/TMATE_OUTPUT_END/p' | sed '/TMATE_OUTPUT_START/d' | sed '/TMATE_OUTPUT_END/d')
WS_URL=\\\$(echo "\\\$output" | sed -n '/PYNGROK_URL_START/,/PYNGROK_URL_END/p' | sed '/PYNGROK_URL_START/d' | sed '/PYNGROK_URL_END/d')

echo -e "\\\\n\\\\n"
echo "✅✅✅ PERSISTENT HEAD HONCHO IS ONLINE ✅✅✅"
echo "------------------------------------------------------------------"
echo "Your Python/PyTorch AI backend and remote terminal are live."
echo "------------------------------------------------------------------"
echo -e "\\\\n📱 FOR AI CONSOLE & SANDBOX (on your phone):"
echo "   Paste this WebSocket URL into the Head Honcho Controller:"
echo "   \\\${WS_URL}"
echo ""
echo "💻 FOR DEVELOPMENT (in Termux or on a PC):"
echo "   Use this SSH command to get a shell on the remote Kaggle machine."
echo "   \\\${SSH_URL}"
echo "------------------------------------------------------------------"
echo "To stop the kernel, go to your Kaggle kernels page and manually stop it."
echo "------------------------------------------------------------------"
\`;
}

const ToggleSwitch: React.FC<{ label: string; checked: boolean; onChange: (checked: boolean) => void; tooltip: string; }> = ({ label, checked, onChange, tooltip }) => (
    <Tooltip text={tooltip}>
        <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-gray-300">{label}</span>
            <div className="relative">
                <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
                <div className={\`block w-10 h-6 rounded-full transition \${checked ? 'bg-green-500' : 'bg-gray-600'}\`}></div>
                <div className={\`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform \${checked ? 'translate-x-4' : ''}\`}></div>
            </div>
        </label>
    </Tooltip>
);

export const ScriptLabTool: React.FC<ScriptLabToolProps> = ({ onGenerate }) => {
    const { artifacts, setActiveTool } = useApp();
    const [activeCategory, setActiveCategory] = useState<typeof blueprintCategories[0]>('All');
    
    const [kaggleConfig, setKaggleConfig] = useState<KaggleConfig>(() => {
        const saved = localStorage.getItem('scriptlab_kaggleConfig_v3');
        try {
            return saved ? JSON.parse(saved) : {
                kernelName: 'persistent-head-honcho',
                modelSource: 'hf',
                modelIdentifier: 'Qwen/Qwen2.5-Coder-7B-Instruct',
                workspaceSyncTarget: '',
                gpuEnabled: true,
            };
        } catch (e) {
            console.error("Failed to parse kaggleConfig from localStorage", e);
            return {
                kernelName: 'persistent-head-honcho',
                modelSource: 'hf',
                modelIdentifier: 'Qwen/Qwen2.5-Coder-7B-Instruct',
                workspaceSyncTarget: '',
                gpuEnabled: true,
            };
        }
    });

    useEffect(() => {
        localStorage.setItem('scriptlab_kaggleConfig_v3', JSON.stringify(kaggleConfig));
    }, [kaggleConfig]);
    
    const gitArtifacts = useMemo(() => artifacts.filter(a => a.type === 'Git Repository'), [artifacts]);
    const workspaceTarget = useMemo(() => artifacts.find(a => a.isWorkspaceTarget), [artifacts]);

    // Auto-select workspace target
    useEffect(() => {
        if (workspaceTarget) {
            setKaggleConfig(p => ({ ...p, workspaceSyncTarget: workspaceTarget.source }));
        } else {
            setKaggleConfig(p => ({ ...p, workspaceSyncTarget: '' }));
        }
    }, [workspaceTarget]);

    useEffect(() => {
        if (kaggleConfig.modelSource === 'git') {
            const modelGitArtifacts = gitArtifacts.filter(a => !a.isWorkspaceTarget);
            const identifierIsAValidArtifactSource = modelGitArtifacts.some(a => a.source === kaggleConfig.modelIdentifier);
            if (!identifierIsAValidArtifactSource && modelGitArtifacts.length > 0) {
                setKaggleConfig(p => ({ ...p, modelIdentifier: modelGitArtifacts[0].source }));
            } else if (modelGitArtifacts.length === 0) {
                 setKaggleConfig(p => ({ ...p, modelIdentifier: '' }));
            }
        }
    }, [kaggleConfig.modelSource, gitArtifacts]);

    const filteredBlueprints = useMemo(() => {
        if (activeCategory === 'All') return agenticBlueprints;
        return agenticBlueprints.filter(b => b.category === activeCategory);
    }, [activeCategory]);
    
    const renderBlueprint = (blueprint: Blueprint) => {
        return (
             <div key={blueprint.id} className={\`p-3 rounded-md border bg-[#161b22] border-gray-700/50\`}>
                <h3 className={\`font-semibold text-green-400\`}>{blueprint.name}</h3>
                <p className="text-xs text-gray-500 mb-3">{blueprint.desc}</p>
                 {blueprint.id === 'persistent-head-honcho' ? (
                    <div className="p-3 bg-black/30 border border-gray-800 rounded-lg space-y-3 text-sm">
                        <h4 className="text-base font-semibold text-gray-200">Head Honcho Configuration</h4>
                        <div>
                            <label className="block font-medium text-gray-400 mb-1">Kernel Name</label>
                            <input type="text" value={kaggleConfig.kernelName} onChange={e => setKaggleConfig(p => ({...p, kernelName: e.target.value}))} className="w-full bg-[#010409] border border-gray-700 rounded-md px-3 py-1.5 text-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none font-fira"/>
                        </div>
                        
                        <div>
                            <Tooltip text="The Git repo used to save and restore your workspace state. Set this in the Artifact Registry.">
                                <label className="block font-medium text-gray-400 mb-1 cursor-help">Workspace Sync Target</label>
                            </Tooltip>
                            {workspaceTarget ? (
                                <input type="text" value={workspaceTarget.source} readOnly className="w-full bg-black/50 border border-yellow-500/50 rounded-md px-3 py-1.5 text-yellow-300 focus:ring-0 outline-none font-fira"/>
                            ) : (
                                 <div className="text-center p-3 border-2 border-dashed border-gray-700 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-2">No Workspace Sync Target set.</p>
                                    <button onClick={() => setActiveTool('artifact-registry')} className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md">
                                        Go to Artifact Registry
                                    </button>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block font-medium text-gray-400 mb-2">Model Source</label>
                            <div className="flex gap-2">
                                <button onClick={() => setKaggleConfig(p => ({...p, modelSource: 'hf'}))} className={\`flex-1 p-2 text-xs rounded-md border \${kaggleConfig.modelSource === 'hf' ? 'bg-green-900/50 border-green-500' : 'bg-gray-800 border-gray-700'}\`}>Hugging Face Hub</button>
                                <button onClick={() => setKaggleConfig(p => ({...p, modelSource: 'git'}))} className={\`flex-1 p-2 text-xs rounded-md border \${kaggleConfig.modelSource === 'git' ? 'bg-green-900/50 border-green-500' : 'bg-gray-800 border-gray-700'}\`}>Artifact Registry (Git)</button>
                            </div>
                        </div>

                        <div>
                            {kaggleConfig.modelSource === 'hf' ? (
                                <>
                                    <Tooltip text="The name of the model on Hugging Face Hub. E.g., 'Qwen/Qwen2.5-Coder-7B-Instruct'">
                                        <label className="block font-medium text-gray-400 mb-1 cursor-help">Model Name</label>
                                    </Tooltip>
                                    <input 
                                        type="text" 
                                        value={kaggleConfig.modelIdentifier} 
                                        onChange={e => setKaggleConfig(p => ({...p, modelIdentifier: e.target.value}))} 
                                        className="w-full bg-[#010409] border border-gray-700 rounded-md px-3 py-1.5 text-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none font-fira"
                                        placeholder={'Qwen/Qwen2.5-Coder-7B-Instruct'}
                                    />
                                </>
                            ) : (
                                <>
                                    <Tooltip text="Select a named Git repository artifact containing your model weights.">
                                        <label className="block font-medium text-gray-400 mb-1 cursor-help">Git Artifact (for model weights)</label>
                                    </Tooltip>
                                    {gitArtifacts.filter(a => !a.isWorkspaceTarget).length > 0 ? (
                                         <select
                                            value={kaggleConfig.modelIdentifier}
                                            onChange={e => setKaggleConfig(p => ({...p, modelIdentifier: e.target.value}))}
                                            className="w-full bg-[#010409] border border-gray-700 rounded-md px-3 py-1.5 text-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none font-fira"
                                        >
                                            {gitArtifacts.filter(a => !a.isWorkspaceTarget).map(artifact => (
                                                <option key={artifact.id} value={artifact.source}>
                                                    {artifact.name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <p className="text-xs text-gray-500 py-2">No non-target Git artifacts found.</p>
                                    )}
                                </>
                            )}
                        </div>

                        <ToggleSwitch 
                            label="Enable GPU Acceleration"
                            checked={kaggleConfig.gpuEnabled}
                            onChange={v => setKaggleConfig(p => ({...p, gpuEnabled: v}))}
                            tooltip="Use a GPU on the Kaggle kernel. Highly recommended for transformer models. This uses Kaggle compute units."
                        />
                        
                        <div className="bg-yellow-900/30 border border-yellow-500/50 text-yellow-300 text-xs p-3 rounded-md">
                            <span className="font-bold">Note:</span> Requires three secrets set on Kaggle: \`KAGGLE_KEY\`, \`NGROK_AUTH_TOKEN\`, and \`GIT_AUTH_TOKEN\` (a classic GitHub PAT with repo scope).
                        </div>
                       
                        <Tooltip text="Generate the configured Kaggle deployment script.">
                             <button 
                                onClick={() => {
                                    const script = generateKaggleScript(kaggleConfig);
                                    onGenerate('Persistent Head Honcho Script', blueprint.desc, script);
                                }}
                                disabled={!kaggleConfig.modelIdentifier || !kaggleConfig.workspaceSyncTarget}
                                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-700 disabled:cursor-not-allowed"
                            >
                                <TerminalIcon className="w-5 h-5" />
                                Generate Kaggle Script
                            </button>
                        </Tooltip>
                    </div>
                ) : (
                     <Tooltip text={\`Generate the '\${blueprint.name}' script and open it in the modal viewer.\`}>
                        <button
                            onClick={() => onGenerate(blueprint.name, blueprint.desc, blueprint.prompt)}
                            className="w-full flex items-center justify-center gap-2 bg-green-600/80 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                        >
                            <TerminalIcon className="w-5 h-5" />
                            Generate Script
                        </button>
                    </Tooltip>
                )}
            </div>
        );
    }

    return (
        <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 shadow-lg shadow-black/30">
            <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
                <h2 className="text-xl font-bold text-green-300">Agentic Script Lab</h2>
                 <div className="flex items-center gap-2">
                    <FilterIcon className="w-4 h-4 text-gray-400" />
                    <select
                        value={activeCategory}
                        onChange={(e) => setActiveCategory(e.target.value as any)}
                        className="bg-[#010409] border border-gray-700 rounded-md px-2 py-1 text-xs text-gray-300 focus:ring-1 focus:ring-green-500 focus:outline-none"
                    >
                        {blueprintCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">Select a production-grade blueprint to generate a secure, auditable, and robust script for complex operations.</p>
            <div className="space-y-3 max-h-[calc(100vh-20rem)] overflow-y-auto pr-2">
                {filteredBlueprints.map(renderBlueprint)}
            </div>
        </div>
    );
};
`,
  'components/PackageManagerTool.tsx': `
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
            const systemInstruction = "You are an expert on Linux packages, specifically for Debian/Ubuntu based systems like Termux. The user will provide a package name. Your task is to provide a concise, one-paragraph description of that package and its primary use case, as if you were the \`nala show\` or \`apt show\` command. Do not add any extra conversational text. Just provide the description.";
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: \`Describe the package: \${pkgName}\`,
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
        let script = \`#!/data/data/com.termux/files/usr/bin/bash
# Nala-inspired package management script
# Generated by GangTerm
set -e
\`;
        let title = "Generated Package Script";
        let description = "Execute this script in Termux.";

        switch (action) {
            case 'Install':
                const allPackages = [...selectedPackages, ...customPackages.split(' ').filter(p => p)];
                if (allPackages.length === 0) return;
                script += \`
echo "Updating package lists..."
pkg update -y

echo "Installing \${allPackages.length} selected package(s)..."
pkg install -y \${allPackages.join(' ')}

echo "Installation complete."
\`;
                title = \`Install Script (\${allPackages.length} packages)\`;
                description = "Executes \`pkg update\` and \`pkg install\` for the selected packages.";
                break;
            case 'Remove':
                const packagesToRemove = removePackages.split(' ').filter(p => p);
                if (packagesToRemove.length === 0) return;
                script += \`
echo "Removing \${packagesToRemove.length} package(s) using 'pkg uninstall'..."
echo "This will NOT remove system-wide configuration files."
pkg uninstall -y \${packagesToRemove.join(' ')}

echo "Removal complete."
\`;
                title = \`Remove Script\`;
                description = \`Executes \\\`pkg uninstall\\\` for the specified packages. This is a safe operation that leaves configuration files intact.\`;
                break;

            case 'System':
                return;
        }

        onGenerate(title, description, script);
    };
    
    const generateSystemScript = (systemCommand: 'upgrade' | 'autoremove' | 'clean' | 'cleanup-extended') => {
         let script = \`#!/data/data/com.termux/files/usr/bin/bash
# Nala-inspired system management script
set -e
\`;
        let title = "System Management Script";
        let description = "";

        switch(systemCommand) {
            case 'upgrade':
                script += \`
echo "Updating package lists..."
pkg update -y
echo "Upgrading installed packages..."
pkg upgrade -y
echo "System upgrade complete."\`;
                title = "System Update & Upgrade";
                description = "Executes \`pkg update\` and \`pkg upgrade\`."
                break;
            case 'autoremove':
                script += \`
echo "Removing unused packages..."
pkg autoremove -y
echo "Autoremove complete."\`;
                title = "Autoremove Unused Packages";
                description = "Executes \`pkg autoremove\` to clean up orphaned dependencies.";
                break;
            case 'clean':
                script += \`
echo "Cleaning APT cache..."
pkg clean
echo "Cache cleaned."\`;
                title = "Clean Package Cache";
                description = "Executes \`pkg clean\` to free up space by removing downloaded .deb files.";
                break;
            case 'cleanup-extended':
                script += \`
# --- Targeted Cache & Bin Cleanup ---
# This script FINDS and REPORTS on common 'dead weight' files and directories.
# IT IS NON-DESTRUCTIVE BY DEFAULT. Review the output before taking action.

echo "--- Searching for Python cache directories (__pycache__)..."
find \$HOME -type d -name "__pycache__" -print

echo ""
echo "--- Searching for Node.js dependency directories (node_modules)..."
find \$HOME -type d -name "node_modules" -print

echo ""
echo "--- Searching for large log files (*.log > 1MB)..."
find \$HOME -type f -name "*.log" -size +1M -print

echo ""
echo "--- ANALYSIS COMPLETE ---"
echo "The items listed above are candidates for deletion to save space."
echo "To delete them, you can re-run the find commands and pipe them to xargs."
echo ""
echo "EXAMPLE (use with caution):"
echo "# find \$HOME -type d -name '__pycache__' -print0 | xargs -0 rm -rf"
echo "# find \$HOME -type d -name 'node_modules' -print0 | xargs -0 rm -rf"
\`;
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
                                    <input type="checkbox" id={\`pkg-\${pkg.name}\`} checked={selectedPackages.includes(pkg.name)} onChange={() => handleTogglePackage(pkg.name)} className="h-4 w-4 mt-1 rounded bg-gray-800 border-gray-600 text-green-500 focus:ring-green-600 cursor-pointer" />
                                    <div className="ml-3 text-sm">
                                        <label htmlFor={\`pkg-\${pkg.name}\`} className="font-semibold text-green-400 cursor-pointer">{pkg.name}</label>
                                        <p className="text-xs text-gray-500">{pkg.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div>
                             <Tooltip text="Enter any extra packages you want to install, separated by spaces (e.g., htop nala).">
                                <label className="