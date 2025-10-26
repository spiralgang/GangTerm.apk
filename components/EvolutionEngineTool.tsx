import React from 'react';
import { CpuIcon, TerminalIcon } from './Icons';
import { Tooltip } from './Tooltip';
import { useApp } from '../context/AppContext';

interface EvolutionEngineToolProps {
    onGenerate: (title: string, description: string, script: string) => void;
}

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

const engineModes = {
    audit: {
        name: 'Audit Only (Discover)',
        desc: 'Read-only scan. Finds potential improvements, outdated dependencies, and agentic tasks without modifying any files.'
    },
    improve: {
        name: 'Improve (Discover + Refactor)',
        desc: 'Runs the audit, then automatically applies safe improvements like code formatting and runs the test suite.'
    },
    evolve: {
        name: 'Evolve (Full Run)',
        desc: 'Runs the full improvement pipeline and also extracts high-level agentic tasks for you to solve with the AI Console.'
    }
};

export const EvolutionEngineTool: React.FC<EvolutionEngineToolProps> = ({ onGenerate }) => {
    const { evolutionEngineState, setEvolutionEngineState, addGuardianLogEntry } = useApp();
    const { targetDirectory, engineMode, useGitSafeguard } = evolutionEngineState;

    const setState = (field: keyof typeof evolutionEngineState, value: any) => {
        setEvolutionEngineState(prev => ({ ...prev, [field]: value }));
    };

    const generateEngineScript = () => {
        const script = `#!/data/data/com.termux/files/usr/bin/bash
# GangTerm Eternal Evolution Engine
# This script is a unified, on-device version of the multi-stage CI pipeline.
# It discovers work, applies improvements, and can operate in a self-healing Git branch.

set -Eeuo pipefail

# --- CONFIGURATION ---
TARGET_DIR="${targetDirectory}"
ENGINE_MODE="${engineMode}" # 'audit', 'improve', or 'evolve'
USE_GIT_SAFEGUARD=${useGitSafeguard}
BRANCH_NAME="eternal-engine-run-\$(date +%s)"

# --- UTILITY FUNCTIONS ---
log_header() {
    echo -e "\\n\\e[1;32m--- \$1 ---\\e[0m"
}

log_info() {
    echo -e "\\e[0;34m[INFO]\\e[0m \$1"
}

log_warn() {
    echo -e "\\e[0;33m[WARN]\\e[0m \$1"
}

log_error() {
    echo -e "\\e[0;31m[ERROR]\\e[0m \$1" >&2
}

# --- MAIN LOGIC ---

run_discover_phase() {
    log_header "PHASE 1: DISCOVERING WORK IN '\$TARGET_DIR'"

    log_info "Scanning for agentic tasks (TODO-AI:)..."
    if ! grep -r -I --color=always "TODO-AI:" "\$TARGET_DIR"; then
        log_info "No agentic tasks found."
    fi

    log_info "Checking for outdated Node.js dependencies..."
    if [ -f "\$TARGET_DIR/package.json" ]; then
        (cd "\$TARGET_DIR" && npm outdated) || log_warn "No outdated npm packages, or 'npm' is not installed."
    else
        log_info "No package.json found."
    fi

    log_info "Checking for outdated Python dependencies..."
    if [ -f "\$TARGET_DIR/requirements.txt" ]; then
        pip install --upgrade pip >/dev/null 2>&1
        (cd "\$TARGET_DIR" && pip list --outdated) || log_warn "No outdated pip packages, or 'pip' is not installed."
    else
        log_info "No requirements.txt found."
    fi

    log_info "Identifying top 10 largest code files (potential complexity hotspots)..."
    find "\$TARGET_DIR" -type f \\( -name "*.js" -o -name "*.py" -o -name "*.sh" -o -name "*.go" -o -name "*.rs" \\) -not -path "*/node_modules/*" -print0 | xargs -0 wc -l | sort -nr | head -n 10
}

run_improve_phase() {
    log_header "PHASE 2: APPLYING IMPROVEMENTS"
    
    if [ -f "package.json" ]; then
        log_info "Node.js project detected."
        log_info "Running formatter (prettier)..."
        npx prettier --write . --ignore-unknown || log_warn "'prettier' not found or failed. Skipping."
        
        log_info "Running test suite..."
        if [ -z "\${CI:-}" ]; then # Don't run install in CI, assume it's done
          npm install --silent
        fi
        npm test
    elif [ -f "requirements.txt" ]; then
        log_info "Python project detected."
        log_info "Running formatter (black)..."
        if command -v black &> /dev/null; then
            black .
        else
            log_warn "'black' not installed. Skipping."
        fi

        log_info "Running test suite (pytest)..."
        if command -v pytest &> /dev/null; then
            pytest
        else
            log_warn "'pytest' not installed. Skipping."
        fi
    else
        log_warn "No recognized project type (package.json or requirements.txt). Skipping improvement phase."
    fi
}

run_evolve_phase() {
    log_header "PHASE 3: AGENTIC EVOLUTION"
    log_info "High-level tasks have been identified. Please review the 'TODO-AI' comments in the codebase."
    log_info "You can use the AI Console to generate solutions for these complex tasks."
}

# --- EXECUTION FLOW ---

main() {
    if [ ! -d "\$TARGET_DIR" ]; then
        log_error "Target directory '\$TARGET_DIR' does not exist. Aborting."
        exit 1
    fi
    cd "\$TARGET_DIR"
    log_info "Executing Evolution Engine in: \$(pwd)"

    run_discover_phase
    
    if [ "\$ENGINE_MODE" = "audit" ]; then
        log_header "AUDIT COMPLETE. No files were modified."
        return
    fi
    
    run_improve_phase

    if [ "\$ENGINE_MODE" = "evolve" ]; then
        run_evolve_phase
    fi

    log_header "ENGINE RUN COMPLETE"
}

# --- GIT SAFEGUARD (SELF-HEALING) ---

if [ "\$USE_GIT_SAFEGUARD" = true ]; then
    log_info "Git Safeguard is ENABLED. All changes will be on a temporary branch."
    
    if ! git diff --quiet || ! git diff --cached --quiet; then
        log_error "Your working directory is not clean. Please commit or stash your changes before running with Git Safeguard."
        exit 1
    fi

    ORIGINAL_BRANCH=\$(git rev-parse --abbrev-ref HEAD)
    git checkout -b "\$BRANCH_NAME"
    
    set +e # Disable exit on error to allow for cleanup
    main
    EXIT_CODE=\$?
    set -e

    if [ \$EXIT_CODE -ne 0 ]; then
        log_error "ENGINE FAILED. Reverting all changes..."
        git checkout -f "\$ORIGINAL_BRANCH"
        git branch -D "\$BRANCH_NAME"
        log_info "All changes have been reverted. Your original branch is safe."
        exit 1
    else
        if ! git diff --quiet; then
            log_info "Changes detected. Committing to temporary branch..."
            git add .
            git commit -m "feat: Automated improvements by Evolution Engine"
        else
            log_info "No code changes were made by the engine."
        fi
        git checkout "\$ORIGINAL_BRANCH"
        log_header "SUCCESS! All changes are safely committed on branch '\$BRANCH_NAME'."
        log_info "Review with 'git diff main..\$BRANCH_NAME' and merge when ready."
    fi
else
    log_warn "Git Safeguard is DISABLED. Changes will be applied directly to your working directory."
    main
fi
`;

        onGenerate(
            "Eternal Evolution Engine Script",
            "A unified script to audit, improve, and evolve your codebase, adapted for on-device execution. Review carefully before running.",
            script
        );
        addGuardianLogEntry('Engine Script Generated', `Mode: ${engineMode}, Safeguard: ${useGitSafeguard}`);
    };

    return (
        <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 shadow-lg shadow-black/30 space-y-6">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <CpuIcon className="w-7 h-7 text-green-300" />
                    <h2 className="text-xl font-bold text-green-300">The Eternal Evolution Engine</h2>
                </div>
                <p className="text-sm text-gray-400">An on-device adaptation of a self-healing, continuously improving CI system. Configure and run the engine on your local projects.</p>
            </div>
            
            {/* Configuration */}
            <div className="p-4 bg-[#010409] border border-gray-800 rounded-lg space-y-4">
                <h3 className="text-lg font-semibold text-green-400">Engine Configuration</h3>
                <div>
                    <Tooltip text="The full path to the project directory you want the engine to analyze and improve.">
                        <label className="block text-sm font-medium text-gray-400 mb-2 cursor-help">Target Project Directory</label>
                    </Tooltip>
                    <input
                        type="text"
                        value={targetDirectory}
                        onChange={(e) => setState('targetDirectory', e.target.value)}
                        className="w-full bg-[#0d1117] border border-gray-700 rounded-md px-3 py-1.5 text-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none font-fira text-sm"
                        placeholder="e.g., ~/projects/my-website"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Engine Mode</label>
                    <div className="space-y-2">
                        {Object.entries(engineModes).map(([key, {name, desc}]) => (
                            <div key={key} className="flex items-start p-3 bg-[#161b22] rounded-md border border-gray-700/50">
                                <input
                                    id={`mode-${key}`}
                                    name="engine-mode"
                                    type="radio"
                                    checked={engineMode === key}
                                    onChange={() => setState('engineMode', key)}
                                    className="h-4 w-4 mt-1 cursor-pointer border-gray-600 bg-gray-800 text-green-500 focus:ring-green-600"
                                />
                                <div className="ml-3 text-sm">
                                    <label htmlFor={`mode-${key}`} className="font-bold text-gray-200 cursor-pointer">{name}</label>
                                    <p className="text-gray-400">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-4">
                    <ToggleSwitch 
                        label="Use Git Safeguard (Self-Healing)"
                        checked={useGitSafeguard}
                        onChange={v => setState('useGitSafeguard', v)}
                        tooltip="Highly recommended. Runs the engine on a temporary Git branch. If any step fails, all changes are automatically reverted, keeping your main branch safe."
                    />
                     {!useGitSafeguard && (
                        <div className="bg-red-900/30 border border-red-500/50 text-red-300 text-xs p-3 rounded-md mt-3">
                            <span className="font-bold">Warning:</span> Safeguard is disabled. The engine will make changes directly to your current working files.
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-2">
                <Tooltip text="Generate the complete, executable script based on your configuration.">
                    <button
                        onClick={generateEngineScript}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-200"
                    >
                        <TerminalIcon className="w-5 h-5" />
                        Generate Engine Script
                    </button>
                </Tooltip>
            </div>
        </div>
    );
};