The original "Repomix-style" compression is a good start but too blunt. Removing *all* function bodies regardless of the available space isn't optimal. If we have a large context window (like Claude 3.5's 200k or GPT-4's 128k), we might be throwing away valuable implementation details unnecessarily. Conversely, for a small context window, just removing function bodies might not be *enough*.

## Ideas for Better Code Compression (Step 2)

1.  **Dynamic Threshold Compression (Chosen Best Approach):**
    *   **Concept:** Calculate the total tokens *before* compression. Only apply compression *if* the total exceeds the selected model's context limit (minus a safety margin for the prompt itself).
    *   **Granularity:** Instead of compressing everything, compress files strategically until the total fits. Start by compressing the *largest* files (highest token count) first, removing function bodies one by one and recalculating the total token count. Stop compressing as soon as the total fits within the target limit.
    *   **Pros:** Maximizes retained information for the given context window. Adapts automatically to different models. Simple prioritization (largest first).
    *   **Cons:** Requires knowing all file token counts upfront. Can be slightly slower due to the iterative process. Still relies on Tree-sitter parsing.

2.  **LLM-Based Summarization (More Advanced):**
    *   **Concept:** Instead of just removing function bodies, use a smaller, faster LLM (like Haiku or GPT-3.5-turbo) to *summarize* the function bodies into concise descriptions (e.g., "//# Summary: Calculates user score based on activity logs").
    *   **Pros:** Retains the *intent* of the function, not just the signature. Potentially more useful for the main LLM.
    *   **Cons:** Much more complex to implement. Introduces latency and potential cost for the summarization step. Summary quality can vary. Still needs a dynamic threshold.

3.  **AST Abstraction Level Control (Advanced Tree-Sitter):**
    *   **Concept:** Use Tree-sitter not just to remove bodies, but to selectively remove *other* details based on need. E.g., remove local variable declarations, simplify complex expressions, remove comments (already an option), etc., based on how much space needs to be saved.
    *   **Pros:** Very granular control over what's removed.
    *   **Cons:** Significantly more complex Tree-sitter logic needed per language. Defining the "levels" of abstraction is hard.

4.  **Semantic Chunking + Compression:**
    *   **Concept:** If the codebase *still* doesn't fit after dynamic compression, intelligently split it into meaningful chunks (e.g., by component, feature, or file) that *do* fit, possibly applying compression within each chunk.
    *   **Pros:** Handles very large codebases that exceed even large context windows.
    *   **Cons:** This is less about compression and more about managing overflow. Complex to define "meaningful" chunks automatically.

**Conclusion:** Idea 1 (Dynamic Threshold Compression) is the most practical and impactful improvement right now. It directly leverages the context window information (Step 5) to make Step 2 adaptive, striking a good balance between information density and token count.

---

## Detailed Implementation Plan (Best Version: Dynamic Threshold Compression)

Here's the step-by-step plan incorporating the dynamic threshold approach for Step 2 and integrating Step 5.

### **STEP 5: MODEL INFORMATION & CONTEXT LIMIT**

*(Prerequisite: This needs to be available for Step 2)*

*   [ ] **5.1 Fetch Model List:**
    *   [ ] Create a function `fetchModels()` that calls the OpenRouter API (`https://openrouter.ai/api/v1/models`).
    *   [ ] Call this on app startup or when the settings/model selection UI is opened.
    *   [ ] Handle potential fetch errors gracefully (log error, use fallback).
*   [ ] **5.2 Store Model Data:**
    *   [ ] Define an interface/type for model data: `interface ModelInfo { id: string; name: string; context_length: number; }`.
    *   [ ] Store the fetched and parsed list of `ModelInfo` objects in application state (e.g., React Context, Zustand, Redux). Let's call this state `availableModels`.
*   [ ] **5.3 Dynamic Model Dropdown UI:**
    *   [ ] Update the existing model selection UI (likely a Dropdown component).
    *   [ ] Populate its options from the `availableModels` state. Display `model.name` as the label and use `model.id` as the value.
    *   [ ] Implement a fallback list (e.g., `[{id:"openai/gpt-4o", name:"GPT-4o", context_length: 128000}, {id:"anthropic/claude-3-5-sonnet", name:"Claude 3.5 Sonnet", context_length: 200000}]`) if the fetch fails or `availableModels` is empty.
