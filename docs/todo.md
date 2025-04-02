# PasteMax Todo List

Here's what we learned during this process:

1. Electron packaging requires careful handling of dependencies, especially for native modules like tree-sitter
2. The dependency chain is deeper than it appears - modules like micromatch depend on braces, which depends on fill-range, which depends on to-regex-range, which depends on is-number
3. Native modules like tree-sitter have special dependencies like node-gyp-build that aren't always detected by simple dependency analysis

For future maintenance:

1. Keep your current approach of incrementally adding dependencies as needed to maintain a reasonable app size
2. Your postinstall script with `electron-builder install-app-deps` is crucial for rebuilding native modules
3. When adding new native modules to your app, be aware you might need to explicitly add their dependencies to the extraResources filter

The final solution combined:
- Targeted dependency inclusion
- Proper handling of native modules
- Maintaining a reasonable app size (around 120MB vs 1GB)

This approach is more maintainable than the "include everything" approach, even though it required a bit more debugging. Your app should now run reliably while keeping its size optimized.



# **PasteMax + Repomix-Style: Final Very Detailed Implementation Checklist (Electron Integration)**

Below is the **consolidated** and **up-to-date** checklist merging:
1. **Step 1: Remote & Local Git Repository Handling (Electron Integration)** (for loading local repos with `.git`, remote GitHub repos, plus branch selection using `isomorphic-git`), and  
2. The **Advanced Implementation** plan (covering code compression, multiple output formats, prompt templates, and new LLM model integration).

All items are broken into **one-story-point** tasks. This ensures a **competent AI Coding Agent** can implement these step by step for PasteMax’s **Electron + React** architecture. **No detail is omitted**.

---

## **STEP 1: REMOTE & LOCAL GIT REPOSITORY HANDLING (ELECTRON INTEGRATION)**

### **1.1 Add or Select Working Folder (Local/Remote)**
- [ ] **UI Folder/Repo Selection**  
  - [ ] In **PasteMax’s main interface** (Electron + React), reuse or create a folder selection component.  
  - [ ] The user can **pick a local path** (via system file dialog) or **enter a remote GitHub URL**.  
  - [ ] If **local path** has a `.git/` subdirectory, mark as Git-managed (enable advanced Git features).  
    - [ ] `fs.existsSync('.git')` or similar to detect.  
    - [ ] If found, we can later list branches, commits, etc.  
  - [ ] If **remote** (like `owner/repo`, `owner/repo#branch`, or a full GitHub URL), proceed to the clone/fetch logic.  
  - [ ] Add a **standardized UI button** labeled “Select Repository” or “Open Repo” (imported from `ui/components/Button` if you have a shared library).

### **1.2 Parse Repository Input (Remote Only)**
- [ ] **Parsing Utility**  
  - [ ] A function `parseGitHubUrl(input: string)` that extracts:
    - `owner` (the string before `/`)
    - `repo` (the string after `/`)
    - optional `branch` or `commit` if `#branch` or `tree/branch`/`commit/...` is found
  - [ ] Check validity: If it doesn’t match known patterns, show “Invalid repository syntax.”
  - [ ] If no branch is provided, default to `"main"` or `"master"`.
  - [ ] Example inputs:
    - `owner/repo`
    - `owner/repo#dev`
    - `https://github.com/owner/repo/tree/someBranch`
    - `https://github.com/owner/repo/commit/123abc`

### **1.3 Clone/Fetch Remote Repo with isomorphic-git**
- [ ] **In Electron Main Process**  
  - [ ] Implement `cloneRemoteRepo({ owner, repo, branch })`:
    - [ ] Use **isomorphic-git** to do a shallow clone to a temp folder: `os.tmpdir() + '/pasteMax-' + uuid()`
    - [ ] If `branch` or `commit` is provided, attempt checkout.  
    - [ ] If invalid branch/commit, show “Branch/commit not found.”  
    - [ ] If it’s private or credentials required, show “Private repo or invalid access.”
  - [ ] Set `depth: 1` for shallow clone.  

