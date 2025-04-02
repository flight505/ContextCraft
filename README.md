# ContextCraft

<div align="center">
  <img src="https://github.com/user-attachments/assets/ecd72a53-65be-4175-9a03-2cf141948dae" alt="ContextCraft Logo" width="180">
  <p>A powerful code formatter and exporter for sharing code with AI models.</p>
</div>

## Overview

ContextCraft is a desktop application designed to help developers easily format and export their code for sharing with AI models like Claude, ChatGPT, and others. It provides an intuitive interface to select specific files from your project, generate file trees, add custom instructions, and export everything in a well-formatted manner that preserves context.

<div align="center">
 <img width="1028" alt="ContextCraft Interface" src="https://github.com/user-attachments/assets/93722108-6a85-441b-9514-286c4dde622c" />
</div>
## Features

- 🗂️ **Project Navigation**: Browse and select files from your project directory
- 🌲 **File Tree Generation**: Create an ASCII file tree representation of your project structure
- 🔍 **Smart Search**: Filter files by name or content
- 📝 **Custom Instructions**: Add context or specific instructions for AI models
- 🔄 **Multiple File Tree Modes**: None, Selected, Selected with Roots, Complete
- 🚫 **Ignore Patterns**: Configure glob patterns for files to exclude
- 🌗 **Light/Dark/System Theme**: Choose your preferred appearance mode
- 📊 **Token Counting**: Track token usage to stay within AI model limits
- 📋 **One-Click Copy**: Easily copy formatted output to clipboard

## Features in Detail

### 🎯 Smart Prompt Management
- **Built-in Templates**: Pre-configured prompts for common use cases like code review, bug fixing, and feature implementation
- **Custom Instructions**: Create and save your own prompt templates with placeholders for dynamic content
- **Context Variables**: Use variables like `{selected_files}`, `{file_tree}`, and `{custom_notes}` in your prompts
- **Preview Mode**: Real-time preview of how your prompt will look with the current selection

### 🌳 File Tree Visualization
- **Multiple View Modes**:
  - `None`: Clean output without directory structure
  - `Selected`: Show only chosen files in tree view
  - `Selected with Roots`: Display selected files with their parent directories
  - `Complete`: Full project structure visualization
- **Smart Path Display**: Automatically collapses long paths for better readability
- **Interactive Navigation**: Click to expand/collapse directories
- **Search & Filter**: Quickly find files with fuzzy search and pattern matching

### 📊 AI Model Integration
- **Token Management**:
  - Real-time token counting for selected content
  - Visual indicators for context limit warnings
  - Support for 290 models (GPT-4, o3, o1-pro, Claude 3.5 - 3.7, etc.)
  - Automatic content optimization suggestions when approaching limits
- **Model-Specific Features**:
  - Customizable context windows per model
  - Token budget allocation for responses
  - Smart content truncation to fit model limits

### ⚡ Code Optimization Tools
- **Smart Compression**:
  - Intelligent whitespace reduction
  - Comment density optimization
  - Import statement consolidation
  - Unused code detection
- **Content Filtering**:
  - Selective comment removal
  - Docstring preservation options
  - Keep/remove TODO markers
  - License and copyright notice handling
- **Format Controls**:
  - Preserve or strip markdown formatting
  - Code block style options
  - Line number inclusion toggle
  - Syntax highlighting preferences

### 🔧 Advanced Configuration
- **Ignore Patterns**:
  - GitIgnore-style pattern support
  - Custom exclusion rules
  - Directory-specific settings
  - Binary file handling
- **Output Formatting**:
  - Customizable indentation
  - Line ending normalization
  - Character encoding options
  - Maximum line length control

### 💾 Session Management
- **Workspace Memory**:
  - Auto-save selected files
  - Restore previous sessions
  - Multiple workspace support
  - Custom workspace naming
- **Export Options**:
  - Copy to clipboard
  - Save as markdown
  - Export as formatted text
  - Generate shareable links

## Installation

