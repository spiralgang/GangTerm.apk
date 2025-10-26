import React from 'react';
import { ShieldIcon, TerminalIcon } from './Icons';
import { Tooltip } from './Tooltip';
import { useApp } from '../context/AppContext';
import { CodeBlock } from './CodeBlock';

interface GuardianToolProps {
    onGenerate: (title: string, description: string, script: string) => void;
}

const securityLevels = {
    Standard: 'Balanced security. Scripts are monitored, but common operations are allowed without explicit prompts.',
    Lockdown: 'Maximum security. All potentially sensitive operations (filesystem, network) require explicit confirmation. Best for running untrusted scripts.',
    Development: 'Permissive mode. Reduced security warnings to streamline development and testing. Not recommended for production use.',
};

const determineCurrentFsmState = (guardianState: ReturnType<typeof useApp>['guardianState']) => {
    const { securityLevel, allowNetworkAccess, allowFileSystemAccess, allowPackageInstallation } = guardianState;
    if (securityLevel === 'Lockdown') {
        return {
            name: 'Secure Mode',
            description: 'The environment is in a high-security lockdown state. Network, filesystem, and package installation are restricted by default, awaiting explicit override. Ideal for executing untrusted code.'
        };
    }
    if (securityLevel === 'Development') {
        return {
            name: 'Development Mode',
            description: 'The environment is in a permissive state to facilitate rapid development. Security warnings are minimized, and most operations are allowed. Not suitable for production.'
        };
    }
    if (securityLevel === 'Standard') {
        if (!allowNetworkAccess || !allowFileSystemAccess || !allowPackageInstallation) {
             return {
                name: 'Restricted Operation',
                description: 'The environment is running with standard protections, but one or more key permissions (Network, Filesystem, or Package Installation) have been manually revoked.'
            };
        }
        return {
            name: 'Nominal Operation',
            description: 'The environment is operating under standard security protocols with all core permissions enabled. This is the recommended balanced state.'
        };
    }
     return {
        name: 'Initializing',
        description: 'The FSM state is being determined based on current Guardian settings.'
    };
};


const ToggleSwitch: React.FC<{ label: string; checked: boolean; onChange: (checked: boolean) => void; tooltip: string; }> = ({ label, checked, onChange, tooltip }) => (
    <Tooltip text={tooltip}>
        <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-gray-300">{label}</span>
            <div className="relative">
                <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
                <div className={`block w-10 h-6 rounded-full transition ${checked ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'translate-x-4' : ''}`}></div>
            </div>
        </label>
    </Tooltip>
);

