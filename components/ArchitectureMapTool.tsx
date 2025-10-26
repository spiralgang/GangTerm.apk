
import React, { useEffect, useRef, useState } from 'react';
import { Share2Icon } from './Icons';
import { useApp } from '../context/AppContext';
import { Tooltip } from './Tooltip';

declare const mermaid: any;

const MermaidDiagram: React.FC<{ chart: string, id: string }> = ({ chart, id }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (ref.current && chart) {
            const render = async () => {
                try {
                    // Unique ID is required for mermaid.render
                    const uniqueId = `mermaid-chart-${id}-${Date.now()}`;
                    const { svg } = await mermaid.render(uniqueId, chart);
                    setSvg(svg);
                    setError('');
                } catch (e: any) {
                    console.error("Mermaid render error:", e);
                    setError(e.message || "Failed to render diagram.");
                    setSvg('');
                }
            };
            mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'loose' });
            render();
        }
    }, [chart, id]);

    if (error) {
        return <div className="p-4 bg-red-900/30 border border-red-500/50 text-red-300 rounded-md text-sm">{error}</div>;
    }

    return <div ref={ref} dangerouslySetInnerHTML={{ __html: svg }} className="w-full flex justify-center items-center" />;
};


export const ArchitectureMapTool: React.FC = () => {
    const { mainArchitectureMap, headHonchoInternalMap, requestSystemState, headHonchoState } = useApp();
    
    return (
         <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 shadow-lg shadow-black/30 space-y-6">
            <div>
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Share2Icon className="w-7 h-7 text-green-300" />
                            <h2 className="text-xl font-bold text-green-300">Live Architecture Map</h2>
                        </div>
                        <p className="text-sm text-gray-400">A dynamic visualization of your multi-polar MLOps environment. Diagrams update in real-time based on system state.</p>
                    </div>
                    <Tooltip text="Request a fresh state report from the Head Honcho to update the diagrams.">
                        <span className="block">
                            <button
                                onClick={requestSystemState}
                                disabled={headHonchoState.connectionStatus !== 'connected'}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed"
                            >
                                Refresh State
                            </button>
                        </span>
                    </Tooltip>
                </div>
            </div>

            {/* Main System Overview */}
            <div className="p-4 bg-[#010409] border border-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold text-green-400 mb-4">Main System Overview</h3>
                <div className="p-4 bg-black/30 rounded-md min-h-[200px] flex items-center justify-center">
                   <MermaidDiagram chart={mainArchitectureMap} id="main-arch" />
                </div>
            </div>

            {/* Head Honcho Internals */}
            <div className="p-4 bg-[#010409] border border-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold text-green-400 mb-4">Head Honcho Internals</h3>
                <div className="p-4 bg-black/30 rounded-md min-h-[200px] flex items-center justify-center">
                    <MermaidDiagram chart={headHonchoInternalMap} id="internal-arch" />
                </div>
            </div>
        </div>
    );
};
