# ContextCraft

<div align="center">
  <img src="https://github.com/user-attachments/assets/ecd72a53-65be-4175-9a03-2cf141948dae" alt="ContextCraft Logo" width="180">
  <p>A powerful code formatter and exporter for sharing code with AI models.</p>
</div>

## Overview

ContextCraft is a desktop application designed to help developers easily format and export their code for sharing with AI models like Claude, ChatGPT, and others. It provides an intuitive interface to select specific files from your project, generate file trees, add custom instructions, and export everything in a well-formatted manner that preserves context.

<div align="center">
 <img width="1112" alt="ContextCraft Interface" src="https://github.com/user-attachments/assets/63ba9ede-76e7-41bb-a5c3-84dd59b78d9f" />
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

## Installation

### Windows
Download the latest `.exe` installer from the [Releases](https://github.com/flight505/contextcraft/releases) page

### macOS
Download the latest `.dmg` file from the [Releases](https://github.com/flight505/contextcraft/releases) page

### Linux
Download the AppImage from the [Releases](https://github.com/flight505/contextcraft/releases) page

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
git clone https://github.com/flight505/contextcraft.git
cd contextcraft

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

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Built with ❤️ using Electron and React</p>
</div>
