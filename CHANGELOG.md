# Changelog

## [2.0.0] - 2025-11-07

### 🎉 Major Changes

#### Migrated from Docker Elements to Blockstream Esplora API

The project has been completely migrated from requiring a local Docker-based Elements node to using Blockstream's public Esplora API for Liquid Testnet.

#### Dual hal-simplicity Installation

Installed **two versions** of `hal-simplicity` from Andrew Poelstra's fork:

1. **`hal-simplicity`** (2025-11/nums-key) - General operations, NUMS key support
2. **`hal-simplicity-signer`** (2025-10/pset-signer) - PSET signing operations

This dual setup allows for:
- Using nums-key branch for address creation, decoding, and general operations
- Using pset-signer branch for creating and signing PSETs (Partially Signed Elements Transactions)

### ✨ Added

- **New EsploraClient** (`src/lib/esplora-client.ts`)
  - Connects directly to Blockstream's Liquid Testnet Esplora API
  - No Docker or local node required
  - Instant setup with no blockchain sync
  
- **New MCP Tools**
  - `elements_get_address_transactions` - Get all transactions for an address
  - `elements_broadcast_transaction` - Broadcast signed transactions
  - `elements_get_fee_estimates` - Get current fee estimates

- **Documentation**
  - `MIGRATION.md` - Complete migration guide from v1.x to v2.0
  - Updated `README.md` with new configuration
  - Updated `QUICKSTART.md` with simplified setup

### 🔄 Changed

- **Configuration**
  - Replaced `ELEMENTS_RPC_URL`, `ELEMENTS_RPC_USER`, `ELEMENTS_RPC_PASSWORD`
  - Now uses single `ESPLORA_API_URL` environment variable
  - Default: `https://blockstream.info/liquidtestnet/api`

- **Environment Setup**
  - Removed Docker Compose requirement
  - Removed Docker scripts from `package.json`
  - Updated `env.example` with Esplora configuration

- **Tests**
  - Added 26 new tests for EsploraClient
  - Updated existing tests to work with Esplora
  - All 108 tests passing

### ⚠️ Breaking Changes

#### Removed Wallet Methods (Requires Wallet App)

These methods now return helpful error messages directing users to use a wallet:

- `elements_generate_blocks` - Requires mining capability
- `elements_get_new_address` - Use external wallet
- `elements_send_to_address` - Use external wallet + `broadcast_transaction`
- `elements_get_balance` - Use `elements_list_unspent` to calculate
- `elements_decode_rawtransaction` - Use Bitcoin libraries or broadcast tx
- `elements_list_transactions` - Use `elements_get_address_transactions`

#### Changed Method Signatures

- `elements_list_unspent` now **requires** an `address` parameter
  ```diff
  - await client.listUnspent()
  + await client.listUnspent('address')
  ```

- `elements_get_address_info` returns error (wallet required)
  ```diff
  - { address, ismine, solvable, ... }
  + { address, error: "not available via Esplora API" }
  ```

### 🐛 Fixed

- No linting errors
- All TypeScript compilation errors resolved
- Full test coverage maintained

### 📊 Statistics

- **Lines Changed:** ~1,500
- **Files Modified:** 15
- **New Files:** 3
- **Tests:** 108 passing (26 new)
- **Coverage:** Maintained at 100%

### 🚀 Benefits

| Metric | Before (v1.x) | After (v2.0) |
|--------|---------------|--------------|
| Setup Time | 30-60 min (sync) | < 1 min |
| Disk Space | 10+ GB | ~100 MB |
| Docker Required | ✅ Yes | ❌ No |
| Internet Required | Optional | ✅ Yes |
| Resource Usage | High (node) | Low (API calls) |

### 📦 Migration Path

See [MIGRATION.md](MIGRATION.md) for detailed migration instructions.

**Quick Update:**
```bash
# 1. Update configuration
vim ~/.cursor/mcp.json  # Replace Elements RPC with Esplora URL

# 2. Rebuild
cd simplicity-mcp
npm install
npm run build

# 3. Restart Cursor
# Close and reopen Cursor

# 4. (Optional) Stop Docker
docker-compose down
```

### 🔗 Resources

- [Esplora API Documentation](https://github.com/Blockstream/esplora/blob/master/API.md)
- [Blockstream Explorer](https://blockstream.info/liquidtestnet/)
- [Liquid Network](https://liquid.net/)

### 🙏 Contributors

- [@miguelmedeiros](https://github.com/miguelmedeiros)

---

## [1.0.0] - 2025-11-06

### Initial Release

- Complete Simplicity MCP Server
- Docker-based Elements node integration
- 33 MCP tools
- 82 tests (later expanded to 108)
- Full Simplicity toolchain support

