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