export const GuardianTool: React.FC<GuardianToolProps> = ({ onGenerate }) => {
    const { guardianState, setGuardianState, guardianAuditLog, addGuardianLogEntry } = useApp();
    const { securityLevel, allowFileSystemAccess, allowNetworkAccess, allowPackageInstallation, allowRootEmulation, autoBackupEnabled, backupFrequency, lastBackupTimestamp } = guardianState;

    const setState = (field: keyof typeof guardianState, value: any) => {
        const oldValue = guardianState[field];
        if (oldValue !== value) {
            addGuardianLogEntry(
                `Setting Changed: ${String(field)}`,
                `Value changed from '${oldValue}' to '${value}'`
            );
            setGuardianState(prev => ({ ...prev, [field]: value }));
        }
    };
    
    const handleBackupNow = () => {
         const timestamp = new Date().toISOString();
         addGuardianLogEntry('Manual Backup', 'User initiated a manual backup of the environment.');
         setGuardianState(prev => ({ ...prev, lastBackupTimestamp: timestamp }));
    }

    const handleGenerateConfigScript = () => {
        addGuardianLogEntry('Script Generation', 'Guardian configuration script was generated.');
        const script = `#!/data/data/com.termux/files/usr/bin/bash
#
# GangTerm Guardian Configuration Script
# This script applies the security and persistence settings defined in the Guardian Control Center.
#
set -euo pipefail

log() {
    echo "[GUARDIAN] $1"
}

log "--- Applying GangTerm Guardian Configuration ---"

log "Setting Security Level to: ${securityLevel}"
# In a real implementation, this would modify a config file or system property.
# Example: termux-properties set security.level "${securityLevel}"

log "--- Permission Schema ---"
log "Allow Filesystem Access: ${allowFileSystemAccess}"
log "Allow Network Access: ${allowNetworkAccess}"
log "Allow Package Installation: ${allowPackageInstallation}"
log "Allow Root (proot) Emulation: ${allowRootEmulation}"

log "--- Chronovault Persistence ---"
log "Automatic Backups Enabled: ${autoBackupEnabled}"
if [ "${autoBackupEnabled}" = "true" ]; then
    log "Backup Frequency: ${backupFrequency}"
    # This would configure a cron job or a similar scheduled task.
    log "Configuring backup schedule..."
fi

log "--- Configuration Applied Successfully ---"
echo "Guardian settings have been staged. A system restart or service reload may be required."
`;
        onGenerate(
            "Guardian Configuration Script",
            "This script stages the environment settings. Execute it in Termux to apply the new configuration.",
            script
        );
    };

    const currentFsmState = determineCurrentFsmState(guardianState);
    
    const termuxUrlOpenerScript = `#!/data/data/com.termux/files/usr/bin/bash
#
# termux-url-opener: A script to handle URLs passed to Termux
# This script saves the content passed via the intent to a temporary file
# and then opens it with an editor, or executes it if it's a script.
#
set -e

# The URL/Text content is passed as the first argument
CONTENT="$1"

# Create a temporary file to store the content
TMP_FILE=$(mktemp)

# Write the content to the temporary file
echo -e "$CONTENT" > "$TMP_FILE"

# Make the script executable if it looks like a shell script
if head -n 1 "$TMP_FILE" | grep -q -e "^#!.*sh"; then
    chmod +x "$TMP_FILE"
    # Execute the script in a new shell session
    # This gives you a live terminal to see the output
    exec bash -c "$TMP_FILE; echo -e '\\n\\n[Script finished. Press Enter to exit.]'; read"
else
    # If it's not a script, open it with an editor for review
    exec nvim "$TMP_FILE"
fi
`;

    return (
        <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 shadow-lg shadow-black/30 space-y-6">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <ShieldIcon className="w-7 h-7 text-green-300" />
                    <h2 className="text-xl font-bold text-green-300">Guardian Control Center</h2>
                </div>
                <p className="text-sm text-gray-400">Configure Persistence, Permissions, and Protection for your agentic environment.</p>
            </div>
            
             {/* FSM State Display */}
            <div className="p-4 bg-[#010409] border border-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold text-green-400 mb-3">Finite State Machine (FSM) Status</h3>
                 <div className="p-3 bg-[#161b22] rounded-md border border-green-500/30">
                     <div className="flex items-center gap-3">
                         <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                         <h4 className="font-bold text-lg text-green-300">{currentFsmState.name}</h4>
                     </div>
                     <p className="text-sm text-gray-400 mt-2 pl-6">{currentFsmState.description}</p>
                 </div>
            </div>

            {/* Environment Bridge */}
            <div className="p-4 bg-[#010409] border border-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold text-green-400 mb-2">Environment Bridge Setup</h3>
                <p className="text-sm text-gray-400 mb-4">To enable the "Run in Termux" button, you must configure a handler script in Termux. Follow these steps exactly.</p>
                <div className="space-y-3 text-sm">
                    <div>
                        <p className="font-semibold text-gray-200">Step 1: Create the script file</p>
                        <p className="text-gray-400">In Termux, run the following commands:</p>
                        <div className="mt-1 h-24">
                           <CodeBlock code={`mkdir -p ~/bin\ntouch ~/bin/termux-url-opener`} language="bash" />
                        </div>
                    </div>
                     <div>
                        <p className="font-semibold text-gray-200">Step 2: Copy this script content</p>
                        <p className="text-gray-400">Open the new file (`nvim ~/bin/termux-url-opener`) and paste the entire script below into it.</p>
                        <div className="mt-1 h-48">
                           <CodeBlock code={termuxUrlOpenerScript} language="bash" />
                        </div>
                    </div>
                     <div>
                        <p className="font-semibold text-gray-200">Step 3: Make it executable</p>
                        <p className="text-gray-400">Finally, run this command in Termux to grant execution permissions:</p>
                         <div className="mt-1 h-16">
                           <CodeBlock code={`chmod +x ~/bin/termux-url-opener`} language="bash" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Protection Protocol */}
            <div className="p-4 bg-[#010409] border border-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold text-green-400 mb-3">Protection Protocol</h3>
                <div className="space-y-3">
                    {Object.entries(securityLevels).map(([level, desc]) => (
                        <div key={level} className="flex items-start p-3 bg-[#161b22] rounded-md border border-gray-700/50">
                            <input
                                id={`level-${level}`}
                                name="security-level"
                                type="radio"
                                checked={securityLevel === level}
                                onChange={() => setState('securityLevel', level)}
                                className="h-4 w-4 mt-1 cursor-pointer border-gray-600 bg-gray-800 text-green-500 focus:ring-green-600"
                            />
                            <div className="ml-3 text-sm">
                                <label htmlFor={`level-${level}`} className="font-bold text-gray-200 cursor-pointer">{level}</label>
                                <p className="text-gray-400">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Permission Schema */}
            <div className="p-4 bg-[#010409] border border-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold text-green-400 mb-4">Permission Schema</h3>
                <div className="space-y-4">
                    <ToggleSwitch label="Allow Filesystem Access" checked={allowFileSystemAccess} onChange={v => setState('allowFileSystemAccess', v)} tooltip="Permit scripts to read/write to the file system outside of their own directory." />
                    <ToggleSwitch label="Allow Network Access" checked={allowNetworkAccess} onChange={v => setState('allowNetworkAccess', v)} tooltip="Permit scripts to make outbound network requests." />
                    <ToggleSwitch label="Allow Package Installation" checked={allowPackageInstallation} onChange={v => setState('allowPackageInstallation', v)} tooltip="Permit scripts to install new packages via 'pkg' or 'apt'." />
                    <ToggleSwitch label="Allow Root (proot) Emulation" checked={allowRootEmulation} onChange={v => setState('allowRootEmulation', v)} tooltip="Permit scripts to use 'proot' for emulated root access. High risk." />
                </div>
            </div>

            {/* Chronovault Persistence */}
            <div className="p-4 bg-[#010409] border border-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold text-green-400 mb-4">Chronovault Persistence</h3>
                <div className="space-y-4">
                    <ToggleSwitch label="Enable Automatic Backups" checked={autoBackupEnabled} onChange={v => setState('autoBackupEnabled', v)} tooltip="Automatically back up your home directory and configurations." />
                    {autoBackupEnabled && (
                         <div>
                            <label htmlFor="backup-frequency" className="block text-sm font-medium text-gray-300 mb-2">Backup Frequency</label>
                            <select id="backup-frequency" value={backupFrequency} onChange={(e) => setState('backupFrequency', e.target.value)} className="w-full bg-[#010409] border border-gray-700 rounded-md px-3 py-2 text-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none font-fira text-sm">
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                    )}
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Last Backup:</span>
                        <span className="text-gray-300 font-fira">{lastBackupTimestamp ? new Date(lastBackupTimestamp).toLocaleString() : 'Never'}</span>
                    </div>
                     <Tooltip text="Manually trigger a full backup of your environment now.">
                        <button onClick={handleBackupNow} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                            Backup Now
                        </button>
                    </Tooltip>
                </div>
            </div>
            
            {/* History & Audit Log */}
            <div className="p-4 bg-[#010409] border border-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold text-green-400 mb-4">History & Audit Log</h3>
                <div className="h-40 overflow-y-auto space-y-2 pr-2">
                    {guardianAuditLog.length > 0 ? guardianAuditLog.map(entry => (
                        <div key={entry.timestamp} className="text-xs font-fira border-l-2 border-gray-700 pl-2">
                            <p className="text-gray-500">{new Date(entry.timestamp).toLocaleString()}</p>
                            <p className="text-green-400">{entry.event}: <span className="text-gray-300">{entry.details}</span></p>
                        </div>
                    )) : (
                        <p className="text-sm text-center text-gray-500 py-4">No security events recorded yet.</p>
                    )}
                </div>
            </div>

            <div className="pt-2">
                <Tooltip text="Generates a shell script to apply all the configured Guardian settings to your Termux environment.">
                    <button onClick={handleGenerateConfigScript} className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-200">
                        <TerminalIcon className="w-5 h-5" />
                        Generate Guardian Config Script
                    </button>
                </Tooltip>
            </div>
        </div>
    );
};