const fs = require('fs'); // Corrected this line
const path = require('path');
const { builtinModules } = require('module');

const projectRoot = path.resolve(__dirname, '..'); // Adjust if script is not in project root
const entryPoints = [
  path.join(projectRoot, 'electron/main.js'),
  path.join(projectRoot, 'electron/preload.js'),
  // Add any other scripts loaded directly by main process if needed
];

const requiredModules = new Set(); // Stores module names like 'minimatch'
const processedFiles = new Set(); // Stores absolute paths of processed files

// Regex to find require('module-name') or require("module-name")
// Handles single and double quotes, ignores comments (basic)
const requireRegex = /(?:^|\s|;|{|\()require\s*\(\s*['"]([^'"./\\][^'"]*)['"]\s*\)/g;

function extractBaseModuleName(filePath) {
  // Turns ".../node_modules/minimatch/index.js" into "minimatch"
  // Or ".../node_modules/@scope/pkg/index.js" into "@scope/pkg"
  const nodeModulesIndex = filePath.lastIndexOf(path.sep + 'node_modules' + path.sep);
  if (nodeModulesIndex === -1) {
    return null; // Not in node_modules
  }

  const relativePath = filePath.substring(nodeModulesIndex + '/node_modules/'.length);
  const parts = relativePath.split(path.sep);

  if (parts[0].startsWith('@')) {
    // Scoped package
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : null;
  } else {
    // Regular package
    return parts[0] || null;
  }
}

function findRequiresRecursively(filePath) {
  const absolutePath = path.resolve(filePath);

  if (processedFiles.has(absolutePath) || !fs.existsSync(absolutePath)) {
    return;
  }

  // Avoid processing things outside the project or deep system files
  if (!absolutePath.startsWith(projectRoot) && !absolutePath.includes(path.join('node_modules'))) {
       console.warn(`Skipping file outside project/node_modules: ${absolutePath}`);
       return;
  }


  processedFiles.add(absolutePath);
  // console.log(`Processing: ${absolutePath}`); // Uncomment for debugging

  try {
    const content = fs.readFileSync(absolutePath, 'utf8');
    let match;

    while ((match = requireRegex.exec(content)) !== null) {
      const moduleName = match[1];

      // Ignore Node.js built-in modules
      if (builtinModules.includes(moduleName)) {
        continue;
      }

      try {
        // Resolve the module path relative to the current file
        const resolvedPath = require.resolve(moduleName, { paths: [path.dirname(absolutePath)] });

        // Check if it's a module within node_modules
        if (resolvedPath.includes(path.join('node_modules'))) {
          const baseModuleName = extractBaseModuleName(resolvedPath);
          if (baseModuleName && !requiredModules.has(baseModuleName)) {
             // console.log(`  Found node_module: ${baseModuleName} (required by ${path.basename(absolutePath)})`); // Uncomment for debugging
            requiredModules.add(baseModuleName);
            // Recursively process the resolved module's entry point if not already done
            // Pass the resolvedPath (entry point of the module)
            findRequiresRecursively(resolvedPath);
          }
        }
        // We don't recursively process non-node_modules files here,
        // assuming they are part of your source code handled by electron-builder's `files` array.
      } catch (resolveError) {
        // Ignore modules that cannot be resolved (e.g., optional dependencies, typos)
        // console.warn(`  Could not resolve module '${moduleName}' required in ${absolutePath}`); // Uncomment for debugging
      }
    }
  } catch (readError) {
    console.error(`Error reading file ${absolutePath}: ${readError.message}`);
  }
}

console.log('Analyzing main process dependencies...');
entryPoints.forEach(entry => {
  if (fs.existsSync(entry)) {
    findRequiresRecursively(entry);
  } else {
    console.warn(`Entry point not found: ${entry}`);
  }
});

console.log('\n--- Required Node Modules for Main/Preload ---');
const sortedModules = Array.from(requiredModules).sort();

if (sortedModules.length > 0) {
  console.log('Add the following patterns to your package.json build.extraResources.filter:');
  console.log('```json');
  console.log(
    JSON.stringify(
      sortedModules.map(mod => `${mod}/**`), // Add /** for electron-builder filter
      null,
      2
    )
  );
  console.log('```');
  console.log('\nNOTE: You might still need to manually add native modules or modules with unusual structures.');
  console.log('      Also ensure these are listed under "dependencies" (not just devDependencies) in package.json.');
  console.log('      Review this list carefully!');

} else {
  console.log('No external node_modules dependencies found in entry points.');
}