### **1.4 Progress Indicator**
- [ ] **Remote Repo Loading UI**  
  - [ ] Once “Load” is clicked for remote, show a spinner labeled “Cloning remote repository...”  
  - [ ] If isomorphic-git provides progress events (e.g., `onProgress`), update status text.  
  - [ ] On success, hide spinner and proceed to file scanning.

### **1.5 Error Handling & Retry**
- [ ] **Network & Repo Errors**  
  - [ ] Catch clone failures. If 404 or network offline, show “Could not clone repository. Check URL or connection.”  
  - [ ] Let user retry or fix the URL.  
  - [ ] If user cancels mid-download, clean up partial data in the temp folder.

### **1.6 File Tree Population**
- [ ] **After Clone or Local Folder**  
  - [ ] If local folder has `.git`, skip clone but proceed to scanning.  
    - [ ] If multiple branches exist, allow user to choose one (below).  
  - [ ] Use PasteMax’s **existing scanning** to build a file tree:
    - [ ] Respect `.gitignore` if user wants.  
    - [ ] Exclude binary files.  
  - [ ] Display the new file tree in the main interface.  
  - [ ] If a different branch is selected (below), re-checkout and re-scan.

### **1.7 Implement Branch Switching (Local Git)**
- [ ] **Branch Selection**  
  - [ ] If `.git/` is found locally, list branches with `isomorphic-git listBranches`.  
  - [ ] Provide a dropdown in the UI. On selection: `isomorphic-git checkout` that branch.  
  - [ ] Rescan folder; update the file tree.  
  - [ ] Show “Currently on branch: <branchName>” label somewhere in the UI.

### **1.8 UI Integration with Repository Handling**
- [ ] **Repository Selection Integration**  
  - [ ] Leverage existing "Select Folder" in FileTreeHeader for local repositories
  - [ ] When local folder has `.git/`, automatically detect it and enable Git features  
  - [ ] Add minimal UI for entering remote GitHub URLs when needed
  - [ ] Use `isomorphic-git` for all Git operations to maintain pure JavaScript implementation
- [ ] **Branch Handling UI**  
  - [ ] Only show branch selector when a Git repository is detected
  - [ ] Display current branch name in the UI
  - [ ] Provide branch switching capability via dropdown
  - [ ] Update file tree automatically when branch is changed

### **1.9 Testing & Validation**
- [ ] **Local Repo**  
  - [ ] Open a local `.git` folder. Confirm branches are listed. Switch branches, see file tree change.
- [ ] **Remote Repo**  
  - [ ] E.g., `owner/repo#dev-branch`. Confirm it clones dev-branch.  
  - [ ] Full commit URL checks out that commit.  
- [ ] **Progress & Errors**  
  - [ ] Ensure spinner shows during clone, error on invalid input, correct file scanning on success.

---

## **STEP 2: CODE COMPRESSION (REPOMIX-STYLE)**

### **2.1 Compression Toggle/UI**
- [ ] **Add “Compress Code” Checkbox**  
  - [ ] In Settings or near the file list, label it “Compress Code (Repomix-like).”
  - [ ] When checked, included files undergo code compression before final usage.

### **2.2 Tree-Sitter/Parser Integration**
- [ ] **Install**  
  - [ ] `npm install tree-sitter tree-sitter-javascript ...` (for languages).  
  - [ ] Handle native module rebuild for Electron if needed.
- [ ] **Implement `compressCode(source, extension)`**  
  - [ ] If recognized language, parse the AST, remove function bodies, keep signatures.  
  - [ ] If unknown extension or parse error, fallback to partial compression or skip.

### **2.3 Fallback for Unsupported Files**
- [ ] **Naive Approach**  
  - [ ] For unrecognized languages, just include them uncompressed or do line-based minimal compression.  
  - [ ] Mark them with “(Not compressed)” in the final output if needed.

### **2.4 Comment Handling**
- [ ] **Optional**  
  - [ ] If user also selects “Remove Comments,” do it in the parse or via a regex pass.  
  - [ ] Keep docstrings if desired, or strip all comments.

