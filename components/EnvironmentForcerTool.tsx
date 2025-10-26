
import React from 'react';
import { ZapIcon, TerminalIcon } from './Icons';
import { Tooltip } from './Tooltip';
import { CodeBlock } from './CodeBlock';

interface EnvironmentForcerToolProps {
    onGenerate: (title: string, description: string, script: string) => void;
}

const kaggleTmateScript = `#!/bin/bash
# --- Kaggle Quick Shell Enhancer ---
# Run this entire block in a single Kaggle notebook cell by prefixing it with '!'

set -e

echo "--- [1/3] Updating package lists ---"
apt-get update -y

echo "--- [2/3] Installing essential terminal tools (tmate, htop, neovim) ---"
apt-get install -y tmate htop neovim

echo "--- [3/3] Starting persistent tmate session ---"
# Start tmate in a detached session
tmate -S /tmp/tmate.sock new-session -d

# Wait for it to be ready
tmate -S /tmp/tmate.sock wait tmate-ready

# --- CONNECTION DETAILS ---
echo "✅✅✅ PERSISTENT KAGGLE SHELL IS ONLINE ✅✅✅"
echo "------------------------------------------------------------------"
echo "Connect to your Kaggle instance using one of the methods below:"
echo "------------------------------------------------------------------"
echo "SSH Connection:"
tmate -S /tmp/tmate.sock display -p '#{tmate_ssh}'
echo ""
echo "Web Shell URL:"
tmate -S /tmp/tmate.sock display -p '#{tmate_web}'
echo "------------------------------------------------------------------"

# Keep the notebook cell running
sleep infinity
`;

const colabXtermScript = `!pip install colab-xterm
%load_ext colab_xterm
%xterm
`;

const dockerOpenWrtScript = `#!/bin/bash
# --- Advanced Breakout: Dockerized OpenWRT Environment ---
# Run this in a Colab or Kaggle cell. It installs Docker, then deploys
# a full OpenWRT OS in a container, accessible via a tmate SSH session.

set -e

echo "--- [1/5] Installing Docker ---"
# Install Docker (this works on most Debian/Ubuntu based cloud notebooks)
apt-get update
apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io

echo "--- [2/5] Starting Docker Daemon ---"
# Start Docker in the background
dockerd > /var/log/dockerd.log 2>&1 &
# Wait for the daemon to be ready
sleep 10

echo "--- [3/5] Pulling and Running OpenWRT Container ---"
# Pull the OpenWRT image
docker pull oofnikj/docker-openwrt
# Run it in detached mode, naming it for easy access
docker run -d --name openwrt_shell --privileged oofnikj/docker-openwrt /sbin/init

echo "--- [4/5] Installing tmate in Host Environment ---"
apt-get install -y tmate

echo "--- [5/5] Creating SSH Bridge with tmate ---"
# This tmate session will let you SSH into the HOST, from which you can
# access the Docker container.
tmate -S /tmp/tmate.sock new-session -d
tmate -S /tmp/tmate.sock wait tmate-ready

echo "✅✅✅ DOCKER OPENWRT SHELL IS ONLINE ✅✅✅"
echo "------------------------------------------------------------------"
echo "Your persistent Linux environment is running inside Docker."
echo "Follow these steps to connect:"
echo "------------------------------------------------------------------"
echo "1. Connect to the HOST using one of these tmate links:"
echo "   SSH: $(tmate -S /tmp/tmate.sock display -p '#{tmate_ssh}')"
echo "   Web: $(tmate -S /tmp/tmate.sock display -p '#{tmate_web}')"
echo ""
echo "2. Once connected to the host, run this command to access your OpenWRT shell:"
echo "   docker exec -it openwrt_shell /bin/ash"
echo "------------------------------------------------------------------"
echo "Your OpenWRT environment is persistent. You can disconnect and reconnect."
echo "------------------------------------------------------------------"

# Keep the notebook cell alive
sleep infinity
`;

const goPrependScriptSource = `package main

import (
	"fmt"
	"os"
	"os/exec"
	"strings"
)

func main() {
	// Check if the command is provided as an argument
	if len(os.Args) < 2 {
		fmt.Println("Usage: ./prepend <command>")
		return
	}

	// Join all arguments into a single command string
	command := strings.Join(os.Args[1:], " ")

	// In a notebook, shell commands are often prefixed with '!'
	// This wrapper standardizes execution.
	fmt.Printf("Executing: %s\\n", command)
	
	// Execute the command
	cmd := exec.Command("sh", "-c", command)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	err := cmd.Run()
	if err != nil {
		fmt.Printf("Error executing command: %v\\n", err)
	}
}
`;

