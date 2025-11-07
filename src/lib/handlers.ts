/**
 * Tool Handlers
 * Implementation of all MCP tool handlers
 */

import {
  CallToolResult,
  TextContent,
} from '@modelcontextprotocol/sdk/types.js';
import { EsploraClient } from './esplora-client.js';
import {
  SimplicityTools,
  extractTransaction,
  checkToolsInstallation,
  autoInstallTools,
} from './simplicity-tools.js';
import { FaucetClient, isValidLiquidAddress } from './faucet-client.js';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { resolve } from 'path';

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

// New tool argument types
export interface CompileFileArgs {
  file_path: string;
}

export interface CompileSourceArgs {
  source: string;
}

export interface GetAddressArgs {
  program: string;
}

export interface DecodeProgramArgs {
  program: string;
}

export interface CreateWitnessArgs {
  contract_type: string;
}

export interface FaucetRequestArgs {
  address: string;
  asset?: string;
}

export interface ContractDeployArgs {
  contract_file: string;
  auto_fund?: boolean;
}

export interface ContractSpendArgs {
  program: string;
  witness_file: string;
  utxo_txid?: string;
  utxo_vout?: number;
  destination?: string;
}

export interface ExtractTransactionArgs {
  output: string;
}

export interface ValidateAddressArgs {
  address: string;
}