### **2.5 Token Counting Post-Compression**
- [ ] **Recount**  
  - [ ] After compression, re-check the token usage for that file.  
  - [ ] Update “Total tokens: X” in the UI if we do real-time token counting.

### **2.6 UI Feedback & Testing**
- [ ] **Indicator**  
  - [ ] Show “Compressing file 3/15” if multiple files are big.  
  - [ ] Compare final code snippet in the output to confirm placeholders replaced function bodies.
- [ ] **Performance**  
  - [ ] For large repos, ensure compression runs asynchronously.

---

## **STEP 3: ADVANCED OUTPUT FORMAT (XML/MARKDOWN/PLAIN)**

### **3.1 Format Selector UI**
- [ ] **Dropdown**: “Output Format” with “XML,” “Markdown,” or “Plain.”  
  - [ ] Default “XML,” or remember last used.  
  - [ ] On change, we’ll reformat the final output (in the “Pack Repo” step).

### **3.2 Implement XML Formatting**
- [ ] **`formatAsXML(files, config)`**  
  - [ ] Optionally start with `<?xml version="1.0"?>`.  
  - [ ] `<file_summary>` for metadata or user instructions.  
  - [ ] `<directory_structure>` listing the tree.  
  - [ ] `<files>` with `<file path="...">Content</file>` for each.  
  - [ ] Escape or wrap code in CDATA.  
  - [ ] If `output.instructionFilePath`, append `<instruction>` with that file’s text.

### **3.3 Implement Markdown Formatting**
- [ ] **`formatAsMarkdown(files, config)`**  
  - [ ] `# File Summary`, `# Directory Structure` (maybe a code block listing).  
  - [ ] `# Files`, then `## File: path` with fenced code blocks.  
  - [ ] If instructions present, “# Instruction” at the end.

### **3.4 Implement Plain Text Formatting**
- [ ] **`formatAsPlain(files, config)`**  
  - [ ] ASCII separators: `==================\nFile Summary`.  
  - [ ] Then “Directory Structure” (list each file/folder).  
  - [ ] Then “Files” with blocks like:
    ```
    =============
    File: path
    =============
    content
    ```  
  - [ ] “Instruction” if present.

### **3.5 Preview & Copy**
- [ ] **UI Panel**  
  - [ ] Once user picks a format, show a text preview or “View Output” button.  
  - [ ] Possibly let them “Copy to Clipboard” or “Save As...”.

### **3.6 Edge Cases**
- [ ] **Markdown with triple backticks inside code** → escape them.  
- [ ] **Invalid XML** → ensure we do CDATA or escape.  
- [ ] Large code. Consider performance or streaming.

---

## **STEP 4: PROMPT TEMPLATE SELECTOR**

### **4.1 Static Template Definitions**
- [ ] **Predefine**  
  - [ ] A small array or JSON: `[ {id:'codeReview', name:'Code Review', content:'...'}, ... ]`.  
  - [ ] Include “Documentation Generation,” “Test Case Generation,” etc.

### **4.2 UI for Template Selection**
- [ ] **Dropdown or Button**  
  - [ ] “Select Prompt Template” near the user’s custom prompt input.
  - [ ] use the same dropdown component for the prompt template as the one for the model selection. or a multiple select dropdown.
- [ ] We have a dropdown in the ui/components/Button.tsx file.
- [ ] **Dropdown** near the user instructions input field.
  - [ ] Rebuild the final preview on change.

### **4.3 Insert Template into Prompt**
- [ ] **Overwrite or Append**  
  - [ ] If user picks a template, fill the prompt text area with that content.  
  - [ ] If they had text already, ask “Replace existing or append?”

### **4.4 Editing & Persistence**
- [ ] **User can tweak**  
  - [ ] Let them modify the inserted text.  
  - [ ] Possibly store the last chosen template in local config.

### **4.5 Testing Template Logic**
- [ ] **Integration**  
  - [ ] The final prompt block (e.g. `<instruction>` in XML) includes this template text.  
  - [ ] Validate with each template.
