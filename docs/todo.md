# contextcraft Todo List



Here's what the new workflow does:
## Key Improvements

1. **Split into Two Jobs**:
   - A lightweight `validate` job runs on every push/PR to check code quality
   - The heavy `build_and_release` job only runs when you tag a release or manually trigger it

2. **Conditional Building**:
   - Added an `if: startsWith(github.ref, 'refs/tags/v') || github.event_name == 'workflow_dispatch'` 
   - This ensures installers are only built for tags or manual triggers

3. **Job Dependencies**:
   - Added `needs: validate` to ensure validation happens before building

4. **Better Job Naming**:
   - Added `name` fields to make the workflow easier to understand in the GitHub Actions UI

## How to Use This Workflow

### For Day-to-Day Development:
1. Push to branches or create PRs
2. Only the `validate` job will run, checking that your code builds and passes basic checks
3. This gives you quick feedback without wasting CI minutes

### For Releasing:
1. Update the version in `package.json`
2. Commit and push to main
3. Create and push a tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
4. Both jobs will run - validation and then building
5. A draft GitHub release will be created with all your installers

### For Testing Builds:
If you need to test the build process without creating a release:
1. Go to the Actions tab in your GitHub repo
2. Select the "Build and Release CI" workflow
3. Click "Run workflow" dropdown
4. Select the branch and click "Run workflow"

This approach gives you the best of both worlds - quick validation for everyday development and proper builds when you're actually making a release.

-----------------

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

--------------------


## **Completion & Summary**
By following these **unchecked tasks**, contextcraft becomes a powerful Electron + React tool, replicating **Repomix**-style code compression and multi-format output, plus local/remote Git integration and the latest model usage. 

[ ] - 1. **Local & Remote Git** with branch switching
[x] - 2. **Code compression** preserving function signatures 
[x] - 3. **Config-based** advanced ignore patterns & output style  
[x] - 4. **Multiple output styles** (XML, Markdown, Plain text)  
[x] - 5. **Prompt templates** for AI instructions  
[x] - 6. **Model selection** from OpenRouter  
[x] - 7. **Thorough testing** for performance & user experience.
[x] - 8. **toaster** for notifications
[x] - 9. **contextcraft** should be able to run on windows, linux and macos
[x] - 10. **contextcraft** should be able to run on arm64 and x64
[ ] - 11. **Refactoring** of the code to make it more readable and maintainable
[ ] - 12. **State management** with Zustand for improved performance and maintainability

This **final** checklist ensures a **fully integrated** contextcraft, mirroring Repomix features while keeping the **Electron**-centric design. 

## ✅ Completed

- [x] Implement comprehensive theme system with proper TypeScript types
- [x] Improve component architecture and styling consistency
- [x] Add proper documentation for styling and components
- [x] Fix ControlContainer component issues
- [x] Implement proper branch workflow documentation
- [x] Add user instructions toggle
- [x] Consolidate theme implementation in ThemeContext
- [x] Fix dependency issues in Electron packaging
- [x] Optimize GitHub Actions workflow to run builds only for tags
- [x] Ensure that displayedFiles will always exclude files that are marked as excluded, keeping both the file tree and file cards area in sync

## 🚀 In Progress

- [x] if the css style is comming from the for example a ui/ component, we could remove the css from the explicit css file in component/ and just import the component css file in the ui/ file? 
- [x] Add more comprehensive testing for theme system
- [ ] Implement E2E tests for core functionality
- [ ] Add performance monitoring for large file trees
- [ ] Improve error handling in file operations
- [ ] Refactor codebase for better maintainability and organization
- [ ] Implement Zustand for centralized state management
- [ ] Fix TypeScript issues and improve type safety

## 📋 Planned

- [ ] Add keyboard shortcuts for common operations
- [ ] Improve accessibility features
- [ ] Add more comprehensive documentation for contributors
- [ ] Implement automated performance testing
- [ ] Migrate from React Context to Zustand for all state management
- [ ] Create state slices for different domains (files, UI, settings, etc.)
- [ ] Implement code splitting for improved performance
- [ ] Modernize component architecture with composition patterns
- [ ] Fix TypeScript ESLint version mismatch (current v5.8.2, supported <5.4.0)
- [ ] Remove unnecessary `any` and `unknown` type usage
- [ ] Clean up unused variables flagged by ESLint
- [ ] Improve TypeScript configuration and strictness
- [ ] Implement stronger typing for all components

## 🐛 Known Issues

- [ ] Large file trees can cause performance issues
- [ ] Some edge cases in theme switching need handling
- [ ] Need better error messages for file operations
- [ ] Improve type safety in some components
- [ ] State management becomes complex with deeply nested components
- [ ] TypeScript version mismatch with ESLint typescript-estree
- [ ] Multiple unused variables in App.tsx and other components
- [ ] Non-null assertions that could be made safer
- [ ] Any type usage in electron.d.ts and react-app-env.d.ts

## 💡 Future Ideas
- [ ] apply back to code base


## Release version tracker 
version v1.0.2:
   - [ ] includes that displayedFiles will always exclude files that are marked as excluded, keeping both the file tree and file cards area in sync 
   - [x] includes reduced number of toasts 🥂
   - [ ] includes Modified Rubric Creation Prompt 
   - [ ] includes Guide and idears 
   - [ ] A fix for windows build