# ContextCraft Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Installation and Setup](#installation-and-setup)
   - [macOS Installation](#macos-installation)
   - [Windows Installation](#windows-installation)
   - [System Requirements](#system-requirements)
3. [User Interface Overview](#user-interface-overview)
   - [Main Application Window](#main-application-window)
   - [File Tree Panel](#file-tree-panel)
   - [Control Container](#control-container)
   - [Output Preview](#output-preview)
4. [Core Features](#core-features)
   - [Project Navigation](#project-navigation)
   - [File Selection](#file-selection)
   - [File Tree Generation](#file-tree-generation)
   - [Custom Instructions](#custom-instructions)
5. [Configuration Options](#configuration-options)
   - [Ignore Patterns](#ignore-patterns)
     - [Global vs. Local Patterns](#global-vs-local-patterns)
     - [Pattern Syntax](#pattern-syntax)
     - [System Patterns](#system-patterns)
   - [Output Formats](#output-formats)
   - [Theme Settings](#theme-settings)
6. [Context Optimization](#context-optimization)
   - [Code Compression](#code-compression)
   - [Comment Removal](#comment-removal)
   - [Token Counting](#token-counting)
   - [Model Context Length](#model-context-length)
7. [Effective AI Prompting](#effective-ai-prompting)
   - [Prompt Structure](#prompt-structure)
   - [Best Practices](#best-practices)
   - [Common Use Cases](#common-use-cases)
8. [Advanced Usage](#advanced-usage)
   - [Workspace Memory](#workspace-memory)
   - [Multiple Files Management](#multiple-files-management)
   - [Export Options](#export-options)
9. [Troubleshooting](#troubleshooting)
   - [Common Issues](#common-issues)
   - [FAQ](#faq)
10. [Developer Reference](#developer-reference)
    - [Building from Source](#building-from-source)
    - [Project Architecture](#project-architecture)
    - [Contributing](#contributing)

## Introduction

ContextCraft is a powerful desktop application designed to help developers efficiently format and export code for sharing with AI models like Claude, ChatGPT, and others. It provides an intuitive interface to browse your project, select specific files, generate file trees, add custom instructions, and export everything in a well-formatted manner that preserves context.

The application addresses several key challenges developers face when working with AI coding assistants:

1. **Context Management**: AI models have context length limitations. ContextCraft helps you select exactly what's needed and optimize for token usage.

2. **Code Organization**: The file tree feature provides AI models with structural context, improving their understanding of your codebase.

3. **Format Consistency**: The application ensures your code is presented consistently to AI models regardless of your IDE or file structure.

4. **Optimization**: Features like code compression and comment removal help you fit more code within AI context limits while preserving important information.

Whether you're seeking code reviews, asking for implementation help, or troubleshooting bugs, ContextCraft streamlines the process of sharing your code with AI assistants, leading to more accurate and helpful responses.

The following documentation provides a comprehensive guide to installing, configuring, and using ContextCraft to maximize your productivity when working with AI coding assistants.

## Installation and Setup

ContextCraft is available for both macOS and Windows platforms. Follow the instructions below for your specific operating system to get started.

### macOS Installation

There are two methods to install ContextCraft on macOS:

#### DMG Installation (Recommended)

1. Download the latest `.dmg` file from the [Releases page](https://github.com/flight505/ContextCraft/releases).
2. Double-click the downloaded `.dmg` file to mount the disk image.
3. Drag the ContextCraft application to your Applications folder.
4. When first launching the app, you may encounter a security warning since ContextCraft is not signed with an Apple Developer Certificate.

To resolve this security warning:
   - Right-click (or Control-click) ContextCraft in the Applications folder
   - Select "Open" from the context menu
   - Click "Open" in the security dialog that appears
   - You only need to perform this step once; subsequent launches will work normally

Alternatively, you can:
1. Open System Settings
2. Go to Privacy & Security
3. Scroll down to the "Security" section
4. Click "Open Anyway" next to the message about ContextCraft

#### ZIP Installation

If you encounter issues with the DMG method:

1. Download the latest `ContextCraft-[version]-arm64-mac.zip` from the [Releases page](https://github.com/flight505/ContextCraft/releases).
2. Double-click to extract the ZIP file.
3. Drag the extracted ContextCraft app to your Applications folder.
4. Follow the same security bypass steps as with the DMG version.

> **Note about macOS Security**: Apple requires apps to be signed with an Apple Developer Certificate ($99/year) and notarized for best security. ContextCraft is distributed without this certification to keep it free and open source. The app is still safe to use; you're simply bypassing Apple's verification system.

### Windows Installation

ContextCraft provides two installation options for Windows users:

#### Standard Installation (Recommended)

1. Download `ContextCraft-[version]-x64-setup.exe` from the [Releases page](https://github.com/flight505/ContextCraft/releases).
2. Double-click the installer file.
3. Follow the installation wizard's instructions.
4. The app will be installed in your Program Files directory.
5. Launch ContextCraft from the Start Menu or desktop shortcut.

#### Portable Version

For users who prefer not to install applications:

1. Download `ContextCraft-[version]-x64-portable.exe` from the [Releases page](https://github.com/flight505/ContextCraft/releases).
2. Move the .exe file to your preferred location.
3. Double-click to run directly - no installation needed.
4. This version can be moved between computers or run from a USB drive.

> **Windows Security Notice**: When running for the first time, Windows may show a SmartScreen warning. Click "More info" and then "Run anyway" to proceed. This happens because the app isn't signed with a Microsoft certificate, which is common for many legitimate applications.

### System Requirements

#### macOS
- macOS 10.15 (Catalina) or later
- 4GB RAM minimum (8GB recommended)
- 200MB free disk space
- Both Intel and Apple Silicon (M1/M2/M3) processors supported

#### Windows
- Windows 10 or later (64-bit)
- 4GB RAM minimum (8GB recommended)
- 200MB free disk space
- Intel or AMD 64-bit processor

#### General Requirements
- Active internet connection (for model information updates)
- Modern web browser engine (included with the application)
- Permission to access local files

## User Interface Overview

The ContextCraft user interface is designed to be intuitive and efficient, providing all the tools you need to select and format your code for AI interactions. This section provides an overview of the main components of the interface.

### Main Application Window

The ContextCraft application window is divided into several key areas:

![ContextCraft Main Window](https://github.com/user-attachments/assets/24a71305-eeb2-4468-9344-18ab874bc544)

1. **Sidebar**: Located on the left side, this panel contains the folder browser and file selection tools.
2. **File Tree**: The central panel displays your project files in a hierarchical tree structure.
3. **Control Container**: The right panel provides configuration options, format controls, and export buttons.
4. **Custom Instructions**: A collapsible panel for adding prompts and instructions to include with your code.
5. **Status Bar**: Shows token counts, processing status, and other information at the bottom of the application.

### File Tree Panel

The File Tree panel is the central component of the ContextCraft interface, displaying your project's files and directories in a hierarchical structure.

Key features of the File Tree panel include:

1. **Checkboxes**: Click checkboxes to select or deselect files for inclusion in your output.
2. **Folder Expansion**: Click on folder names or the chevron icon to expand/collapse directories.
3. **Folder Selection**: Checking a folder automatically selects all eligible files within it.
4. **Indentation**: The tree uses indentation to represent the directory hierarchy.
5. **File Icons**: Different icons represent files and folders for easy visual identification.
6. **Token Counts**: Files display their token counts in parentheses next to their names.
7. **Exclusion Indicators**: Files excluded by ignore patterns show an "Excluded" label.

The file tree supports keyboard navigation:
- Use arrow keys to move up and down the tree
- Use right arrow to expand a folder and left arrow to collapse it
- Use space to select/deselect the current item

### Control Container

The Control Container panel provides access to ContextCraft's configuration options and export functionality:

1. **File Tree Mode**: A dropdown to select how the file tree is displayed in the output:
   - **None**: No file tree is included in the output
   - **Selected Only**: Only selected files are shown in the tree
   - **Selected with Path**: Selected files with their parent directories
   - **Complete Tree**: The full project structure

2. **Output Format**: Choose between different output formats:
   - **XML**: Structured format with clear sections
   - **Markdown**: Readable format with code blocks
   - **Plain Text**: Simple text format with separators

3. **Model Selection**: Choose the target AI model to optimize for:
   - Models are fetched from OpenRouter API
   - Each model displays its name and context limit
   - The selected model determines token count warnings

4. **Context Optimization**: Tools to reduce token usage:
   - **Compression**: Toggle to enable function body compression
   - **Comment Removal**: Toggle to remove comments from code
   - **Keep Docstrings**: Option to preserve documentation comments

5. **Token Usage Bar**: Visual indicator showing what percentage of the selected model's context limit is being used.

6. **Action Buttons**: 
   - **Copy**: Copy formatted output to clipboard
   - **Download**: Save formatted output as a file

### Output Preview

While ContextCraft doesn't display a direct preview of the final output in the main interface, the token count and percentage indicators give you immediate feedback on how much of your selected model's context window you're utilizing.

The token usage bar changes color based on usage:
- **Green**: Safe usage (under 75% of the limit)
- **Yellow**: Approaching limit (75-95% of the limit)
- **Red**: At or exceeding limit (over 95% of the limit)

The application also provides real-time feedback during operations with status messages and toast notifications for important events.

## Core Features

ContextCraft provides several core features that work together to create optimized code snippets for AI model interactions. This section details these features and how to use them effectively.

### Project Navigation

The project navigation system in ContextCraft makes it easy to browse and select the files you want to include in your AI prompts.

#### Selecting a Project Folder

1. Click the "Select Folder" button in the sidebar.
2. Use your system's file browser to navigate to and select your project's root directory.
3. Click "Open" to load the project.

Once a project is loaded, ContextCraft scans the directory structure and displays all available files that aren't excluded by ignore patterns. The application remembers your last selected project when you reopen it.

#### Searching for Files

To quickly find specific files in your project:

1. Use the search bar at the top of the sidebar.
2. Type a search term - this will filter files by name.
3. The file tree updates in real-time as you type.
4. Clear the search field or click the X button to show all files again.

The search functionality supports:
- Partial matches (typing "comp" will find "component.tsx")
- Case-insensitive searching
- Path-based searching (typing "src/utils" will show all files in that directory)

### File Selection

ContextCraft provides intuitive ways to select the specific files you want to include in your AI context:

#### Individual File Selection

1. Click the checkbox next to a file name to select it.
2. Click again to deselect it.
3. Selected files are highlighted in the file tree.

#### Directory Selection

1. Click the checkbox next to a directory name to select all files within it.
2. If some files in a directory are excluded by ignore patterns, they won't be selected.
3. Directories with partial selection show a partially-filled checkbox.

#### Bulk Operations

- **Select All**: Use Ctrl+A (Windows) or Cmd+A (Mac) to select all visible files.
- **Deselect All**: Click the clear selection button (X icon) in the sidebar header.
- **Invert Selection**: Use the context menu (right-click) on the file tree and select "Invert Selection".

The sidebar shows a count of how many files are currently selected, and the total token count updates automatically as you change your selection.

### File Tree Generation

The file tree feature helps AI models understand the structure of your project by providing a visual representation of your file organization.

#### File Tree Modes

ContextCraft offers four different modes for generating file trees:

1. **None**: No file tree is included in the output. Use this when you only want to share specific files without structural context.

2. **Selected Only**: Only the files you've selected appear in the tree. This creates a minimal tree showing just the files you're sharing, with no additional structural context.

3. **Selected with Path**: Shows selected files along with their parent directories. This provides more context than "Selected Only" by showing the path to each file, but doesn't include unselected siblings.

4. **Complete Tree**: Displays your entire project structure, with selected files highlighted. This gives the AI the most complete picture of your project organization.

Example of the "Selected with Path" mode:

```
project-root/
├── src/
│   ├── components/
│   │   └── Button.tsx
│   └── utils/
│       └── helpers.ts
└── package.json
```

To change the file tree mode:
1. Locate the "File Tree Mode" dropdown in the Control Container.
2. Click to open the dropdown menu.
3. Select your preferred mode from the options.

The file tree is automatically generated based on your selection and included in the exported output.

### Custom Instructions

The Custom Instructions feature allows you to add text that provides context, asks questions, or gives specific directions to the AI model alongside your code.

To add custom instructions:

1. Click the "Show Instructions" toggle in the Control Container if the instructions panel is not visible.
2. Enter your text in the instructions editor.
3. Format your text as needed using plain text or markdown formatting.

Effective uses for custom instructions include:

- **Context**: Explain what the code does, its purpose, or relevant background information.
  ```
  This is a React component library for a dashboard application. The components follow the company's design system.
  ```

- **Questions**: Ask specific questions about the code.
  ```
  Can you identify any performance issues in the DataTable component? How would you optimize the rendering?
  ```

- **Directives**: Give specific tasks for the AI to perform.
  ```
  Please review the authentication logic in auth.js for security vulnerabilities and suggest improvements.
  ```

- **Templates**: Use predefined templates for common scenarios (if supported in your version).

Your custom instructions will be included in the formatted output, clearly separated from the code content to help guide the AI's analysis and responses.

## Configuration Options

ContextCraft provides various configuration options to customize how your code is processed, formatted, and presented to AI models. This section covers the key configuration features.

### Ignore Patterns

Ignore patterns allow you to exclude certain files and directories from being displayed in ContextCraft. This helps keep your project view clean and focused on relevant code files.

#### Global vs. Local Patterns

ContextCraft supports two levels of ignore patterns:

1. **Global Patterns**: Apply to all projects you open with ContextCraft.
   - Ideal for common files you always want to exclude (like node_modules, .git)
   - Stored in the application's settings
   - Apply consistently across different projects

2. **Local Patterns**: Apply only to the specific project folder currently open.
   - Useful for project-specific exclusions
   - Stored in the context of the current project
   - Don't affect other projects you open with ContextCraft

To access and edit ignore patterns:

1. Click the "Ignore Patterns" icon in the sidebar.
2. Switch between "Global" and "Local" tabs to edit the respective patterns.
3. Make your changes in the editor.
4. Click "Apply Patterns" to save changes and update the file tree.

#### Pattern Syntax

ContextCraft uses glob pattern syntax for ignore rules, similar to .gitignore files:

- `*` - Matches any number of characters except `/`
- `**` - Matches any number of characters including `/`
- `?` - Matches a single character except `/`
- `[abc]` - Matches one character given in the bracket
- `{foo,bar}` - Matches either "foo" or "bar"

Common pattern examples:

```
# Ignore all .log files
*.log

# Ignore node_modules anywhere in the project
**/node_modules/**

# Ignore specific directory
dist/

# Ignore specific file
config.private.json

# Negate a pattern (include a file that would otherwise be ignored)
!important.log
```

#### System Patterns

ContextCraft includes predefined system patterns that exclude common non-code files and directories. These are grouped into categories:

1. **Version Control**: `.git/`, `.svn/`, etc.
2. **Build Output**: `node_modules/`, `dist/`, `build/`, etc.
3. **Caches**: `.cache/`, `__pycache__/`, etc.
4. **Logs**: `logs/`, `*.log`, etc.
5. **IDE**: `.idea/`, `.vscode/`, etc.
6. **Temporary**: `tmp/`, `temp/`, etc.
7. **OS**: `.DS_Store`, `Thumbs.db`, etc.

You can:
- Enable/disable entire categories of system patterns
- Enable/disable individual system patterns
- Add your own patterns to supplement the system ones

Best practices for ignore patterns:

- Start with the default system patterns
- Add global patterns for types of files you never want to include
- Use local patterns for project-specific exclusions
- Be specific to avoid accidentally excluding important files
- Test your patterns using the "Test Patterns" button

### Output Formats

ContextCraft provides multiple output formats to accommodate different AI tools and preferences:

#### XML Format

The XML format provides a structured, clearly separated representation of your code:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<pastemax-export>
  <metadata>
    <timestamp>2023-10-18T14:30:22.123Z</timestamp>
    <file_count>3</file_count>
    <base_folder>/Users/username/Projects/my-app</base_folder>
  </metadata>

  <instructions>
    <![CDATA[Please review this React component for best practices.]]>
  </instructions>

  <directory_structure>
    <![CDATA[
    my-app/
    ├── src/
    │   └── components/
    │       └── Button.tsx
    ├── package.json
    └── tsconfig.json
    ]]>
  </directory_structure>

  <files>
    <file path="src/components/Button.tsx" token_count="245">
      <![CDATA[
      import React from 'react';
      
      interface ButtonProps {
        // Button props definition
      }
      
      export const Button: React.FC<ButtonProps> = ({ children }) => {
        return <button>{children}</button>;
      };
      ]]>
    </file>
    <!-- Additional files... -->
  </files>
</pastemax-export>
```

Benefits of XML format:
- Clear separation of metadata, instructions, structure, and code
- CDATA sections preserve formatting and special characters
- Machine-readable structure

#### Markdown Format

The Markdown format creates a more readable, visually appealing representation:

```markdown
# PasteMax Export

## Metadata
- **Timestamp:** 2023-10-18T14:30:22.123Z
- **File Count:** 3
- **Base Folder:** `/Users/username/Projects/my-app`

## Instructions

Please review this React component for best practices.

## Directory Structure

```
my-app/
├── src/
│   └── components/
│       └── Button.tsx
├── package.json
└── tsconfig.json
```

## Files

### src/components/Button.tsx
Token count: 245

```tsx
import React from 'react';

interface ButtonProps {
  // Button props definition
}

export const Button: React.FC<ButtonProps> = ({ children }) => {
  return <button>{children}</button>;
};
```

<!-- Additional files... -->
```

Benefits of Markdown format:
- Excellent readability in most AI chat interfaces
- Syntax highlighting in code blocks
- Easy to edit manually if needed
- Well-supported by most documentation systems

#### Plain Text Format

A simple text format with clear separators:

```
================================================================================
PASTEMAX EXPORT
================================================================================

METADATA
================================================================================
Timestamp: 2023-10-18T14:30:22.123Z
File Count: 3
Base Folder: /Users/username/Projects/my-app

================================================================================
INSTRUCTIONS
================================================================================
Please review this React component for best practices.

================================================================================
DIRECTORY STRUCTURE
================================================================================
my-app/
├── src/
│   └── components/
│       └── Button.tsx
├── package.json
└── tsconfig.json

================================================================================
FILES
================================================================================
File: src/components/Button.tsx
Token Count: 245
================================================================================
import React from 'react';

interface ButtonProps {
  // Button props definition
}

export const Button: React.FC<ButtonProps> = ({ children }) => {
  return <button>{children}</button>;
};

<!-- Additional files... -->
```

Benefits of Plain Text format:
- Works well with any AI interface regardless of markdown support
- Clean, consistent formatting with clear section separators
- Minimal overhead in terms of formatting characters

To select an output format:
1. Find the "Output Format" dropdown in the Control Container.
2. Click to open the dropdown menu.
3. Select your preferred format.

### Theme Settings

ContextCraft offers theme options to match your preferred visual style:

1. **Light Theme**: Bright background with dark text, ideal for high-contrast environments.
2. **Dark Theme**: Dark background with light text, reduces eye strain in low-light environments.
3. **System Theme**: Automatically matches your operating system's theme setting.

To change the theme:
1. Click the theme toggle button in the application header.
2. Select your preferred theme option.

The theme preference is saved and will be remembered the next time you launch ContextCraft.

## Context Optimization

One of ContextCraft's most powerful features is its ability to optimize code for AI context windows. This section explains the various optimization features and how to use them effectively.

### Code Compression

Code compression is a technique that reduces token usage by replacing function and method bodies with placeholder comments while preserving signatures, types, and important structural elements.

#### How Code Compression Works

When enabled, ContextCraft analyzes your code and:

1. Identifies function bodies, method implementations, and class bodies
2. Replaces the implementation details with a brief comment (`/* ... */`)
3. Preserves function signatures, parameters, return types, and exports
4. Maintains the overall structure while reducing token usage

Before compression:
```javascript
function calculateTotal(items) {
  let sum = 0;
  for (let i = 0; i < items.length; i++) {
    sum += items[i].price * items[i].quantity;
    if (items[i].taxable) {
      sum += items[i].price * items[i].quantity * 0.08;
    }
  }
  return sum.toFixed(2);
}
```

After compression:
```javascript
function calculateTotal(items) {
  /* Implementation compressed to save tokens */
}
```

#### Configuring Compression

To enable and configure code compression:

1. In the Control Container, find the "Compression" toggle and enable it.
2. Optionally, configure these additional settings (if available in your version):
   - **Minimum Token Threshold**: Only compress functions larger than this threshold
   - **Keep Docstrings**: Preserve documentation comments when compressing
   - **Remove Empty Lines**: Remove blank lines to further reduce tokens
   - **Never Compress Patterns**: Specify files or patterns that should never be compressed

#### Benefits and Trade-offs

Benefits:
- Can reduce token usage by 30-80% depending on your codebase
- Preserves API signatures and structural information
- Allows including more files within the same token budget

Trade-offs:
- Implementation details are not available to the AI
- May not be suitable when you need the AI to analyze specific function logic
- Some language features might not be properly recognized in all languages

Best Practice: Enable compression when you need to give the AI a broad overview of your codebase structure, or when you're primarily asking about interfaces, APIs, and architectural concerns rather than implementation details.

### Comment Removal

The comment removal feature further reduces token usage by excluding comments from your code while preserving the actual code functionality.

#### How Comment Removal Works

When enabled, ContextCraft:

1. Parses your code using language-specific analyzers
2. Identifies and removes single-line and multi-line comments
3. Optionally preserves docstrings (documentation comments)
4. Returns the cleaned code without modifying the functional logic

Before comment removal:
```javascript
/**
 * Calculates the total price including tax
 * @param {Array} items - Array of items with price and quantity
 * @returns {string} Formatted price with 2 decimal places
 */
function calculateTotal(items) {
  let sum = 0; // Initialize sum
  // Loop through each item
  for (let i = 0; i < items.length; i++) {
    sum += items[i].price * items[i].quantity;
    // Add tax if applicable
    if (items[i].taxable) {
      sum += items[i].price * items[i].quantity * 0.08;
    }
  }
  return sum.toFixed(2); // Format to 2 decimal places
}
```

After comment removal (with docstrings preserved):
```javascript
/**
 * Calculates the total price including tax
 * @param {Array} items - Array of items with price and quantity
 * @returns {string} Formatted price with 2 decimal places
 */
function calculateTotal(items) {
  let sum = 0;
  for (let i = 0; i < items.length; i++) {
    sum += items[i].price * items[i].quantity;
    if (items[i].taxable) {
      sum += items[i].price * items[i].quantity * 0.08;
    }
  }
  return sum.toFixed(2);
}
```

#### Configuring Comment Removal

To enable and configure comment removal:

1. In the Control Container, find the "Remove Comments" toggle and enable it.
2. Use the "Keep Docstrings" option to preserve documentation comments (recommended).

This feature supports various programming languages, including:
- JavaScript/TypeScript
- Python
- HTML/CSS
- Java
- C/C++
- And more

#### Benefits and Trade-offs

Benefits:
- Reduces token usage while preserving code functionality
- Removes potentially outdated or misleading comments
- Can be combined with code compression for maximum token savings

Trade-offs:
- Removes potentially helpful context from inline comments
- May make code harder for the AI to understand without explanatory comments
- Implementation details might be less clear without explanatory comments

Best Practice: Enable comment removal with "Keep Docstrings" turned on. This preserves important documentation about function purpose and parameters while eliminating less critical inline comments.

### Token Counting

ContextCraft provides real-time token counting to help you stay within AI model context limits.

#### How Token Counting Works

Token counting in ContextCraft:

1. Analyzes each file to count tokens based on model tokenization rules
2. Displays individual file token counts in the file tree
3. Provides a total token count for all selected files
4. Shows a visual indicator of how much of the selected model's context limit you're using

The token counting is an estimation that closely matches the tokenization algorithms used by major AI models. It's not exact but provides a reliable gauge for planning your context usage.

#### Token Count Display

ContextCraft displays token information in several places:

1. **File Tree**: Each file shows its token count in parentheses next to the filename
2. **Status Bar**: Shows the total token count for all selected files
3. **Token Usage Bar**: Visual indicator showing the percentage of the model's context limit being used
4. **Model Selection**: Displays the context length of each available model

The token usage bar changes color based on your usage:
- **Green**: Safe usage (under 75% of the context limit)
- **Yellow**: Approaching the limit (75-95% of the limit)
- **Red**: At or exceeding the limit (over 95% of the limit)

#### Token Calculation Considerations

Token counting is affected by several factors:

- **File Content**: Longer files with more text use more tokens
- **Language**: Different programming languages tokenize differently
- **Compression**: Enabling code compression can significantly reduce token counts
- **Comment Removal**: Removing comments further reduces token usage
- **File Tree Mode**: More comprehensive file trees use additional tokens
- **Custom Instructions**: Instructions count toward your total token usage
- **Output Format**: Different output formats have slightly different overhead

Best Practice: Monitor the token usage bar as you add files to your selection. If you approach the limit, consider enabling compression, removing comments, or being more selective about which files to include.

### Model Context Length

Different AI models have different context length limitations. ContextCraft helps you target specific models and optimize for their constraints.

#### Supported Models

ContextCraft fetches model information from the OpenRouter API, providing access to a wide range of models including:

- OpenAI's GPT models (GPT-4o, GPT-4-turbo, etc.)
- Anthropic's Claude models (Claude 3.5 Sonnet, Claude 3 Opus, etc.)
- Other compatible models available through OpenRouter

Each model entry shows:
- **Model Name**: The name of the model
- **Context Length**: The maximum number of tokens the model can process

#### Selecting a Target Model

To select your target model:

1. In the Control Container, find the "Model" dropdown
2. Click to open the model selection menu
3. Search for a specific model if needed
4. Select your desired model from the list

The application will update its token usage display based on the selected model's context length.

#### Working with Context Limits

When working with context limits:

1. **Be selective**: Choose only the files that are directly relevant to your task
2. **Use compression**: Enable code compression for structural overview
3. **Remove comments**: Toggle comment removal to reduce tokens
4. **Prioritize important files**: Place the most critical files first in your selection
5. **Monitor the token bar**: Keep an eye on the token usage indicator
6. **Use ignore patterns**: Exclude irrelevant files from view
7. **Consider using multiple prompts**: For very large projects, you may need to split your context into multiple, focused prompts

Best Practice: When approaching the limit, use a combination of compression, comment removal, and more selective file inclusion rather than trying to fit too much into a single prompt. Well-focused prompts with the right context typically yield better results than overstuffed prompts that approach the model's limits.

## Effective AI Prompting

ContextCraft not only helps you format and export code but also aids in crafting effective prompts for AI coding assistants. This section provides guidance on how to structure prompts and get the most out of your AI interactions.

### Prompt Structure

A well-structured prompt leads to better AI responses. When using ContextCraft, consider organizing your prompts with these components:

#### 1. Context Setting

Start with a brief explanation of what your code does and its purpose:

```
This is a React application that manages a product inventory system. The codebase uses Redux for state management and React Router for navigation.
```

#### 2. Technical Background

Provide relevant technical details that help the AI understand your environment:

```
We're using React 18.2, TypeScript 4.9, and Node.js 18. The project follows a feature-based organization pattern, and we use the Material-UI component library.
```

#### 3. Clear Instructions

Be specific about what you want the AI to do:

```
Please review the ProductList component and its related reducer. I'm particularly interested in:
1. Performance optimizations for the filtering logic
2. Better ways to handle the loading/error states
3. Any potential bugs in the pagination implementation
```

#### 4. Relevant Files

ContextCraft will include your selected files, but you can guide the AI's attention:

```
The main files to focus on are:
- src/features/products/ProductList.tsx (the component with filtering/pagination)
- src/features/products/productsSlice.ts (the Redux reducer)
- src/api/productService.ts (API integration)
```

#### 5. Specific Questions

End with specific questions to get targeted answers:

```
Specific questions:
1. Is our approach to debouncing the search input optimal?
2. How can we improve the memoization in the filteredProducts selector?
3. Are there more efficient ways to handle the batch loading of product images?
```

### Best Practices

Follow these best practices to get high-quality responses from AI coding assistants:

#### Be Concise but Complete

- Include necessary context but avoid overwhelming the AI with irrelevant details
- Focus on the specific problem or question you want help with
- Use compression features to include more structural context without using tokens on implementation details

Example of a concise opener:

```
I'm debugging a memory leak in a React application that uses custom hooks for data fetching. I've narrowed it down to the useProductData hook, which doesn't seem to clean up properly.
```

#### Use Technical Precision

- Use correct technical terminology
- Specify versions of libraries and frameworks
- Include relevant error messages or logs

Example:

```
We're seeing this error in React 18.2 when using Suspense with a custom data fetching hook:

Error: A component suspended while responding to synchronous input.
```

#### Frame the Problem Clearly

- State what you're trying to accomplish
- Explain what you've already tried
- Specify any constraints or requirements

Example:

```
I need to implement a file upload feature that:
1. Supports multiple files (up to 10)
2. Validates file types (only PDFs and images)
3. Shows upload progress
4. Must work in IE11

I've tried using the basic file input and FormData, but I'm running into cross-browser issues.
```

#### Provide Context for Code Review

When requesting a code review, specify what aspects you'd like feedback on:

```
Please review this authentication middleware with a focus on:
- Security best practices
- Error handling
- Performance considerations
- JWT implementation
```

#### Set the Right Scope

Use ContextCraft's file selection to set an appropriate scope:

- **Too narrow**: Including only a single component without its dependencies
- **Too broad**: Including the entire codebase with dozens of files
- **Just right**: Including the main file plus directly related dependencies

### Common Use Cases

Here are effective prompting strategies for common use cases with ContextCraft:

#### Code Review

```
Please review the attached React component for:
1. Best practices and code quality
2. Performance optimizations
3. Accessibility issues
4. Potential bugs or edge cases

I'm particularly concerned about the useEffect dependencies and the callback handling.
```

#### Bug Troubleshooting

```
I'm encountering a bug where the user authentication state is lost after navigating between pages. 

The issue appears to be related to how the AuthContext provider is set up or how the auth state is persisted. I've included the AuthContext, AuthProvider, and the login/logout functions.

What might be causing this issue and how can I fix it?
```

#### Feature Implementation

```
I need to implement a data export feature that allows users to download their data in CSV and JSON formats. 

I've included our current API service, the data models, and the UI components where this feature needs to be integrated.

Could you suggest an implementation approach and provide sample code for:
1. The API service method
2. The UI components for format selection and download
3. Any necessary helper functions for data formatting
```

#### Architecture Advice

```
We're planning to refactor our state management approach. Currently, we use Redux but are considering React Query for server state and Context for local UI state.

I've included examples of our current Redux setup, API services, and component usage patterns.

What are the pros and cons of this approach? How would you recommend structuring the transition to minimize disruption?
```

#### Learning and Understanding

```
I'm trying to understand how the routing configuration works in this codebase. I've included the router setup, route definitions, and some components that use routing.

Could you explain:
1. How the route protection/guards are implemented
2. How the nested routes are structured
3. How the route parameters are passed and accessed
4. What the withRouter HOC is doing in these components
```

#### Performance Optimization

```
The product listing page has performance issues when loading large datasets. I've included the component, its hooks, and the data service.

The main issues appear to be:
1. Slow initial render (> 2 seconds)
2. Laggy scrolling with many items
3. Delayed response when filtering

Please analyze the code and suggest specific optimizations to address these performance issues.
```

By combining ContextCraft's formatting capabilities with these prompting strategies, you'll be able to get more accurate, helpful responses from AI coding assistants, saving time and improving your development workflow.

## Advanced Usage

This section covers advanced features and techniques for getting the most out of ContextCraft in your day-to-day development workflow.

### Workspace Memory

ContextCraft includes workspace memory features that remember your selections and settings between sessions, making it more efficient to work with the same codebase over time.

#### Saved Selections

The application automatically remembers:

1. **Last Selected Folder**: The most recently opened project directory
2. **Selected Files**: Which files you had checked in your last session
3. **Expanded Folders**: Which directories were expanded in the file tree
4. **Search Terms**: Any active search filters
5. **Sort Order**: How files were sorted in the tree view
6. **Ignore Patterns**: Both global and local ignore patterns

This means you can close the application and return later to find your workspace in the same state you left it.

#### Multiple Workspace Support

If you work with multiple projects, ContextCraft maintains separate memory states for each project folder:

1. Each project folder maintains its own:
   - Selected files
   - Expanded directory state
   - Local ignore patterns
   - Sort preferences

2. Global settings are shared across workspaces:
   - Global ignore patterns
   - Theme preferences
   - Selected model
   - Output format preference

#### Clearing Workspace Memory

To reset workspace memory:

1. **For the current project**:
   - Use the "Reset Selection" button in the sidebar
   - This clears selected files but maintains other settings

2. **For all projects**:
   - In the application menu, choose "Reset All Settings" (if available)
   - Or manually clear localStorage in your browser developer tools

### Multiple Files Management

Working with multiple files efficiently is a key benefit of using ContextCraft. Here are advanced techniques for managing multiple files:

#### Selection Strategies

For complex projects, consider these selection strategies:

1. **Layered Approach**: 
   - First, select high-level files that provide context (e.g., README.md, package.json)
   - Then add core architectural files (e.g., main components, service definitions)
   - Finally, add specific implementation files related to your question

2. **Feature-Based Selection**:
   - Identify all files related to a specific feature
   - Include both frontend and backend components if relevant
   - Select files across different layers (UI, logic, data, tests)

3. **Problem-Centric Selection**:
   - Focus on files directly related to the problem you're solving
   - Include files where errors occur and related dependencies
   - Add test files that demonstrate the expected behavior

#### Bulk Operations

For efficient file management:

1. **Select by Pattern**: Use the search function with common prefixes to find related files
   - Example: Search for "auth" to find all authentication-related files

2. **Directory-Based Selection**: Select entire directories when you need all files in a module
   - Example: Select the entire "src/components/forms" directory

3. **Selection Toggle**: Use Ctrl+Click (or Cmd+Click on Mac) to toggle multiple individual files without affecting other selections

4. **Selection by File Type**: Use search with file extensions
   - Example: Search for ".test." to find all test files

#### Managing Large Codebases

For very large projects:

1. **Use Targeted Folders**: Instead of opening the entire project, open specific subdirectories
   - Example: Open just the "src/features/billing" directory for billing-related questions

2. **Progressive Loading**: Start with a minimal selection and add more files only as needed

3. **Leverage Compression**: Always use compression when dealing with large codebases to include more structural context

4. **Split by Concern**: Create separate exports for different aspects of your application
   - One export for the data model
   - Another for the UI components
   - A third for the business logic

### Export Options

ContextCraft provides several options for exporting your selected code and context.

#### Copy to Clipboard

The primary export method is copying to the clipboard:

1. Select your files and configure output options
2. Click the "Copy" button in the Control Container
3. The formatted output is copied to your clipboard
4. Paste directly into your AI assistant chat

This method is ideal for:
- Direct interaction with web-based AI tools
- Quick iterations on your prompt
- Sharing in messaging applications or emails

#### Download as File

For longer prompts or to save for later:

1. Select your files and configure output options
2. Click the "Download" button in the Control Container
3. Choose a save location in the file dialog
4. The output is saved as a text file with a timestamp in the filename

This method is useful for:
- Preserving complex prompts for later use
- Sharing prompts with team members
- Documenting your interactions with AI assistants
- Prompts that exceed clipboard size limits

#### Format Optimization

Tips for optimizing your exports by format:

1. **XML Format**:
   - Best for structured data that may need parsing
   - Useful when you need to clearly separate metadata from content
   - Provides the cleanest file/section boundaries

2. **Markdown Format**:
   - Optimal for most modern AI chat interfaces
   - Provides syntax highlighting in code blocks
   - Maintains readability even in plain text environments
   - Best choice for most general use cases

3. **Plain Text Format**:
   - Most compatible with all systems
   - Minimizes formatting overhead
   - Good for AI systems with limited markdown support
   - Simpler parsing for programmatic usage

#### Command Line Integration (Advanced)

For power users (if available in your version):

1. Use the command line interface to automate exports:
   ```bash
   contextcraft export --directory ./my-project --files "src/app.js,src/utils/*.js" --format markdown --output prompt.md
   ```

2. Integrate with scripts or development workflows:
   ```bash
   # Example script to generate a code review prompt
   FILES=$(git diff --name-only main)
   contextcraft export --files "$FILES" --instructions "Review these changes" --output review-prompt.md
   ```

This advanced usage enables integration with git workflows, CI/CD pipelines, or custom development scripts.

## Troubleshooting

Even well-designed applications sometimes encounter issues. This section covers common problems you might encounter while using ContextCraft and provides solutions.

### Common Issues

#### Application Won't Start

If ContextCraft fails to launch:

1. **macOS Security Restrictions**:
   - Problem: "App cannot be opened because the developer cannot be verified"
   - Solution: Right-click (or Control-click) the app and select "Open" from the context menu
   - Alternative: Go to System Settings > Privacy & Security and click "Open Anyway"

2. **Windows SmartScreen Warning**:
   - Problem: "Windows protected your PC" message
   - Solution: Click "More info" and then "Run anyway"

3. **Application Crashes on Launch**:
   - Problem: Application immediately closes after opening
   - Solutions:
     - Restart your computer
     - Reinstall the application using the latest version
     - Check system requirements to ensure compatibility

#### No Files Shown After Opening a Folder

If no files appear in the file tree after selecting a folder:

1. **Permissions Issues**:
   - Problem: The app doesn't have permission to read the directory
   - Solution: Ensure the app has file system access permissions in your OS settings

2. **Ignore Patterns Filtering Everything**:
   - Problem: All files are being excluded by ignore patterns
   - Solution: Check your global and local ignore patterns; reset to defaults if necessary

3. **Non-Standard File Structure**:
   - Problem: The directory structure is not recognized properly
   - Solution: Try selecting a more specific subfolder closer to your actual code

#### Token Counts Are Incorrect

If token counts seem wrong:

1. **Estimation Differences**:
   - Problem: Token counts differ from what your AI model reports
   - Explanation: Different models tokenize slightly differently; ContextCraft provides an estimate
   - Solution: Allow for a margin of error (±10%) when planning your context usage

2. **Zero Token Count for Some Files**:
   - Problem: Some files show 0 tokens despite having content
   - Solutions:
     - Ensure the file encoding is UTF-8
     - Check if the file type is supported for tokenization
     - Very small files may round down to 0 in the display

#### Compression or Comment Removal Not Working

If code optimization features aren't functioning:

1. **Unsupported Language**:
   - Problem: The file's language isn't recognized for processing
   - Solution: Check if the file extension is standard for the language
   - Note: Some languages have limited or no support for advanced processing

2. **Complex Code Structures**:
   - Problem: Unusual code patterns aren't handled properly
   - Solution: Try using simpler files or disable compression for those specific files

3. **Large Files**:
   - Problem: Very large files may time out during processing
   - Solution: Break large files into smaller ones or exclude them from compression

#### Copying to Clipboard Fails

If the copy function doesn't work:

1. **Browser Permissions**:
   - Problem: The app doesn't have clipboard access permission
   - Solution: Allow clipboard access in your browser/OS settings

2. **Very Large Content**:
   - Problem: The content is too large for the clipboard
   - Solution: Use the download option instead and manually copy smaller sections

3. **Focus Issues**:
   - Problem: The app has lost focus on the copy button
   - Solution: Click elsewhere in the app and try again, or restart the application

### FAQ

#### General Questions

**Q: Is my code sent to any external servers during processing?**

A: No. ContextCraft processes all your code locally on your machine. Your code is never sent to external servers for processing. The only external communication is to fetch model information from the OpenRouter API, but this doesn't involve your code.

**Q: Does ContextCraft modify my original files?**

A: No. ContextCraft only reads your files and creates formatted output for export. It never modifies your original source files, regardless of what options you select.

**Q: Can I use ContextCraft with private repositories?**

A: Yes. Since the application runs locally on your machine, you can use it with any files you have access to, including private repositories and proprietary code.

#### Features and Limitations

**Q: What programming languages are supported?**

A: ContextCraft supports common programming languages for features like syntax highlighting and code compression, including:
- JavaScript/TypeScript
- Python
- Java
- C/C++
- C#
- Ruby
- Go
- Rust
- HTML/CSS
- PHP
- And more

However, advanced features like code compression and comment removal have varying levels of support depending on the language.

**Q: Is there a limit to how many files I can select?**

A: There's no hard limit on the number of files you can select, but practical limitations include:
- Your computer's memory and performance
- The token limit of your target AI model
- The usability of very large outputs

For best results, be selective and focus on the most relevant files.

**Q: Can I create and save templates for common prompts?**

A: Some versions of ContextCraft include template functionality. Check the Custom Instructions section or your specific version's features for template options.

#### Technical Details

**Q: How does token counting work?**

A: ContextCraft uses an estimation algorithm that approximates how AI models tokenize text. It breaks down text into units similar to those used by models like GPT and Claude, accounting for:
- Words and parts of words
- Punctuation
- Special characters
- Programming language syntax
- Whitespace

While not exact, it provides a good approximation for planning your context usage.

**Q: What happens if I exceed the token limit?**

A: ContextCraft will warn you with a red indicator in the token usage bar, but it won't prevent you from copying or downloading content that exceeds limits. When you paste into an AI tool, that tool might:
- Truncate your input to fit its limits
- Reject the input and ask for shorter content
- Split the content into multiple parts (some models)

For best results, stay within the indicated limits for your selected model.

**Q: Why do some files show as "Excluded"?**

A: Files are marked as "Excluded" when they match one or more patterns in your ignore configuration. This can include:
- System ignore patterns (like .git directories or node_modules)
- Global ignore patterns you've defined
- Local ignore patterns specific to the current project

## Developer Reference

This section provides information for developers who want to build, modify, or contribute to ContextCraft.

### Building from Source

If you want to build ContextCraft from source or contribute to its development, follow these steps:

#### Prerequisites

Ensure you have the following installed on your system:
- Node.js 18.x or higher
- npm or yarn package manager
- Git

#### Clone and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/flight505/ContextCraft.git
   cd ContextCraft
   ```

2. Install dependencies:
   ```bash
   npm install
   # or if using yarn
   yarn
   ```

#### Development Mode

Run the application in development mode:

```bash
npm run dev:electron
# or with yarn
yarn dev:electron
```

This starts the Electron app with hot-reloading enabled, allowing you to see changes in real-time.

#### Building for Production

Build the application for your current platform:

```bash
npm run package
# or for specific platforms
npm run package:mac
npm run package:win
npm run package:linux
```

Build for all platforms (requires appropriate environment):

```bash
npm run package:all
```

The built applications will be available in the `release-builds` directory.

### Project Architecture

ContextCraft is built with Electron and React, using TypeScript for type safety. This section provides an overview of the project structure and architecture.

#### Directory Structure

```
contextcraft/
├── build/              # Build configuration
├── dist/               # Production build output
├── electron/           # Electron main process code
│   ├── main.js         # Main process entry point
│   ├── preload.js      # Preload script for secure IPC
│   └── utils/          # Electron-specific utilities
├── public/             # Static assets
├── scripts/            # Build and helper scripts
├── src/                # Application source code
│   ├── assets/         # Images and other assets
│   ├── components/     # React components
│   │   └── ui/         # Reusable UI components
│   ├── constants/      # Application constants
│   ├── context/        # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── styles/         # CSS and styling
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main React component
│   └── main.tsx        # React entry point
└── vite.config.ts      # Vite configuration
```

#### Core Architecture

ContextCraft follows a modern React architecture with these key principles:

1. **Electron Process Separation**:
   - **Main Process**: Handles file system operations, window management, and heavy computations
   - **Renderer Process**: Contains the React UI and user interactions
   - **Preload Script**: Provides a secure bridge between processes

2. **React Component Structure**:
   - **App.tsx**: Central state management and core application logic
   - **Sidebar.tsx**: Project navigation and file selection
   - **ControlContainer.tsx**: Configuration options and export controls
   - **TreeItem.tsx**: Individual file/directory representation in the tree

3. **State Management**:
   - Uses React's built-in state management with useState and useEffect
   - Context API for theme and other global state
   - Local Storage for persistence between sessions

4. **File Processing Pipeline**:
   1. File selection by the user
   2. Application of ignore patterns to filter files
   3. Reading file contents (on demand or deferred)
   4. Optional processing (compression, comment removal)
   5. Token counting and format application
   6. Output generation and export

### Contributing

Contributions to ContextCraft are welcome! This section outlines the process for contributing to the project.

#### Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a new branch for your feature or bugfix
4. Make your changes
5. Test thoroughly
6. Push to your fork
7. Submit a pull request

#### Development Guidelines

When contributing, please follow these guidelines:

1. **Code Style**:
   - Follow the existing code style and formatting
   - Use TypeScript for type safety
   - Keep functions small and focused
   - Write descriptive variable and function names

2. **Testing**:
   - Add tests for new features when possible
   - Ensure existing tests pass
   - Test on multiple platforms if making platform-specific changes

3. **Documentation**:
   - Update documentation to reflect your changes
   - Add comments for complex logic
   - Include JSDoc comments for functions

4. **Commit Messages**:
   - Write clear, concise commit messages
   - Reference issue numbers when applicable
   - Use conventional commit format when possible

#### Feature Requests and Bug Reports

If you find a bug or have a feature request:

1. Check existing issues to avoid duplicates
2. Open a new issue with a clear title and description
3. For bugs, include steps to reproduce, expected behavior, and actual behavior
4. For feature requests, describe the feature and its benefits

#### License and Attribution

ContextCraft is an open-source project. All contributions will be under the same license as the project. By contributing, you agree to license your code under the project's license.

---

Thank you for using ContextCraft! We hope this documentation helps you get the most out of the application and optimize your interactions with AI coding assistants. If you have questions or need further assistance, please refer to the project's GitHub repository or community forums.
