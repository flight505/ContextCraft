# ContextCraft

<div align="center">
  <img src="https://github.com/user-attachments/assets/db863f93-a022-47b8-bfe2-e8dfe4c0fcc1" alt="ContextCraft Logo" width="180">
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
  - Support for multiple models (GPT-3.5, GPT-4, Claude, etc.)
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

### Windows
Download the latest `.exe` installer from the [Releases](https://github.com/flight505/ContextCraft/releases) page

### macOS
Download the latest `.dmg` file from the [Releases](https://github.com/flight505/ContextCraft/releases) page

### Linux
Download the AppImage from the [Releases](https://github.com/flight505/ContextCraft/releases) page

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

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Built with ❤️ using Electron and React</p>
</div>