### macOS
Download the latest `.dmg` file from the [Releases](https://github.com/flight505/ContextCraft/releases) page

#### Alternative Installation Method
You can also download the `.zip` version instead of the `.dmg`. The ZIP version might be easier to open on some systems:
1. Download the latest `ContextCraft-[version]-arm64-mac.zip`
2. Double-click to extract it
3. Drag the extracted ContextCraft app to your Applications folder
4. Follow the same security bypass steps as with the DMG version

#### Important Note About Security on macOS
Since ContextCraft is not signed with an Apple Developer Certificate, you'll see a security warning when trying to open the app. This is normal and doesn't mean there's anything wrong with the application. To install:

1. Download the `.dmg` file
2. Double-click to mount the disk image
3. Drag ContextCraft to your Applications folder
4. When you first try to open the app, macOS will show a security warning
5. To open the app:
   - Right-click (or Control-click) ContextCraft in the Applications folder
   - Select "Open" from the context menu
   - Click "Open" in the security dialog
   - You only need to do this once; subsequent launches will work normally

Alternatively, you can:
1. Open System Settings
2. Go to Privacy & Security
3. Scroll down to the "Security" section
4. Click "Open Anyway" next to the message about ContextCraft

**Why this happens**: Apple requires apps to be signed with an Apple Developer Certificate ($99/year) and notarized for best security. We've chosen to distribute ContextCraft without this certification to keep it free and open source. The app is still safe to use; you're just bypassing Apple's verification system.

#### Installation Screenshots

<details>
<summary>Click to see what to expect during installation</summary>

1. Initial Security Warning:
   ```
   "ContextCraft" cannot be opened because the developer cannot be verified.
   macOS cannot verify that this app is free from malware.
   ```
   
2. Opening from Context Menu:
   - Right-click menu will show "Open" option
   - A dialog will appear with an "Open" button
   
3. Privacy & Security Settings:
   - Look for the message: "ContextCraft was blocked from use because it is not from an identified developer"
   - Click "Open Anyway" button
   
Note: These screenshots are from macOS Sonoma. The exact appearance might vary slightly depending on your macOS version.
</details>

### Windows
Download the latest Windows build from the [Releases](https://github.com/flight505/ContextCraft/releases) page. You have two options:

#### Option 1: Standard Installation (Recommended)
1. Download `ContextCraft-[version]-x64-setup.exe`
2. Double-click the installer
3. Follow the installation wizard
4. The app will be installed in your Program Files directory
5. Launch from the Start Menu or desktop shortcut

#### Option 2: Portable Version
1. Download `ContextCraft-[version]-x64-portable.exe`
2. Move the .exe file to your preferred location
3. Double-click to run directly - no installation needed
4. Can be moved between computers or run from a USB drive

#### Windows Security Notice
When running for the first time, Windows may show a SmartScreen warning:
1. Click "More info"
2. Click "Run anyway"
This happens because the app isn't signed with a Microsoft certificate. The app is safe to use, but Windows shows this warning for all new/unknown applications.

#### System Requirements
- Windows 10 or later (64-bit)
- 4GB RAM minimum (8GB recommended)
- 200MB free disk space

## Quick Start

1. **Select a Project**: Click "Select Folder" to choose your project directory
2. **Choose Files**: Select the files you want to include
3. **Configure**: Choose your file tree mode and add any custom instructions
4. **Export**: Click "Copy" to copy the formatted content
5. **Share**: Paste directly into your preferred AI model

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/flight505/ContextCraft.git
cd ContextCraft

# Install dependencies
npm install

# Start development
npm run dev:electron
```

### Building
```bash
# Build for all platforms
npm run package:all

# Or specific platforms
npm run package:mac
npm run package:win
npm run package:linux
```

## License

Compleatly rewritten by me and AI and it is compleatly free and open source.

For full disclosure, this is based on a video by Kevin Leneway, which you can find at https://www.youtube.com/@kevinleneway2290 
Follow his channel for more great content!
---

<div align="center">
  <p>Built with ❤️ using Electron and React</p>
</div>


## Credits

- [Kevin Leneway](https://github.com/flight505) - Original author of the ContextCraft project
- [ChatGPT](https://github.com/openai/chatgpt) - AI-powered code generation
- [Cursor](https://github.com/cursor-ai/cursor) - AI-powered code generation
