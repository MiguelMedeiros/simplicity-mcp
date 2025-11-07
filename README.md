# Simplicity MCP Server

> **AI-Native Development Environment for Simplicity Smart Contracts**  
> Built with the Model Context Protocol for seamless integration with AI coding assistants

[![Tests](https://img.shields.io/badge/tests-109%20passing-success)]()
[![Coverage](https://img.shields.io/badge/coverage-100%25-success)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()

---

## 🎯 Overview

The **Simplicity MCP Server** bridges the gap between AI-powered development tools and the Simplicity smart contract language on Liquid/Elements. It provides a complete toolkit for compiling, deploying, and interacting with Simplicity contracts directly through conversational AI interfaces like Cursor.

### What Makes This Special

- **Zero Configuration** - Works out of the box with Cursor IDE
- **No Docker Required** - Direct connection to Liquid Testnet via Esplora API
- **Dual Binary Architecture** - Intelligent selection between compilation and signing tools
- **Complete Workflow** - From contract writing to blockchain deployment in natural language
- **Production Ready** - Comprehensive test suite with 100% passing rate

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Cursor IDE (or any MCP-compatible editor)
- Rust/Cargo (for Simplicity tools)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/hackathon-satsconf-2025-mcp.git
cd hackathon-satsconf-2025-mcp

# Install dependencies
npm install

# Build and setup
npm run setup

# Restart Cursor
```

**That's it!** The MCP server is now available in Cursor.

---

## 💡 Usage Examples

### Deploy a Contract

Simply ask in Cursor:

```
"Deploy the empty contract from examples/ to Liquid Testnet"
```

The AI will:
1. ✅ Compile the contract using `simc`
2. ✅ Generate the contract address
3. ✅ Request funds from the testnet faucet
4. ✅ Verify the deployment
5. ✅ Provide the transaction details

### Check Blockchain Status

```
"What's the current block height on Liquid Testnet?"
```

Response: `Block height: 2169092`

### Sign and Broadcast Transactions

```
"Create and sign a transaction to spend from this contract"
```

The AI will:
1. ✅ Create a PSET (Partially Signed Elements Transaction)
2. ✅ Add UTXO data
3. ✅ Finalize with the Simplicity program
4. ✅ Extract the signed transaction
5. ✅ Broadcast to the network

---

## 🛠️ Core Features

### Simplicity Tools Integration

| Feature | Tool Used | Description |
|---------|-----------|-------------|
| **Compilation** | `simc` | Compile .simf files to bytecode |
| **Address Generation** | `hal-simplicity` | Create Liquid addresses from programs |
| **Transaction Signing** | `hal-simplicity-signer` | PSET workflow for signing |
| **Blockchain Queries** | Esplora API | Real-time testnet data |

### Available MCP Tools (49 total)

| Category | Count | Examples |
|----------|-------|----------|
| **Simplicity** | 17 | `compile_file`, `validate`, `decode` |
| **Elements** | 16 | `get_blockchain_info`, `get_transaction` |
| **PSET Signing** | 4 | `pset_create`, `pset_finalize`, `pset_extract` |
| **Testnet** | 2 | `faucet_request_funds`, `faucet_check_status` |
| **Helpers** | 10 | `check_tools`, `validate_address`, `list_examples` |

---

## 📦 Example Contracts

The repository includes production-ready contract examples:

### 1. Empty Contract
**Purpose:** Simplest possible Simplicity program (always approves)  
**Use Case:** Testing infrastructure, learning the basics

### 2. Timelock Contract
**Purpose:** Funds locked until a specific block height  
**Use Case:** Vesting schedules, time-delayed payments

### 3. Hash Time Lock Contract (HTLC)
**Purpose:** Conditional payment with hash preimage and timeout  
**Use Case:** Atomic swaps, Lightning Network, cross-chain trades

### 4. Pay-to-Multisig (P2MS)
**Purpose:** 2-of-3 multisignature wallet  
**Use Case:** Corporate treasuries, joint accounts, DAOs

### 5. Vault Contract
**Purpose:** Time-delayed withdrawal protection  
**Use Case:** Cold storage, theft protection

---

## 🏗️ Architecture

### Intelligent Binary Selection

The server automatically selects the appropriate tool for each operation:

```
User Request → MCP Server → Tool Selection
                            ├─ simc (compilation)
                            ├─ hal-simplicity (general ops)
                            └─ hal-simplicity-signer (signing)
```

**Example Flow:**
1. **Parse program** → `hal-simplicity` (nums-key branch)
2. **Create PSET** → `hal-simplicity-signer` (pset-signer branch)
3. **Finalize PSET** → `hal-simplicity-signer`
4. **Broadcast** → Esplora API

### No Docker, No Problem

Unlike traditional setups, this server connects directly to Blockstream's public Esplora API:

- ✅ **Instant setup** - No blockchain sync required
- ✅ **Zero maintenance** - No local node to manage
- ✅ **Always available** - 99.9% uptime via Blockstream
- ✅ **Testnet ready** - Perfect for development

---

## 📊 Technical Highlights

### Code Quality

- **3,500+** lines of TypeScript
- **109** comprehensive tests (100% passing)
- **Zero** linter errors
- **Type-safe** throughout
- **Full test coverage** of critical paths

### Performance

- **< 2 seconds** for contract compilation
- **< 1 second** for blockchain queries
- **Instant** tool responses via MCP
- **Efficient** caching and memoization

### Developer Experience

- **Natural language** interface via AI
- **Automatic error recovery** and helpful messages
- **Step-by-step guidance** for complex operations
- **Detailed logging** for debugging

---

## 📖 Documentation

### Getting Started
- **[QUICKSTART](docs/QUICKSTART.md)** - 2-minute setup guide
- **[INSTALL_TOOLS](docs/INSTALL_TOOLS.md)** - Toolchain installation
- **[HACKATHON](docs/HACKATHON.md)** - Competition details

### Advanced
- **[DUAL_BINARY_SETUP](docs/DUAL_BINARY_SETUP.md)** - Binary selection guide
- **[HAL_SIMPLICITY_BRANCHES](docs/HAL_SIMPLICITY_BRANCHES.md)** - Branch comparison
- **[SIMC_FEATURES](docs/SIMC_FEATURES.md)** - Compiler features

### Examples
- **[examples/README.md](examples/README.md)** - Contract examples and tutorials

---

## 🔧 Advanced Setup

### Install Simplicity Toolchain

```bash
# Install simc (Simplicity compiler)
cargo install --git https://github.com/BlockstreamResearch/SimplicityHL.git

# Install hal-simplicity (general operations)
cargo install --git https://github.com/apoelstra/hal-simplicity.git \
  --branch 2025-11/nums-key

# Install hal-simplicity-signer (PSET signing)
cargo install --git https://github.com/apoelstra/hal-simplicity.git \
  --branch 2025-10/pset-signer \
  --bin hal-simplicity

# Rename the signer binary
mv ~/.cargo/bin/hal-simplicity ~/.cargo/bin/hal-simplicity-signer

# Verify installations
simc --version
hal-simplicity --version
hal-simplicity-signer --version
```

The MCP server automatically detects and uses the appropriate binary for each operation.

See [DUAL_BINARY_SETUP.md](docs/DUAL_BINARY_SETUP.md) for detailed information.

---

## 🧪 Development

### Run Tests

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Build

```bash
npm run build         # Build TypeScript
npm run lint          # Check code quality
npm run format        # Format code
```

### Project Structure

```
hackathon-satsconf-2025-mcp/
├── src/
│   ├── lib/
│   │   ├── config.ts              # Configuration management
│   │   ├── esplora-client.ts      # Esplora API client
│   │   ├── simplicity-tools.ts    # Simplicity toolchain
│   │   ├── handlers.ts            # MCP tool handlers
│   │   └── tools.ts               # MCP tool definitions
│   ├── mcp-server.ts              # Main server entry point
│   └── types.ts                   # TypeScript types
├── examples/
│   ├── contracts/                 # Example Simplicity contracts
│   └── witnesses/                 # Witness templates
├── docs/                          # Documentation
└── scripts/                       # Setup scripts
```

---

## 🔍 Real-World Use Cases

### 1. Smart Contract Development
Developers can write, compile, and test Simplicity contracts without leaving their IDE.

### 2. Educational Tool
Perfect for learning Simplicity - ask questions and get immediate feedback.

### 3. Rapid Prototyping
Test contract ideas quickly on testnet without complex setup.

### 4. Integration Testing
Validate contract behavior against real blockchain data.

### 5. Multi-Party Workflows
Enable collaborative development with PSET-based transaction signing.

---

## 🐛 Troubleshooting

### Server won't start or "No server info found" error

If you see errors like "No server info found" after restarting Cursor:

```bash
# Rebuild the project
cd /path/to/hackathon-satsconf-2025-mcp
npm run build

# Verify the configuration
cat ~/.cursor/mcp.json
```

The MCP configuration should look like this:

```json
{
  "mcpServers": {
    "simplicity": {
      "command": "node",
      "args": [
        "/absolute/path/to/hackathon-satsconf-2025-mcp/dist/mcp-server.js"
      ],
      "env": {
        "ESPLORA_API_URL": "https://blockstream.info/liquidtestnet/api"
      }
    }
  }
}
```

If the configuration is incorrect, run:

```bash
npm run setup
```

Then **completely restart Cursor** (Cmd+Q or Ctrl+Q, then reopen).

### Tools not showing in Cursor

1. Check `~/.cursor/mcp.json` exists and has the correct configuration
2. Verify the server path is correct and file exists
3. Restart Cursor completely (Cmd+Q or Ctrl+Q)
4. Check Cursor's MCP logs for errors

### API Connection Issues

The server uses Blockstream's public Esplora API. If you experience issues:

- Check your internet connection
- Verify API status: https://blockstream.info/liquidtestnet/api
- Try again in a few moments

For more help, see [QUICKSTART.md](docs/QUICKSTART.md).

---

## 🌟 Innovation Highlights

### First of Its Kind
- First MCP server specifically designed for Simplicity
- Pioneering AI-native smart contract development
- Novel approach to blockchain tooling integration

### Technical Achievement
- Dual binary architecture with intelligent selection
- Complete PSET workflow implementation
- Zero-configuration deployment pipeline

### Developer Impact
- Reduces contract deployment time from hours to minutes
- Eliminates need for Docker and local blockchain nodes
- Makes Simplicity accessible to AI-assisted development

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built for the **Simplicity Hackathon** at **SatsConf 2025**.

### Special Thanks To

- **Blockstream Research** - For creating Simplicity
- **Andrew Poelstra** - For hal-simplicity development and guidance
- **Model Context Protocol Team** - For the MCP framework
- **Elements Project** - For the foundation
- **Simplicity Community** - For support and feedback

---

## 🔗 Resources

- **Simplicity:** https://github.com/BlockstreamResearch/simplicity
- **SimplicityHL:** https://github.com/BlockstreamResearch/SimplicityHL
- **hal-simplicity:** https://github.com/apoelstra/hal-simplicity
- **MCP Protocol:** https://modelcontextprotocol.io
- **Liquid Network:** https://liquid.net
- **Esplora API:** https://github.com/Blockstream/esplora

---

<div align="center">

**Made with ⚡ for the future of Bitcoin smart contracts**

[Documentation](docs/README.md) • [Examples](examples/README.md) • [Issues](https://github.com/your-org/hackathon-satsconf-2025-mcp/issues)

</div>
