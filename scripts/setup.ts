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

  // Step 2: Check Docker
  step(2, 'Checking Docker installation');
  try {
    execSync('docker --version', { stdio: 'ignore' });
    log('✅ Docker found', 'green');
  } catch {
    log('⚠️  Docker not found. You will need to install Docker to run Elements node.', 'yellow');
  }

  // Step 3: Install dependencies
  step(3, 'Installing dependencies');
  log('Running: npm install...');
  if (exec('npm install')) {
    log('✅ Dependencies installed', 'green');
  } else {
    log('❌ Failed to install dependencies', 'red');
    process.exit(1);
  }

  // Step 4: Build TypeScript
  step(4, 'Building TypeScript');
  log('Running: npm run build...');
  if (exec('npm run build')) {
    log('✅ TypeScript compiled successfully', 'green');
  } else {
    log('❌ Failed to build TypeScript', 'red');
    process.exit(1);
  }

  // Step 5: Install globally
  step(5, 'Installing globally');
  log('Running: npm link...');
  if (exec('npm link')) {
    log('✅ Global command "simplicity-mcp" installed', 'green');
  } else {
    log('❌ Failed to install globally', 'red');
    process.exit(1);
  }

  // Step 6: Start Docker
  step(6, 'Starting Elements node (Docker)');
  log('Running: docker-compose up -d...');
  if (exec('docker-compose up -d')) {
    log('✅ Elements node started', 'green');
    log('⏳ Waiting 5 seconds for node to initialize...', 'yellow');
    await new Promise((resolve) => setTimeout(resolve, 5000));
  } else {
    log('⚠️  Failed to start Docker. You may need to start it manually.', 'yellow');
  }

  // Step 7: Configure Cursor
  step(7, 'Configuring Cursor MCP');

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

    // Add or update simplicity server
    config.mcpServers.simplicity = {
      command: 'simplicity-mcp',
      env: {
        ELEMENTS_RPC_URL: 'http://127.0.0.1:18884',
        ELEMENTS_RPC_USER: 'elementsuser',
        ELEMENTS_RPC_PASSWORD: 'elementspass',
      },
    };

    // Write config
    fs.writeFileSync(cursorConfigPath, JSON.stringify(config, null, 2));
    log('✅ Cursor MCP config updated', 'green');
    log(`📝 Config file: ${cursorConfigPath}`, 'cyan');
  } catch (error) {
    log('⚠️  Could not update Cursor config automatically', 'yellow');
    log('Please manually add this to ~/.cursor/mcp.json:', 'yellow');
    log(
      JSON.stringify(
        {
          mcpServers: {
            simplicity: {
              command: 'simplicity-mcp',
              env: {
                ELEMENTS_RPC_URL: 'http://127.0.0.1:18884',
                ELEMENTS_RPC_USER: 'elementsuser',
                ELEMENTS_RPC_PASSWORD: 'elementspass',
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
  log('   "What is the current block height on Elements?"', 'cyan');
  log('\n💡 Useful Commands:\n', 'cyan');
  log('  npm run docker:up      - Start Elements node', 'reset');
  log('  npm run docker:down    - Stop Elements node', 'reset');
  log('  npm run docker:logs    - View Elements logs', 'reset');
  log('  npm test               - Run tests', 'reset');
  log('  npm run build          - Rebuild after changes', 'reset');

  log('\n🔗 MCP Server is now globally available as: simplicity-mcp\n', 'green');
}

main().catch((error: Error) => {
  log(`\n❌ Setup failed: ${error.message}`, 'red');
  process.exit(1);
});

