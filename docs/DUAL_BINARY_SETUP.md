# Dual Binary Setup - Intelligent Tool Selection

## 🎯 Overview

O MCP Server agora usa **automaticamente** os dois binários do `hal-simplicity` de forma inteligente, escolhendo o binário correto para cada operação:

### 📦 Binary Selection Strategy

| Operation Type | Binary Used | Branch | Reason |
|---------------|-------------|--------|--------|
| **Parse programs** | `hal-simplicity` | 2025-11/nums-key | Latest, NUMS support |
| **Decode programs** | `hal-simplicity` | 2025-11/nums-key | Latest features |
| **Create addresses** | `hal-simplicity` | 2025-11/nums-key | General operations |
| **Compute sighash** | `hal-simplicity` | 2025-11/nums-key | Enhanced implementation |
| **Create PSET** | `hal-simplicity-signer` | 2025-10/pset-signer | PSET exclusive |
| **Update PSET** | `hal-simplicity-signer` | 2025-10/pset-signer | PSET exclusive |
| **Finalize PSET** | `hal-simplicity-signer` | 2025-10/pset-signer | PSET exclusive |
| **Extract TX** | `hal-simplicity-signer` | 2025-10/pset-signer | PSET exclusive |

## 🔧 Code Implementation

### SimplicityTools Class

```typescript
class SimplicityTools {
  private halSimplicityPath = 'hal-simplicity';      // nums-key
  private halSignerPath = 'hal-simplicity-signer';   // pset-signer
  
  // General operations use nums-key
  async getProgramInfo(program: string) {
    // Uses hal-simplicity
  }
  
  // PSET operations use pset-signer
  async createPSET() {
    // Uses hal-simplicity-signer
  }
}
```

## 🆕 New MCP Tools

Added 4 new PSET tools that use `hal-simplicity-signer`:

### 1. pset_create

Create an empty PSET to start building a transaction.

```typescript
// Example usage in Cursor
"Create a new PSET"
```

**Returns:**
```json
{
  "success": true,
  "pset": "cHNldP8BA...",
  "note": "Uses hal-simplicity-signer (pset-signer branch)"
}
```

### 2. pset_update_input

Add UTXO data to a PSET input.

```typescript
// Example
"Update PSET with UTXO txid abc123, vout 0, amount 100000"
```

**Parameters:**
- `pset` - The PSET to update
- `txid` - Transaction ID of UTXO
- `vout` - Output index
- `amount` - Amount in satoshis
- `asset` (optional) - Asset ID
- `script_pubkey` (optional) - Script pubkey

### 3. pset_finalize

Attach Simplicity program and witness to complete the PSET.

```typescript
// Example
"Finalize PSET with program <base64> and witness <hex>"
```

**Parameters:**
- `pset` - The PSET with UTXO data
- `program` - Base64-encoded Simplicity program
- `witness` - Hex-encoded witness data

### 4. pset_extract

Extract the final signed transaction.

```typescript
// Example
"Extract transaction from PSET"
```

**Returns:**
```json
{
  "success": true,
  "transaction": "020000000...",
  "note": "Use elements_broadcast_transaction to broadcast"
}
```

## 🔄 Complete Workflow Example

### Via Cursor Chat

```
User: "I want to deploy and sign a transaction for my empty contract"

AI: I'll help you create, sign, and broadcast a Simplicity transaction:

1. First, compile your contract:
   "Compile examples/contracts/empty.simf"
   
2. Create address:
   "Create address from program <base64>"
   [Uses hal-simplicity - nums-key branch]
   
3. Fund the address (via faucet):
   "Request funds for address <addr>"
   
4. Create PSET:
   "Create a new PSET"
   [Uses hal-simplicity-signer - pset-signer branch]
   
5. Update with UTXO:
   "Update PSET with UTXO from funding transaction"
   [Uses hal-simplicity-signer]
   
6. Finalize:
   "Finalize PSET with program and witness"
   [Uses hal-simplicity-signer]
   
7. Extract:
   "Extract transaction from PSET"
   [Uses hal-simplicity-signer]
   
8. Broadcast:
   "Broadcast transaction <hex>"
   [Uses Esplora API]
```

## 📋 Method Mapping

### General Operations → hal-simplicity (nums-key)

```typescript
✅ simplicityTools.getProgramInfo()      // Parse & get address
✅ simplicityTools.decodeProgram()       // Decode to readable format
✅ simplicityTools.compileFile()         // Compile .simf files
✅ simplicityTools.compileSource()       // Compile source code
```

### Signing Operations → hal-simplicity-signer (pset-signer)

```typescript
✅ simplicityTools.createPSET()          // Create empty PSET
✅ simplicityTools.updatePSETInput()     // Add UTXO data
✅ simplicityTools.finalizePSET()        // Attach program & witness
✅ simplicityTools.extractTransaction()  // Get signed transaction
```

## 🧪 Testing

All 109 tests passing! Including:

```bash
✅ 8 test files
✅ 109 tests total
✅ 4 new PSET tests
```

New PSET tests verify:
- PSET tools are registered
- Correct tool count (49 total)
- PSET handlers exist
- Tool schemas are valid

## 🎓 Benefits

### 1. Automatic Selection
- **No user confusion** - MCP chooses the right binary
- **Transparent** - Users don't need to know about branches
- **Optimal** - Always uses the best tool for the job

### 2. Best of Both Worlds
- **nums-key features** for general ops (NUMS keys, enhanced sighash)
- **pset-signer features** for signing (PSET workflow)

### 3. Future-Proof
- Easy to add more operations
- Can update branches independently
- Clear separation of concerns

## 📊 Statistics

```
Total MCP Tools: 49 (+4 new)
├─ Simplicity: 17
├─ Elements: 16
├─ PSET: 4 (NEW)
├─ Faucet: 2
├─ Contract: 2
├─ Helper: 4
└─ Integration: 4

Binaries Used: 2
├─ hal-simplicity (nums-key): General operations
└─ hal-simplicity-signer (pset-signer): Signing operations
```

## 🔍 Binary Detection

The server automatically detects both binaries on startup:

```typescript
checkToolsInstallation() {
  ✅ simc_installed
  ✅ hal_simplicity_installed      // nums-key
  ✅ hal_signer_installed          // pset-signer
}
```

If missing, provides installation instructions for the correct branch.

## 💡 Usage Tips

### For Users (via Cursor)

Just ask naturally:
- ✅ "Create address from my program" → Uses nums-key
- ✅ "Sign this transaction" → Uses pset-signer automatically
- ✅ "Parse this Simplicity program" → Uses nums-key

### For Developers

The selection is automatic in `SimplicityTools`:

```typescript
// This automatically uses the right binary
const info = await tools.getProgramInfo(program);
const pset = await tools.createPSET();
```

## 🚀 Future Enhancements

Potential additions:
- [ ] Auto-fallback if one binary is missing
- [ ] Binary version checks
- [ ] Performance metrics per binary
- [ ] More PSET manipulation tools

## 📚 Related Documentation

- [HAL_SIMPLICITY_BRANCHES_DIFF.md](HAL_SIMPLICITY_BRANCHES_DIFF.md) - Branch comparison
- [HAL_SIMPLICITY_BRANCHES.md](HAL_SIMPLICITY_BRANCHES.md) - Setup guide
- [HAL_SIMPLICITY_SETUP.md](HAL_SIMPLICITY_SETUP.md) - Installation details

---

**Implementation Date:** November 7, 2025  
**Status:** ✅ Production Ready  
**Tests:** 109 passing

