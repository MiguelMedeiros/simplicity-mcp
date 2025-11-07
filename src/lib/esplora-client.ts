/**
 * Esplora API Client for Liquid Testnet
 * Handles communication with Blockstream Esplora API
 * API Docs: https://github.com/Blockstream/esplora/blob/master/API.md
 */

import axios, { AxiosError } from 'axios';
import type {
  Block,
  Transaction,
  UnspentOutput,
} from '../types.js';

// Esplora-specific types
interface EsploraBlockStatus {
  in_best_chain: boolean;
  height: number;
  next_best?: string;
}

interface EsploraUTXO {
  txid: string;
  vout: number;
  status: {
    confirmed: boolean;
    block_height?: number;
    block_hash?: string;
    block_time?: number;
  };
  value: number;
  asset?: string;
}

export interface BlockchainInfo {
  chain: string;
  blocks: number;
  bestblockhash: string;
  mediantime?: number;
}

export class EsploraClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://blockstream.info/liquidtestnet/api') {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  private async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await axios.get<T>(`${this.baseUrl}${endpoint}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error(
        `Esplora API error: ${axiosError.response?.status || axiosError.message}`
      );
    }
  }

  async getBlockchainInfo(): Promise<BlockchainInfo> {
    // Esplora doesn't have a single endpoint for blockchain info
    // We'll get the latest block height and hash
    const tipHeight = await this.get<string>('/blocks/tip/height');
    const tipHash = await this.get<string>('/blocks/tip/hash');

    return {
      chain: 'liquidtestnet',
      blocks: parseInt(tipHeight),
      bestblockhash: tipHash,
    };
  }

  async getBlockHeight(): Promise<number> {
    const height = await this.get<string>('/blocks/tip/height');
    return parseInt(height);
  }

  async getBlockHash(height: number): Promise<string> {
    return await this.get<string>(`/block-height/${height}`);
  }

  async getBlock(hashOrHeight: string | number): Promise<Block> {
    let hash: string;
    
    if (typeof hashOrHeight === 'number') {
      hash = await this.getBlockHash(hashOrHeight);
    } else {
      hash = hashOrHeight;
    }

    const block = await this.get<Block>(`/block/${hash}`);
    const status = await this.get<EsploraBlockStatus>(`/block/${hash}/status`);
    
    // Enrich block data with status
    return {
      ...block,
      height: status.height,
      confirmations: status.in_best_chain ? 1 : 0, // Simplified
    };
  }

  async getTransaction(txid: string, verbose = true): Promise<Transaction> {
    const tx = await this.get<Transaction>(`/tx/${txid}`);
    
    if (!verbose) {
      // Return minimal transaction data
      return tx;
    }

    // Get transaction status for confirmations
    const status = await this.get<{
      confirmed: boolean;
      block_height?: number;
      block_hash?: string;
      block_time?: number;
    }>(`/tx/${txid}/status`);

    return {
      ...tx,
      confirmations: status.confirmed && status.block_height 
        ? await this.getBlockHeight() - status.block_height + 1
        : 0,
      blockhash: status.block_hash,
      blocktime: status.block_time,
    };
  }

  async getTransactionHex(txid: string): Promise<string> {
    return await this.get<string>(`/tx/${txid}/hex`);
  }

  async getAddressTransactions(address: string): Promise<Transaction[]> {
    return await this.get<Transaction[]>(`/address/${address}/txs`);
  }

  async getAddressUTXOs(address: string): Promise<UnspentOutput[]> {
    const esploraUTXOs = await this.get<EsploraUTXO[]>(`/address/${address}/utxo`);
    
    // Convert Esplora UTXO format to our UnspentOutput format
    return esploraUTXOs.map(utxo => ({
      txid: utxo.txid,
      vout: utxo.vout,
      address: address,
      scriptPubKey: '', // Not provided by Esplora, would need to fetch from tx
      amount: utxo.value / 100000000, // Convert satoshis to BTC
      asset: utxo.asset || '',
      amountblinder: '',
      assetblinder: '',
      confirmations: utxo.status.confirmed && utxo.status.block_height
        ? 1 // Simplified, would need current height
        : 0,
      spendable: true, // Assume spendable if in UTXO set
      solvable: false,
      safe: utxo.status.confirmed,
    }));
  }

  async broadcastTransaction(txHex: string): Promise<string> {
    try {
      const txid = await axios.post<string>(
        `${this.baseUrl}/tx`,
        txHex,
        {
          headers: {
            'Content-Type': 'text/plain',
          },
        }
      );
      return txid.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage = axiosError.response?.data 
        ? String(axiosError.response.data)
        : axiosError.message;
      throw new Error(`Failed to broadcast transaction: ${errorMessage}`);
    }
  }

  async getFeeEstimates(): Promise<Record<string, number>> {
    return await this.get<Record<string, number>>('/fee-estimates');
  }

  // Wallet-like methods that are not available via Esplora
  // These will throw errors suggesting alternatives
  
  getAddressInfo(address: string): { address: string; error: string } {
    return {
      address,
      error: 'getAddressInfo is not available via Esplora API. This requires a wallet.',
    };
  }

  async listUnspent(address?: string): Promise<UnspentOutput[]> {
    if (!address) {
      throw new Error('listUnspent requires an address when using Esplora API');
    }
    return await this.getAddressUTXOs(address);
  }

  listIssuances(): { error: string }[] {
    return [{
      error: 'listIssuances is not available via Esplora API. This requires a node with wallet.',
    }];
  }

  getPeginAddress(): { error: string } {
    return {
      error: 'getPeginAddress is not available via Esplora API. This requires a wallet.',
    };
  }

  generateToAddress(_nblocks: number, _address: string): Promise<string[]> {
    throw new Error('generateToAddress is not available via Esplora API. This requires a regtest node.');
  }

  getBalance(_account?: string, _minconf?: number): { error: string } {
    return {
      error: 'getBalance is not available via Esplora API. Calculate balance from UTXOs using getAddressUTXOs.',
    };
  }

  getNewAddress(_label?: string): { error: string } {
    return {
      error: 'getNewAddress is not available via Esplora API. Use a wallet to generate addresses.',
    };
  }

  sendToAddress(
    _address: string,
    _amount: number,
    _comment?: string,
    _commentTo?: string
  ): { error: string } {
    return {
      error: 'sendToAddress is not available via Esplora API. Create and sign transactions manually, then use broadcastTransaction.',
    };
  }

  async getBlockCount(): Promise<number> {
    return await this.getBlockHeight();
  }

  listTransactions(_account?: string, _count?: number, _skip?: number): { error: string }[] {
    return [{
      error: 'listTransactions is not available via Esplora API. Use getAddressTransactions for specific addresses.',
    }];
  }

  decodeRawTransaction(_hex: string): Promise<Transaction> {
    // Esplora doesn't have a decode endpoint
    // We would need to parse the hex ourselves or use a library
    throw new Error('decodeRawTransaction is not supported via Esplora API. Broadcast the transaction to get it decoded.');
  }
}