*   [ ] **5.4 Handle Model Selection & Store Context:**
    *   [ ] Add application state variables:
        *   `selectedModelId: string | null`
        *   `selectedContextLength: number | null`
    *   [ ] When the user selects a model from the dropdown:
        *   [ ] Find the corresponding `ModelInfo` object from `availableModels`.
        *   [ ] Update `selectedModelId` with the `model.id`.
        *   [ ] Update `selectedContextLength` with the `model.context_length`.
        *   [ ] Persist `selectedModelId` to localStorage so it's remembered across sessions. Load it on startup.
*   [ ] **5.5 Token Limit Awareness UI:**
    *   [ ] Display the `selectedContextLength` near the total token count UI.
    *   [ ] If `total_tokens > selectedContextLength`, show a prominent warning (e.g., red text, warning icon).
    *   [ ] Add a suggestion to enable compression if the limit is exceeded.
*   [ ] **5.6 Global Access:**
    *   [ ] Ensure `selectedContextLength` is easily accessible by the code generation/compression logic (e.g., via context, state selectors). A common state management solution is ideal.

---

### **STEP 2: DYNAMIC CODE COMPRESSION**

*(Leverages `selectedContextLength` from Step 5)*

*   [ ] **2.0 Pre-computation & State:**
    *   [ ] When files are processed (after initial selection/ignore patterns applied), calculate and store the *uncompressed* token count for *each* file (`FileData.uncompressedTokenCount`).
    *   [ ] Add a state variable or flag to `FileData` to track if a file has been compressed: `FileData.isCompressed: boolean` (default: `false`).
    *   [ ] The existing `FileData.tokenCount` will now store the *current* token count (either uncompressed or compressed). Initialize it with `uncompressedTokenCount`.
*   [ ] **2.1 Compression Toggle/UI:**
    *   [ ] **Add “Smart Compress Code” Checkbox:**
        *   [ ] Add it in `ControlContainer`, using the `Switch` component. Label it “Smart Compress Code”.
        *   [ ] Store its state (e.g., `isCompressionEnabled: boolean`).
*   [ ] **2.2 Tree-Sitter/Parser Integration:**
    *   [ ] **Install:**
        *   [ ] `npm install tree-sitter tree-sitter-javascript tree-sitter-typescript tree-sitter-python ...` (add parsers for common languages).
        *   [ ] Handle potential native module rebuild steps for Electron (`electron-rebuild`).
    *   [ ] **Implement `compressCode(source: string, language: string): string | null`:**
        *   [ ] Takes source code and a language identifier (e.g., 'javascript', 'python').
        *   [ ] Uses the appropriate Tree-sitter parser based on the language.
        *   [ ] Parses the AST.
        *   [ ] **Crucially:** Traverses the AST, identifies function/method definitions.
        *   [ ] *Replaces* the body of each function/method with a placeholder comment (e.g., `// ... body removed by PasteMax ...`). Keep the signature (name, parameters, return type hints if available).
        *   [ ] Returns the modified source code string.
        *   [ ] If parsing fails or language is unsupported, return `null`.
