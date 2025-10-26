import React, { createContext, useContext, useState, useRef, useCallback, ReactNode, useEffect } from 'react';

// A simple uuidv4 generator to avoid external dependencies.
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
}

// --- Custom Hook for Local Storage ---
function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
}


// --- Type Definitions ---
export type ArtifactType = 'Git Repository' | 'Kaggle Dataset';

export interface Artifact {
    id: string;
    name: string;
    type: ArtifactType;
    source: string;
    isWorkspaceTarget?: boolean;
}

export interface Snippet {
    id: string;
    name: string;
    script: string;
}

export interface GuardianLogEntry {
    timestamp: string;
    event: string;
    details: string;
}

export interface ApkFusionState {
    sourceApk: string;
    newPackageName: string;
    newAppName: string;
    versionCode: string;
    versionName: string;
}

export interface PackageManagerState {
    activeTab: 'Install' | 'Remove' | 'System' | 'Show';
    selectedPackages: string[];
    customPackages: string;
    removePackages: string;
}

export interface GuardianState {
    securityLevel: 'Standard' | 'Lockdown' | 'Development';
    allowFileSystemAccess: boolean;
    allowNetworkAccess: boolean;
    allowPackageInstallation: boolean;
    allowRootEmulation: boolean;
    autoBackupEnabled: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    lastBackupTimestamp: string | null;
}

export interface EvolutionEngineState {
    targetDirectory: string;
    engineMode: 'audit' | 'improve' | 'evolve';
    useGitSafeguard: boolean;
}

export interface HeadHonchoState {
    backendType: 'remote' | 'local';
    remoteWsUrl: string;
    connectionStatus: 'disconnected' | 'connecting' | 'connected';
    logs: string[];
    internalState: Record<string, any> | null;
}

export interface Message {
    sender: 'user' | 'ai';
    text: string;
}

interface ModalContent {
    isOpen: boolean;
    title: string;
    description: string;
    script: string;
}

// Type for the terminal writer callback
type TerminalWriteHandler = ((data: string) => void) | null;


interface AppContextType {
    activeTool: string;
    setActiveTool: (tool: string) => void;
    
    modalContent: ModalContent;
    handleGenerateScript: (title: string, description: string, script: string) => void;
    closeModal: () => void;

    apkFusionState: ApkFusionState;
    setApkFusionState: React.Dispatch<React.SetStateAction<ApkFusionState>>;

    packageManagerState: PackageManagerState;
    setPackageManagerState: React.Dispatch<React.SetStateAction<PackageManagerState>>;

    sandboxScript: string;
    setSandboxScript: React.Dispatch<React.SetStateAction<string>>;
    
    snippets: Snippet[];
    addSnippet: (name: string, script: string) => void;
    deleteSnippet: (id: string) => void;

    guardianState: GuardianState;
    setGuardianState: React.Dispatch<React.SetStateAction<GuardianState>>;
    guardianAuditLog: GuardianLogEntry[];
    addGuardianLogEntry: (event: string, details: string) => void;

    evolutionEngineState: EvolutionEngineState;
    setEvolutionEngineState: React.Dispatch<React.SetStateAction<EvolutionEngineState>>;

    artifacts: Artifact[];
    addArtifact: (name: string, type: ArtifactType, source: string, isWorkspaceTarget?: boolean) => void;
    deleteArtifact: (id: string) => void;
    setWorkspaceTarget: (id: string) => void;
    
    scriptLabState: {}; 

    headHonchoState: HeadHonchoState;
    setHeadHonchoState: React.Dispatch<React.SetStateAction<HeadHonchoState>>;
    connectToHeadHoncho: () => void;
    disconnectFromHeadHoncho: () => void;
    ws: React.MutableRefObject<WebSocket | null>;

    conversation: Message[];
    setConversation: React.Dispatch<React.SetStateAction<Message[]>>;

    isExecutingScript: boolean;
    isSnapshotting: boolean;
    createWorkspaceSnapshot: () => void;