export const EnvironmentForcerTool: React.FC<EnvironmentForcerToolProps> = ({ onGenerate }) => {
    return (
        <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 shadow-lg shadow-black/30 space-y-6">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <ZapIcon className="w-7 h-7 text-green-300" />
                    <h2 className="text-xl font-bold text-green-300">Environment Forcer</h2>
                </div>
                <p className="text-sm text-gray-400">Generate scripts to compel cloud notebooks (Kaggle, Colab) to revert to a more powerful, persistent, and desktop-like x86-64 Linux shell.</p>
            </div>

            <div className="space-y-4">
                {/* Kaggle Strategy */}
                <div className="p-4 bg-[#010409] border border-gray-800 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-400 mb-2">Strategy 1: Kaggle Persistent Shell</h3>
                    <p className="text-sm text-gray-400 mb-4">Enhances the default Kaggle shell with essential tools and starts a persistent, shareable `tmate` session. This allows you to connect from a local terminal and work continuously, even if you close the browser.</p>
                    <Tooltip text="Generate the script to set up a tmate session in a Kaggle notebook.">
                        <button
                            onClick={() => onGenerate(
                                "Kaggle Persistent Shell Script",
                                "Run this script in a single Kaggle notebook cell (prefixed with '!') to start a persistent tmate session.",
                                kaggleTmateScript
                            )}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                        >
                            <TerminalIcon className="w-5 h-5" />
                            Generate Kaggle Script
                        </button>
                    </Tooltip>
                </div>

                {/* Colab Strategy */}
                <div className="p-4 bg-[#010409] border border-gray-800 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-400 mb-2">Strategy 2: Colab Interactive Terminal</h3>
                    <p className="text-sm text-gray-400 mb-4">Uses the `colab-xterm` package to launch a fully interactive terminal directly in the output of a Google Colab cell. This is the quickest way to get a real terminal experience in Colab.</p>
                    <Tooltip text="Generate the code to run an interactive xterm in Google Colab.">
                        <button
                             onClick={() => onGenerate(
                                "Colab Interactive Terminal",
                                "Run this code in a Google Colab cell to launch an interactive terminal.",
                                colabXtermScript
                            )}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                        >
                            <TerminalIcon className="w-5 h-5" />
                            Generate Colab Code
                        </button>
                    </Tooltip>
                </div>

                {/* Docker Strategy */}
                <div className="p-4 bg-[#010409] border border-yellow-500/50 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-300 mb-2">Advanced Strategy: Full Docker Breakout</h3>
                    <p className="text-sm text-gray-400 mb-4">Deploys a complete OpenWRT Linux operating system inside a Docker container within your cloud environment. This provides a persistent, isolated, and fully-featured shell that survives notebook restarts. Access it via an SSH bridge created by `tmate`.</p>
                     <div className="bg-red-900/30 border border-red-500/50 text-red-300 text-xs p-3 rounded-md mb-4">
                        <span className="font-bold">Warning:</span> This is a highly advanced technique. It requires root/sudo privileges in the notebook environment and may consume significant resources.
                    </div>
                    <Tooltip text="Generate the advanced script for deploying a full OpenWRT OS in Docker.">
                        <button
                            onClick={() => onGenerate(
                                "Advanced Docker Breakout Script",
                                "This script installs Docker and deploys a persistent OpenWRT container. Follow the output instructions to connect.",
                                dockerOpenWrtScript
                            )}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                        >
                            <TerminalIcon className="w-5 h-5" />
                            Generate Breakout Script
                        </button>
                    </Tooltip>
                </div>

                 {/* Go Wrapper Strategy */}
                <div className="p-4 bg-[#010409] border border-gray-800 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-400 mb-2">Advanced: Programmatic Execution Wrapper (Go)</h3>
                    <p className="text-sm text-gray-400 mb-4">For scenarios requiring programmatic control over shell commands, this Go program acts as a simple wrapper. It takes a command as arguments and executes it. This can be compiled and used within your notebook to build more complex automation pipelines.</p>
                    <div>
                        <p className="font-semibold text-gray-200 text-sm mb-1">1. Source Code (`prepend.go`)</p>
                        <div className="h-48">
                            <CodeBlock code={goPrependScriptSource} language="go" />
                        </div>
                    </div>
                     <div className="mt-4">
                        <p className="font-semibold text-gray-200 text-sm mb-1">2. Build & Usage</p>
                        <p className="text-xs text-gray-500 mb-2">Run these commands in your notebook cell.</p>
                        <CodeBlock code={`# Save the source above to prepend.go\n!go build -o prepend prepend.go\n!./prepend ls -la`} language="bash" />
                    </div>
                </div>
            </div>
        </div>
    );
};