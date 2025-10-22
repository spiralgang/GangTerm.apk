import React, { useState } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { ApkFusionTool } from './components/ApkFusionTool';
import { ScriptLabTool } from './components/ScriptLabTool';
import { PackageManagerTool } from './components/PackageManagerTool';
import { ScriptOutputModal } from './components/ScriptOutputModal';

type Tool = 'apk-fusion' | 'script-lab' | 'package-manager';

const App: React.FC = () => {
    const [activeTool, setActiveTool] = useState<Tool>('apk-fusion');
    const [modalContent, setModalContent] = useState({
        isOpen: false,
        title: '',
        description: '',
        script: ''
    });

    const handleGenerateScript = (title: string, description: string, script: string) => {
        setModalContent({
            isOpen: true,
            title,
            description,
            script
        });
    };

    const closeModal = () => {
        setModalContent(prev => ({ ...prev, isOpen: false }));
    };

    const renderTool = () => {
        switch (activeTool) {
            case 'apk-fusion':
                return <ApkFusionTool onGenerate={handleGenerateScript} />;
            case 'script-lab':
                return <ScriptLabTool onGenerate={handleGenerateScript} />;
            case 'package-manager':
                 return <PackageManagerTool onGenerate={handleGenerateScript} />;
            default:
                return <ApkFusionTool onGenerate={handleGenerateScript} />;
        }
    };
    
    return (
        <div className="bg-[#0a0a0a] text-gray-200 min-h-screen font-mono">
            <div className="max-w-7xl mx-auto flex">
                <Navigation activeTool={activeTool} setActiveTool={setActiveTool} />
                <div className="flex-1 p-4 md:p-8">
                    <Header />
                    <main className="mt-8">
                       {renderTool()}
                    </main>
                </div>
            </div>
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

export default App;
