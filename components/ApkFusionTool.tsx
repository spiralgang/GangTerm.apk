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
            } else if (!/^[a-z0-9_]+(\.[a-z0-9_]+)+$/.test(newPackageName)) {
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
        } else if (/[/\\:*?"<>|]/.test(newAppName)) {
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
        return `#!/usr/bin/env bash
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
if [[ "$-" == *i* ]]; then
    echo ""
    echo "ERROR: This script cannot be run interactively." >&2
    echo "Please save it to a file (e.g., fuse.sh), make it executable (chmod +x fuse.sh), and then run it (./fuse.sh)." >&2
    echo ""
    exit 1
fi

# --- CONFIGURATION ---
SOURCE_APK="${sourceApk.trim()}"
NEW_PACKAGE_NAME="${newPackageName.trim()}"
NEW_APP_NAME="${newAppName.trim()}"
VERSION_CODE_OVERRIDE="${versionCode.trim()}"
VERSION_NAME_OVERRIDE="${versionName.trim()}"
WORKDIR="$HOME/apk_fusion_workdir"
KEYSTORE_NAME="fusion_keystore.jks"
KEY_ALIAS="fusion_key"
KEY_PASS="spiralgang" # Use a secure password in a real scenario
LOG_FILE="\${WORKDIR}/fusion_audit.log"
CLEANUP_ON_FAILURE="false" # Set to "true" to automatically clean up on error

# --- FUNCTIONS ---
log() {
    echo "[\$(date '+%Y-%m-%d %H:%M:%S')] \$1" | tee -a "\${LOG_FILE}"
}

# Robust cleanup trap
cleanup() {
  local exit_code=\$?
  if [ \${exit_code} -ne 0 ]; then
    log "AN ERROR OCCURRED (EXIT CODE: \${exit_code}). SCRIPT IS TERMINATING."
    if [ "\${CLEANUP_ON_FAILURE}" != "true" ]; then
      log "The workspace at \${WORKDIR} has been preserved for forensic analysis."
    fi
  fi
  cd "\$HOME"
  if [ "\${CLEANUP_ON_FAILURE}" = "true" ] && [ -d "\${WORKDIR}" ]; then
    rm -rf "\${WORKDIR}"
    log "Temporary workspace has been cleaned up."
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
        log "Essential tool '\$tool' not found. Attempting to install dependencies..."
        if ! command -v apt-get &> /dev/null; then
            log "FATAL: 'apt-get' not found. Cannot automatically install dependencies. Please install apktool, apksigner, zipalign, and openjdk-17 manually."
            exit 1
        fi
        log "Using 'apt-get' to install. This may require you to enter your password for sudo."
        if ! (sudo apt-get update && sudo apt-get install -y apktool apksigner zipalign openjdk-17-jre-headless) >> "\${LOG_FILE}" 2>&1; then
             log "FATAL: Failed to install required tools. Please run 'sudo apt-get install -y apktool apksigner zipalign openjdk-17-jre-headless' manually and try again."
             exit 1
        fi
        log "Tools installed successfully."
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

log "[2/9] Decompiling source APK: \${SOURCE_APK}"
if ! apktool d "\${SOURCE_APK}" -o decompiled -f >> "\${LOG_FILE}" 2>&1; then
    log "FATAL: APK decompilation failed. The source APK might be corrupt, protected, or incompatible with the current apktool version."
    exit 1
fi
log "Decompilation successful."

log "Verifying decompilation output..."
if [ ! -d "\${DECOMPILED_DIR}" ] || [ ! -f "\${MANIFEST_FILE}" ]; then
    log "FATAL: Decompilation finished, but the output is invalid. Expected directory '\${DECOMPILED_DIR}' and file '\${MANIFEST_FILE}' were not found."
    exit 1
fi
log "Decompiled directory validated."

log "[3/9] Mutating AndroidManifest.xml and resource files..."
ORIGINAL_PACKAGE_NAME=\$(grep -o 'package="[^"]*"' "\${MANIFEST_FILE}" | head -n 1 | cut -d'"' -f2)
log "Original package name detected: \${ORIGINAL_PACKAGE_NAME}"

if [ -z "\${ORIGINAL_PACKAGE_NAME}" ]; then
    log "FATAL: Could not automatically detect the original package name from AndroidManifest.xml."
    exit 1
fi

log "Changing package name to \${NEW_PACKAGE_NAME}..."
if ! (set -o pipefail; find "\${DECOMPILED_DIR}" -type f \\( -name "*.xml" -o -name "*.smali" \\) -print0 | xargs -0 sed -i "s|\${ORIGINAL_PACKAGE_NAME}|\${NEW_PACKAGE_NAME}|g") >> "\${LOG_FILE}" 2>&1; then
    log "FATAL: Failed to replace package name across project files. Check permissions and sed/find command syntax."
    exit 1
fi

log "Changing app name to '\${NEW_APP_NAME}'..."
if grep -q 'name="app_name"' "\${STRINGS_FILE}"; then
    if ! sed -i '/name="app_name"/s/>[^<]*</>'"\${NEW_APP_NAME}"'</' "\${STRINGS_FILE}" >> "\${LOG_FILE}" 2>&1; then
        log "FATAL: Failed to change app name in strings.xml."
        exit 1
    fi
else
    log "WARNING: 'app_name' string resource not found. App name may not change."
fi

if [ -n "\${VERSION_CODE_OVERRIDE}" ]; then
    log "Overriding versionCode to '\${VERSION_CODE_OVERRIDE}'..."
    if ! sed -i "s/versionCode: '[^']*'/versionCode: '\${VERSION_CODE_OVERRIDE}'/" "\${DECOMPILED_DIR}/apktool.yml" >> "\${LOG_FILE}" 2>&1; then
        log "FATAL: Failed to override versionCode in apktool.yml."
        exit 1
    fi
fi
if [ -n "\${VERSION_NAME_OVERRIDE}" ]; then
    log "Overriding versionName to '\${VERSION_NAME_OVERRIDE}'..."
    if ! sed -i "s/versionName: [^ ]*/versionName: \${VERSION_NAME_OVERRIDE}/" "\${DECOMPILED_DIR}/apktool.yml" >> "\${LOG_FILE}" 2>&1; then
        log "FATAL: Failed to override versionName in apktool.yml."
        exit 1
    fi
fi
log "Mutation complete."

log "[4/9] Recompiling the mutated application from \${DECOMPILED_DIR}..."
if ! apktool b decompiled -o unsigned.apk >> "\${LOG_FILE}" 2>&1; then
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
if ! keytool -genkey -v -keystore "\${KEYSTORE_NAME}" -alias "\${KEY_ALIAS}" -keyalg RSA -keysize 2048 -validity 10000 -storepass "\${KEY_PASS}" -keypass "\${KEY_PASS}" -dname "CN=Spiralgang, OU=Dev, O=GhostShell, L=Unknown, ST=Unknown, C=XX" >> "\${LOG_FILE}" 2>&1; then
    log "FATAL: Failed to generate signing key. Check that 'keytool' is installed (from openjdk-17), that you have write permissions in the current directory, and that the password is valid."
    exit 1
fi

log "[6/9] Signing 'unsigned.apk' with key '\${KEY_ALIAS}' from keystore '\${KEYSTORE_NAME}'..."
if ! apksigner sign --ks "\${KEYSTORE_NAME}" --ks-key-alias "\${KEY_ALIAS}" --ks-pass "pass:\${KEY_PASS}" --out signed.apk unsigned.apk >> "\${LOG_FILE}" 2>&1; then
    log "FATAL: APK signing failed. Check the keystore details, passwords, and ensure apksigner is functioning correctly."
    exit 1
fi
log "Signing successful. Signed APK created: \${WORKDIR}/signed.apk"

log "[7/9] Aligning 'signed.apk' for optimal performance..."
FINAL_APK_NAME="\${NEW_APP_NAME// /_}_fused.apk"
if ! zipalign -v 4 signed.apk "\${FINAL_APK_NAME}" >> "\${LOG_FILE}" 2>&1; then
    log "FATAL: APK alignment failed. Ensure 'zipalign' is installed, the signed APK is not corrupt, and that there is sufficient storage space available on the device."
    exit 1
fi

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

log "[9/9] Build Finalized."
log "SUCCESS: '\${NEW_APP_NAME}' has been built successfully."
log "The final, signed APK is located at:"
log "\${FINAL_APK_PATH}"
log ""
log "--- NEXT STEPS ---"
log "To install this on an Android device, you can use the Android Debug Bridge (adb)."
log "1. Ensure your Android device is connected and in developer mode."
log "2. Run the command: adb install \"\${FINAL_APK_PATH}\""
log "------------------"

log "--- Fusion Process Complete ---"
`;
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
            const presumedPath = `/storage/emulated/0/Download/${file.name}`;
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
                        className={`relative group p-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                            isDragging ? 'border-green-500 bg-green-900/20' : 'border-gray-700 hover:border-green-600'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={handleBrowseClick}
                    >
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".apk" />
                        <div className="flex items-center justify-center text-center gap-4">
                            <UploadCloudIcon className={`w-8 h-8 text-gray-500 transition-colors ${isDragging ? 'text-green-400' : 'group-hover:text-green-500'}`} />
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
                        className={`w-full mt-2 bg-[#010409] border ${sourceApkError ? 'border-red-500/50 focus:ring-red-500' : 'border-gray-700 focus:ring-green-500'} rounded-md px-3 py-1.5 text-gray-200 focus:ring-2 focus:outline-none font-fira`}
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
                            className={`w-full bg-[#010409] border ${packageNameError ? 'border-red-500/50 focus:ring-red-500' : 'border-gray-700 focus:ring-green-500'} rounded-md px-3 py-1.5 text-gray-200 focus:ring-2 focus:outline-none font-fira`}
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
                            className={`w-full bg-[#010409] border ${appNameError ? 'border-red-500/50 focus:ring-red-500' : 'border-gray-700 focus:ring-green-500'} rounded-md px-3 py-1.5 text-gray-200 focus:ring-2 focus:outline-none`}
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