    setTerminalWriteHandler: (handler: TerminalWriteHandler) => void;
    clearTerminal: React.MutableRefObject<(() => void) | null>;

    mainArchitectureMap: string;
    headHonchoInternalMap: string;
    requestSystemState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeTool, setActiveTool] = useLocalStorage<string>('gangterm_activeTool', 'sandbox');
    const [modalContent, setModalContent] = useState<ModalContent>({ isOpen: false, title: '', description: '', script: '' });
    const [apkFusionState, setApkFusionState] = useLocalStorage<ApkFusionState>('gangterm_apkFusionState', {
        sourceApk: '', newPackageName: '', newAppName: '', versionCode: '', versionName: '',
    });
    const [packageManagerState, setPackageManagerState] = useLocalStorage<PackageManagerState>('gangterm_packageManagerState', {
        activeTab: 'Install', selectedPackages: [], customPackages: '', removePackages: '',
    });
    const [sandboxScript, setSandboxScript] = useLocalStorage<string>('gangterm_sandboxScript_v3', '# Welcome to the Head Honcho IDE!');
    const [snippets, setSnippets] = useLocalStorage<Snippet[]>('gangterm_snippets', []);
    const [guardianState, setGuardianState] = useLocalStorage<GuardianState>('gangterm_guardianState_v2', {
        securityLevel: 'Standard', allowFileSystemAccess: true, allowNetworkAccess: true, allowPackageInstallation: true,
        allowRootEmulation: false, autoBackupEnabled: true, backupFrequency: 'daily', lastBackupTimestamp: null,
    });
    const [guardianAuditLog, setGuardianAuditLog] = useLocalStorage<GuardianLogEntry[]>('gangterm_guardianAuditLog', []);
    const [evolutionEngineState, setEvolutionEngineState] = useLocalStorage<EvolutionEngineState>('gangterm_evolutionEngineState', {
        targetDirectory: '~/projects/my-app', engineMode: 'audit', useGitSafeguard: true,
    });
    const [artifacts, setArtifacts] = useLocalStorage<Artifact[]>('gangterm_artifacts_v2', []);
    const [scriptLabState, setScriptLabState] = useLocalStorage('gangterm_scriptLabState', {});

    const [headHonchoState, setHeadHonchoState] = useLocalStorage<HeadHonchoState>('gangterm_headHonchoState_v3', {
        backendType: 'remote', remoteWsUrl: '', connectionStatus: 'disconnected', logs: [], internalState: null,
    });
    const [conversation, setConversation] = useState<Message[]>([]);
    
    const [isExecutingScript, setIsExecutingScript] = useState(false);
    const [isSnapshotting, setIsSnapshotting] = useState(false);
    
    const [mainArchitectureMap, setMainArchitectureMap] = useState('');
    const [headHonchoInternalMap, setHeadHonchoInternalMap] = useState('');

    const ws = useRef<WebSocket | null>(null);
    const terminalWriteHandler = useRef<TerminalWriteHandler>(null);
    const clearTerminal = useRef<(() => void) | null>(null);

    const handleGenerateScript = (title: string, description: string, script: string) => {
        setModalContent({ isOpen: true, title, description, script });
    };

    const closeModal = () => setModalContent({ isOpen: false, title: '', description: '', script: '' });

    const addGuardianLogEntry = useCallback((event: string, details: string) => {
        const newEntry: GuardianLogEntry = { timestamp: new Date().toISOString(), event, details };
        setGuardianAuditLog(prev => [newEntry, ...prev].slice(0, 50));
    }, [setGuardianAuditLog]);
    
    const addSnippet = (name: string, script: string) => {
        const newSnippet: Snippet = { id: uuidv4(), name, script };
        setSnippets(prev => [...prev, newSnippet]);
    };

    const deleteSnippet = (id: string) => setSnippets(prev => prev.filter(s => s.id !== id));

    const addArtifact = (name: string, type: ArtifactType, source: string, isWorkspaceTarget = false) => {
        const newArtifact: Artifact = { id: uuidv4(), name, type, source, isWorkspaceTarget };
        setArtifacts(prev => {
            let newArtifacts = [...prev];
            if (isWorkspaceTarget) newArtifacts = newArtifacts.map(a => ({ ...a, isWorkspaceTarget: false }));
            return [...newArtifacts, newArtifact];
        });
        if(isWorkspaceTarget) addGuardianLogEntry('Artifact Target Set', `New workspace sync target: ${name}`);
    };

    const deleteArtifact = (id: string) => setArtifacts(prev => prev.filter(a => a.id !== id));

    const setWorkspaceTarget = (id: string) => {
        setArtifacts(prev => prev.map(a => ({ ...a, isWorkspaceTarget: a.id === id })));
        const target = artifacts.find(a => a.id === id);
        if(target) addGuardianLogEntry('Artifact Target Set', `Workspace sync target set to: ${target.name}`);
    };

    const addLog = useCallback((log: string) => {
        setHeadHonchoState(prev => ({ ...prev, logs: [...prev.logs, `[${new Date().toLocaleTimeString()}] ${log}`].slice(-100) }));
    }, [setHeadHonchoState]);

    const handleWsMessage = useCallback((event: MessageEvent) => {
        try {
            const data = JSON.parse(event.data);
            if (data.action === 'AI_RESPONSE') {
                const aiMessage: Message = { sender: 'ai', text: data.response };
                setConversation(prev => [...prev, aiMessage]);
            } else if (data.action === 'PTY_OUTPUT') {
                terminalWriteHandler.current?.(data.data);
            } else if (data.action === 'SNAPSHOT_START') {
                setIsSnapshotting(true); addLog('Workspace snapshot process started.');
            } else if (data.action === 'SNAPSHOT_LOG') {
                addLog(`[SNAPSHOT] ${data.line}`);
            } else if (data.action === 'SNAPSHOT_END') {
                setIsSnapshotting(false);
                if (data.success) addLog('Workspace snapshot completed successfully.');
                else addLog(`ERROR: Workspace snapshot failed: ${data.error}`);
            } else if (data.action === 'SYSTEM_STATE_RESPONSE') {
                setHeadHonchoState(p => ({ ...p, internalState: data.state })); addLog('Received system state from Head Honcho.');
            }
        } catch (e) {
            console.error('Failed to parse WebSocket message:', e); addLog(`ERROR: Received invalid message: ${event.data}`);
        }
    }, [addLog, setConversation, setHeadHonchoState]);

    const connectToHeadHoncho = useCallback(() => {
        if (ws.current || headHonchoState.connectionStatus === 'connecting') return;
        addLog(`Attempting to connect to ${headHonchoState.remoteWsUrl}...`);
        setHeadHonchoState(prev => ({ ...prev, connectionStatus: 'connecting', logs: [`[${new Date().toLocaleTimeString()}] Attempting to connect to ${headHonchoState.remoteWsUrl}...`] }));
        try {
            const socket = new WebSocket(headHonchoState.remoteWsUrl);
            ws.current = socket;
            socket.onopen = () => {
                setHeadHonchoState(prev => ({ ...prev, connectionStatus: 'connected' }));
                addLog("WebSocket connection established.");
                addGuardianLogEntry('Head Honcho Connect', `Connected to ${headHonchoState.remoteWsUrl}`);
                setConversation([]);
            };
            socket.onmessage = handleWsMessage;
            socket.onerror = (error) => { console.error("WebSocket Error:", error); addLog("WebSocket error occurred."); };
            socket.onclose = () => {
                ws.current = null;
                setHeadHonchoState(prev => ({ ...prev, connectionStatus: 'disconnected' }));
                addLog("WebSocket connection closed.");
                addGuardianLogEntry('Head Honcho Disconnect', 'Connection was closed.');
            };
        } catch (error) {
            console.error("Failed to create WebSocket:", error);
            addLog(`Failed to connect: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setHeadHonchoState(prev => ({ ...prev, connectionStatus: 'disconnected' }));
        }
    }, [headHonchoState.remoteWsUrl, setHeadHonchoState, addLog, addGuardianLogEntry, handleWsMessage]);

    const disconnectFromHeadHoncho = useCallback(() => ws.current?.close(), []);

    const createWorkspaceSnapshot = useCallback(() => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ action: 'CREATE_SNAPSHOT' }));
        } else {
            addLog("Cannot create snapshot. Not connected.");
        }
    }, [addLog]);
    
    const requestSystemState = useCallback(() => {
         if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ action: 'GET_SYSTEM_STATE' }));
            addLog("Requesting system state...");
        } else {
            addLog("Cannot request state. Not connected.");
        }
    }, [addLog]);
    
    const setTerminalWriteHandler = useCallback((handler: TerminalWriteHandler) => terminalWriteHandler.current = handler, []);
    
    useEffect(() => {
        const { connectionStatus, internalState } = headHonchoState;
        const connectionColor = connectionStatus === 'connected' ? 'green' : connectionStatus === 'connecting' ? 'yellow' : 'red';
        const syncTarget = artifacts.find(a => a.isWorkspaceTarget);
        const mainMap = `
flowchart TD
    subgraph "Control Plane (Android)"
        A[GangTerm UI]
    end
    subgraph "Compute Plane (Remote x86-64)"
        B(Head Honcho)
    end
    subgraph "Storage Plane (Git)"
        C{Workspace Sync Target\\n(${syncTarget ? syncTarget.name : 'Not Set'})}
    end
    A -- WebSocket --o B; B -- Hydrate/Snapshot --> C
    style A fill:#0d1117,stroke:#333; style B fill:#0d1117,stroke:#333; style C fill:#0d1117,stroke:#333
    linkStyle 0 stroke:${connectionColor},stroke-width:2px`;
        setMainArchitectureMap(mainMap);

        if (connectionStatus === 'connected' && internalState) {
            const modelLoaded = internalState.model_loaded ? 'green' : 'orange';
            const workspaceHydrated = internalState.workspace_hydrated ? 'green' : 'grey';
            const internalMap = `
graph TD
    subgraph "External Services"; Tmate[tmate Tunnel]; Ngrok[ngrok Tunnel]; Git[Git Remote]; end
    subgraph "Head Honcho Kernel"; WS[WebSocket Server]; PTY[Native PTY Shell]; Model[AI Model\\nStatus: ${internalState.model_loaded ? 'Loaded' : 'Loading...'}]; Workspace[Workspace Files]; end
    Tmate --> PTY; Ngrok --> WS; Workspace <--> Git; WS --> Model; WS --> PTY
    style Model fill:#010409,stroke:${modelLoaded},stroke-width:2px
    style Workspace fill:#010409,stroke:${workspaceHydrated},stroke-width:2px`;
            setHeadHonchoInternalMap(internalMap);
        } else {
            setHeadHonchoInternalMap(`flowchart TD; A[Head Honcho is Disconnected]; style A fill:#300,stroke:#800,stroke-width:2px`);
        }
    }, [headHonchoState, artifacts]);

    const value: AppContextType = {
        activeTool, setActiveTool, modalContent, handleGenerateScript, closeModal, apkFusionState, setApkFusionState,
        packageManagerState, setPackageManagerState, sandboxScript, setSandboxScript, snippets, addSnippet, deleteSnippet,
        guardianState, setGuardianState, guardianAuditLog, addGuardianLogEntry, evolutionEngineState, setEvolutionEngineState,
        artifacts, addArtifact, deleteArtifact, setWorkspaceTarget, scriptLabState, headHonchoState, setHeadHonchoState,
        connectToHeadHoncho, disconnectFromHeadHoncho, ws, conversation, setConversation, isExecutingScript, 
        isSnapshotting, createWorkspaceSnapshot, setTerminalWriteHandler, clearTerminal, mainArchitectureMap,
        headHonchoInternalMap, requestSystemState,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) throw new Error('useApp must be used within an AppProvider');
    return context;
};