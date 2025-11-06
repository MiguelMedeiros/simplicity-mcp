# Simplicity MCP Server

[![CI](https://github.com/MiguelMedeiros/simplicity-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/MiguelMedeiros/simplicity-mcp/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](https://github.com/MiguelMedeiros/simplicity-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Model Context Protocol (MCP) server for working with Simplicity programs and Elements blockchain.

## ⚡ Quick Install

```bash
git clone https://github.com/MiguelMedeiros/simplicity-mcp.git && cd simplicity-mcp && npm install && npm run setup
```

Then restart Cursor and start chatting with Elements blockchain!

## Quick Start

### Automated Setup (Recommended)

Run the setup script to install everything automatically:

```bash
npm install
npm run setup
```

The setup script will:
- ✅ Check Node.js and Docker
- ✅ Install dependencies
- ✅ Build the project
- ✅ Install globally as `simplicity-mcp`
- ✅ Start Elements node
- ✅ Configure Cursor MCP automatically

**Then restart Cursor and you're ready to go!**

### Manual Installation

If you prefer to install manually:

```bash
# Install dependencies
npm install

# Build
npm run build

# Install globally
npm link

# Start Elements node
npm run docker:up
```

### Configuration

#### Cursor

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "simplicity": {
      "command": "simplicity-mcp",
      "env": {
        "ELEMENTS_RPC_URL": "http://127.0.0.1:18884",
        "ELEMENTS_RPC_USER": "elementsuser",
        "ELEMENTS_RPC_PASSWORD": "elementspass"
      }
    }
  }
}
```

#### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "simplicity": {
      "command": "simplicity-mcp",
      "env": {
        "ELEMENTS_RPC_URL": "http://127.0.0.1:18884",
        "ELEMENTS_RPC_USER": "elementsuser",
        "ELEMENTS_RPC_PASSWORD": "elementspass"
      }
    }
  }
}
```

**Restart your MCP client after configuration.**

## Available Tools

- **Simplicity**: encode, decode, validate, construct, analyze, finalize
- **Elements**: blockchain info, blocks, transactions, addresses, assets
- **Integration**: transaction analysis, script verification, cost estimation

## Development

```bash
npm run build         # Build project
npm run dev           # Watch mode
npm test              # Run tests
npm run lint          # Run linter
npm run docker:up     # Start Elements node
npm run docker:down   # Stop Elements node
```

## Troubleshooting

**Server won't start:**
- Run `npm install && npm run build`
- Check Node.js version: `node --version` (need 18+)

**Tools not appearing:**
- Restart MCP client completely
- Check config file path is correct

**RPC errors:**
- Ensure Elements is running: `npm run docker:up`
- Check logs: `npm run docker:logs`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
