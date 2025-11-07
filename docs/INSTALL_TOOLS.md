# Installing Simplicity Tools

Complete guide to installing the Simplicity toolchain.

## Prerequisites

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Verify
rustc --version
cargo --version
```

## simc (Simplicity Compiler)

```bash
# Install from source
git clone https://github.com/BlockstreamResearch/SimplicityHL.git
cd SimplicityHL
cargo build --release
cargo install --path .

# Verify
simc --version

# Test
echo 'fn main() { () }' > test.simf
simc test.simf
```

## hal-simplicity

```bash
# Install from Andrew Poelstra's branch with nums-key support
cargo install --git https://github.com/apoelstra/hal-simplicity.git --branch 2025-11/nums-key

# Verify
hal-simplicity --version

# Test
hal-simplicity simplicity --help
```

## Verification

Use MCP to check:

```
"Check if Simplicity tools are installed"
```

Or manually:

```bash
which simc && echo "✅ simc"
which hal-simplicity && echo "✅ hal-simplicity"
```

## Troubleshooting

### Rust Not Found
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

### Build Errors
```bash
rustup update
cargo clean
cargo build --release
```

### Tools Not in PATH
```bash
export PATH="$HOME/.cargo/bin:$PATH"
source ~/.bashrc  # or ~/.zshrc
```

## Platform Notes

**macOS:** M1/M2 Macs work natively
**Linux:** May need: `sudo apt install build-essential`
**Windows:** Use WSL2

## Next Steps

1. Restart Cursor
2. Verify: `"Check if Simplicity tools are installed"`
3. Compile: `"Compile examples/contracts/empty.simf"`
4. Deploy: `"Deploy examples/contracts/empty.simf with auto-funding"`

---

**Resources:**
- SimplicityHL: https://github.com/BlockstreamResearch/SimplicityHL
- hal-simplicity: https://github.com/BlockstreamResearch/hal-simplicity
- Rust: https://rustup.rs/
