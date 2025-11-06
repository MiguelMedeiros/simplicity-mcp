/**
 * Tests for ElementsClient
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';
import { ElementsClient } from '../lib/elements-client.js';

vi.mock('axios');
const mockedAxios = axios as any;

describe('ElementsClient', () => {
  let client: ElementsClient;

  beforeEach(() => {
    client = new ElementsClient('http://localhost:18884', 'user', 'pass');
    vi.clearAllMocks();
  });

  describe('call', () => {
    it('should make successful RPC call', async () => {
      const mockResult = { blocks: 100 };
      mockedAxios.post = vi.fn().mockResolvedValue({
        data: { result: mockResult },
      });

      const result = await client.call('getblockchaininfo');

      expect(result).toEqual(mockResult);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:18884',
        {
          jsonrpc: '1.0',
          id: 'mcp-client',
          method: 'getblockchaininfo',
          params: [],
        },
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should handle RPC error', async () => {
      mockedAxios.post = vi.fn().mockRejectedValue({
        response: {
          data: {
            error: {
              message: 'RPC error',
            },
          },
        },
      });

      await expect(client.call('test')).rejects.toThrow(
        'Elements RPC error: RPC error'
      );
    });

    it('should handle network error', async () => {
      mockedAxios.post = vi.fn().mockRejectedValue(new Error('Network error'));

      await expect(client.call('test')).rejects.toThrow(
        'Elements RPC error: Network error'
      );
    });
  });

  describe('getBlockchainInfo', () => {
    it('should get blockchain info', async () => {
      const mockInfo = { chain: 'regtest', blocks: 101 };
      mockedAxios.post = vi.fn().mockResolvedValue({
        data: { result: mockInfo },
      });

      const result = await client.getBlockchainInfo();

      expect(result).toEqual(mockInfo);
    });
  });

  describe('getBlock', () => {
    it('should get block by hash', async () => {
      const mockBlock = { hash: 'abc123', height: 100 };
      mockedAxios.post = vi.fn().mockResolvedValue({
        data: { result: mockBlock },
      });

      const result = await client.getBlock('abc123');

      expect(result).toEqual(mockBlock);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'getblock',
          params: ['abc123', 2],
        }),
        expect.any(Object)
      );
    });

    it('should get block by height', async () => {
      const mockHash = 'abc123';
      const mockBlock = { hash: mockHash, height: 100 };

      mockedAxios.post = vi
        .fn()
        .mockResolvedValueOnce({ data: { result: mockHash } })
        .mockResolvedValueOnce({ data: { result: mockBlock } });

      const result = await client.getBlock(100);

      expect(result).toEqual(mockBlock);
      expect(mockedAxios.post).toHaveBeenNthCalledWith(
        1,
        expect.any(String),
        expect.objectContaining({
          method: 'getblockhash',
          params: [100],
        }),
        expect.any(Object)
      );
    });
  });

  describe('getTransaction', () => {
    it('should get transaction with verbose', async () => {
      const mockTx = { txid: 'tx123', confirmations: 6 };
      mockedAxios.post = vi.fn().mockResolvedValue({
        data: { result: mockTx },
      });

      const result = await client.getTransaction('tx123', true);

      expect(result).toEqual(mockTx);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'getrawtransaction',
          params: ['tx123', true],
        }),
        expect.any(Object)
      );
    });

    it('should get transaction with default verbose', async () => {
      const mockTx = { txid: 'tx123' };
      mockedAxios.post = vi.fn().mockResolvedValue({
        data: { result: mockTx },
      });

      await client.getTransaction('tx123');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: ['tx123', true],
        }),
        expect.any(Object)
      );
    });
  });

  describe('decodeRawTransaction', () => {
    it('should decode raw transaction', async () => {
      const mockDecoded = { txid: 'tx123', vin: [], vout: [] };
      mockedAxios.post = vi.fn().mockResolvedValue({
        data: { result: mockDecoded },
      });

      const result = await client.decodeRawTransaction('0100000000');

      expect(result).toEqual(mockDecoded);
    });
  });

  describe('getAddressInfo', () => {
    it('should get address info', async () => {
      const mockInfo = { address: 'addr123', ismine: true };
      mockedAxios.post = vi.fn().mockResolvedValue({
        data: { result: mockInfo },
      });

      const result = await client.getAddressInfo('addr123');

      expect(result).toEqual(mockInfo);
    });
  });

  describe('listUnspent', () => {
    it('should list all unspent outputs', async () => {
      const mockUnspent = [{ txid: 'tx1', vout: 0 }];
      mockedAxios.post = vi.fn().mockResolvedValue({
        data: { result: mockUnspent },
      });

      const result = await client.listUnspent();

      expect(result).toEqual(mockUnspent);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'listunspent',
          params: [],
        }),
        expect.any(Object)
      );
    });

    it('should list unspent outputs for specific address', async () => {
      const mockUnspent = [{ txid: 'tx1', vout: 0, address: 'addr123' }];
      mockedAxios.post = vi.fn().mockResolvedValue({
        data: { result: mockUnspent },
      });

      const result = await client.listUnspent('addr123');

      expect(result).toEqual(mockUnspent);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: [0, 9999999, ['addr123']],
        }),
        expect.any(Object)
      );
    });
  });

  describe('listIssuances', () => {
    it('should list issuances', async () => {
      const mockIssuances = [{ asset: 'asset1' }];
      mockedAxios.post = vi.fn().mockResolvedValue({
        data: { result: mockIssuances },
      });

      const result = await client.listIssuances();

      expect(result).toEqual(mockIssuances);
    });
  });

  describe('getPeginAddress', () => {
    it('should get pegin address', async () => {
      const mockAddress = { mainchain_address: 'btc1234' };
      mockedAxios.post = vi.fn().mockResolvedValue({
        data: { result: mockAddress },
      });

      const result = await client.getPeginAddress();

      expect(result).toEqual(mockAddress);
    });
  });
});
