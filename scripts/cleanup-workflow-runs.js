#!/usr/bin/env node

/**
 * This script cleans up old GitHub workflow runs using the GitHub CLI
 * Usage: node cleanup-workflow-runs.js [--keep=N] [--workflow=NAME] [--force]
 * 
 * Options:
 *   --keep=N: Number of most recent runs to keep (default: 5)
 *   --workflow=NAME: Specific workflow to clean up (default: clean all workflows)
 *   --force: Use the REST API directly when gh CLI fails (requires GH_TOKEN)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const https = require('https');
const url = require('url');

// Parse command line arguments
const args = process.argv.slice(2);
let keepCount = 5; // Default to keeping 5 most recent runs
let workflowName = null;
let forceMode = false;

for (const arg of args) {
  if (arg.startsWith('--keep=')) {
    keepCount = parseInt(arg.replace('--keep=', ''), 10);
    if (isNaN(keepCount) || keepCount < 1) {
      console.error('Error: --keep value must be a positive number');
      process.exit(1);
    }
  } else if (arg.startsWith('--workflow=')) {
    workflowName = arg.replace('--workflow=', '');
  } else if (arg === '--force') {
    forceMode = true;
  }
}

// Check if GitHub CLI is installed
try {
  execSync('gh --version', { stdio: 'ignore' });
} catch (error) {
  console.error('Error: GitHub CLI (gh) is not installed or not in PATH');
  console.error('Please install it from: https://cli.github.com/');
  process.exit(1);
}

// Check if user is authenticated with GitHub
try {
  const authOutput = execSync('gh auth status', { encoding: 'utf8' });
  console.log(authOutput);
} catch (error) {
  console.error('Error: Not authenticated with GitHub CLI');
  console.error('Please run: gh auth login');
  process.exit(1);
}

// Get repo information for REST API calls
let repoInfo = { owner: '', repo: '' };
try {
  const repoOutput = execSync('gh repo view --json owner,name', { encoding: 'utf8' });
  const repo = JSON.parse(repoOutput);
  repoInfo.owner = repo.owner;
  repoInfo.repo = repo.name;
  console.log(`Repository: ${repoInfo.owner}/${repoInfo.repo}`);
} catch (error) {
  console.error(`Error getting repo info: ${error.message}`);
  if (forceMode) {
    console.error('Force mode requires repository information. Exiting.');
    process.exit(1);
  }
}

// Helper function for direct REST API calls when gh CLI fails
async function deleteRunViaAPI(runId) {
  return new Promise((resolve, reject) => {
    const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
    
    if (!token) {
      reject(new Error('GH_TOKEN or GITHUB_TOKEN environment variable not set'));
      return;
    }
    
    const options = {
      hostname: 'api.github.com',
      path: `/repos/${repoInfo.owner}/${repoInfo.repo}/actions/runs/${runId}`,
      method: 'DELETE',
      headers: {
        'User-Agent': 'GitHub-Workflow-Cleanup-Script',
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    };
    
    const req = https.request(options, (res) => {
      if (res.statusCode === 204) {
        resolve();
      } else {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          reject(new Error(`Status ${res.statusCode}: ${data || 'No response body'}`));
        });
      }
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

console.log('🧹 Starting workflow run cleanup...');
if (forceMode) {
  console.log('⚠️ Force mode enabled: Will attempt direct API calls for failed deletions');
  if (!process.env.GH_TOKEN && !process.env.GITHUB_TOKEN) {
    console.error('Error: Force mode requires GH_TOKEN or GITHUB_TOKEN environment variable');
    process.exit(1);
  }
}

// Get list of workflow runs
let command = 'gh run list';
if (workflowName) {
  command += ` -w "${workflowName}"`;
}
command += ' -L 100 --json databaseId,name,status,conclusion,createdAt --jq ".[] | [.databaseId, .name, .status, .conclusion, .createdAt] | @tsv"';

try {
  const output = execSync(command, { encoding: 'utf8' });
  const runs = output.trim().split('\n')
    .filter(line => line.trim())
    .map(line => {
      const [id, name, status, conclusion, createdAt] = line.split('\t');
      return { id, name, status, conclusion, createdAt: new Date(createdAt) };
    });

  // Group runs by workflow name
  const workflowGroups = {};
  for (const run of runs) {
    if (!workflowGroups[run.name]) {
      workflowGroups[run.name] = [];
    }
    workflowGroups[run.name].push(run);
  }

  // For each workflow, sort by date and keep only the most recent ones
  let deletedCount = 0;
  let skippedCount = 0;
  let forceDeletedCount = 0;
  
  for (const [name, workflowRuns] of Object.entries(workflowGroups)) {
    console.log(`\nWorkflow: ${name}`);
    
    // Sort runs by creation date (newest first)
    workflowRuns.sort((a, b) => b.createdAt - a.createdAt);
    
    // Keep the N most recent runs
    const runsToKeep = workflowRuns.slice(0, keepCount);
    const runsToDelete = workflowRuns.slice(keepCount);
    
    console.log(`  Found ${workflowRuns.length} runs, keeping ${runsToKeep.length}, deleting ${runsToDelete.length}`);
    
    // Delete old runs
    for (const run of runsToDelete) {
      try {
        console.log(`  Deleting run ${run.id} from ${run.createdAt.toISOString()}`);
        const result = execSync(`gh run delete ${run.id} --yes`, { encoding: 'utf8', stdio: 'pipe' });
        console.log(`  Successfully deleted run ${run.id}`);
        deletedCount++;
      } catch (error) {
        console.error(`  Failed to delete run ${run.id}: ${error.message}`);
        
        // Try to get more information about why it failed
        try {
          const runInfo = execSync(`gh run view ${run.id} --json status,conclusion`, { encoding: 'utf8' });
          console.error(`  Run info: ${runInfo.trim()}`);
        } catch (infoError) {
          console.error(`  Could not get run info: ${infoError.message}`);
        }
        
        // If force mode is enabled, try via direct API call
        if (forceMode) {
          console.log(`  Attempting force delete of run ${run.id} via REST API...`);
          try {
            execSync(`curl -X DELETE -H "Authorization: token ${process.env.GH_TOKEN || process.env.GITHUB_TOKEN}" -H "Accept: application/vnd.github.v3+json" https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/actions/runs/${run.id}`, 
              { stdio: 'pipe' }
            );
            console.log(`  Successfully force deleted run ${run.id}`);
            forceDeletedCount++;
          } catch (forceError) {
            console.error(`  Force delete failed: ${forceError.message}`);
            skippedCount++;
          }
        } else {
          skippedCount++;
        }
      }
    }
  }
  
  console.log(`\n✅ Cleanup complete.`);
  console.log(`   - Deleted: ${deletedCount} runs`);
  if (forceMode) {
    console.log(`   - Force deleted: ${forceDeletedCount} runs`);
  }
  console.log(`   - Skipped: ${skippedCount} runs`);
  
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
} 