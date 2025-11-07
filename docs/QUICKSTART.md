# ⚡ Quick Start - Simplicity MCP

Get up and running in 2 minutes.

## 🚀 Installation

```bash
git clone https://github.com/MiguelMedeiros/simplicity-mcp.git
cd simplicity-mcp
npm run setup
```

**Restart Cursor** and you're ready!

## 🎯 First Commands

### Check Installation
```
"Check if Simplicity tools are installed"
```

### List Tools
```
"What Simplicity tools are available?"
```

### Deploy Contract
```
"Deploy examples/contracts/empty.simf with auto-funding"
```

## 🎓 Quick Tutorials

### Tutorial 1: Empty Contract (2 min)
```
1. "Show me the empty contract"
2. "Compile it"
3. "Deploy it with auto-funding"
```

### Tutorial 2: HTLC (5 min)
```
1. "Show me the HTLC contract"
2. "Deploy examples/contracts/htlc.simf with auto-funding"
3. "Explain the two spending paths"
```

### Tutorial 3: Multisig (5 min)
```
1. "Show me the p2ms contract"
2. "Compile examples/contracts/p2ms.simf"
3. "Explain how 2-of-3 multisig works"
```

## 🛠️ Development Commands

```bash
npm run build        # Build
npm test             # Test
```

## 🐛 Troubleshooting

### Server won't start
```bash
npm install && npm run build
which simplicity-mcp
```

### Tools not in Cursor
1. Check `~/.cursor/mcp.json`
2. Restart Cursor

### API Connection
- Uses Blockstream's public Esplora API
- No Docker or local node required
- Works directly with Liquid Testnet

## 📚 Next Steps

1. Complete Tutorial 1
2. Read examples in `examples/`
3. Try Tutorial 2
4. Build your own contract

---

**That's it! Start building with:**

```
"Show me how to deploy a Simplicity contract"
```
