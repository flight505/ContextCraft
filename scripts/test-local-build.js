/**
 * Script to test local Electron builds
 * This helps verify that electron-builder is working correctly on your machine
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const platform = process.platform;
const buildType = process.argv[2] || platform;

console.log("🧪 Testing local Electron build");
console.log("System:", os.platform(), os.release(), os.arch());
console.log("Build type:", buildType);

// Clean previous builds
try {
  console.log("🧹 Cleaning previous builds...");
  if (fs.existsSync(path.join(__dirname, "../release-builds"))) {
    if (platform === "win32") {
      execSync("rmdir /s /q release-builds", { stdio: "inherit" });
    } else {
      execSync("rm -rf release-builds", { stdio: "inherit" });
    }
  }
  console.log("✅ Clean complete");
} catch (err) {
  console.log("⚠️ Clean failed, but continuing...");
}

// Run build
try {
  console.log("🔨 Building Vite app...");
  execSync("npm run build", { stdio: "inherit" });
  console.log("✅ Build complete");
} catch (err) {
  console.error("❌ Build failed:");
  console.error(err.message);
  process.exit(1);
}

// Run packaging
console.log("📦 Packaging Electron app...");
try {
  let command;

  switch (buildType) {
    case "darwin":
    case "mac":
      command = "npm run package:mac";
      break;
    case "win32":
    case "windows":
    case "win":
      command = "npm run package:win";
      break;
    case "linux":
      command = "npm run package:linux";
      break;
    case "all":
      command = "npm run package:all";
      break;
    default:
      console.log(`Unknown build type: ${buildType}, using current platform`);
      command = `npm run package:${
        platform === "win32" ? "win" : platform === "darwin" ? "mac" : "linux"
      }`;
  }

  console.log(`Running command: ${command}`);
  execSync(command, { stdio: "inherit" });
  console.log("✅ Packaging complete");
} catch (err) {
  console.error("❌ Packaging failed:");
  console.error(err.message);
  process.exit(1);
}

// Check for output files
console.log("🔍 Checking for output files...");
if (!fs.existsSync(path.join(__dirname, "../release-builds"))) {
  console.error("❌ No release-builds directory found");
  process.exit(1);
}

let files;
try {
  files = fs.readdirSync(path.join(__dirname, "../release-builds"));
} catch (err) {
  console.error("❌ Failed to read release-builds directory:");
  console.error(err.message);
  process.exit(1);
}

if (files.length === 0) {
  console.error("❌ No files found in release-builds directory");
  process.exit(1);
}

console.log("📃 Files in release-builds directory:");
files.forEach((file) => {
  const stats = fs.statSync(path.join(__dirname, "../release-builds", file));
  const size = stats.size / (1024 * 1024); // Convert to MB
  console.log(`- ${file} (${size.toFixed(2)} MB)`);
});

console.log(
  "\n✅ Build test complete! Your electron-builder setup appears to be working correctly.",
);
console.log("You can find your build files in the release-builds directory.");

// Print helpful instructions
console.log("\n📝 Next steps:");
if (platform === "darwin") {
  console.log("- To test the macOS app: open release-builds/PasteMax.app");
  console.log("- To create a GitHub release, tag your commit and push:");
  console.log("  git tag v1.0.0");
  console.log("  git push origin v1.0.0");
} else if (platform === "win32") {
  console.log("- To test the Windows app: run release-builds\\PasteMax.exe");
  console.log("- To create a GitHub release, tag your commit and push:");
  console.log("  git tag v1.0.0");
  console.log("  git push origin v1.0.0");
} else {
  console.log("- To test the Linux app: run the AppImage in release-builds/");
  console.log("- To create a GitHub release, tag your commit and push:");
  console.log("  git tag v1.0.0");
  console.log("  git push origin v1.0.0");
}