*   [ ] **2.3 Dynamic Compression Logic:**
    *   [ ] Create a function `applyDynamicCompression(files: FileData[], targetTokenLimit: number): { compressedFiles: FileData[], finalTokenCount: number }`.
    *   [ ] **Input:** The list of currently *selected* and *included* `FileData` objects, and the `targetTokenLimit` (e.g., `selectedContextLength * 0.95`).
    *   [ ] **Inside the function:**
        *   [ ] Initialize `currentTotalTokens` by summing `tokenCount` for all input `files`.
        *   [ ] Create a mutable copy of the `files` array to modify.
        *   [ ] **Check if compression is needed:** If `currentTotalTokens <= targetTokenLimit`, return the original files and token count immediately.
        *   [ ] **Iterative Compression Loop:**
            *   [ ] While `currentTotalTokens > targetTokenLimit`:
                *   [ ] Find the *largest* file (highest `tokenCount`) among the `files` that has `isCompressed === false`.
                *   [ ] If no uncompressed files are left, break the loop (cannot compress further).
                *   [ ] Get the file's source code (you might need `window.electron.ipcRenderer.invoke("read-file", file.path)` here if content isn't already loaded).
                *   [ ] Determine the language from the file extension.
                *   [ ] Call `compressedSource = compressCode(source, language)`.
                *   [ ] If `compressedSource` is not `null`:
                    *   [ ] Recalculate the token count for the `compressedSource` (using `tiktoken`).
                    *   [ ] Update the file object in the mutable array:
                        *   `file.content = compressedSource` (if you store content)
                        *   `file.tokenCount = newCompressedTokenCount`
                        *   `file.isCompressed = true`
                    *   [ ] Recalculate `currentTotalTokens` by summing the updated `tokenCount`s.
                *   [ ] If `compressedSource` is `null` (compression failed/unsupported):
                    *   [ ] Mark the file as `isCompressed = true` anyway to prevent trying it again. Don't change its `tokenCount`.
            *   [ ] Return the modified `files` array and the final `currentTotalTokens`.
*   [ ] **2.4 Integration with `getSelectedFilesContent`:**
    *   [ ] Modify the `getSelectedFilesContent` function (or wherever the final output is assembled).
    *   [ ] **Before formatting:**
        *   [ ] Get the list of currently selected/included `FileData` objects.
        *   [ ] Get the `selectedContextLength` from the application state. If null, use a large default or skip compression.
        *   [ ] Get the `isCompressionEnabled` state from the UI toggle.
        *   [ ] If `isCompressionEnabled` and `selectedContextLength` is available:
            *   [ ] Define a `safetyMargin = 0.95` (or configurable).
            *   [ ] `targetLimit = selectedContextLength * safetyMargin`.
            *   [ ] Call `applyDynamicCompression(selectedFileData, targetLimit)`. Let the result be `{ processedFiles, finalTokenCount }`.
            *   [ ] Update the main token count display with `finalTokenCount`.
            *   [ ] Use `processedFiles` for the subsequent formatting steps (XML, MD, Plain). You'll need to fetch content for these processed files if `applyDynamicCompression` didn't load it.
        *   [ ] Else (compression disabled or no context limit):
            *   [ ] Use the original selected file data and calculate the total tokens without compression.
            *   [ ] Update the main token count display.
            *   [ ] Proceed with formatting using uncompressed content.
*   [ ] **2.5 Comment Handling:**
    *   [ ] Add a *separate* "Remove Comments" `Switch` in `ControlContainer`.
    *   [ ] If checked, implement `removeComments(source, language)` possibly using Tree-sitter or robust regex.
    *   [ ] Apply `removeComments` *before* `compressCode` if both are enabled. Update token counts accordingly after comment removal.
*   [ ] **2.6 UI Feedback & Testing:**
    *   [ ] **Indicator:** During the `applyDynamicCompression` loop, update the `processingStatus` state to show "Compressing file X/Y (filename)...".
    *   [ ] **Visual Cue:** In the `FileList` component, visually indicate which `FileCard`s represent compressed files (e.g., add a small icon or "(compressed)" text if `fileData.isCompressed` is true).
    *   **Performance:** Ensure file reading (`read-file`) and compression (`compressCode`) within the loop run asynchronously if possible, especially for large repos, to avoid blocking the UI thread. Update the UI status frequently.
    *   **Testing:**
        *   Test with a large repo that *exceeds* a small context limit (e.g., set limit to 4k). Verify only some files get compressed.
        *   Test with the same repo and a large context limit (e.g., 200k). Verify *fewer* or *no* files get compressed.
        *   Test with unsupported file types – they should be included uncompressed.
        *   Test toggling the "Smart Compress Code" switch on/off and verify token counts update.

This plan makes Step 2 intelligent and adaptive, directly addressing the need to pack the codebase effectively based on the LLM's capabilities.