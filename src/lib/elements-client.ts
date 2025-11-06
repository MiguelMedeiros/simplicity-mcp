/**
 * Elements RPC Client
 * Handles communication with Elements blockchain node
 */

import axios, { AxiosError } from 'axios';
import type {
  BlockchainInfo,
  Block,
  Transaction,
  AddressInfo,
  UnspentOutput,
} from '../types.js';

// RPC types
interface RPCRequest {
  jsonrpc: string;
  id: string;
  method: string;
  params: unknown[];
}

interface RPCResponse<T = unknown> {
  result: T;
  error?: {
    code: number;
    message: string;
  };
}

export class ElementsClient {
  private url: string;
  private auth: string;

  constructor(url: string, user: string, password: string) {
    this.url = url;
    this.auth = Buffer.from(`${user}:${password}`).toString('base64');
  }

  async call<T = unknown>(method: string, params: unknown[] = []): Promise<T> {
    try {
      const response = await axios.post<RPCResponse<T>>(
        this.url,
        {
          jsonrpc: '1.0',
          id: 'mcp-client',
          method,
          params,
        } as RPCRequest,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${this.auth}`,
          },
        }
      );
      return response.data.result;
    } catch (error) {
      const axiosError = error as AxiosError<RPCResponse>;
      throw new Error(
        `Elements RPC error: ${axiosError.response?.data?.error?.message || axiosError.message}`
      );
    }
  }

  async getBlockchainInfo(): Promise<BlockchainInfo> {
    return await this.call<BlockchainInfo>('getblockchaininfo');
  }

  async getBlock(hashOrHeight: string | number): Promise<Block> {
    if (typeof hashOrHeight === 'number') {
      const hash = await this.call<string>('getblockhash', [hashOrHeight]);
      return await this.call<Block>('getblock', [hash, 2]);
    }
    return await this.call<Block>('getblock', [hashOrHeight, 2]);
  }

  async getTransaction(txid: string, verbose = true): Promise<Transaction> {
    return await this.call<Transaction>('getrawtransaction', [txid, verbose]);
  }

  async decodeRawTransaction(hex: string): Promise<Transaction> {
    return await this.call<Transaction>('decoderawtransaction', [hex]);
  }

  async getAddressInfo(address: string): Promise<AddressInfo> {
    return await this.call<AddressInfo>('getaddressinfo', [address]);
  }

  async listUnspent(address?: string): Promise<UnspentOutput[]> {
    if (address) {
      return await this.call<UnspentOutput[]>('listunspent', [
        0,
        9999999,
        [address],
      ]);
    }
    return await this.call<UnspentOutput[]>('listunspent');
  }

  async listIssuances(): Promise<unknown[]> {
    return await this.call<unknown[]>('listissuances');
  }

  async getPeginAddress(): Promise<unknown> {
    return await this.call('getpeginaddress');
  }
}
