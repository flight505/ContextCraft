# Node-Gyp Setup Instructions

## Windows Setup

### 1. Install Build Tools (Choose One Option)

**Option A: Visual Studio (Recommended)**
- Download from [Visual Studio website](https://visualstudio.microsoft.com/)
- Select "Desktop development with C++" workload
- Includes full IDE and all necessary components

**Option B: Build Tools Only (Lighter Install)**
- Download [Visual C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- Select these workloads:
  - "C++ build tools"
  - "Windows 10/11 SDK"
  - "MSVC v143 - VS 2022 C++ x64/x86 build tools"

Both options provide the required compilers and tools. Visual Studio provides a full development environment, while Build Tools are sufficient for compilation.

### 2. Install Node-Gyp Globally
```cmd
npm install -g node-gyp
```

### 3. Find Node-Gyp Path
Choose one method:

**Command Prompt:**
```cmd
where node-gyp

# The path will show something like:
C:\Users\YourUsername\AppData\Roaming\npm\node-gyp.cmd
```

**PowerShell:**
```powershell
(Get-Command node-gyp).Path

# The path will show something like:
C:\Users\YourUsername\AppData\Roaming\npm\node-gyp.cmd
```

### 4. Update Configuration
Copy the path to `config/native-modules.json`:
```json
{
  "windows": {
    "visualStudioVersion": "2022",
    # Ensure to replace with \\
    "nodeGypPath": "C:\\Path\\To\\node-gyp.cmd"
  }
}
```

---

## macOS Setup

### 1. Install Xcode Command Line Tools
```bash
xcode-select --install
```

### 2. Install Node-Gyp Globally
```bash
npm install -g node-gyp
```

### 3. Find Node-Gyp Path
```bash
which node-gyp

# The path will show something like:
/usr/local/bin/node-gyp
```

### 4. Update Configuration
```json
{
  "mac": {
    "nodeGypPath": "/usr/local/bin/node-gyp"
  }
}
```

---

## Linux Setup

### 1. Install Build Tools
```bash
sudo apt-get update
sudo apt-get install build-essential python3
```

### 2. Install Node-Gyp Globally
```bash
npm install -g node-gyp
```

### 3. Find Node-Gyp Path
```bash
which node-gyp

# The path will show something like:
/usr/bin/node-gyp
```

### 4. Update Configuration
```json
{
  "linux": {
    "nodeGypPath": "/usr/bin/node-gyp"
  }
}
```

## Verification
After configuration, run:
```bash
npm run rebuild-native-modules