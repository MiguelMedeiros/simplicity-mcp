/**
 * MCP Tool Definitions
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const tools: Tool[] = [
  // Simplicity tools
  {
    name: 'simplicity_encode',
    description: 'Encode a Simplicity program to bytes',
    inputSchema: {
      type: 'object',
      properties: {
        program: {
          type: 'string',
          description: 'The Simplicity program to encode',
        },
        format: {
          type: 'string',
          enum: ['hex', 'base64'],
          description: 'Output format (default: hex)',
        },
      },
      required: ['program'],
    },
  },
  {
    name: 'simplicity_decode',
    description: 'Decode bytes to a Simplicity program',
    inputSchema: {
      type: 'object',
      properties: {
        data: { type: 'string', description: 'The encoded data to decode' },
        format: {
          type: 'string',
          enum: ['hex', 'base64'],
          description: 'Input format (default: hex)',
        },
      },
      required: ['data'],
    },
  },
  {
    name: 'simplicity_validate',
    description: 'Validate a Simplicity program',
    inputSchema: {
      type: 'object',
      properties: {
        program: {
          type: 'string',
          description: 'The Simplicity program to validate',
        },
      },
      required: ['program'],
    },
  },
  {
    name: 'simplicity_construct',
    description: 'Construct a Simplicity expression',
    inputSchema: {
      type: 'object',
      properties: {
        expression: {
          type: 'string',
          description: 'The Simplicity expression to construct',
        },
        context: {
          type: 'object',
          description: 'Optional context for the expression',
        },
      },
      required: ['expression'],
    },
  },
  {
    name: 'simplicity_analyze',
    description: "Analyze a Simplicity program's properties",
    inputSchema: {
      type: 'object',
      properties: {
        program: {
          type: 'string',
          description: 'The Simplicity program to analyze',
        },
      },
      required: ['program'],
    },
  },
  {
    name: 'simplicity_finalize',
    description: 'Finalize a ConstructNode to CommitNode',
    inputSchema: {
      type: 'object',
      properties: {
        construct: { type: 'string', description: 'The construct to finalize' },
      },
      required: ['construct'],
    },
  },
  // Elements tools
  {
    name: 'elements_get_blockchain_info',
    description: 'Get blockchain information from Elements node',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'elements_get_block',
    description: 'Get block by hash or height',
    inputSchema: {
      type: 'object',
      properties: {
        hash: { type: 'string', description: 'Block hash' },
        height: { type: 'number', description: 'Block height' },
      },
    },
  },
  {
    name: 'elements_get_transaction',
    description: 'Get transaction details',
    inputSchema: {
      type: 'object',
      properties: {
        txid: { type: 'string', description: 'Transaction ID' },
        verbose: {
          type: 'boolean',
          description: 'Return verbose info (default: true)',
        },
      },
      required: ['txid'],
    },
  },
  {
    name: 'elements_decode_rawtransaction',
    description: 'Decode a raw transaction hex',
    inputSchema: {
      type: 'object',
      properties: {
        hex: { type: 'string', description: 'Raw transaction hex' },
      },
      required: ['hex'],
    },
  },
  {
    name: 'elements_get_address_info',
    description: 'Get address information',
    inputSchema: {
      type: 'object',
      properties: {
        address: { type: 'string', description: 'Elements address' },
      },
      required: ['address'],
    },
  },
  {
    name: 'elements_list_unspent',
    description: 'List unspent transaction outputs',
    inputSchema: {
      type: 'object',
      properties: {
        address: { type: 'string', description: 'Optional address filter' },
      },
    },
  },
  {
    name: 'elements_get_asset_info',
    description: 'Get asset information',
    inputSchema: {
      type: 'object',
      properties: {
        asset_id: { type: 'string', description: 'Asset ID' },
      },
      required: ['asset_id'],
    },
  },
  {
    name: 'elements_list_issuances',
    description: 'List all asset issuances',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'elements_get_pegin_address',
    description: 'Get a pegin address',
    inputSchema: { type: 'object', properties: {} },
  },
  // Utility tools for development and testing
  {
    name: 'elements_generate_blocks',
    description: 'Generate blocks to a specific address (regtest/testnet only)',
    inputSchema: {
      type: 'object',
      properties: {
        nblocks: {
          type: 'number',
          description: 'Number of blocks to generate',
        },
        address: {
          type: 'string',
          description: 'Address to receive block rewards',
        },
      },
      required: ['nblocks', 'address'],
    },
  },
  {
    name: 'elements_get_balance',
    description: 'Get wallet balance',
    inputSchema: {
      type: 'object',
      properties: {
        account: {
          type: 'string',
          description: 'Account name (optional)',
        },
        minconf: {
          type: 'number',
          description: 'Minimum confirmations (default: 1)',
        },
      },
    },
  },
  {
    name: 'elements_get_new_address',
    description: 'Generate a new address',
    inputSchema: {
      type: 'object',
      properties: {
        label: {
          type: 'string',
          description: 'Label for the address (optional)',
        },
      },
    },
  },
  {
    name: 'elements_send_to_address',
    description: 'Send amount to a given address',
    inputSchema: {
      type: 'object',
      properties: {
        address: {
          type: 'string',
          description: 'Destination address',
        },
        amount: {
          type: 'number',
          description: 'Amount to send',
        },
        comment: {
          type: 'string',
          description: 'Optional comment',
        },
        comment_to: {
          type: 'string',
          description: 'Optional comment for recipient',
        },
      },
      required: ['address', 'amount'],
    },
  },
  {
    name: 'elements_get_block_count',
    description: 'Get the current block height',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'elements_get_block_hash',
    description: 'Get block hash by height',
    inputSchema: {
      type: 'object',
      properties: {
        height: {
          type: 'number',
          description: 'Block height',
        },
      },
      required: ['height'],
    },
  },
  {
    name: 'elements_list_transactions',
    description: 'List recent transactions',
    inputSchema: {
      type: 'object',
      properties: {
        account: {
          type: 'string',
          description: 'Account name (optional)',
        },
        count: {
          type: 'number',
          description: 'Number of transactions to return (default: 10)',
        },
        skip: {
          type: 'number',
          description: 'Number of transactions to skip',
        },
      },
    },
  },
  // Integration tools
  {
    name: 'decode_simplicity_transaction',
    description: 'Extract and decode Simplicity programs from a transaction',
    inputSchema: {
      type: 'object',
      properties: {
        txid: { type: 'string', description: 'Transaction ID' },
        output_index: {
          type: 'number',
          description: 'Output index (optional)',
        },
      },
      required: ['txid'],
    },
  },
  {
    name: 'verify_simplicity_script',
    description: 'Verify a Simplicity script with optional witness',
    inputSchema: {
      type: 'object',
      properties: {
        program: { type: 'string', description: 'Simplicity program' },
        witness: { type: 'string', description: 'Witness data (optional)' },
      },
      required: ['program'],
    },
  },
  {
    name: 'estimate_simplicity_cost',
    description: 'Estimate execution cost of a Simplicity program',
    inputSchema: {
      type: 'object',
      properties: {
        program: { type: 'string', description: 'Simplicity program' },
      },
      required: ['program'],
    },
  },
  {
    name: 'analyze_simplicity_in_block',
    description: 'Analyze Simplicity usage in a block',
    inputSchema: {
      type: 'object',
      properties: {
        block_hash: { type: 'string', description: 'Block hash' },
      },
      required: ['block_hash'],
    },
  },
  // New advanced Simplicity tools
  {
    name: 'simplicity_compile_file',
    description:
      'Compile a .simf file to Simplicity program using simc compiler',
    inputSchema: {
      type: 'object',
      properties: {
        file_path: {
          type: 'string',
          description: 'Path to .simf file',
        },
      },
      required: ['file_path'],
    },
  },
  {
    name: 'simplicity_compile_source',
    description: 'Compile SimplicityHL source code to Simplicity program',
    inputSchema: {
      type: 'object',
      properties: {
        source: {
          type: 'string',
          description: 'SimplicityHL source code',
        },
      },
      required: ['source'],
    },
  },
  {
    name: 'simplicity_get_address',
    description:
      'Get on-chain address for a Simplicity program using hal-simplicity',
    inputSchema: {
      type: 'object',
      properties: {
        program: {
          type: 'string',
          description: 'Base64-encoded Simplicity program',
        },
      },
      required: ['program'],
    },
  },
  {
    name: 'simplicity_decode_program',
    description: 'Decode a Simplicity program to readable format',
    inputSchema: {
      type: 'object',
      properties: {
        program: {
          type: 'string',
          description: 'Base64-encoded Simplicity program',
        },
      },
      required: ['program'],
    },
  },
  {
    name: 'simplicity_create_witness',
    description: 'Create witness template for a contract type',
    inputSchema: {
      type: 'object',
      properties: {
        contract_type: {
          type: 'string',
          enum: ['empty', 'p2ms', 'htlc', 'vault'],
          description: 'Type of contract',
        },
      },
      required: ['contract_type'],
    },
  },
  {
    name: 'simplicity_check_tools',
    description:
      'Check if Simplicity tools (simc, hal-simplicity) are installed with detailed installation instructions',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'simplicity_install_tools',
    description:
      'Automatically install missing Simplicity tools (simc, hal-simplicity) via cargo',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  // Faucet tools
  {
    name: 'faucet_request_funds',
    description: 'Request LBTC from Liquid testnet faucet',
    inputSchema: {
      type: 'object',
      properties: {
        address: {
          type: 'string',
          description: 'Liquid address to receive funds',
        },
        asset: {
          type: 'string',
          enum: ['lbtc', 'asset'],
          description: 'Asset type (default: lbtc)',
        },
      },
      required: ['address'],
    },
  },
  {
    name: 'faucet_check_status',
    description: 'Check if Liquid testnet faucet is available',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  // Contract workflow tools
  {
    name: 'contract_deploy',
    description:
      'Complete workflow: compile contract, get address, and optionally fund it',
    inputSchema: {
      type: 'object',
      properties: {
        contract_file: {
          type: 'string',
          description: 'Path to .simf contract file',
        },
        auto_fund: {
          type: 'boolean',
          description: 'Automatically request funds from faucet',
        },
      },
      required: ['contract_file'],
    },
  },
  {
    name: 'contract_spend',
    description: 'Spend funds from a Simplicity contract',
    inputSchema: {
      type: 'object',
      properties: {
        program: {
          type: 'string',
          description: 'Base64-encoded Simplicity program',
        },
        witness_file: {
          type: 'string',
          description: 'Path to witness file',
        },
        utxo_txid: {
          type: 'string',
          description: 'Transaction ID of UTXO to spend',
        },
        utxo_vout: {
          type: 'number',
          description: 'Output index of UTXO to spend',
        },
        destination: {
          type: 'string',
          description: 'Destination address',
        },
      },
      required: ['program', 'witness_file'],
    },
  },
  // Helper tools
  {
    name: 'helper_extract_transaction',
    description: 'Extract transaction hex from hal-simplicity output',
    inputSchema: {
      type: 'object',
      properties: {
        output: {
          type: 'string',
          description: 'hal-simplicity command output',
        },
      },
      required: ['output'],
    },
  },
  {
    name: 'helper_validate_address',
    description: 'Validate if a string is a valid Liquid address',
    inputSchema: {
      type: 'object',
      properties: {
        address: {
          type: 'string',
          description: 'Address to validate',
        },
      },
      required: ['address'],
    },
  },
  {
    name: 'helper_list_example_contracts',
    description: 'List available example contracts',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'helper_get_example_contract',
    description: 'Get the content of an example contract',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          enum: ['empty', 'p2ms', 'htlc', 'vault'],
          description: 'Name of example contract',
        },
      },
      required: ['name'],
    },
  },
  // New intelligent Simplicity tools
  {
    name: 'simplicity_get_features',
    description:
      'Get detailed information about supported and unsupported simc features, including working jets',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'simplicity_generate_example',
    description:
      'Generate a working Simplicity contract example based on a pattern (minimal, comparison, assertion)',
    inputSchema: {
      type: 'object',
      properties: {
        pattern: {
          type: 'string',
          enum: ['minimal', 'comparison', 'assertion'],
          description:
            'Pattern to generate: minimal (basic program), comparison (using jets), assertion (with validation)',
        },
      },
      required: ['pattern'],
    },
  },
  {
    name: 'simplicity_validate_syntax',
    description:
      'Validate SimplicityHL source code syntax before compiling, with helpful error messages',
    inputSchema: {
      type: 'object',
      properties: {
        source: {
          type: 'string',
          description: 'SimplicityHL source code to validate',
        },
      },
      required: ['source'],
    },
  },
  {
    name: 'simplicity_suggest_fix',
    description:
      'Get helpful suggestions to fix a simc compilation error based on error message',
    inputSchema: {
      type: 'object',
      properties: {
        error_message: {
          type: 'string',
          description: 'The error message from simc compiler',
        },
      },
      required: ['error_message'],
    },
  },

  // PSET Operations (using hal-simplicity-signer)
  {
    name: 'pset_create',
    description:
      'Create an empty PSET (Partially Signed Elements Transaction). Uses hal-simplicity-signer (pset-signer branch). This is the first step to build and sign a Simplicity transaction.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'pset_update_input',
    description:
      'Update a PSET input with UTXO data (txid, vout, amount, asset, scriptPubKey). Uses hal-simplicity-signer (pset-signer branch). Required before finalizing the PSET.',
    inputSchema: {
      type: 'object',
      properties: {
        pset: {
          type: 'string',
          description: 'The PSET to update (base64 or hex encoded)',
        },
        txid: {
          type: 'string',
          description: 'Transaction ID of the UTXO being spent',
        },
        vout: {
          type: 'number',
          description: 'Output index of the UTXO being spent',
        },
        amount: {
          type: 'number',
          description: 'Amount in satoshis of the UTXO',
        },
        asset: {
          type: 'string',
          description: 'Asset ID (optional, defaults to L-BTC)',
        },
        script_pubkey: {
          type: 'string',
          description: 'Script pubkey of the UTXO (optional)',
        },
      },
      required: ['pset', 'txid', 'vout', 'amount'],
    },
  },
  {
    name: 'pset_finalize',
    description:
      'Finalize a PSET by attaching a Simplicity program and witness. Uses hal-simplicity-signer (pset-signer branch). This completes the signing process.',
    inputSchema: {
      type: 'object',
      properties: {
        pset: {
          type: 'string',
          description: 'The PSET to finalize (with UTXO data)',
        },
        program: {
          type: 'string',
          description: 'Base64-encoded Simplicity program',
        },
        witness: {
          type: 'string',
          description: 'Hex-encoded witness data',
        },
      },
      required: ['pset', 'program', 'witness'],
    },
  },
  {
    name: 'pset_extract',
    description:
      'Extract the final signed transaction from a completed PSET. Uses hal-simplicity-signer (pset-signer branch). The resulting transaction can be broadcast to the network.',
    inputSchema: {
      type: 'object',
      properties: {
        pset: {
          type: 'string',
          description: 'The finalized PSET',
        },
      },
      required: ['pset'],
    },
  },
];
