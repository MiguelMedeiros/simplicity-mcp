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
];
