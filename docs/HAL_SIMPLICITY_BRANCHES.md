# hal-simplicity - Dual Branch Setup

## 🎯 Overview

We have installed **two versions** of `hal-simplicity` from different branches, each serving a specific purpose:

1. **`hal-simplicity`** (nums-key branch) - For general operations
2. **`hal-simplicity-signer`** (pset-signer branch) - For signing/PSET operations

## 📦 Installed Versions

### Version 1: nums-key Branch (General Use)

```bash
Binary: hal-simplicity
Branch: 2025-11/nums-key
Location: ~/.cargo/bin/hal-simplicity
Source: https://github.com/apoelstra/hal-simplicity/tree/2025-11/nums-key
```

**Purpose:** General Simplicity operations, NUMS key support, sighash computation

**Available Commands:**
```bash
hal-simplicity address create/inspect    # Address operations
hal-simplicity block create/decode       # Block operations  
hal-simplicity keypair generate          # Key generation
hal-simplicity simplicity info           # Parse programs
hal-simplicity simplicity sighash        # Compute sighashes
hal-simplicity tx create/decode          # Transaction operations
```

### Version 2: pset-signer Branch (Signing Operations)

```bash
Binary: hal-simplicity-signer
Branch: 2025-10/pset-signer
Location: ~/.cargo/bin/hal-simplicity-signer
Source: https://github.com/apoelstra/hal-simplicity/tree/2025-10/pset-signer
```

**Purpose:** PSET (Partially Signed Elements Transaction) operations for signing

**Exclusive Commands:**
```bash
hal-simplicity-signer simplicity pset create         # Create empty PSET
hal-simplicity-signer simplicity pset update-input   # Attach UTXO data
hal-simplicity-signer simplicity pset finalize       # Attach program & witness
hal-simplicity-signer simplicity pset extract        # Extract raw transaction
```

**All other commands are the same as nums-key branch**

## 🔑 Key Differences

| Feature | nums-key Branch | pset-signer Branch |
|---------|----------------|-------------------|
| **Binary Name** | `hal-simplicity` | `hal-simplicity-signer` |
| **Main Purpose** | General operations | Transaction signing |
| **NUMS Key Support** | ✅ Yes | ❌ No |
| **PSET Commands** | ❌ No | ✅ Yes |
| **Sighash** | ✅ Yes | ✅ Yes |
| **Address Creation** | ✅ Yes | ✅ Yes |
| **Info/Decode** | ✅ Yes | ✅ Yes |

## 🛠️ Usage Guide

### When to Use hal-simplicity (nums-key)

Use for:
- ✅ Creating addresses from Simplicity programs
- ✅ Parsing and decoding programs
- ✅ Computing sighashes
- ✅ NUMS key operations
- ✅ General blockchain operations

**Example:**
```bash
# Decode a program
hal-simplicity simplicity info <base64-program>

# Create address
hal-simplicity address create <program>

# Compute sighash
hal-simplicity simplicity sighash <args>
```

### When to Use hal-simplicity-signer (pset-signer)

Use for:
- ✅ Creating PSETs (Partially Signed Elements Transactions)
- ✅ Updating PSET inputs with UTXO data
- ✅ Finalizing PSETs with Simplicity programs
- ✅ Extracting signed transactions
- ✅ **All signing operations**

**Example:**
```bash
# Create a new PSET
hal-simplicity-signer simplicity pset create

# Update PSET with UTXO data
hal-simplicity-signer simplicity pset update-input <pset> <args>

# Finalize with Simplicity program
hal-simplicity-signer simplicity pset finalize <pset> <program> <witness>

# Extract final transaction
hal-simplicity-signer simplicity pset extract <pset>
```

## 🔄 Complete Workflow Example

### Step 1: Create Address (nums-key)
```bash
# Compile contract
simc contract.simf > program.b64

# Create address
hal-simplicity address create $(cat program.b64)
```

### Step 2: Create & Sign Transaction (pset-signer)
```bash
# Create PSET
hal-simplicity-signer simplicity pset create > unsigned.pset

# Update with UTXO
hal-simplicity-signer simplicity pset update-input unsigned.pset \
  --txid <txid> --vout <n> --amount <amt> > updated.pset

# Finalize with program and witness
hal-simplicity-signer simplicity pset finalize updated.pset \
  $(cat program.b64) $(cat witness.json) > finalized.pset

# Extract signed transaction
hal-simplicity-signer simplicity pset extract finalized.pset > signed.tx
```

