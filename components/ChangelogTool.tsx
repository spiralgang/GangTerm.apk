import React from 'react';
import { HistoryIcon } from './Icons';

const ChangeItem: React.FC<{ type: 'NEW' | 'IMPROVEMENT' | 'FIX' | 'ARCH'; children: React.ReactNode }> = ({ type, children }) => {
    const typeMap = {
        NEW: { text: 'NEW', color: 'text-green-400', bg: 'bg-green-900/50' },
        IMPROVEMENT: { text: 'IMPROVE', color: 'text-yellow-300', bg: 'bg-yellow-900/50' },
        FIX: { text: 'FIX', color: 'text-blue-400', bg: 'bg-blue-900/50' },
        ARCH: { text: 'ARCH', color: 'text-purple-400', bg: 'bg-purple-900/50' },
    };
    const { text, color, bg } = typeMap[type];
    return (
        <li className="flex items-start gap-3">
            <span className={`flex-shrink-0 font-bold text-xs ${color} ${bg} px-2 py-0.5 rounded-full`}>{text}</span>
            <span className="text-gray-300 text-sm">{children}</span>
        </li>
    );
}

const VersionEntry: React.FC<{ version: string; date: string; title: string; children: React.ReactNode }> = ({ version, date, title, children }) => (
    <div className="relative pl-8 pb-8 border-l-2 border-gray-700">
        <div className="absolute -left-[9px] top-1 w-4 h-4 bg-green-400 rounded-full border-4 border-[#0d1117]"></div>
        <p className="text-sm text-gray-500">{date}</p>
        <h3 className="text-lg font-bold text-green-300">{version}: <span className="font-semibold text-gray-200">{title}</span></h3>
        <ul className="mt-3 space-y-2">
            {children}
        </ul>
    </div>
);

export const ChangelogTool: React.FC = () => {
    return (
        <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 shadow-lg shadow-black/30">
            <div className="flex items-center gap-3 mb-6">
                <HistoryIcon className="w-7 h-7 text-green-300" />
                <h2 className="text-xl font-bold text-green-300">Changelog & Version History</h2>
            </div>

            <div className="max-h-[calc(100vh-16rem)] overflow-y-auto pr-4">
                <VersionEntry version="v0.8.0" date="Current" title="Meta & Transparency">
                    <ChangeItem type="NEW">
                        **Changelog Tool:** A new meta-tool to provide a clear, versioned history of the application's development.
                    </ChangeItem>
                    <ChangeItem type="IMPROVEMENT">
                        **Navigation Groups:** The navigation panel is now organized into logical sections (`Core Tools`, `Compute & Environment`, etc.) for better clarity and scalability.
                    </ChangeItem>
                </VersionEntry>

                <VersionEntry version="v0.7.0" date="Recent" title="Course Correction">
                    <ChangeItem type="FIX">
                        **Restored Env Breakout:** Re-instated the `Environment Breakout` tool as a distinct entity from the `Environment Forcer`, ensuring both simple and advanced use cases are covered. This was a direct response to user feedback about preserving functionality.
                    </ChangeItem>
                </VersionEntry>
                
                <VersionEntry version="v0.6.0" date="Recent" title="Advanced Environment Control">
                    <ChangeItem type="NEW">
                        **Environment Forcer:** Introduced a new tool dedicated to advanced strategies for compelling cloud notebooks to revert to a full x86-64 Linux shell, including Docker-based breakouts.
                    </ChangeItem>
                </VersionEntry>
                
                 <VersionEntry version="v0.5.0" date="Recent" title="UI Responsiveness">
                    <ChangeItem type="IMPROVEMENT">
                        **Loading Indicators:** Implemented clear loading states (spinners, disabled buttons) for all asynchronous operations in the Sandbox, Package Manager, and other tools, providing better user feedback.
                    </ChangeItem>
                </VersionEntry>

                <VersionEntry version="v0.4.0" date="Major Update" title="The Multi-Polar Architecture">
                     <ChangeItem type="ARCH">
                        **Hydrate -> Execute -> Snapshot:** Implemented the core MLOps workflow. The Head Honcho now hydrates its state from a Git repo and can snapshot changes back, creating a persistent, rehydratable workspace.
                    </ChangeItem>
                    <ChangeItem type="NEW">
                        **Head Honcho Controller:** A dedicated tool to manage the WebSocket connection to the remote compute plane, displaying status and logs.
                    </ChangeItem>
                    <ChangeItem type="NEW">
                        **Artifact Registry:** A central registry for managing MLOps assets like Git repos for models and workspace persistence.
                    </ChangeItem>
                </VersionEntry>

                <VersionEntry version="v0.3.0" date="Foundation" title="Agentic Engines">
                    <ChangeItem type="NEW">
                        **Genesis & Evolution Engines:** Added tools for designing multi-agent systems and running self-healing CI pipelines on local code.
                    </ChangeItem>
                </VersionEntry>
                 <VersionEntry version="v0.2.0" date="Foundation" title="Core Tooling">
                     <ChangeItem type="NEW">
                        **Sandbox & Guardian:** Introduced the interactive code editor/webshell and the security FSM for managing environment permissions.
                    </ChangeItem>
                    <ChangeItem type="NEW">
                        **AI Console:** The persistent, context-aware AI companion was added as a global component.
                    </ChangeItem>
                </VersionEntry>
                 <VersionEntry version="v0.1.0" date="Foundation" title="Initial Release">
                     <ChangeItem type="NEW">
                        **Initial Tools:** First release featuring Script Lab, Package Manager, and APK Fusion.
                    </ChangeItem>
                </VersionEntry>
            </div>
        </div>
    );
};