### **4.6 Prompt Template to hardcode**
- [ ] **Prompt Template to hardcode**
  - [ ] We have the following templates for Code Review, Architecture Review, Security Review, Performance Review, and Code Quality which we will add to the prompt template.
<PROMPT_TEMPLATE>
-Code Review

"""
Architecture Review:
- Analyze this codebase's architecture:
1. Evaluate the overall structure and patterns
2. Identify potential architectural issues
3. Suggest improvements for scalability
4. Note areas that follow best practices
Focus on maintainability and modularity.
"""

"""
Security Review:
Perform a security review of this codebase:
1. Identify potential security vulnerabilities
2. Check for common security anti-patterns
3. Review error handling and input validation
4. Assess dependency security
Provide specific examples and remediation steps.
"""

"""
Performance Review
Review the codebase for performance:
1. Identify performance bottlenecks
2. Check resource utilization
3. Review algorithmic efficiency
4. Assess caching strategies
Include specific optimization recommendations.
"""

"""
- Documentation Generation

"""
API Documentation
Generate comprehensive API documentation:
1. List and describe all public endpoints
2. Document request/response formats
3. Include usage examples
4. Note any limitations or constraints
"""

"""
- Developer Guide

"""
Create a developer guide covering:
1. Setup instructions
2. Project structure overview
3. Development workflow
4. Testing approach
5. Common troubleshooting steps
"""

