/**
 * Simplicity Tools Integration
 * Wrapper for simc and hal-simplicity command-line tools
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync } from 'fs';

const execAsync = promisify(exec);

export interface CompileResult {
  success: boolean;
  program?: string; // base64 encoded
  error?: string;
  warnings?: string[];
}

export interface ProgramInfo {
  address?: string;
  program_hash?: string;
  witness_structure?: Record<string, unknown>;
  error?: string;
}

export interface SimplicityToolsConfig {
  simcPath?: string;
  halSimplicityPath?: string;
  halSignerPath?: string;
}

export class SimplicityTools {
  private simcPath: string;
  private halSimplicityPath: string;
  private halSignerPath: string;

  constructor(config: SimplicityToolsConfig = {}) {
    this.simcPath = config.simcPath || 'simc';
    this.halSimplicityPath = config.halSimplicityPath || 'hal-simplicity';
    this.halSignerPath = config.halSignerPath || 'hal-simplicity-signer';
  }

  /**
   * Check if simc is available
   */
  async isSimcAvailable(): Promise<boolean> {
    try {
      await execAsync(`which ${this.simcPath}`);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if hal-simplicity is available
   */
  async isHalSimplicityAvailable(): Promise<boolean> {
    try {
      await execAsync(`which ${this.halSimplicityPath}`);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if hal-simplicity-signer is available
   */
  async isHalSignerAvailable(): Promise<boolean> {
    try {
      await execAsync(`which ${this.halSignerPath}`);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Compile a .simf file to Simplicity program
   */
  async compileFile(filePath: string): Promise<CompileResult> {
    // Check if file exists
    if (!existsSync(filePath)) {
      return {
        success: false,
        error: `File not found: ${filePath}`,
      };
    }

    // Check if simc is available
    const simcAvailable = await this.isSimcAvailable();
    if (!simcAvailable) {
      return {
        success: false,
        error:
          'simc not found. Please install SimplicityHL compiler from https://github.com/BlockstreamResearch/SimplicityHL',
      };
    }

    try {
      const { stdout, stderr } = await execAsync(
        `${this.simcPath} "${filePath}"`
      );

      const warnings = stderr ? stderr.split('\n').filter(Boolean) : [];

      return {
        success: true,
        program: stdout.trim(),
        warnings,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Compilation failed',
      };
    }
  }

  /**
   * Compile Simplicity source code (string)
   */
  async compileSource(source: string): Promise<CompileResult> {
    const simcAvailable = await this.isSimcAvailable();
    if (!simcAvailable) {
      return {
        success: false,
        error:
          'simc not found. Please install SimplicityHL compiler from https://github.com/BlockstreamResearch/SimplicityHL',
      };
    }

    try {
      // Write to temporary file and compile
      const { writeFile, unlink } = await import('fs/promises');
      const tmpFile = `/tmp/simplicity-${Date.now()}.simf`;

      await writeFile(tmpFile, source);

      try {
        const result = await this.compileFile(tmpFile);
        await unlink(tmpFile);
        return result;
      } catch (error) {
        await unlink(tmpFile).catch(() => {});
        throw error;
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Compilation failed',
      };
    }
  }

  /**
   * Get program info (address, hash, witness structure)
   * Uses hal-simplicity (nums-key branch) for general operations
   */
  async getProgramInfo(program: string): Promise<ProgramInfo> {
    const halAvailable = await this.isHalSimplicityAvailable();
    if (!halAvailable) {
      return {
        error:
          'hal-simplicity not found. Please install nums-key branch from https://github.com/apoelstra/hal-simplicity',
      };
    }

    try {
      const { stdout } = await execAsync(
        `echo "${program}" | ${this.halSimplicityPath} simplicity info`
      );

      // Parse hal-simplicity output
      const lines = stdout.split('\n');
      const info: ProgramInfo = {};

      for (const line of lines) {
        if (line.includes('address:')) {
          info.address = line.split(':')[1].trim();
        } else if (line.includes('program_hash:')) {
          info.program_hash = line.split(':')[1].trim();
        }
      }

      return info;
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : 'Failed to get program info',
      };
    }
  }

  /**
   * Decode a Simplicity program
   * Uses hal-simplicity (nums-key branch) for general operations
   */
  async decodeProgram(program: string): Promise<{
    success: boolean;
    decoded?: string;
    error?: string;
  }> {
    const halAvailable = await this.isHalSimplicityAvailable();
    if (!halAvailable) {
      return {
        success: false,
        error:
          'hal-simplicity not found. Please install nums-key branch from https://github.com/apoelstra/hal-simplicity',
      };
    }

    try {
      const { stdout } = await execAsync(
        `echo "${program}" | ${this.halSimplicityPath} simplicity info`
      );

      return {
        success: true,
        decoded: stdout.trim(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Decoding failed',
      };
    }
  }

  /**
   * Create a PSET (Partially Signed Elements Transaction)
   * Uses hal-simplicity-signer (pset-signer branch) for PSET operations
   */
  async createPSET(): Promise<{
    success: boolean;
    pset?: string;
    error?: string;
  }> {
    const signerAvailable = await this.isHalSignerAvailable();
    if (!signerAvailable) {
      return {
        success: false,
        error:
          'hal-simplicity-signer not found. Please install pset-signer branch from https://github.com/apoelstra/hal-simplicity',
      };
    }

    try {
      const { stdout } = await execAsync(
        `${this.halSignerPath} simplicity pset create`
      );

      return {
        success: true,
        pset: stdout.trim(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create PSET',
      };
    }
  }

  /**
   * Update PSET input with UTXO data
   * Uses hal-simplicity-signer (pset-signer branch)
   */
  async updatePSETInput(
    pset: string,
    txid: string,
    vout: number,
    amount: number,
    asset?: string,
    scriptPubKey?: string
  ): Promise<{
    success: boolean;
    pset?: string;
    error?: string;
  }> {
    const signerAvailable = await this.isHalSignerAvailable();
    if (!signerAvailable) {
      return {
        success: false,
        error:
          'hal-simplicity-signer not found. Please install pset-signer branch',
      };
    }

    try {
      let cmd = `echo "${pset}" | ${this.halSignerPath} simplicity pset update-input --txid ${txid} --vout ${vout} --amount ${amount}`;
      
      if (asset) {
        cmd += ` --asset ${asset}`;
      }
      if (scriptPubKey) {
        cmd += ` --script ${scriptPubKey}`;
      }

      const { stdout } = await execAsync(cmd);

      return {
        success: true,
        pset: stdout.trim(),
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to update PSET input',
      };
    }
  }

  /**
   * Finalize PSET with Simplicity program and witness
   * Uses hal-simplicity-signer (pset-signer branch)
   */
  async finalizePSET(
    pset: string,
    program: string,
    witness: string
  ): Promise<{
    success: boolean;
    pset?: string;
    error?: string;
  }> {
    const signerAvailable = await this.isHalSignerAvailable();
    if (!signerAvailable) {
      return {
        success: false,
        error:
          'hal-simplicity-signer not found. Please install pset-signer branch',
      };
    }

    try {
      const { stdout } = await execAsync(
        `echo "${pset}" | ${this.halSignerPath} simplicity pset finalize "${program}" "${witness}"`
      );

      return {
        success: true,
        pset: stdout.trim(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to finalize PSET',
      };
    }
  }

  /**
   * Extract signed transaction from finalized PSET
   * Uses hal-simplicity-signer (pset-signer branch)
   */
  async extractTransaction(pset: string): Promise<{
    success: boolean;
    transaction?: string;
    error?: string;
  }> {
    const signerAvailable = await this.isHalSignerAvailable();
    if (!signerAvailable) {
      return {
        success: false,
        error:
          'hal-simplicity-signer not found. Please install pset-signer branch',
      };
    }

    try {
      const { stdout } = await execAsync(
        `echo "${pset}" | ${this.halSignerPath} simplicity pset extract`
      );

      return {
        success: true,
        transaction: stdout.trim(),
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to extract transaction',
      };
    }
  }

  /**
   * Create witness file structure
   */
  createWitnessTemplate(contractType: string): Record<string, unknown> {
    const templates: Record<string, Record<string, unknown>> = {
      empty: {},
      p2ms: {
        sig1: '0x304402...',
        sig2: '0x304402...',
        sig3: null,
      },
      htlc: {
        preimage: '0x00...',
        signature: '0x304402...',
      },
      vault: {
        signature: '0x304402...',
        withdrawal_block: 0,
      },
    };

    return templates[contractType] || {};
  }

  /**
   * Validate SimplicityHL source code syntax
   * Returns helpful error messages for common mistakes
   */
  validateSyntax(source: string): {
    valid: boolean;
    errors: string[];
    warnings: string[];
    suggestions: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Check for top-level let declarations (not allowed)
    const topLevelLetRegex = /^let\s+\w+/m;
    if (topLevelLetRegex.test(source)) {
      errors.push(
        'Top-level `let` declarations are not supported. Move all `let` statements inside the `main()` function.'
      );
      suggestions.push('Example: fn main() { let x: u32 = 42; () }');
    }

    // Check for witness usage (not available)
    if (source.includes('witness')) {
      warnings.push(
        'IMPORTANT: `witness` is not available in current simc version. Use hardcoded values for now.'
      );
      suggestions.push(
        'Replace `let x = witness("value")` with `let x: u32 = 42` (hardcoded value)'
      );
    }

    // Check for if/else (not supported)
    if (/\bif\s+\w+/.test(source)) {
      errors.push(
        'Conditional statements (if/else) are not supported in current simc version.'
      );
      suggestions.push(
        'Use `assert!()` for validation instead of conditional logic.'
      );
    }

    // Check for match expressions (not supported)
    if (/\bmatch\s+\w+/.test(source)) {
      errors.push(
        'Pattern matching with `match` is not supported in current simc version.'
      );
    }

    // Check for unsupported jets
    const unsupportedJets = [
      'gt_32',
      'ge_32',
      'and',
      'or',
      'not',
      'sha256',
      'sha256_32',
      'verify',
      'current_block_height',
      'check_sig',
    ];
    for (const jet of unsupportedJets) {
      if (source.includes(`jet::${jet}`)) {
        warnings.push(
          `jet::${jet} may not be available. Supported jets: eq_32, lt_32, le_32`
        );
      }
    }

    // Check for variable assignment from function calls
    const assignmentFromCallRegex = /let\s+\w+\s*=\s*\w+\(/;
    if (assignmentFromCallRegex.test(source)) {
      warnings.push(
        'Assigning function return values may fail if the function returns a complex type (tuple, etc).'
      );
      suggestions.push('Ensure functions return simple types (u32, bool, ())');
    }

    // Check if main() exists
    if (!source.includes('fn main()')) {
      errors.push(
        'Missing `fn main()` function. Every program must have a main() function.'
      );
    }

    // Check for custom function definitions (limited support)
    const customFnRegex = /fn\s+(?!main)\w+\s*\(/;
    if (customFnRegex.test(source)) {
      warnings.push(
        'Custom functions have limited support. Keep functions simple and test thoroughly.'
      );
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      suggestions,
    };
  }

  /**
   * Get information about available simc features
   */
  getAvailableFeatures(): {
    supported: string[];
    notSupported: string[];
    jets: {
      working: string[];
      notTested: string[];
    };
  } {
    return {
      supported: [
        'Variable declarations inside main() with type annotations',
        'Basic types: u32, bool, ()',
        'assert!() for validation',
        'Comparison jets: jet::eq_32, jet::lt_32, jet::le_32',
        'Simple arithmetic with proper type handling',
      ],
      notSupported: [
        'Top-level let declarations',
        'witness keyword (not yet available)',
        'if/else conditional statements',
        'match pattern matching',
        'Custom function definitions (limited)',
        'Tuple destructuring',
        'Hash functions (sha256, etc)',
        'Blockchain context (current_block_height, etc)',
        'Signature verification (check_sig)',
      ],
      jets: {
        working: ['jet::eq_32', 'jet::lt_32', 'jet::le_32'],
        notTested: [
          'jet::add_32 (returns tuple)',
          'jet::sub_32',
          'jet::mul_32',
          'jet::sha256',
          'jet::verify',
          'jet::check_sig',
        ],
      },
    };
  }

  /**
   * Generate a working example contract based on pattern
   */
  generateExample(pattern: 'minimal' | 'comparison' | 'assertion'): string {
    const examples = {
      minimal: `// Minimal working Simplicity program
fn main() {
    ()
}`,
      comparison: `// Example using comparison jets
fn main() {
    let a: u32 = 100;
    let b: u32 = 50;
    
    // Compare values
    let equal: bool = jet::eq_32(a, b);
    let less_than: bool = jet::lt_32(b, a);
    let less_or_eq: bool = jet::le_32(b, a);
    
    ()
}`,
      assertion: `// Example using assertions for validation
fn main() {
    let value: u32 = 42;
    let expected: u32 = 42;
    
    // Verify value matches expected
    let is_valid: bool = jet::eq_32(value, expected);
    assert!(is_valid);
    
    ()
}`,
    };

    return examples[pattern] || examples.minimal;
  }

  /**
   * Provide helpful suggestions based on error message
   */
  suggestFix(errorMessage: string): string[] {
    const suggestions: string[] = [];

    if (errorMessage.includes('expected EOI or item')) {
      suggestions.push(
        'This error usually means a top-level declaration is not allowed.'
      );
      suggestions.push('Move all `let` statements inside fn main() { ... }');
    }

    if (errorMessage.includes('Grammar error: expected call_args')) {
      suggestions.push(
        'This might be due to: 1) using witness which is not available, 2) incorrect function call syntax, or 3) trying to assign a tuple return value'
      );
      suggestions.push('Try using simple types and hardcoded values');
    }

    if (
      errorMessage.includes('Jet') &&
      errorMessage.includes('does not exist')
    ) {
      suggestions.push('This jet is not available in current simc version.');
      suggestions.push('Available jets: eq_32, lt_32, le_32');
    }

    if (errorMessage.includes('Expected expression of type')) {
      suggestions.push(
        'Type mismatch detected. Some jets return tuples (like add_32 returns (bool, u32))'
      );
      suggestions.push(
        'Use jets that return simple types: eq_32, lt_32, le_32'
      );
    }

    if (suggestions.length === 0) {
      suggestions.push(
        'Check the simc documentation or use generateExample() to see working patterns'
      );
    }

    return suggestions;
  }
}

/**
 * Helper function to extract transaction from hal-simplicity output
 */
export function extractTransaction(output: string): string | null {
  const lines = output.split('\n');
  for (const line of lines) {
    if (line.includes('with.transaction')) {
      const parts = line.split(' ');
      const txPart = parts[parts.length - 1];
      return txPart.split('.')[0];
    }
  }
  return null;
}

/**
 * Helper to check if a program is valid base64
 */
export function isValidBase64Program(program: string): boolean {
  try {
    // Check if it's valid base64
    const decoded = Buffer.from(program, 'base64');
    // Check if it can be re-encoded to the same string
    return Buffer.from(decoded).toString('base64') === program;
  } catch {
    return false;
  }
}

/**
 * Check if all required Simplicity tools are installed
 */
export async function checkToolsInstallation(): Promise<{
  simc_installed: boolean;
  hal_simplicity_installed: boolean;
  hal_signer_installed: boolean;
  all_installed: boolean;
  missing_tools: string[];
  installation_instructions: string;
}> {
  const tools = new SimplicityTools();

  const simcInstalled = await tools.isSimcAvailable();
  const halInstalled = await tools.isHalSimplicityAvailable();
  const halSignerInstalled = await tools.isHalSignerAvailable();

  const missingTools: string[] = [];
  if (!simcInstalled) missingTools.push('simc');
  if (!halInstalled) missingTools.push('hal-simplicity');
  if (!halSignerInstalled) missingTools.push('hal-simplicity-signer');

  const instructions = `
Missing Simplicity tools: ${missingTools.join(', ')}

Installation Instructions:
==========================

1. Install Rust (if not already installed):
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

2. Install simc (Simplicity Compiler):
   cargo install --git https://github.com/BlockstreamResearch/SimplicityHL.git

3. Install hal-simplicity (nums-key branch - general operations):
   cargo install --git https://github.com/apoelstra/hal-simplicity.git --branch 2025-11/nums-key

4. Install hal-simplicity-signer (pset-signer branch - signing operations):
   cd /tmp
   git clone https://github.com/apoelstra/hal-simplicity.git hal-simplicity-signer
   cd hal-simplicity-signer
   git checkout 2025-10/pset-signer
   cargo build --release
   cp target/release/hal-simplicity ~/.cargo/bin/hal-simplicity-signer

After installation, restart your terminal and verify:
   simc --help
   hal-simplicity --help
   hal-simplicity-signer simplicity pset --help

For more details, see: HAL_SIMPLICITY_BRANCHES.md
`;

  return {
    simc_installed: simcInstalled,
    hal_simplicity_installed: halInstalled,
    hal_signer_installed: halSignerInstalled,
    all_installed: simcInstalled && halInstalled && halSignerInstalled,
    missing_tools: missingTools,
    installation_instructions:
      missingTools.length > 0 ? instructions : 'All tools are installed!',
  };
}

/**
 * Attempt to install missing Simplicity tools automatically
 */
export async function autoInstallTools(): Promise<{
  success: boolean;
  message: string;
  installed_tools: string[];
  errors?: string[];
}> {
  const check = await checkToolsInstallation();

  if (check.all_installed) {
    return {
      success: true,
      message: 'All Simplicity tools are already installed!',
      installed_tools: ['simc', 'hal-simplicity'],
    };
  }

  const installedTools: string[] = [];
  const errors: string[] = [];

  try {
    // Check if cargo is available
    try {
      await execAsync('cargo --version');
    } catch {
      return {
        success: false,
        message:
          'Rust/Cargo not found. Please install Rust first: https://rustup.rs',
        installed_tools: [],
        errors: ['Cargo not available'],
      };
    }

    // Install simc if missing
    if (!check.simc_installed) {
      try {
        console.log('Installing simc...');
        await execAsync(
          'cargo install --git https://github.com/BlockstreamResearch/simfony simc',
          {
            timeout: 600000, // 10 minutes timeout
          }
        );
        installedTools.push('simc');
      } catch (error) {
        errors.push(
          `Failed to install simc: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    // Install hal-simplicity if missing
    if (!check.hal_simplicity_installed) {
      try {
        console.log('Installing hal-simplicity...');
        await execAsync(
          'cargo install --git https://github.com/sanket1729/hal hal-simplicity',
          {
            timeout: 600000, // 10 minutes timeout
          }
        );
        installedTools.push('hal-simplicity');
      } catch (error) {
        errors.push(
          `Failed to install hal-simplicity: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    const finalCheck = await checkToolsInstallation();

    return {
      success: finalCheck.all_installed,
      message: finalCheck.all_installed
        ? 'Successfully installed all Simplicity tools!'
        : 'Some tools failed to install. See errors for details.',
      installed_tools: installedTools,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Installation failed',
      installed_tools: installedTools,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
}
