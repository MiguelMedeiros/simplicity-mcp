# Simplicity Contract Examples

This directory contains example Simplicity contracts and their witness files.

## Contracts

### 1. empty.simf
The simplest Simplicity program that always approves transactions.

**Use Case**: Testing, learning Simplicity basics.

**Witness**: `witnesses/empty.wit` (empty object)

### 2. p2ms.simf
Pay-to-Multisig: A 2-of-3 multisig contract.

**Use Case**: Joint custody, corporate wallets, escrow services.

**Features**:
- Requires 2 out of 3 signatures
- Each key can independently authorize
- Flexible threshold signing

### 3. htlc.simf
Hash Time Lock Contract: Spend via hash preimage OR after timeout.

**Use Case**: Atomic swaps, Lightning-style payments, conditional payments.

**Features**:
- Recipient can spend with hash preimage
- Original sender can reclaim after timeout
- Trustless conditional payments

**Witness Options**:
- `witnesses/htlc-preimage.wit` (for recipient spending)
- `witnesses/htlc-timeout.wit` (for refund after timeout)

### 4. vault.simf
Time-delayed withdrawal vault for enhanced security.

**Use Case**: Cold storage, high-security wallets, protection against key compromise.

**Features**:
- Withdrawals require time delay (e.g., 1 day)
- Guardian key can always intervene
- Protection against immediate theft

### 5. timelock.simf
Simple timelock contract that locks funds until a specific block height.

**Use Case**: Scheduled payments, vesting schedules, forced savings, inheritance planning.

**Features**:
- Funds locked until block 1000
- Cannot be spent before unlock height
- Simple and secure time-based restriction
- No additional signatures required after unlock

**Witness**: `witnesses/timelock.wit`

## Using These Contracts

### With simc (Simplicity Compiler)

```bash
# Compile a contract
simc examples/contracts/empty.simf

# Output will be base64-encoded Simplicity program
```

### With hal-simplicity

```bash
# Get address and info for a compiled program
hal-simplicity simplicity info <base64-program>

# This gives you:
# - On-chain address to send funds to
# - Program hash
# - Expected witness structure
```

### With MCP Tools

Use the Simplicity MCP server to interact with these contracts:

```typescript
// Compile contract
await mcp.call('simplicity_compile_file', {
  file_path: 'examples/contracts/p2ms.simf'
});

// Get address for contract
await mcp.call('simplicity_get_address', {
  program: '<base64-program>'
});

// Fund the contract
await mcp.call('simplicity_fund_contract', {
  address: '<contract-address>',
  amount: 0.001
});

// Spend from contract
await mcp.call('simplicity_spend_contract', {
  program: '<base64-program>',
  witness_file: 'examples/witnesses/empty.wit'
});
```

## Workflow Example: Timelock

1. **Compile and deploy**:
   ```bash
   simc examples/contracts/timelock.simf
   hal-simplicity simplicity info <program> # Get address
   ```

2. **Fund contract**:
   Send LBTC to the contract address (funds are now locked)

3. **Wait for unlock**:
   ```bash
   # Check current block height
   elements-cli getblockcount
   # Wait until block >= 1000
   ```

4. **Spend after unlock**:
   ```bash
   # After block 1000, funds can be spent
   # Create transaction spending from contract
   # Broadcast
   ```

## Workflow Example: HTLC

1. **Create contract with hash lock**:
   ```bash
   # Generate secret
   echo "my-secret" | sha256sum
   # Use this hash in htlc.simf
   ```

2. **Compile and deploy**:
   ```bash
   simc examples/contracts/htlc.simf
   hal-simplicity simplicity info <program> # Get address
   ```

3. **Fund contract**:
   Use faucet or send LBTC to contract address

4. **Recipient spends** (with preimage):
   ```bash
   # Provide preimage in witness
   # Sign transaction
   # Broadcast
   ```

5. **OR Sender reclaims** (after timeout):
   ```bash
   # Wait for timeout block
   # Sign with refund key
   # Broadcast
   ```

## Advanced Examples

### Creating Custom Contracts

1. **Define your logic** in SimplicityHL (.simf)
2. **Compile** with simc
3. **Generate address** with hal-simplicity
4. **Test** on Liquid testnet
5. **Deploy** to production

### Best Practices

- Always test on Liquid testnet first
- Verify witness structure before funding
- Use appropriate timeouts for HTLCs
- Consider guardian keys for high-value vaults
- Audit contracts before production use

## Resources

- [Simplicity Documentation](https://simplicity-lang.org/)
- [SimplicityHL Examples](https://github.com/BlockstreamResearch/SimplicityHL/tree/master/examples)
- [Liquid Testnet Explorer](https://blockstream.info/liquidtestnet/)
- [Liquid Testnet Faucet](https://liquidtestnet.com/faucet)