"""
- Architecture Documentation

"""
Document the system architecture:
1. High-level overview
2. Component interactions
3. Data flow diagrams
4. Design decisions and rationale
5. System constraints and limitations
"""

- Analysis and Improvement

"""
Dependency Analysis
Analyze the project dependencies:
1. Identify outdated packages
2. Check for security vulnerabilities
3. Suggest alternative packages
4. Review dependency usage patterns
Include specific upgrade recommendations.
"""

- Test Coverage

"""
Review the test coverage:
1. Identify untested components
2. Suggest additional test cases
3. Review test quality
4. Recommend testing strategies
"""

- Code Quality

"""
Assess code quality and suggest improvements:
1. Review naming conventions
2. Check code organization
3. Evaluate error handling
4. Review commenting practices
Provide specific examples of good and problematic patterns.
"""
</PROMPT_TEMPLATE>

- Tips for Better Results

Be Specific: Include clear objectives and evaluation criteria
Set Context: Specify your role and expertise level needed
Request Format: Define how you want the response structured
Prioritize: Indicate which aspects are most important

Model-Specific Notes
Claude
Use XML output format
Place important instructions at the end
Specify response structure

ChatGPT
Use Markdown format
Break large codebases into sections
Include system role prompts

Gemini
Works with all formats
Focus on specific areas per request
Use step-by-step analysis

---

## **STEP 5: MODEL INFORMATION FROM OPENROUTER**

### **5.1 Fetch Model List**
- [ ] **Public Endpoint**: `https://openrouter.ai/api/v1/models`.  
  - [ ] Do a fetch on app startup or when opening the “Model Selection” UI.

### **5.2 Extract Key Fields**
- [ ] **Parse**  
  - [ ] For each model, store `id`, `name`, `context_length`.  
  - [ ] Skip cost/pricing.

### **5.3 Dynamic Model Dropdown**
- [ ] **Replace Hard-coded**  
  - [ ] Instead of manual “GPT-3.5 / Claude 2,” show fetched list.  
  - [ ] If fetch fails, fallback to `[ {id:"openai/gpt-4o"}, {id:"anthropic/claude-3.5"}]`.

### **5.4 Handle Model Selection**
- [ ] **Global State**  
  - [ ] “selectedModelID” and “context_length” in the app’s React state.  
  - [ ] If user changes model, update token limit logic.

### **5.5 Token Limit Awareness**
- [ ] **Use Model’s `context_length`**  
  - [ ] If total tokens > model limit, show a warning. Possibly suggest compression.  
  - [ ] Test with a big code snippet.

### **5.6 Test**
- [ ] **Try**  
  - [ ] A known large context model e.g. “Claude 3.5” (200k). Confirm token meter updates.  
  - [ ] If offline, fallback to default.

---

## **STEP 6: UPDATE TO CURRENT LLMS (GPT-4O & CLAUDE 3.5)**

### **6.1 Deprecate Old Models**
- [ ] **Remove** references to `gpt-3.5-turbo` or `claude-2`.  
- [ ] **Rename** them to `openai/gpt-4o` or `anthropic/claude-3.5`.

### **6.2 Check API Calls**
- [ ] **OpenRouter**  
  - [ ] If using `model: "openai/gpt-4o"` or `"anthropic/claude-3.5"`, confirm the chat format is role-based.  
  - [ ] Ensure no legacy parameters are used.

### **6.3 Test**
- [ ] **Manual Query**  
  - [ ] If there’s a “Send to AI” feature in PasteMax, try sending the final code prompt. See if GPT-4o or Claude 3.5 respond properly.

---

## **STEP 7: INTEGRATE NEW FEATURES INTO PASTEMAX UI**

### **7.1 Remote vs. Local Switch**
- [ ] **UI**  
  - [ ] Tab or toggle: “Local Repo” vs. “Remote GitHub.”  
  - [ ] If remote, show the text input. If local, show file dialog.

### **7.2 File Selection & Tree**
- [ ] **Unified**  
  - [ ] For local or remote, display the same tree component.  
  - [ ] Check/uncheck files for inclusion.

### **7.3 Compression Toggle**
- [ ] **Place** next to “Output Format,” labeled “Compress Code?”  
  - [ ] Update real-time token usage if toggled.

### **7.4 Output Format Selector**
- [ ] **Dropdown** near the prompt text or advanced settings.  
  - [ ] Rebuild the final preview on change.

### **7.5 Prompt Template Dropdown**
- [ ] **Insert** selected template into user’s instruction box.  
  - [ ] Possibly in the same panel as compression/format?

### **7.6 Model Selector**
- [ ] **Dropdown** for the OpenRouter models.  
  - [ ] Display context length.  
  - [ ] If offline fetch fails, fallback to `[ "openai/gpt-4o", "anthropic/claude-3.5"]`.

### **7.7 Token Counter**
- [ ] **Display**: “Tokens: X / Y.”  
  - [ ] Warn if near limit.

### **7.8 Save/Send Prompt Flow**
- [ ] **Generate Prompt** with chosen format + compression + instructions.  
- [ ] **Send to AI** (if that feature is present) calls the endpoint with role-based messages.

### **7.9 UI Consistency & Theming**
- [ ] **Dark Mode** check, layout tidiness, advanced panel for large repos, etc.

---

## **STEP 8: (OPTIONAL) CLI CONFIG & REPOMIX COMPATIBILITY**

### **8.1 Internal Config Representation**
- [ ] **`PasteMaxConfig`** structure with:
  - `remoteRepo`, `branch`, `outputFormat`, `compress`, `selectedPromptTemplate`, `customPromptText`, `selectedModel`, etc.

### **8.2 Load config**
- [ ] **If** `repomix.config.json` found, parse.  
  - [ ] Map `output.style` → `outputFormat`, `compress` → boolean, etc.  
  - [ ] Update the UI states accordingly.

### **8.3 Export config**
- [ ] **“Save Config”** button that writes a new file or merges with existing.  
  - [ ] Could name it `repomix.config.json` for cross-tool compatibility.

### **8.4 Use config**
- [ ] On opening a project, if `repomix.config.json` is found, auto-apply.  
- [ ] Document any partial mismatches if advanced features differ from Repomix’s.

---

## **STEP 9: TESTING & UX FEEDBACK (COMPREHENSIVE)**

### **9.1 Test Remote Repo with Branch**
- [ ] **Example**: `owner/repo#dev-branch`. Confirm correct branch is checked out.  
- [ ] Confirm file tree matches that branch’s content.

### **9.2 Test Compression**
- [ ] **Large Functions**: enable “Compress Code,” check placeholders.  
- [ ] Compare token counts with/without compress.

### **9.3 Test Each Output Format**
- [ ] **XML**: valid tags, `<file_summary>`, `<files>`, `<instruction>`.  
- [ ] **Markdown**: headings, fenced code blocks.  
- [ ] **Plain**: ASCII dividers.  

### **9.4 Test Prompt Templates**
- [ ] Insert “Code Review” template, see if it appears in the final output.  
- [ ] Possibly send to an LLM, confirm it references the snippet.

### **9.5 Test Model Selection**
- [ ] Fetch from OpenRouter, pick `gpt-4o`. Send a small code snippet.  
- [ ] Try `claude-3.5` with a bigger snippet (maybe 50k tokens).  
- [ ] If offline, fallback to the default array.

### **9.6 Validate GPT-4o & Claude 3.5**
- [ ] No old references to `gpt-3.5` or `claude-2`.  
- [ ] Possibly use system messages if recommended.

### **9.7 Over-Limit Scenarios**
- [ ] If code is huge, total tokens > model limit. Warn or forcibly compress more.

### **9.8 UI & Theming**
- [ ] **Dark Mode** test, no layout breaks.

### **9.9 Performance Check**
- [ ] Big repos: measure scanning, compression times. Possibly add a progress bar.

### **9.10 Final Bug Fix & Documentation**
- [ ] **Docs**: update README with new remote loading steps, compression, format selection, GPT-4o/Claude3.5 usage.  
- [ ] Merge all short-lived feature branches in sequence (remote, compression, output formats, etc.).  
- [ ] Tag a release once all tests pass.

---

## **Completion & Summary**
By following these **unchecked tasks**, PasteMax becomes a powerful Electron + React tool, replicating **Repomix**-style code compression and multi-format output, plus local/remote Git integration and the latest GPT-4o/Claude 3.5 model usage. Every detail is specified so a **capable AI** can autonomously implement:

1. **Local & Remote Git** with branch switching  
2. **Code compression** preserving function signatures  
3. **Config-based** advanced ignore patterns & output style  
4. **Multiple output styles** (XML, Markdown, Plain text)  
5. **Prompt templates** for AI instructions  
6. **Model selection** from OpenRouter  
7. **New GPT-4o & Claude 3.5** integration  
8. **Thorough testing** for performance & user experience.

This **final** checklist ensures a **fully integrated** PasteMax, mirroring Repomix features while keeping the **Electron**-centric design. 

## ✅ Completed

- [x] Implement comprehensive theme system with proper TypeScript types
- [x] Improve component architecture and styling consistency
- [x] Add proper documentation for styling and components
- [x] Fix ControlContainer component issues
- [x] Implement proper branch workflow documentation
- [x] Add user instructions toggle
- [x] Consolidate theme implementation in ThemeContext

## 🚀 In Progress

- [ ] if the css style is comming from the for example a ui/ component, we could remove the css from the explicit css file in component/ and just import the component css file in the ui/ file? 
- [ ] Add more comprehensive testing for theme system
- [ ] Implement E2E tests for core functionality
- [ ] Add performance monitoring for large file trees
- [ ] Improve error handling in file operations

## 📋 Planned

- [ ] Add more theme customization options
- [ ] Implement theme preview in settings
- [ ] Add keyboard shortcuts for common operations
- [ ] Improve accessibility features
- [ ] Add more comprehensive documentation for contributors
- [ ] Implement automated performance testing
- [ ] Add more UI components to the component library

## 🐛 Known Issues

- [ ] Large file trees can cause performance issues
- [ ] Some edge cases in theme switching need handling
- [ ] Need better error messages for file operations
- [ ] Improve type safety in some components

## 💡 Future Ideas

- [ ] Add custom theme creation
- [ ] Implement plugin system
- [ ] Add more file preview options
- [ ] Implement collaborative features
- [ ] Add more export formats
- [ ] Improve search functionality