### Step 3: Broadcast (Esplora API)
```bash
# Use the MCP server or curl
curl -X POST https://blockstream.info/liquidtestnet/api/tx \
  -H "Content-Type: text/plain" \
  --data "$(cat signed.tx)"
```

## 📝 PSET Command Reference

### pset create
Create an empty PSET to start building a transaction.

```bash
hal-simplicity-signer simplicity pset create [OPTIONS]
```

### pset update-input
Attach UTXO information to a PSET input.

```bash
hal-simplicity-signer simplicity pset update-input <PSET> [OPTIONS]
  --txid <TXID>           # Previous transaction ID
  --vout <N>              # Output index
  --amount <AMOUNT>       # Amount in satoshis
  --asset <ASSET>         # Asset ID (optional for L-BTC)
  --script <SCRIPT>       # Script pubkey
```

### pset finalize
Attach Simplicity program and witness to complete the PSET.

```bash
hal-simplicity-signer simplicity pset finalize <PSET> <PROGRAM> <WITNESS>
```

### pset extract
Extract the final signed transaction from a completed PSET.

```bash
hal-simplicity-signer simplicity pset extract <PSET>
```

## 🔧 Integration with MCP Server

The MCP server should use:

### For General Operations (simplicity-tools.ts)
```typescript
private halSimplicityPath = 'hal-simplicity';  // nums-key branch
```

### For Signing Operations (New: pset-tools.ts)
```typescript
private halSignerPath = 'hal-simplicity-signer';  // pset-signer branch
```

## 🧪 Verification

Test both installations:

```bash
# Test nums-key branch
hal-simplicity --version
hal-simplicity simplicity --help

# Test pset-signer branch  
hal-simplicity-signer --version
hal-simplicity-signer simplicity pset --help

# Verify locations
which hal-simplicity
which hal-simplicity-signer
```

Expected output:
```
hal-simplicity 0.1.0
/Users/miguelmedeiros/.cargo/bin/hal-simplicity

hal-simplicity 0.1.0
/Users/miguelmedeiros/.cargo/bin/hal-simplicity-signer
```

## 🔄 Updating

### Update nums-key branch:
```bash
cargo install --git https://github.com/apoelstra/hal-simplicity.git \
  --branch 2025-11/nums-key --force
```

### Update pset-signer branch:
```bash
cd /tmp
git clone https://github.com/apoelstra/hal-simplicity.git hal-simplicity-signer
cd hal-simplicity-signer
git checkout 2025-10/pset-signer
cargo build --release
cp target/release/hal-simplicity ~/.cargo/bin/hal-simplicity-signer
```

## 💡 Pro Tips

1. **Use aliases** for convenience:
   ```bash
   alias hal='hal-simplicity'
   alias hal-signer='hal-simplicity-signer'
   ```

2. **Default to nums-key** for most operations, only use pset-signer for signing

3. **PSET workflow** is the recommended way to sign Simplicity transactions

4. **Keep both updated** as they may have different bug fixes

## 🐛 Troubleshooting

### Binary not found
```bash
echo $PATH | grep .cargo/bin
export PATH="$HOME/.cargo/bin:$PATH"
```

### Wrong binary being used
```bash
# Check which one is being called
type hal-simplicity
type hal-simplicity-signer

# Use full path if needed
~/.cargo/bin/hal-simplicity-signer simplicity pset create
```

### PSET commands not available
Make sure you're using `hal-simplicity-signer`, not `hal-simplicity`:
```bash
# ❌ Wrong
hal-simplicity simplicity pset create

# ✅ Correct
hal-simplicity-signer simplicity pset create
```

## 📚 References

- **nums-key branch:** https://github.com/apoelstra/hal-simplicity/tree/2025-11/nums-key
- **pset-signer branch:** https://github.com/apoelstra/hal-simplicity/tree/2025-10/pset-signer
- **Original hal-elements:** https://github.com/stevenroose/hal

---

**Setup Date:** November 7, 2025  
**Maintainer Note:** According to the developer, pset-signer branch is used for signing, master/nums-key for everything else.

