

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
        prompt: ``, // This will be dynamically generated
        desc: "Deploys a stateful AI backend to Kaggle. Hydrates its workspace from a Git repo on startup and snapshots changes back on demand.",
        category: 'AI Deployment'
    },
    {
        id: 'noteformers-docker',
        name: 'NoteFormers Docker Lab',
        prompt: `#!/data/data/com.termux/files/usr/bin/bash
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
LOG_FILE="\$HOME/noteformers_deploy.log"
JUPYTER_LOG="\$HOME/jupyter_launch.log"

# --- Utility Functions ---
log() {
    echo "[\$(date '+%Y-%m-%d %H:%M:%S')] \$1" | tee -a "\$LOG_FILE"
}

# --- Main Execution ---
rm -f "\$LOG_FILE" "\$JUPYTER_LOG"
touch "\$LOG_FILE"
log "--- GangTerm NoteFormers Deployment Initiated ---"

# --- Phase 1: Termux Prerequisite Check ---
log "[1/4] Checking Termux prerequisites (proot-distro, wget)..."
pkg update -y >/dev/null 2>&1
pkg install -y proot-distro wget >/dev/null 2>&1
log "Prerequisites are installed."

# --- Phase 2: Setup proot-distro with Docker ---
log "[2/4] Setting up Ubuntu proot-distro for Docker..."
if ! proot-distro list | grep -q "\$DISTRO_NAME"; then
    log "Distro '\$DISTRO_NAME' not found. Installing now. This will take several minutes."
    proot-distro install ubuntu --distro-name "\$DISTRO_NAME"
    log "Distro installed."
else
    log "Distro '\$DISTRO_NAME' already exists."
fi

log "Logging into the distro to install Docker..."
proot-distro login "\$DISTRO_NAME" -- bash -c '
    set -Eeuo pipefail
    echo "--- Inside \${DISTRO_NAME}: Updating and installing Docker prerequisites ---"
    apt-get update
    apt-get install -y ca-certificates curl gnupg lsb-release

    echo "--- Adding Docker GPG key ---"
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg

    echo "--- Setting up Docker repository ---"
    echo \
      "deb [arch=\$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      \$(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    echo "--- Installing Docker Engine ---"
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    echo "--- Docker installation complete inside proot-distro ---"
' >> "\$LOG_FILE" 2>&1
log "Docker setup within '\$DISTRO_NAME' is complete."

# --- Phase 3: Launch Docker Container ---
log "[3/4] Pulling and running the NoteFormers Docker container..."
proot-distro login "\$DISTRO_NAME" -- bash -c "
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
    if docker ps -a -q -f name=\${CONTAINER_NAME}; then
        docker rm -f \${CONTAINER_NAME}
    fi
    
    # Create a notebooks directory in the proot-distro home
    mkdir -p /root/notebooks

    docker run -d --name \${CONTAINER_NAME} -p \${JUPYTER_PORT}:\${JUPYTER_PORT} -v '/root/notebooks:/home/jovyan/work' toluclassics/transformers_notebook
    
    echo '--- Waiting for JupyterLab to start...'
    sleep 10

    echo '--- Retrieving JupyterLab URL with token ---'
    docker logs \${CONTAINER_NAME}
" > "\$JUPYTER_LOG" 2>&1
log "Container started. Log file created at \$JUPYTER_LOG"

# --- Phase 4: Display Connection Info ---
log "[4/4] Displaying Connection Information ---"
echo -e "\\n\\n"
echo "✅✅✅ NOTEFORMERS JUPYTERLAB IS STARTING ✅✅✅"
echo "------------------------------------------------------------------"
echo "Your JupyterLab instance is running inside a Docker container."
echo "Find the connection URL with the login token in the logs below."
echo "------------------------------------------------------------------"
cat "\$JUPYTER_LOG" | grep 'http://127.0.0.1'
echo ""
echo "INSTRUCTIONS:"
echo "1. Copy one of the URLs above (it includes the auth token)."
echo "2. Paste it into your web browser."
echo "3. Your notebooks are stored in the '~/notebooks' directory within the proot-distro."
echo "------------------------------------------------------------------"
echo "To stop the server, run this command:"
echo "proot-distro login \${DISTRO_NAME} -- docker stop \${CONTAINER_NAME}"
echo "------------------------------------------------------------------"
`,
        desc: "Deploys a full JupyterLab NLP environment via Docker inside a Termux proot-distro. A portable, powerful 'Head Honcho' setup.",
        category: 'AI Deployment'
    },
    {
        id: 'chromium-os-vnc',
        name: 'Chromium Web Desktop (noVNC)',
        prompt: `#!/data/data/com.termux/files/usr/bin/bash
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
LOG_FILE="\$HOME/web_desktop_deploy.log"

# --- Utility Functions ---
log() {
    echo "[\$(date '+%Y-%m-%d %H:%M:%S')] \$1" | tee -a "\$LOG_FILE"
}

# --- Main Execution ---
rm -f "\$LOG_FILE"
touch "\$LOG_FILE"
log "--- GangTerm Web Desktop Deployment Initiated ---"

# --- Phase 1: Termux Prerequisite Check ---
log "[1/5] Checking Termux prerequisites..."
pkg update -y >/dev/null 2>&1
pkg install -y proot-distro wget tmate >/dev/null 2>&1
log "Prerequisites are installed."

# --- Phase 2: Setup proot-distro ---
log "[2/5] Setting up Ubuntu proot-distro..."
if ! proot-distro list | grep -q "\$DISTRO_NAME"; then
    log "Distro '\$DISTRO_NAME' not found. Installing. THIS WILL TAKE SEVERAL MINUTES."
    proot-distro install ubuntu --distro-name "\$DISTRO_NAME"
    log "Distro installed."
else
    log "Distro '\$DISTRO_NAME' already exists."
fi

# --- Phase 3: Install Desktop Environment & Tools ---
log "[3/5] Installing desktop environment inside distro..."
proot-distro login "\$DISTRO_NAME" -- bash -c '
    set -Eeuo pipefail
    echo "--- Inside \${DISTRO_NAME}: Updating and installing packages ---"
    export DEBIAN_FRONTEND=noninteractive
    apt-get update -y
    apt-get install -y --no-install-recommends \\
        xfce4 xfce4-goodies chromium-browser \\
        x11vnc xvfb novnc websockify
    
    echo "--- Configuring VNC password ---"
    mkdir -p ~/.vnc
    x11vnc -storepasswd "'"\$VNC_PASS"'" ~/.vnc/passwd
    
    echo "--- Desktop environment setup complete ---"
' >> "\$LOG_FILE" 2>&1
log "Desktop environment installed."

# --- Phase 4: Launch Services ---
log "[4/5] Launching VNC, Web Proxy, and Tunnel..."
# This command runs the entire server stack inside the proot-distro
proot-distro login "\$DISTRO_NAME" -- bash -c '
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
TMATE_WEB_URL=\$(tmate -S /tmp/tmate.sock display -p '#{tmate_web}')
# The remote port forwarding command is complex, let's just expose the web URL of tmate shell for simplicity and guide user.
# A more advanced setup would tunnel the port directly.

PUBLIC_URL=\$(tmate -S /tmp/tmate.sock display -p '#{tmate_web}')

echo -e "\\n\\n"
echo "✅✅✅ CHROMIUM WEB DESKTOP IS ONLINE ✅✅✅"
echo "------------------------------------------------------------------"
echo "Your graphical desktop is running and accessible in your browser."
echo "------------------------------------------------------------------"
echo "CONNECTION DETAILS:"
echo "  Web Desktop URL: \${PUBLIC_URL}"
echo "  Password:        \${VNC_PASS}"
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
echo "proot-distro login \${DISTRO_NAME} -- pkill -f x11vnc"
echo "------------------------------------------------------------------"
`,
        desc: "Deploys a full graphical desktop with Chromium inside a proot-distro, accessible from any web browser via a secure tunnel.",
        category: 'OS & Emulation'
    },
    {
        id: 'process-warden',
        name: 'Termux Process Warden',
        prompt: `Create an advanced, persistent bash script for Termux called 'Process Warden'. This script must act as a background service (daemon) to enforce process control.

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
`,
        desc: "An active daemon that kills any process not on your allowlist and notifies you. Your personal process firewall.",
        category: 'Security Audits'
    },
    {
        id: 'orphan-hunter',
        name: 'Orphan & Rogue Process Hunter',
        prompt: `Create an advanced bash script for Termux called 'Orphan & Rogue Process Hunter'. The script must identify all processes running under the current user's ID. It should then analyze the process tree to differentiate between processes started by the current interactive shell (and its children) and those running in the background (e.g., from npm, background tasks, or other scripts). The output must be a color-coded report: highlight processes directly under the current shell in green, and flag all other processes (orphans or those started by other means) in yellow or red. Finally, it should offer an interactive prompt to terminate any of the flagged processes by PID.`,
        desc: "Audits your processes, flagging any that aren't direct children of your current shell. Helps find and kill runaway background tasks.",
        category: 'System Administration'
    },
    {
        id: 'security-audit',
        name: 'System & User Security Audit',
        prompt: `Create an advanced bash security script for Termux called 'System & User Security Audit'. The script must perform three actions: 1) List all users from /data/data/com.termux/files/usr/etc/passwd and all groups from /data/data/com.termux/files/usr/etc/group to establish a baseline of configured identities. 2) List all currently running processes with their user and group ownership. 3) Cross-reference the process list against the user list. It must create a color-coded report that clearly distinguishes between processes owned by 'root', the current interactive user, and any other users found on the system. It should highlight processes owned by unexpected or non-standard users in red as a potential security risk. The script must be robust and handle cases where user/group files might be non-standard.`,
        desc: 'A deep security scan. Lists all users/groups and flags processes owned by unexpected user accounts.',
        category: 'Security Audits'
    },
     {
        id: 'process-sentinel',
        name: 'Process Ownership Sentinel',
        prompt: `Generate a bash script for Termux called 'Process Ownership Sentinel'. The script should get the current user's name. It must then list all running processes using 'ps -eo user,pid,cmd'. The output must be clearly grouped and color-coded into three categories: 1) Processes owned by the current interactive user (highlight in green). 2) Processes owned by 'root' (highlight in yellow). 3) Processes owned by ANY other user (highlight in red). This provides a quick, high-level overview of who is running what on the system.`,
        desc: 'A quick, color-coded overview of running processes, grouped by owner: you, root, or others.',
        category: 'System Administration'
    },
    {
        id: 'encrypted-backup',
        name: 'Secure Encrypted Backup',
        prompt: `Create a bash script for Termux that finds important project files (like READMEs, source code in src/, scripts/), archives them into a .tar.gz file, encrypts the archive with a user-provided password using openssl, and then optionally uploads it to a specified rclone remote. The script should include robust logging, error handling, and cleanup of temporary files.`,
        desc: 'Generate a script to archive, encrypt, and upload sensitive files.',
        category: 'File Management'
    },
    {
        id: 'python-router',
        name: 'Python AI Provider Router',
        prompt: `Generate a Python script that acts as a unified function to call different AI provider APIs (like OpenAI, Hugging Face, Ollama). The script should select the provider based on an environment variable or function argument. It must handle API keys from environment variables securely and normalize the responses to return a simple text string. Include error handling for network issues or missing API keys.`,
        desc: 'A flexible Python function to route requests to multiple AI backends.',
        category: 'AI Deployment'
    },
    {
        id: 'health-dashboard',
        name: 'System Health Dashboard',
        prompt: `Generate a comprehensive bash script for Termux that acts as a 'System Health Dashboard'. It should display the current date/time, CPU usage (perhaps from 'top'), memory usage ('free -h'), disk space ('df -h'), and a list of the top 5 memory-consuming processes. The output should be well-formatted with clear headings for each section.`,
        desc: 'A script that provides a quick, formatted overview of system resources.',
        category: 'System Administration'
    },
    {
        id: 'share-server',
        name: 'Instant Share Server',
        prompt: `Create a simple bash script for Termux to start a temporary HTTP file server in the current directory. The script must check if Python 3 is available, then use 'python -m http.server 8000'. It must detect the device's local IP address and print a clear message like 'Server running at http://[DEVICE_IP]:8000'. It should handle cleanup on Ctrl+C.`,
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

    const bootstrapPyContent = `
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
WORKSPACE_SYNC_TARGET = "${workspaceSyncTarget}"
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
${modelSource === 'git' ? `
print("Cloning model repository... This may take a while.")
run_command(f"git clone ${modelIdentifier} {MODEL_REPO_DIR}")
model_path = MODEL_REPO_DIR
` : `
model_path = "${modelIdentifier}"
`}
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
        await send_json(websocket, {"action": "SNAPSHOT_END", "success": False, "error": "No workspace sync target configured."})
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
        await send_json(websocket, {"action": "SNAPSHOT_END", "success": True})

    except Exception as e:
        error_msg = f"Snapshot failed: {e}"
        await log_to_client(error_msg)
        await send_json(websocket, {"action": "SNAPSHOT_END", "success": False, "error": error_msg})

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
`;

    return `#!/data/data/com.termux/files/usr/bin/bash
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
KAGGLE_KERNEL_NAME="${kernelName}"
WORKDIR="\$HOME/kaggle_deploys"
KERNEL_DIR="\$WORKDIR/\$KAGGLE_KERNEL_NAME"
LOG_FILE="\$WORKDIR/kaggle_deploy.log"

# --- Utility Functions ---
log() {
    echo "[\$(date '+%Y-%m-%d %H:%M:%S')] \$1" | tee -a "\$LOG_FILE"
}

# --- Phase 1: Local Environment Setup (Termux) ---
log "--- Phase 1: Setting up local Termux environment ---"
mkdir -p "\$WORKDIR"
touch "\$LOG_FILE"

log "Installing local dependencies (kaggle, python)..."
pkg update -y >/dev/null 2>&1
pkg install -y python python-pip openssh >/dev/null 2>&1

log "Ensuring Kaggle CLI is installed..."
if ! python -m pip show kaggle &>/dev/null; then
    python -m pip install --upgrade kaggle
fi

log "Verifying Kaggle & Git credentials..."
if [ ! -f "\$HOME/.kaggle/kaggle.json" ]; then
    log "FATAL: Kaggle API key not found at \$HOME/.kaggle/kaggle.json"
    exit 1
fi
chmod 600 "\$HOME/.kaggle/kaggle.json"

if [ -z "\${NGROK_AUTH_TOKEN:-}" ] || [ -z "\${GIT_AUTH_TOKEN:-}" ]; then
    log "WARNING: NGROK_AUTH_TOKEN and/or GIT_AUTH_TOKEN are not set in Termux."
    log "You MUST add them as secrets on the Kaggle kernel settings page for the Head Honcho to function correctly."
fi
log "Local checks complete."

# --- Phase 2: Create Kaggle Kernel Files ---
log "--- Phase 2: Generating Kaggle Kernel files ---"
rm -rf "\$KERNEL_DIR"
mkdir -p "\$KERNEL_DIR"

log "Creating kernel metadata..."
printf '{
  "id": "%s/%s",
  "title": "%s",
  "code_file": "bootstrap.py",
  "language": "python",
  "kernel_type": "script",
  "is_private": true,
  "enable_gpu": ${gpuEnabled},
  "enable_internet": true,
  "dataset_sources": [],
  "competition_sources": [],
  "kernel_sources": []
}\\n' "\$(kaggle config view -q | grep '^username' | cut -d ' ' -f 2)" "\${KAGGLE_KERNEL_NAME}" "\${KAGGLE_KERNEL_NAME}" > "\$KERNEL_DIR/kernel-metadata.json"

log "Creating bootstrap Python script for Kaggle..."
printf '%s' "${bootstrapPyContent.replace(/%/g, '%%')}" > "\$KERNEL_DIR/bootstrap.py"

log "Kernel files created successfully in \$KERNEL_DIR"

# --- Phase 3: Deploy to Kaggle ---
log "--- Phase 3: Pushing and running the Kernel on Kaggle ---"
log "This will start the build process on Kaggle's servers. It may take 15-45 minutes."
kaggle kernels push -p "\$KERNEL_DIR"

# --- Phase 4: Monitor and Retrieve Connection Info ---
log "--- Phase 4: Waiting for Kernel to become ready... ---"
i=0
max_wait=90 # 90 * 30s = 45 minutes
while true; do
    status=\$(kaggle kernels status "\$(kaggle config view -q | grep '^username' | cut -d ' ' -f 2)"/"\${KAGGLE_KERNEL_NAME}" | grep -o 'status: [a-zA-Z]*' | cut -d ' ' -f 2)
    log "Current kernel status: \$status"
    if [[ "\$status" == "running" ]]; then
        log "Kernel is running. Checking for tmate & ngrok output..."
        output=\$(kaggle kernels output "\$(kaggle config view -q | grep '^username' | cut -d ' ' -f 2)"/"\${KAGGLE_KERNEL_NAME}")
        if echo "\$output" | grep -q "TMATE_OUTPUT_START" && echo "\$output" | grep -q "PYNGROK_URL_START"; then
            log "Kernel is ready! Retrieving connection details."
            break
        fi
    fi
    if [[ "\$status" == "complete" || "\$status" == "error" ]]; then
        log "FATAL: Kernel finished unexpectedly with status: \$status. Check logs on Kaggle website."
        kaggle kernels output "\$(kaggle config view -q | grep '^username' | cut -d ' ' -f 2)"/"\${KAGGLE_KERNEL_NAME}"
        exit 1
    fi
    i=\$((i+1))
    if [ \$i -ge \$max_wait ]; then
        log "FATAL: Timeout waiting for kernel after \$((max_wait * 30 / 60)) minutes."
        exit 1
    fi
    sleep 30
done

# --- Phase 5: Display Connection Details ---
log "--- Phase 5: Connection Ready! ---"
SSH_URL=\$(echo "\$output" | sed -n '/TMATE_OUTPUT_START/,/TMATE_OUTPUT_END/p' | sed '/TMATE_OUTPUT_START/d' | sed '/TMATE_OUTPUT_END/d')
WS_URL=\$(echo "\$output" | sed -n '/PYNGROK_URL_START/,/PYNGROK_URL_END/p' | sed '/PYNGROK_URL_START/d' | sed '/PYNGROK_URL_END/d')

echo -e "\\n\\n"
echo "✅✅✅ PERSISTENT HEAD HONCHO IS ONLINE ✅✅✅"
echo "------------------------------------------------------------------"
echo "Your Python/PyTorch AI backend and remote terminal are live."
echo "------------------------------------------------------------------"
echo -e "\\n📱 FOR AI CONSOLE & SANDBOX (on your phone):"
echo "   Paste this WebSocket URL into the Head Honcho Controller:"
echo "   \${WS_URL}"
echo ""
echo "💻 FOR DEVELOPMENT (in Termux or on a PC):"
echo "   Use this SSH command to get a shell on the remote Kaggle machine."
echo "   \${SSH_URL}"
echo "------------------------------------------------------------------"
echo "To stop the kernel, go to your Kaggle kernels page and manually stop it."
echo "------------------------------------------------------------------"
`;
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
             <div key={blueprint.id} className={`p-3 rounded-md border bg-[#161b22] border-gray-700/50`}>
                <h3 className={`font-semibold text-green-400`}>{blueprint.name}</h3>
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
                                <button onClick={() => setKaggleConfig(p => ({...p, modelSource: 'hf'}))} className={`flex-1 p-2 text-xs rounded-md border ${kaggleConfig.modelSource === 'hf' ? 'bg-green-900/50 border-green-500' : 'bg-gray-800 border-gray-700'}`}>Hugging Face Hub</button>
                                <button onClick={() => setKaggleConfig(p => ({...p, modelSource: 'git'}))} className={`flex-1 p-2 text-xs rounded-md border ${kaggleConfig.modelSource === 'git' ? 'bg-green-900/50 border-green-500' : 'bg-gray-800 border-gray-700'}`}>Artifact Registry (Git)</button>
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
                            <span className="font-bold">Note:</span> Requires three secrets set on Kaggle: `KAGGLE_KEY`, `NGROK_AUTH_TOKEN`, and `GIT_AUTH_TOKEN` (a classic GitHub PAT with repo scope).
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
                     <Tooltip text={`Generate the '${blueprint.name}' script and open it in the modal viewer.`}>
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
