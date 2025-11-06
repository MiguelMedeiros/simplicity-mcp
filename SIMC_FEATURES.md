# SimplicityHL (simc) Compiler Features

Quick reference for what works and doesn't work in the current simc compiler.

## ✅ Supported Features

### Basic Types
- `u32`, `bool`, `()`

### Variable Declarations
Must be inside `main()` with type annotations:
```rust
fn main() {
    let x: u32 = 42;
    let y: bool = true;
    ()
}
```

### Working Jets
- `jet::eq_32(a: u32, b: u32) -> bool` - Equality
- `jet::lt_32(a: u32, b: u32) -> bool` - Less than
- `jet::le_32(a: u32, b: u32) -> bool` - Less than or equal

### Assertions
```rust
fn main() {
    let value: u32 = 42;
    let expected: u32 = 42;
    let is_valid: bool = jet::eq_32(value, expected);
    assert!(is_valid);
    ()
}
```

## ❌ NOT Supported

- Top-level `let` declarations
- `witness` keyword
- `if/else` conditionals
- `match` pattern matching
- Custom functions (limited support)
- Tuple destructuring
- Most jets (`add_32`, `sha256`, `check_sig`, etc.)

## 📝 Common Errors

### "expected EOI or item"
**Cause:** Top-level `let` declaration
**Fix:** Move variables inside `fn main()`

### "expected call_args"
**Cause:** Using `witness`, wrong syntax, or tuple assignment
**Fix:** Use hardcoded values, check syntax, avoid tuples

### "Jet XYZ does not exist"
**Cause:** Using unsupported jet
**Fix:** Only use: `eq_32`, `lt_32`, `le_32`

## 📚 Working Examples

See `examples/contracts/` for:
- `empty.simf` - Minimal program
- `p2ms.simf` - Multisig pattern
- `htlc.simf` - Hash time lock
- `vault.simf` - Time-delayed withdrawal

All examples compile successfully with only supported features.

## 🛠️ MCP Tools

Use these for help:
- `simplicity_get_features` - List supported/unsupported features
- `simplicity_validate_syntax` - Validate before compiling
- `simplicity_suggest_fix` - Get help with errors
- `simplicity_generate_example` - Generate working code

---

**Keep it simple!** The current simc is very limited. Use examples as templates.
