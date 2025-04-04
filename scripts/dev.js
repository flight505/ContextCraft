// scripts/dev.js
const { spawn } = require("child_process");
const { platform } = require("os");

console.log("🚀 Starting development environment...");
process.env.NODE_ENV = "development";

// --- MODIFICATION START ---
// Prioritize externally set URL, otherwise default (will be detected later)
let electronStartUrl = process.env.ELECTRON_START_URL;
let vitePort = 3000; // Keep a default only for fallback/logging
let viteDetected = false; // Flag to ensure we only use detected port once
// --- MODIFICATION END ---

console.log("📦 Starting Vite dev server...");
const viteProcess = spawn("npm", ["run", "dev"], { // Assuming "npm run dev" starts Vite
  stdio: ["inherit", "pipe", "inherit"],
  shell: platform() === "win32",
});

let electronProcess = null; // Keep track of the electron process
let electronStarted = false; // Flag to prevent multiple starts

// Function to start Electron
const startElectron = () => {
  if (electronStarted) return; // Prevent multiple launches
  electronStarted = true;

  // --- MODIFICATION: Determine the final URL ---
  // Use the externally set URL if available AND Vite detection didn't override it yet
  // OR use the detected URL. Fallback to default 3000 only if absolutely necessary.
  const finalStartUrl = electronStartUrl || `http://localhost:${vitePort}`;
  console.log(`🔌 Starting Electron app. Loading URL: ${finalStartUrl}`);
  // --- END MODIFICATION ---

  electronProcess = spawn("npm", ["start"], { // Assuming "npm start" runs "electron ."
    stdio: "inherit",
    shell: platform() === "win32",
    env: {
      ...process.env, // Pass existing environment variables
      NODE_ENV: "development",
      ELECTRON_START_URL: finalStartUrl, // *** Use the determined URL ***
      ELECTRON_DEVELOPMENT: "true",
      ELECTRON_DISABLE_SECURITY_WARNINGS: "true"
    },
  });

  electronProcess.on("close", (code) => {
    console.log(`Electron process exited with code ${code}`);
    if (viteProcess && !viteProcess.killed) viteProcess.kill();
    process.exit(code ?? 0); // Exit with Electron's code or 0
  });
};

// Listen for Vite server ready message
viteProcess.stdout?.on("data", (data) => {
  const output = data.toString();
  console.log(output.trim()); // Echo output

  const portMatch = output.match(/Local:\s+https?:\/\/localhost:(\d+)/); // Allow http or https
  // --- MODIFICATION: Only update if electronStartUrl wasn't set externally ---
  if (portMatch && portMatch[1] && !process.env.ELECTRON_START_URL && !viteDetected) {
    vitePort = parseInt(portMatch[1], 10);
    electronStartUrl = `http://localhost:${vitePort}`; // Update the URL to use
    viteDetected = true; // Mark as detected
    console.log(`✅ Detected Vite server running on port ${vitePort}. Updated start URL.`);
  }
  // --- END MODIFICATION ---

  // Trigger Electron start once Vite prints the Local URL
  if (output.includes("Local:") && !electronStarted) {
    console.log("⚡ Vite seems ready. Starting Electron...");
    startElectron();
  }
});

viteProcess.stderr?.on("data", (data) => {
  console.error(data.toString().trim());
});

// Optional: Fallback timeout if Vite never prints the ready message
const startTimeout = setTimeout(() => {
    if (!electronStarted) {
        console.warn("⚠️ Vite ready message not detected after 10s. Attempting to start Electron with potentially default/external URL...");
        startElectron();
    }
}, 10000); // 10 seconds timeout

viteProcess.on("close", (code) => {
    console.log(`Vite process exited with code ${code}`);
    clearTimeout(startTimeout); // Clear timeout if Vite closes first
    if (electronProcess && !electronProcess.killed) electronProcess.kill(); // Kill Electron if Vite closes
    if (!electronStarted) process.exit(code ?? 1); // Exit if Electron never started
});

process.on("SIGINT", () => {
  if (viteProcess && !viteProcess.killed) viteProcess.kill();
  if (electronProcess && !electronProcess.killed) electronProcess.kill();
  process.exit(0);
});