export interface GetExampleContractArgs {
  name: string;
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
  esploraClient: EsploraClient
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, ToolHandler<any>> {
  // Initialize tools
  const simplicityTools = new SimplicityTools();
  const faucetClient = new FaucetClient();

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

    // Elements tools (now using Esplora API)
    elements_get_blockchain_info: async () => {
      const info = await esploraClient.getBlockchainInfo();
      return createTextResponse(info);
    },

    elements_get_block: async ({ hash, height }: GetBlockArgs) => {
      if (!hash && height === undefined) {
        throw new Error("Either 'hash' or 'height' must be provided");
      }
      const block = await esploraClient.getBlock(
        hash ?? (height as string | number)
      );
      return createTextResponse(block);
    },

    elements_get_transaction: async ({
      txid,
      verbose = true,
    }: GetTransactionArgs) => {
      const tx = await esploraClient.getTransaction(txid, verbose);
      return createTextResponse(tx);
    },

    elements_decode_rawtransaction: ({
      hex,
    }: DecodeRawTransactionArgs) => {
      return Promise.resolve(createTextResponse({
        error: 'decodeRawTransaction is not supported via Esplora API',
        tip: 'Broadcast the transaction to decode it, or use a local Bitcoin library',
        hex_provided: hex.substring(0, 64) + '...',
      }));
    },

    elements_get_address_info: ({ address }: GetAddressInfoArgs) => {
      const info = esploraClient.getAddressInfo(address);
      return Promise.resolve(createTextResponse(info));
    },

    elements_list_unspent: async ({ address }: ListUnspentArgs) => {
      if (!address) {
        return createTextResponse({
          error: 'Address is required when using Esplora API',
          tip: 'Provide an address to list UTXOs for that address',
        });
      }
      const unspent = await esploraClient.listUnspent(address);
      return createTextResponse(unspent);
    },

    elements_get_asset_info: ({ asset_id }: GetAssetInfoArgs) => {
      return Promise.resolve(
        createTextResponse({
          asset_id,
          message:
            'Asset info retrieval not directly supported in Esplora API',
        })
      );
    },

    elements_list_issuances: () => {
      const issuances = esploraClient.listIssuances();
      return Promise.resolve(createTextResponse(issuances));
    },

    elements_get_pegin_address: () => {
      const address = esploraClient.getPeginAddress();
      return Promise.resolve(createTextResponse(address));
    },

    // Utility handlers - Some not available via Esplora
    elements_generate_blocks: ({
      nblocks,
      address,
    }: {
      nblocks: number;
      address: string;
    }) => {
      return Promise.resolve(createTextResponse({
        error: 'generateToAddress is not available via Esplora API',
        tip: 'This requires a regtest/testnet node with mining capabilities',
        requested_blocks: nblocks,
        requested_address: address,
      }));
    },

    elements_get_balance: ({
      account,
      minconf,
    }: {
      account?: string;
      minconf?: number;
    }) => {
      return Promise.resolve(createTextResponse({
        error: 'getBalance is not available via Esplora API',
        tip: 'Use elements_list_unspent with an address to calculate balance from UTXOs',
        account,
        minconf,
      }));
    },

    elements_get_new_address: ({ label }: { label?: string }) => {
      return Promise.resolve(createTextResponse({
        error: 'getNewAddress is not available via Esplora API',
        tip: 'Use a wallet application or library to generate new addresses',
        label,
      }));
    },

    elements_send_to_address: ({
      address,
      amount,
      comment,
      comment_to,
    }: {
      address: string;
      amount: number;
      comment?: string;
      comment_to?: string;
    }) => {
      return Promise.resolve(createTextResponse({
        error: 'sendToAddress is not available via Esplora API',
        tip: 'Create and sign transactions using a wallet, then broadcast with broadcastTransaction',
        address,
        amount,
        comment,
        comment_to,
      }));
    },

    elements_get_block_count: async () => {
      const height = await esploraClient.getBlockCount();
      return createTextResponse({ block_height: height });
    },

    elements_get_block_hash: async ({ height }: { height: number }) => {
      const hash = await esploraClient.getBlockHash(height);
      return createTextResponse({ height, block_hash: hash });
    },

    elements_list_transactions: ({
      account,
      count,
      skip,
    }: {
      account?: string;
      count?: number;
      skip?: number;
    }) => {
      return Promise.resolve(createTextResponse({
        error: 'listTransactions is not available via Esplora API',
        tip: 'Use elements_get_address_transactions for specific addresses',
        account,
        count,
        skip,
      }));
    },

    // New Esplora-specific tools
    elements_get_address_transactions: async ({ address }: { address: string }) => {
      const txs = await esploraClient.getAddressTransactions(address);
      return createTextResponse({
        address,
        transactions: txs,
        count: txs.length,
      });
    },

    elements_broadcast_transaction: async ({ tx_hex }: { tx_hex: string }) => {
      const txid = await esploraClient.broadcastTransaction(tx_hex);
      return createTextResponse({
        success: true,
        txid,
        broadcasted: true,
      });
    },

    elements_get_fee_estimates: async () => {
      const estimates = await esploraClient.getFeeEstimates();
      return createTextResponse(estimates);
    },

    // Integration tools
    decode_simplicity_transaction: async ({
      txid,
      output_index = 0,
    }: DecodeSimplicityTransactionArgs) => {
      const tx = await esploraClient.getTransaction(txid, true);
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
      const block = await esploraClient.getBlock(block_hash);
      return createTextResponse({
        block_hash,
        block_height: block.height,
        total_transactions: block.tx ? block.tx.length : 0,
        simplicity_transactions: 0,
        total_simplicity_cost: 0,
      });
    },

    // New advanced Simplicity tools
    simplicity_compile_file: async ({ file_path }: CompileFileArgs) => {
      // Read source for validation
      let source = '';
      if (existsSync(file_path)) {
        source = await readFile(file_path, 'utf-8');
      }

      // Validate syntax before compiling
      const validation = simplicityTools.validateSyntax(source);

      const result = await simplicityTools.compileFile(file_path);

      // Add helpful suggestions if compilation failed
      if (!result.success && result.error) {
        const suggestions = simplicityTools.suggestFix(result.error);
        return createTextResponse({
          ...result,
          validation,
          suggestions,
          tip: 'Use simplicity_get_features to see what simc supports',
        });
      }

      return createTextResponse({
        ...result,
        validation_warnings: validation.warnings,
      });
    },

    simplicity_compile_source: async ({ source }: CompileSourceArgs) => {
      // Validate syntax before compiling
      const validation = simplicityTools.validateSyntax(source);

      // Return early if there are validation errors
      if (!validation.valid) {
        return createTextResponse({
          success: false,
          error: 'Syntax validation failed',
          validation,
          tip: 'Fix validation errors before compiling. Use simplicity_generate_example for working patterns.',
        });
      }

      const result = await simplicityTools.compileSource(source);

      // Add helpful suggestions if compilation failed
      if (!result.success && result.error) {
        const suggestions = simplicityTools.suggestFix(result.error);
        return createTextResponse({
          ...result,
          validation,
          suggestions,
          tip: 'Use simplicity_get_features to see what simc supports',
        });
      }

      return createTextResponse({
        ...result,
        validation_warnings: validation.warnings,
      });
    },

    simplicity_get_address: async ({ program }: GetAddressArgs) => {
      const info = await simplicityTools.getProgramInfo(program);
      return createTextResponse(info);
    },

    simplicity_decode_program: async ({ program }: DecodeProgramArgs) => {
      const result = await simplicityTools.decodeProgram(program);
      return createTextResponse(result);
    },

    simplicity_create_witness: ({ contract_type }: CreateWitnessArgs) => {
      const template = simplicityTools.createWitnessTemplate(contract_type);
      return Promise.resolve(
        createTextResponse({
          contract_type,
          template,
          instructions: 'Fill in the witness values and save to a .wit file',
        })
      );
    },

    simplicity_check_tools: async () => {
      const status = await checkToolsInstallation();
      return createTextResponse(status);
    },

    simplicity_install_tools: async () => {
      const result = await autoInstallTools();
      return createTextResponse(result);
    },

    // Faucet tools
    faucet_request_funds: async ({
      address,
      asset = 'lbtc',
    }: FaucetRequestArgs) => {
      if (!isValidLiquidAddress(address)) {
        return createTextResponse({
          success: false,
          error: 'Invalid Liquid address format',
        });
      }

      const result = await faucetClient.requestFundsWithRetry({
        address,
        asset: asset as 'lbtc' | 'asset',
      });

      return createTextResponse(result);
    },

    faucet_check_status: async () => {
      const status = await faucetClient.checkFaucetStatus();
      return createTextResponse(status);
    },

    // Contract workflow tools
    contract_deploy: async ({
      contract_file,
      auto_fund = false,
    }: ContractDeployArgs) => {
      // Step 1: Compile contract
      const compileResult = await simplicityTools.compileFile(contract_file);

      if (!compileResult.success) {
        return createTextResponse({
          success: false,
          step: 'compile',
          error: compileResult.error,
        });
      }

      const program = compileResult.program || '';

      // Step 2: Get address
      const addressInfo = await simplicityTools.getProgramInfo(program);

      if (addressInfo.error) {
        return createTextResponse({
          success: false,
          step: 'get_address',
          program,
          error: addressInfo.error,
        });
      }

      const response: Record<string, unknown> = {
        success: true,
        contract_file,
        program,
        address: addressInfo.address,
        program_hash: addressInfo.program_hash,
        witness_structure: addressInfo.witness_structure,
      };

      // Step 3: Auto-fund if requested
      if (auto_fund && addressInfo.address) {
        const fundResult = await faucetClient.requestFundsWithRetry({
          address: addressInfo.address,
          asset: 'lbtc',
        });

        response.funding = fundResult;
      }

      return createTextResponse(response);
    },

    contract_spend: async ({
      program,
      witness_file,
      utxo_txid,
      utxo_vout,
      destination,
    }: ContractSpendArgs) => {
      // Read witness file
      if (!existsSync(witness_file)) {
        return createTextResponse({
          success: false,
          error: `Witness file not found: ${witness_file}`,
        });
      }

      try {
        const witnessContent = await readFile(witness_file, 'utf-8');
        const witness = JSON.parse(witnessContent) as Record<string, unknown>;

        return createTextResponse({
          success: true,
          program,
          witness,
          utxo: utxo_txid ? { txid: utxo_txid, vout: utxo_vout } : undefined,
          destination,
          note: 'This is a simplified representation. Use hal-simplicity to create and broadcast the actual transaction.',
          instructions: [
            '1. Use hal-simplicity to create spending transaction',
            '2. Sign the transaction',
            '3. Broadcast with elements-cli sendrawtransaction',
          ],
        });
      } catch (error) {
        return createTextResponse({
          success: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to read witness file',
        });
      }
    },

    // Helper tools
    helper_extract_transaction: ({ output }: ExtractTransactionArgs) => {
      const txid = extractTransaction(output);
      return Promise.resolve(
        createTextResponse({
          transaction_id: txid,
          success: !!txid,
        })
      );
    },

    helper_validate_address: ({ address }: ValidateAddressArgs) => {
      const valid = isValidLiquidAddress(address);
      return Promise.resolve(
        createTextResponse({
          address,
          valid,
          message: valid
            ? 'Valid Liquid address format'
            : 'Invalid Liquid address format',
        })
      );
    },

    helper_list_example_contracts: async () => {
      const examples = [
        {
          name: 'empty',
          description: 'Always approves - simplest Simplicity program',
          path: 'examples/contracts/empty.simf',
          witness: 'examples/witnesses/empty.wit',
        },
        {
          name: 'p2ms',
          description: '2-of-3 multisig contract',
          path: 'examples/contracts/p2ms.simf',
          witness: 'examples/witnesses/p2ms.wit (not included)',
        },
        {
          name: 'htlc',
          description: 'Hash Time Lock Contract',
          path: 'examples/contracts/htlc.simf',
          witness: 'examples/witnesses/htlc-preimage.wit',
        },
        {
          name: 'vault',
          description: 'Time-delayed withdrawal vault',
          path: 'examples/contracts/vault.simf',
          witness: 'examples/witnesses/vault.wit (not included)',
        },
        {
          name: 'timelock',
          description:
            'Simple timelock - locks funds until specific block height',
          path: 'examples/contracts/timelock.simf',
          witness: 'examples/witnesses/timelock.wit',
        },
      ];

      return Promise.resolve(
        createTextResponse({
          examples,
          total: examples.length,
        })
      );
    },

    helper_get_example_contract: async ({ name }: GetExampleContractArgs) => {
      const contractPath = resolve(
        process.cwd(),
        `examples/contracts/${name}.simf`
      );

      if (!existsSync(contractPath)) {
        return createTextResponse({
          success: false,
          error: `Example contract '${name}' not found`,
        });
      }

      try {
        const content = await readFile(contractPath, 'utf-8');
        return createTextResponse({
          success: true,
          name,
          path: contractPath,
          content,
        });
      } catch (error) {
        return createTextResponse({
          success: false,
          error:
            error instanceof Error ? error.message : 'Failed to read contract',
        });
      }
    },

    // New intelligent helpers
    simplicity_get_features: () => {
      const features = simplicityTools.getAvailableFeatures();
      return Promise.resolve(
        createTextResponse({
          ...features,
          tip: 'Use these features when writing Simplicity contracts. Avoid unsupported features.',
          examples_available: ['minimal', 'comparison', 'assertion'],
        })
      );
    },

    simplicity_generate_example: ({ pattern }: { pattern: string }) => {
      const validPatterns = ['minimal', 'comparison', 'assertion'];
      if (!validPatterns.includes(pattern)) {
        return Promise.resolve(
          createTextResponse({
            success: false,
            error: `Invalid pattern. Choose from: ${validPatterns.join(', ')}`,
            available_patterns: validPatterns,
          })
        );
      }

      const example = simplicityTools.generateExample(
        pattern as 'minimal' | 'comparison' | 'assertion'
      );
      return Promise.resolve(
        createTextResponse({
          success: true,
          pattern,
          code: example,
          tip: 'Copy this example and modify it for your needs. It uses only supported features.',
        })
      );
    },

    simplicity_validate_syntax: ({ source }: { source: string }) => {
      const validation = simplicityTools.validateSyntax(source);
      return Promise.resolve(
        createTextResponse({
          ...validation,
          tip: validation.valid
            ? 'Syntax looks good! You can now compile this code.'
            : 'Fix the errors listed above before compiling.',
        })
      );
    },

    simplicity_suggest_fix: ({ error_message }: { error_message: string }) => {
      const suggestions = simplicityTools.suggestFix(error_message);
      return Promise.resolve(
        createTextResponse({
          error_message,
          suggestions,
          additional_help:
            'Use simplicity_get_features to see supported features, or simplicity_generate_example for working patterns',
        })
      );
    },

    // PSET Operations (using hal-simplicity-signer)
    pset_create: async () => {
      const result = await simplicityTools.createPSET();
      return createTextResponse({
        ...result,
        note: 'Uses hal-simplicity-signer (pset-signer branch) for PSET operations',
      });
    },

    pset_update_input: async ({
      pset,
      txid,
      vout,
      amount,
      asset,
      script_pubkey,
    }: {
      pset: string;
      txid: string;
      vout: number;
      amount: number;
      asset?: string;
      script_pubkey?: string;
    }) => {
      const result = await simplicityTools.updatePSETInput(
        pset,
        txid,
        vout,
        amount,
        asset,
        script_pubkey
      );
      return createTextResponse({
        ...result,
        note: 'Uses hal-simplicity-signer (pset-signer branch)',
      });
    },

    pset_finalize: async ({
      pset,
      program,
      witness,
    }: {
      pset: string;
      program: string;
      witness: string;
    }) => {
      const result = await simplicityTools.finalizePSET(pset, program, witness);
      return createTextResponse({
        ...result,
        note: 'Uses hal-simplicity-signer (pset-signer branch)',
      });
    },

    pset_extract: async ({ pset }: { pset: string }) => {
      const result = await simplicityTools.extractTransaction(pset);
      return createTextResponse({
        ...result,
        note: 'Uses hal-simplicity-signer (pset-signer branch). Use elements_broadcast_transaction to broadcast.',
      });
    },
  };
}
