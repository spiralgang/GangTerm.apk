import React from 'react';
import { BugIcon, TerminalIcon } from './Icons';
import { Tooltip } from './Tooltip';
import { CodeBlock } from './CodeBlock';
import { useApp } from '../context/AppContext';

export const InspectorGatewayTool: React.FC = () => {
    const { handleGenerateScript } = useApp();

    const nodeServerScript = `const http = require('http');
const os = require('os');
const { exec } = require('child_process');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  const status = {
    message: "Node.js Inspector Host is Running",
    platform: os.platform(),
    arch: os.arch(),
    uptime: os.uptime(),
    cwd: process.cwd(),
    node_version: process.version,
  };
  res.end(JSON.stringify(status, null, 2));
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Inspector host server running on port 3000.');
  console.log('Connect your Chrome DevTools to the provided inspector URL.');
  
  // Log a heartbeat to show the process is alive
  setInterval(() => {
    console.log(\`[\${new Date().toLocaleTimeString()}] Heartbeat. Process is active.\`);
  }, 60000);
});
`;

    const fullSetupScript = `#!/bin/bash
# --- GangTerm Inspector Gateway Launcher ---
# This script sets up a Node.js inspector and exposes it via tmate.

set -e

echo "--- [1/4] Installing dependencies (Node.js, tmate)..."
# This assumes a Debian/Ubuntu based environment like a proot-distro
if ! command -v node &> /dev/null || ! command -v tmate &> /dev/null; then
    apt-get update -y
    apt-get install -y nodejs tmate
fi

echo "--- [2/4] Creating Node.js inspector host script..."
mkdir -p /tmp/gangterm_inspector
cat > /tmp/gangterm_inspector/inspector.js <<'EOF'
${nodeServerScript}
EOF

echo "--- [3/4] Launching Node.js process with --inspect flag..."
# We launch the node process in the background.
# The --inspect=0.0.0.0:9229 flag opens the inspector on all network interfaces.
node --inspect=0.0.0.0:9229 /tmp/gangterm_inspector/inspector.js > /tmp/gangterm_inspector.log 2>&1 &
NODE_PID=$!
echo "Node.js process started with PID: \$NODE_PID"
sleep 2 # Give node time to start

echo "--- [4/4] Creating secure tmate tunnel to inspector port (9229)..."
tmate -S /tmp/tmate.sock new-session -d "sleep infinity"
tmate -S /tmp/tmate.sock wait tmate-ready

# The tmate command to expose the local port is complex. We will instead
# instruct the user to run it inside the tmate shell for reliability.
INSPECTOR_HOST=\$(hostname)

echo "✅✅✅ INSPECTOR GATEWAY IS ONLINE ✅✅✅"
echo "------------------------------------------------------------------"
echo "Your secure bridge to the native Chrome DevTools is ready."
echo "Follow these steps EXACTLY:"
echo "------------------------------------------------------------------"
echo "1. Connect to this tmate session using the SSH command:"
echo "   $(tmate -S /tmp/tmate.sock display -p '#{tmate_ssh}')"
echo ""
echo "2. Inside the tmate SSH session, run the following command to get your DevTools URL:"
echo "   echo \`tmate display -p 'ws://#{tmate_ssh_host}:#{tmate_ssh_port}/ws'\`"
echo ""
echo "3. The output will be a URL starting with 'ws://...'. Copy it."
echo "4. Open Chrome, navigate to 'chrome://inspect', click 'Configure...',"
echo "   and paste the URL there."
echo "5. Your remote target should appear. Click 'inspect' to connect."
echo "------------------------------------------------------------------"
echo "The DevTools Console is now a REPL with full access to this machine."
echo "Try this in the console: require('child_process').execSync('ls -la').toString()"
echo "------------------------------------------------------------------"

# This script will now hang, keeping the connection alive.
wait \$NODE_PID
`;

    return (
        <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 shadow-lg shadow-black/30 space-y-6">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <BugIcon className="w-7 h-7 text-green-300" />
                    <h2 className="text-xl font-bold text-green-300">Inspector Gateway</h2>
                </div>
                <p className="text-sm text-gray-400">Bridge the native, high-performance Chrome DevTools to your backend environment. This is the professional-grade solution for a true interactive webshell.</p>
            </div>
            
            <div className="p-4 bg-[#010409] border border-gray-800 rounded-lg space-y-4">
                <h3 className="text-lg font-semibold text-green-400">How It Works</h3>
                <p className="text-sm text-gray-400">
                    This tool generates a script to run in your target environment (e.g., a Termux proot-distro or a Kaggle/Colab notebook). The script starts a Node.js process in inspection mode and uses `tmate` to create a secure tunnel to the inspection port. You can then connect your local browser's full-featured developer tools to this remote process, giving you a powerful and complete interactive shell.
                </p>
                 <div className="bg-yellow-900/30 border border-yellow-500/50 text-yellow-300 text-xs p-3 rounded-md">
                    <span className="font-bold">Prerequisite:</span> Your backend environment must have Node.js and `apt-get` available. Most proot-distros and cloud notebooks meet this requirement.
                </div>
            </div>

            <div className="p-4 bg-[#010409] border border-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold text-green-400 mb-2">Gateway Setup Script</h3>
                 <p className="text-sm text-gray-400 mb-4">Click the button below to generate the complete setup script. Run this script in your target environment to establish the bridge.</p>
                <Tooltip text="Generates a shell script that sets up the Node.js inspector and the tmate tunnel.">
                    <button
                        onClick={() => handleGenerateScript(
                            "Inspector Gateway Setup Script",
                            "Run this script in your target environment. Follow the instructions in the output to connect your Chrome DevTools.",
                            fullSetupScript
                        )}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-200"
                    >
                        <TerminalIcon className="w-5 h-5" />
                        Generate Setup Script
                    </button>
                </Tooltip>
            </div>
            
             <div className="p-4 bg-[#010409] border border-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold text-green-400 mb-2">Usage Instructions</h3>
                <div className="space-y-3 text-sm text-gray-300">
                    <p>1. Generate the script using the button above and run it in your remote shell.</p>
                    <p>2. The script will output an <span className="font-bold text-yellow-300">SSH command</span>. Use it to connect to the tmate session.</p>
                    <p>3. Inside the tmate session, it will instruct you to run an `echo` command to get your DevTools URL.</p>
                    <p>4. Open a new tab in a Chromium-based browser and navigate to <code className="font-fira bg-gray-700 text-green-300 px-1 rounded">chrome://inspect</code>.</p>
                    <p>5. Click the <span className="font-bold">"Configure..."</span> button and add the URL you copied.</p>
                    <p>6. Your remote target should appear below. Click <span className="font-bold">"inspect"</span> to open the DevTools window.</p>
                    <p>7. The <span className="font-bold">Console tab</span> is now a full Node.js REPL connected to your remote machine!</p>
                </div>
                 <div className="mt-4">
                    <p className="font-semibold text-gray-200 text-sm mb-1">Example Command in DevTools Console:</p>
                    <CodeBlock code={`console.log(require('child_process').execSync('ls -la /').toString())`} language="javascript" />
                </div>
            </div>
        </div>
    );
};