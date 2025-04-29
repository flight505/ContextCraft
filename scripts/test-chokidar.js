#!/usr/bin/env node

/**
 * Test script to verify the chokidar loading approach.
 * This script simulates both development and production environments.
 */

console.log('🔍 Testing chokidar loading approach...');

// Create a mock app object to simulate Electron
const app = {
  isPackaged: process.argv.includes('--production')
};

console.log(`Running in ${app.isPackaged ? 'production' : 'development'} mode`);

// Mock functions for logging
const console_log = console.log;
const console_error = console.error;

// No-op watcher creator function
function createNoOpWatcher() {
  console_log("Creating no-op file watcher as fallback");
  return {
    watch: () => ({
      on: () => {},
      close: () => {}
    })
  };
}

// Try loading chokidar based on environment
let chokidar;

if (!app.isPackaged) {
  try {
    chokidar = require('chokidar');
    console_log("✅ Successfully loaded chokidar in development mode");
    console_log(`Chokidar version: ${chokidar.FSWatcher ? 'Available' : 'Unavailable'}`);
  } catch (err) {
    console_error(`❌ Failed to load chokidar in development: ${err.message}`);
    chokidar = createNoOpWatcher();
  }
} else {
  // In production, don't attempt to load chokidar at all
  console_log("🚫 Running in production mode - file watching disabled");
  chokidar = createNoOpWatcher();
}

// Test the watcher
console_log("\nTesting watcher functionality:");
const watcher = chokidar.watch('.');
console_log(`Watcher created: ${typeof watcher === 'object' ? 'Yes' : 'No'}`);
console_log(`Watcher has on method: ${typeof watcher.on === 'function' ? 'Yes' : 'No'}`);
console_log(`Watcher has close method: ${typeof watcher.close === 'function' ? 'Yes' : 'No'}`);

// Clean up
if (watcher && typeof watcher.close === 'function') {
  watcher.close();
}

console_log('\n✨ Test completed!'); 