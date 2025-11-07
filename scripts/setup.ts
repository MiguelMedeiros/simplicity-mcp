#!/usr/bin/env node

/**
 * Automated Setup Script for Simplicity MCP Server
 * Runs all necessary steps to get the server running
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

type Color = 'reset' | 'green' | 'red' | 'yellow' | 'blue' | 'cyan';

const colors: Record<Color, string> = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: Color = 'reset'): void {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command: string, options: Record<string, unknown> = {}): boolean {
  try {
    execSync(command, { stdio: 'inherit', ...options });
    return true;
  } catch (error) {
    return false;
  }
}

function step(number: number, title: string): void {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`  STEP ${number}: ${title}`, 'cyan');
  log('='.repeat(60), 'cyan');
}

interface CursorConfig {
  mcpServers?: Record<
    string,
    {
      command: string;
      args?: string[];
      env: Record<string, string>;
    }
  >;
}

async function main(): Promise<void> {
  log('\n🚀 Simplicity MCP Server - Automated Setup\n', 'blue');

  // Step 1: Check Node.js
  step(1, 'Checking Node.js installation');
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    log(`✅ Node.js ${nodeVersion} found`, 'green');
  } catch {
    log('❌ Node.js not found. Please install Node.js 18+ first.', 'red');
    process.exit(1);
  }

  // Step 2: Install dependencies
  step(2, 'Installing dependencies');
  log('Running: npm install...');
  if (exec('npm install')) {
    log('✅ Dependencies installed', 'green');
  } else {
    log('❌ Failed to install dependencies', 'red');
    process.exit(1);
  }

  // Step 3: Build TypeScript
  step(3, 'Building TypeScript');
  log('Running: npm run build...');
  if (exec('npm run build')) {
    log('✅ TypeScript compiled successfully', 'green');
  } else {
    log('❌ Failed to build TypeScript', 'red');
    process.exit(1);
  }

  // Step 4: Install globally
  step(4, 'Installing globally');
  log('Running: npm link...');
  if (exec('npm link')) {
    log('✅ Global command "simplicity-mcp" installed', 'green');
  } else {
    log('❌ Failed to install globally', 'red');
    process.exit(1);
  }

  // Step 5: Configure Cursor
  step(5, 'Configuring Cursor MCP');

  const cursorConfigPath = path.join(os.homedir(), '.cursor', 'mcp.json');
  const cursorConfigDir = path.dirname(cursorConfigPath);

  try {
    // Create .cursor directory if it doesn't exist
    if (!fs.existsSync(cursorConfigDir)) {
      fs.mkdirSync(cursorConfigDir, { recursive: true });
      log('📁 Created .cursor directory', 'cyan');
    }

    let config: CursorConfig = {};

    // Read existing config if it exists
    if (fs.existsSync(cursorConfigPath)) {
      const content = fs.readFileSync(cursorConfigPath, 'utf8');
      config = JSON.parse(content) as CursorConfig;
      log('📖 Found existing Cursor config', 'cyan');
    }

    // Initialize mcpServers if it doesn't exist
    if (!config.mcpServers) {
      config.mcpServers = {};
    }

    // Get absolute path to the project
    const projectPath = process.cwd();
    const serverPath = path.join(projectPath, 'dist', 'mcp-server.js');

    // Add or update simplicity server with direct path
    config.mcpServers.simplicity = {
      command: 'node',
      args: [serverPath],
      env: {
        ESPLORA_API_URL: 'https://blockstream.info/liquidtestnet/api',
      },
    };

    // Write config
    fs.writeFileSync(cursorConfigPath, JSON.stringify(config, null, 2));
    log('✅ Cursor MCP config updated', 'green');
    log(`📝 Config file: ${cursorConfigPath}`, 'cyan');
    log(`📝 Server path: ${serverPath}`, 'cyan');
  } catch (error) {
    log('⚠️  Could not update Cursor config automatically', 'yellow');
    log('Please manually add this to ~/.cursor/mcp.json:', 'yellow');
    const projectPath = process.cwd();
    const serverPath = path.join(projectPath, 'dist', 'mcp-server.js');
    log(
      JSON.stringify(
        {
          mcpServers: {
            simplicity: {
              command: 'node',
              args: [serverPath],
              env: {
                ESPLORA_API_URL: 'https://blockstream.info/liquidtestnet/api',
              },
            },
          },
        },
        null,
        2
      ),
      'yellow'
    );
  }

  // Final instructions
  log('\n' + '='.repeat(60), 'green');
  log('  🎉 SETUP COMPLETE!', 'green');
  log('='.repeat(60), 'green');

  log('\n📋 Next Steps:\n', 'cyan');
  log('1. Restart Cursor completely (Cmd+Q or Ctrl+Q, then reopen)', 'yellow');
  log('2. Open a new chat and test with:', 'yellow');
  log('   "What is the current block height on Liquid Testnet?"', 'cyan');
  log('\n💡 Useful Commands:\n', 'cyan');
  log('  npm test               - Run tests', 'reset');
  log('  npm run build          - Rebuild after changes', 'reset');
  log('\n✨ No Docker needed! Using Esplora API directly.', 'green');

  log(
    '\n🔗 MCP Server is now globally available as: simplicity-mcp\n',
    'green'
  );
}

main().catch((error: Error) => {
  log(`\n❌ Setup failed: ${error.message}`, 'red');
  process.exit(1);
});
