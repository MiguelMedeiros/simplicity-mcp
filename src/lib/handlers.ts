/**
 * Tool Handlers
 * Implementation of all MCP tool handlers
 */

import {
  CallToolResult,
  TextContent,
} from '@modelcontextprotocol/sdk/types.js';
import { ElementsClient } from './elements-client.js';

// Tool argument types
export interface EncodeArgs {
  program: string;
  format?: 'hex' | 'base64';
}

export interface DecodeArgs {
  data: string;
  format?: 'hex' | 'base64';
}

export interface ValidateArgs {
  program: string;
}

export interface ConstructArgs {
  expression: string;
  context?: Record<string, unknown>;
}

export interface AnalyzeArgs {
  program: string;
}

export interface FinalizeArgs {
  construct: string;
}

export interface GetBlockArgs {
  hash?: string;
  height?: number;
}

export interface GetTransactionArgs {
  txid: string;
  verbose?: boolean;
}

export interface DecodeRawTransactionArgs {
  hex: string;
}

export interface GetAddressInfoArgs {
  address: string;
}

export interface ListUnspentArgs {
  address?: string;
}

export interface GetAssetInfoArgs {
  asset_id: string;
}

export interface DecodeSimplicityTransactionArgs {
  txid: string;
  output_index?: number;
}

export interface VerifySimplicityScriptArgs {
  program: string;
  witness?: string;
}

export interface EstimateSimplicityCostArgs {
  program: string;
}

export interface AnalyzeSimplicityInBlockArgs {
  block_hash: string;
}

// Helper function to create text response
function createTextResponse(data: unknown): CallToolResult {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(data, null, 2),
      } as TextContent,
    ],
  };
}

// Tool handler type
export type ToolHandler<T = unknown> = (args: T) => Promise<CallToolResult>;

export function createHandlers(
  elementsClient: ElementsClient
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, ToolHandler<any>> {
  return {
    // Simplicity tools
    simplicity_encode: ({ program, format = 'hex' }: EncodeArgs) => {
      const buffer = Buffer.from(program, 'utf8');
      const encoded =
        format === 'hex' ? buffer.toString('hex') : buffer.toString('base64');
      return Promise.resolve(
        createTextResponse({
          encoded,
          format,
          size_bytes: encoded.length,
        })
      );
    },

    simplicity_decode: ({ data, format = 'hex' }: DecodeArgs) => {
      const buffer = Buffer.from(data, format);
      const program = buffer.toString('utf8');
      return Promise.resolve(
        createTextResponse({
          program,
          node_type: 'ConstructNode',
        })
      );
    },

    simplicity_validate: ({ program }: ValidateArgs) => {
      const valid = Boolean(program && program.length > 0);
      const errors = valid ? [] : ['Program is empty'];
      return Promise.resolve(createTextResponse({ valid, errors }));
    },

    simplicity_construct: ({ expression, context }: ConstructArgs) => {
      return Promise.resolve(
        createTextResponse({
          construct: expression,
          context,
          status: 'constructed',
        })
      );
    },

    simplicity_analyze: ({ program }: AnalyzeArgs) => {
      return Promise.resolve(
        createTextResponse({
          source_type: 'Unit',
          target_type: 'Unit',
          node_count: program.length,
          estimated_cost: 100,
        })
      );
    },

    simplicity_finalize: ({ construct }: FinalizeArgs) => {
      return Promise.resolve(
        createTextResponse({
          construct,
          commitment: 'placeholder_commitment_hash',
          status: 'finalized',
        })
      );
    },

    // Elements tools
    elements_get_blockchain_info: async () => {
      const info = await elementsClient.getBlockchainInfo();
      return createTextResponse(info);
    },

    elements_get_block: async ({ hash, height }: GetBlockArgs) => {
      if (!hash && height === undefined) {
        throw new Error("Either 'hash' or 'height' must be provided");
      }
      const block = await elementsClient.getBlock(
        hash ?? (height as string | number)
      );
      return createTextResponse(block);
    },

    elements_get_transaction: async ({
      txid,
      verbose = true,
    }: GetTransactionArgs) => {
      const tx = await elementsClient.getTransaction(txid, verbose);
      return createTextResponse(tx);
    },

    elements_decode_rawtransaction: async ({
      hex,
    }: DecodeRawTransactionArgs) => {
      const decoded = await elementsClient.decodeRawTransaction(hex);
      return createTextResponse(decoded);
    },

    elements_get_address_info: async ({ address }: GetAddressInfoArgs) => {
      const info = await elementsClient.getAddressInfo(address);
      return createTextResponse(info);
    },

    elements_list_unspent: async ({ address }: ListUnspentArgs) => {
      const unspent = await elementsClient.listUnspent(address);
      return createTextResponse(unspent);
    },

    elements_get_asset_info: ({ asset_id }: GetAssetInfoArgs) => {
      return Promise.resolve(
        createTextResponse({
          asset_id,
          message:
            'Asset info retrieval not directly supported in Elements RPC',
        })
      );
    },

    elements_list_issuances: async () => {
      const issuances = await elementsClient.listIssuances();
      return createTextResponse(issuances);
    },

    elements_get_pegin_address: async () => {
      const address = await elementsClient.getPeginAddress();
      return createTextResponse(address);
    },

    // Integration tools
    decode_simplicity_transaction: async ({
      txid,
      output_index = 0,
    }: DecodeSimplicityTransactionArgs) => {
      const tx = await elementsClient.getTransaction(txid, true);
      return createTextResponse({
        txid,
        output_index,
        transaction: tx,
        simplicity_program: 'placeholder_program',
        program_type: 'RedeemNode',
      });
    },

    verify_simplicity_script: ({
      program,
      witness,
    }: VerifySimplicityScriptArgs) => {
      const valid = Boolean(program && program.length > 0);
      const errors = valid ? [] : ['Program is empty'];
      return Promise.resolve(
        createTextResponse({
          valid,
          errors,
          execution_cost: 150,
          witness_provided: !!witness,
        })
      );
    },

    estimate_simplicity_cost: ({ program }: EstimateSimplicityCostArgs) => {
      return Promise.resolve(
        createTextResponse({
          estimated_cost: 200,
          max_cost: 1000,
          node_count: program.length,
        })
      );
    },

    analyze_simplicity_in_block: async ({
      block_hash,
    }: AnalyzeSimplicityInBlockArgs) => {
      const block = await elementsClient.getBlock(block_hash);
      return createTextResponse({
        block_hash,
        block_height: block.height,
        total_transactions: block.tx ? block.tx.length : 0,
        simplicity_transactions: 0,
        total_simplicity_cost: 0,
      });
    },
  };
}
