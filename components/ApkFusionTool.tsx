import React, { useState } from 'react';
import { TerminalIcon } from './Icons';

interface ApkFusionToolProps {
    onGenerate: (title: string, description: string, script: string) => void;
}

export const ApkFusionTool: React.FC<ApkFusionToolProps> = ({ onGenerate }) => {
    const [sourceApk, setSourceApk] = useState('/storage/emulated/0/Download/termux-app_v0.119.1.apk');
    const [newPackageName, setNewPackageName] = useState('com.spiralgang.termux.ghost');
    const [newAppName, setNewAppName] = useState('Ghost Shell');
    const [versionCode, setVersionCode] = useState('');
    const [versionName, setVersionName] = useState('');

    const generateFullScript = (
        sourceApk: string, 
        newPackageName: string, 
        newAppName: string,
        versionCode: string,
        versionName: string
    ) => {
        // A monolithic script that performs the entire APK mutation process with robust logging and error handling.
        return `#!/data/data/com.termux/files/usr/bin/bash
#
# Spiralgang APK Fusion Script - Production Grade
# This script will decompile, mutate, recompile, sign, and install a parallel Termux instance.
# It features a full forensic audit trail and robust error handling.
#
set -Eeuo pipefail # Exit on error, unset var, pipe failure.

# --- CONFIGURATION ---
SOURCE_APK="${sourceApk.trim()}"
NEW_PACKAGE_NAME="${newPackageName.trim()}"
NEW_APP_NAME="${newAppName.trim()}"
VERSION_CODE_OVERRIDE="${versionCode.trim()}"
VERSION_NAME_OVERRIDE="${versionName.trim()}"
WORKDIR="/data/data/com.termux/files/home/apk_fusion_workdir"
KEYSTORE_NAME="fusion_keystore.jks"
KEY_ALIAS="fusion_key"
KEY_PASS="spiralgang" # Use a secure password in a real scenario
LOG_FILE="\${WORKDIR}/fusion_audit.log"
CLEANUP_ON_FAILURE="false" # Set to "true" to automatically clean up on error

# --- FUNCTIONS ---
log() {
    echo "[\$(date '+%Y-%m-%d %H:%M:%S')] \$1" | tee -a "\${LOG_FILE}"
}

# Function to execute a command with full logging of stdout and stderr
log_and_run() {
    local cmd="\$@"
    log "EXECUTING: \$cmd"
    
    # Using a subshell to capture output and exit code
    (
        set -o pipefail
        eval "\$cmd"
    ) >> "\${LOG_FILE}" 2>&1
    local exit_code=\$?

    if [ \${exit_code} -eq 0 ]; then
        log "SUCCESS: Command finished successfully."
    else
        log "FATAL: Command failed with exit code \${exit_code}. Check the audit log for details."
        log "AUDIT LOG: \${LOG_FILE}"
        # Setting CLEANUP_ON_FAILURE to false is useful for debugging
        if [ "\${CLEANUP_ON_FAILURE}" = "true" ]; then
             log "Cleaning up failed workspace."
             rm -rf "\${WORKDIR}"
        else
             log "Workspace preserved for inspection at: \${WORKDIR}"
        fi
        exit \${exit_code}
    fi
}

# Robust cleanup trap
cleanup() {
  local exit_code=\$?
  if [ \${exit_code} -ne 0 ]; then
    log "An error occurred with exit code \${exit_code}. The script is terminating."
    if [ "\${CLEANUP_ON_FAILURE}" != "true" ]; then
      log "The workspace at \${WORKDIR} has been left for inspection."
    fi
  fi
  # Always change back to home directory to avoid issues with deleting WORKDIR
  cd "\$HOME"
  if [ "\${CLEANUP_ON_FAILURE}" = "true" ] && [ -d "\${WORKDIR}" ]; then
    rm -rf "\${WORKDIR}"
    log "Temporary workspace cleaned up."
  fi
}
trap cleanup EXIT ERR

# --- MAIN EXECUTION ---
echo "--- Initiating Spiralgang APK Fusion Process ---"
echo "Full audit trail will be available at a new log file in \${WORKDIR}"

rm -rf "\${WORKDIR}"
mkdir -p "\${WORKDIR}"
touch "\${LOG_FILE}"
log "Workspace created at \${WORKDIR}"

cd "\${WORKDIR}"

log "[1/9] Validating inputs and environment..."
for tool in apktool keytool apksigner zipalign; do
    if ! command -v \$tool &> /dev/null; then
        log "Essential tool '\$tool' not found. Installing dependencies..."
        log_and_run pkg install -y apktool apksigner zipalign openjdk-17
        break
    fi
done

if [ ! -f "\${SOURCE_APK}" ]; then
    log "ERROR: Source APK not found at '\${SOURCE_APK}'"
    exit 1
fi
if [ -z "\${NEW_PACKAGE_NAME}" ] || [ -z "\${NEW_APP_NAME}" ]; then
    log "ERROR: New Package Name and New App Name cannot be empty."
    exit 1
fi
SOURCE_APK_HASH=\$(sha256sum "\${SOURCE_APK}" | awk '{print $1}')
log "Source APK hash (SHA256): \${SOURCE_APK_HASH}"

DECOMPILED_DIR="\${WORKDIR}/decompiled"
MANIFEST_FILE="\${DECOMPILED_DIR}/AndroidManifest.xml"
STRINGS_FILE="\${DECOMPILED_DIR}/res/values/strings.xml"

log "[2/9] Decompiling source APK..."
log_and_run apktool d "\${SOURCE_APK}" -o decompiled -f

log "[3/9] Mutating AndroidManifest.xml and resource files..."
ORIGINAL_PACKAGE_NAME=\$(grep -oP 'package="[^"]+"' "\${MANIFEST_FILE}" | sed 's/package="//;s/"//')
log "Original package name detected: \${ORIGINAL_PACKAGE_NAME}"

log "Changing package name to \${NEW_PACKAGE_NAME}..."
log_and_run find "\${DECOMPILED_DIR}" -type f \\( -name "*.xml" -o -name "*.smali" \\) -print0 | xargs -0 sed -i "s/\${ORIGINAL_PACKAGE_NAME}/\${NEW_PACKAGE_NAME}/g"

log "Changing app name to '\${NEW_APP_NAME}'..."
if grep -q 'name="app_name"' "\${STRINGS_FILE}"; then
    log_and_run sed -i "s|>Termux<|>\${NEW_APP_NAME}<|g" "\${STRINGS_FILE}"
else
    log "WARNING: 'app_name' string resource not found. App name may not change."
fi

if [ -n "\${VERSION_CODE_OVERRIDE}" ]; then
    log "Overriding versionCode to '\${VERSION_CODE_OVERRIDE}'..."
    log_and_run sed -i "s/versionCode: '[^']*'/versionCode: '\${VERSION_CODE_OVERRIDE}'/" "\${DECOMPILED_DIR}/apktool.yml"
fi
if [ -n "\${VERSION_NAME_OVERRIDE}" ]; then
    log "Overriding versionName to '\${VERSION_NAME_OVERRIDE}'..."
    log_and_run sed -i "s/versionName: [^ ]*/versionName: \${VERSION_NAME_OVERRIDE}/" "\${DECOMPILED_DIR}/apktool.yml"
fi
log "Mutation complete."

log "[4/9] Recompiling the mutated application..."
log_and_run apktool b decompiled -o unsigned.apk

log "[5/9] Generating new signing key..."
log_and_run keytool -genkey -v -keystore "\${KEYSTORE_NAME}" -alias "\${KEY_ALIAS}" -keyalg RSA -keysize 2048 -validity 10000 -storepass "\${KEY_PASS}" -keypass "\${KEY_PASS}" -dname "CN=Spiralgang, OU=Termux, O=GhostShell, L=Unknown, ST=Unknown, C=XX"

log "[6/9] Signing the recompiled APK..."
log_and_run apksigner sign --ks "\${KEYSTORE_NAME}" --ks-key-alias "\${KEY_ALIAS}" --ks-pass "pass:\${KEY_PASS}" --out signed.apk unsigned.apk

log "[7/9] Aligning the final APK..."
FINAL_APK_NAME="\${NEW_APP_NAME// /_}_fused.apk"
log_and_run zipalign -v 4 signed.apk "\${FINAL_APK_NAME}"

FINAL_APK_PATH="\${WORKDIR}/\${FINAL_APK_NAME}"
log "Final APK created at \${FINAL_APK_PATH}"

log "[8/9] Generating Final Audit Report..."
FINAL_APK_HASH=\$(sha256sum "\${FINAL_APK_PATH}" | awk '{print $1}')
cat > fusion_summary.txt <<- EOM
Spiralgang APK Fusion Summary
------------------------------------
Timestamp: \$(date)
Source APK: \${SOURCE_APK}
Source SHA256: \${SOURCE_APK_HASH}

Final APK: \${FINAL_APK_PATH}
Final SHA256: \${FINAL_APK_HASH}

Mutations Applied:
- New Package Name: \${NEW_PACKAGE_NAME}
- New App Name: \${NEW_APP_NAME}
- Version Code Override: \${VERSION_CODE_OVERRIDE:-N/A}
- Version Name Override: \${VERSION_NAME_OVERRIDE:-N/A}

Full forensic log available at: \${LOG_FILE}
EOM
log "Summary written to \${WORKDIR}/fusion_summary.txt"
cat fusion_summary.txt

log "[9/9] Attempting to install the new APK..."
# Use a subshell to attempt install so script doesn't exit if it fails
(pm install "\${FINAL_APK_PATH}" && log "SUCCESS: '\${NEW_APP_NAME}' installed successfully. You can now run your parallel Termux instance.") || \
(log "ERROR: Installation failed. You may need to manually uninstall an existing version or install the APK from your file manager." && \
 log "You can find the final APK at: \${FINAL_APK_PATH}")


log "--- Fusion Process Complete ---"
`;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const script = generateFullScript(sourceApk, newPackageName, newAppName, versionCode, versionName);
        onGenerate(
            "Generated Fusion Script",
            "This is the 'living code.' It's a production-grade script with a full audit trail. Copy and execute it in your Termux terminal to begin the auditable APK fusion process.",
            script
        );
    };

    return (
        <div className="bg-[#111111] border border-gray-800 rounded-lg p-6 shadow-lg shadow-black/30">
            <h2 className="text-2xl font-bold text-green-300 mb-4 border-b border-gray-700 pb-3">APK Fusion Control Panel</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="sourceApk" className="block text-sm font-medium text-gray-400 mb-2">
                        Source APK Path
                    </label>
                    <input
                        type="text"
                        id="sourceApk"
                        value={sourceApk}
                        onChange={(e) => setSourceApk(e.target.value)}
                        className="w-full bg-black border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        placeholder="e.g., /sdcard/Download/termux_v0.119.1.apk"
                        required
                    />
                     <p className="text-xs text-gray-500 mt-2">Full path to the source Termux APK you want to mutate.</p>
                </div>
                <div>
                    <label htmlFor="newPackageName" className="block text-sm font-medium text-gray-400 mb-2">
                        New Package Name
                    </label>
                    <input
                        type="text"
                        id="newPackageName"
                        value={newPackageName}
                        onChange={(e) => setNewPackageName(e.target.value)}
                        className="w-full bg-black border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        placeholder="e.g., com.termux.ghost"
                        required
                    />
                    <p className="text-xs text-gray-500 mt-2">Unique package identifier for the new app (e.g., com.yourname.termux).</p>
                </div>
                <div>
                    <label htmlFor="newAppName" className="block text-sm font-medium text-gray-400 mb-2">
                        New App Name
                    </label>
                    <input
                        type="text"
                        id="newAppName"
                        value={newAppName}
                        onChange={(e) => setNewAppName(e.target.value)}
                        className="w-full bg-black border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        placeholder="e.g., Ghost Shell"
                        required
                    />
                     <p className="text-xs text-gray-500 mt-2">The name that will appear on your home screen.</p>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="versionCode" className="block text-sm font-medium text-gray-400 mb-2">
                            New Version Code (Optional)
                        </label>
                        <input
                            type="text"
                            id="versionCode"
                            value={versionCode}
                            onChange={(e) => setVersionCode(e.target.value)}
                            className="w-full bg-black border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none"
                            placeholder="e.g., 23"
                        />
                        <p className="text-xs text-gray-500 mt-2">Overrides the versionCode in apktool.yml.</p>
                    </div>
                    <div>
                        <label htmlFor="versionName" className="block text-sm font-medium text-gray-400 mb-2">
                            New Version Name (Optional)
                        </label>
                        <input
                            type="text"
                            id="versionName"
                            value={versionName}
                            onChange={(e) => setVersionName(e.target.value)}
                            className="w-full bg-black border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none"
                            placeholder="e.g., 1.0.0-ghost"
                        />
                        <p className="text-xs text-gray-500 mt-2">Overrides the versionName in apktool.yml.</p>
                    </div>
                </div>
                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                        <TerminalIcon className="w-5 h-5" />
                        Generate Fusion Script
                    </button>
                </div>
            </form>
        </div>
    );
};