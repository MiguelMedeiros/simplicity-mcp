/**
 * Type definitions for Simplicity MCP Server
 */

// Simplicity program types
export type NodeType = 'ConstructNode' | 'CommitNode' | 'RedeemNode' | 'Unit';

export interface SimplicityProgram {
  program: string;
  node_type: NodeType;
}

export interface SimplicityAnalysis {
  source_type: string;
  target_type: string;
  node_count: number;
  estimated_cost: number;
}

export interface SimplicityValidation {
  valid: boolean;
  errors: string[];
}

export interface SimplicityConstruct {
  construct: string;
  context?: Record<string, unknown>;
  status: 'constructed' | 'finalized';
  commitment?: string;
}

// Elements blockchain types
export interface BlockchainInfo {
  chain: string;
  blocks: number;
  headers: number;
  bestblockhash: string;
  time: number;
  mediantime: number;
  verificationprogress: number;
  initialblockdownload: boolean;
  size_on_disk: number;
  pruned: boolean;
  current_params_root: string;
  current_signblock_asm: string;
  current_signblock_hex: string;
  max_block_witness: number;
  current_fedpeg_program: string;
  current_fedpeg_script: string;
  extension_space: string[];
  epoch_length: number;
  total_valid_epochs: number;
  epoch_age: number;
  warnings: string;
}

export interface Block {
  hash: string;
  confirmations: number;
  strippedsize?: number;
  size: number;
  weight: number;
  height: number;
  version: number;
  versionHex?: string;
  merkleroot: string;
  tx?: Transaction[];
  time: number;
  mediantime: number;
  nonce: number;
  bits: string;
  difficulty: number;
  chainwork: string;
  nTx: number;
  previousblockhash?: string;
  nextblockhash?: string;
  [key: string]: unknown;
}

export interface Transaction {
  txid: string;
  hash: string;
  version: number;
  size: number;
  vsize: number;
  weight: number;
  locktime: number;
  vin: TransactionInput[];
  vout: TransactionOutput[];
  hex?: string;
  blockhash?: string;
  confirmations?: number;
  time?: number;
  blocktime?: number;
  [key: string]: unknown;
}

export interface TransactionInput {
  txid?: string;
  vout?: number;
  scriptSig?: {
    asm: string;
    hex: string;
  };
  sequence: number;
  coinbase?: string;
  txinwitness?: string[];
  [key: string]: unknown;
}

export interface TransactionOutput {
  value: number;
  n: number;
  scriptPubKey: ScriptPubKey;
  asset?: string;
  assetcommitment?: string;
  valuecommitment?: string;
  commitmentnonce?: string;
  [key: string]: unknown;
}

export interface ScriptPubKey {
  asm: string;
  hex: string;
  reqSigs?: number;
  type: string;
  addresses?: string[];
  address?: string;
  [key: string]: unknown;
}

export interface AddressInfo {
  address: string;
  scriptPubKey: string;
  ismine: boolean;
  solvable: boolean;
  desc?: string;
  iswatchonly?: boolean;
  isscript?: boolean;
  iswitness?: boolean;
  witness_version?: number;
  witness_program?: string;
  pubkey?: string;
  ischange?: boolean;
  timestamp?: number;
  hdkeypath?: string;
  hdseedid?: string;
  hdmasterfingerprint?: string;
  labels?: string[];
  [key: string]: unknown;
}

export interface UnspentOutput {
  txid: string;
  vout: number;
  address: string;
  label?: string;
  scriptPubKey: string;
  amount: number;
  asset: string;
  amountblinder: string;
  assetblinder: string;
  confirmations: number;
  spendable: boolean;
  solvable: boolean;
  desc?: string;
  safe: boolean;
  [key: string]: unknown;
}

export interface AssetIssuance {
  txid: string;
  vin: number;
  assetlabel?: string;
  assetblindingkey?: string;
  tokenamount?: number;
  tokenlabel?: string;
  token?: string;
  entropy?: string;
  asset?: string;
  assetamount?: number;
  isreissuance: boolean;
  [key: string]: unknown;
}

// Integration types
export interface SimplicityTransaction {
  txid: string;
  output_index: number;
  transaction: Transaction;
  simplicity_program: string;
  program_type: NodeType;
}

export interface SimplicityScriptVerification {
  valid: boolean;
  errors: string[];
  execution_cost: number;
  witness_provided: boolean;
}

export interface SimplicityCostEstimate {
  estimated_cost: number;
  max_cost: number;
  node_count: number;
}

export interface SimplicityBlockAnalysis {
  block_hash: string;
  block_height: number;
  total_transactions: number;
  simplicity_transactions: number;
  total_simplicity_cost: number;
}
