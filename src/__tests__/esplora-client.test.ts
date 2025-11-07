/**
 * Tests for EsploraClient
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';
import { EsploraClient } from '../lib/esplora-client.js';

vi.mock('axios');
const mockedAxios = axios as any;

describe('EsploraClient', () => {
  let client: EsploraClient;

  beforeEach(() => {
    client = new EsploraClient('https://blockstream.info/liquidtestnet/api');
    vi.clearAllMocks();
  });

  describe('getBlockchainInfo', () => {
    it('should get blockchain info', async () => {
      mockedAxios.get = vi
        .fn()
        .mockResolvedValueOnce({ data: '12345' }) // tip height
        .mockResolvedValueOnce({ data: 'abc123' }); // tip hash

      const result = await client.getBlockchainInfo();

      expect(result).toEqual({
        chain: 'liquidtestnet',
        blocks: 12345,
        bestblockhash: 'abc123',
      });
    });

    it('should handle API error', async () => {
      mockedAxios.get = vi.fn().mockRejectedValue({
        response: { status: 500 },
        message: 'API error',
      });

      await expect(client.getBlockchainInfo()).rejects.toThrow(
        'Esplora API error'
      );
    });
  });

  describe('getBlockHeight', () => {
    it('should get current block height', async () => {
      mockedAxios.get = vi.fn().mockResolvedValue({ data: '12345' });

      const result = await client.getBlockHeight();

      expect(result).toBe(12345);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://blockstream.info/liquidtestnet/api/blocks/tip/height'
      );
    });
  });

  describe('getBlockHash', () => {
    it('should get block hash by height', async () => {
      mockedAxios.get = vi.fn().mockResolvedValue({ data: 'abc123' });

      const result = await client.getBlockHash(100);

      expect(result).toBe('abc123');
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://blockstream.info/liquidtestnet/api/block-height/100'
      );
    });
  });

  describe('getBlock', () => {
    it('should get block by hash', async () => {
      const mockBlock = { hash: 'abc123', height: 100 };
      const mockStatus = { height: 100, in_best_chain: true };

      mockedAxios.get = vi
        .fn()
        .mockResolvedValueOnce({ data: mockBlock })
        .mockResolvedValueOnce({ data: mockStatus });

      const result = await client.getBlock('abc123');

      expect(result).toEqual({
        ...mockBlock,
        height: 100,
        confirmations: 1,
      });
    });

    it('should get block by height', async () => {
      const mockBlock = { hash: 'abc123', height: 100 };
      const mockStatus = { height: 100, in_best_chain: true };

      mockedAxios.get = vi
        .fn()
        .mockResolvedValueOnce({ data: 'abc123' }) // getBlockHash
        .mockResolvedValueOnce({ data: mockBlock }) // getBlock
        .mockResolvedValueOnce({ data: mockStatus }); // status

      const result = await client.getBlock(100);

      expect(result).toEqual({
        ...mockBlock,
        height: 100,
        confirmations: 1,
      });
    });
  });

  describe('getTransaction', () => {
    it('should get transaction with verbose', async () => {
      const mockTx = { txid: 'tx123', vin: [], vout: [] };
      const mockStatus = {
        confirmed: true,
        block_height: 100,
        block_hash: 'block123',
        block_time: 1234567890,
      };

      mockedAxios.get = vi
        .fn()
        .mockResolvedValueOnce({ data: mockTx })
        .mockResolvedValueOnce({ data: mockStatus })
        .mockResolvedValueOnce({ data: '105' }); // current height

      const result = await client.getTransaction('tx123', true);

      expect(result).toEqual({
        ...mockTx,
        confirmations: 6,
        blockhash: 'block123',
        blocktime: 1234567890,
      });
    });

    it('should get unconfirmed transaction', async () => {
      const mockTx = { txid: 'tx123', vin: [], vout: [] };
      const mockStatus = { confirmed: false };

      mockedAxios.get = vi
        .fn()
        .mockResolvedValueOnce({ data: mockTx })
        .mockResolvedValueOnce({ data: mockStatus });

      const result = await client.getTransaction('tx123', true);

      expect(result).toEqual({
        ...mockTx,
        confirmations: 0,
        blockhash: undefined,
        blocktime: undefined,
      });
    });
  });

  describe('getTransactionHex', () => {
    it('should get transaction hex', async () => {
      const mockHex = '0100000000010000000000';
      mockedAxios.get = vi.fn().mockResolvedValue({ data: mockHex });

      const result = await client.getTransactionHex('tx123');

      expect(result).toBe(mockHex);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://blockstream.info/liquidtestnet/api/tx/tx123/hex'
      );
    });
  });

  describe('getAddressTransactions', () => {
    it('should get address transactions', async () => {
      const mockTxs = [
        { txid: 'tx1', vin: [], vout: [] },
        { txid: 'tx2', vin: [], vout: [] },
      ];
      mockedAxios.get = vi.fn().mockResolvedValue({ data: mockTxs });

      const result = await client.getAddressTransactions('addr123');

      expect(result).toEqual(mockTxs);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://blockstream.info/liquidtestnet/api/address/addr123/txs'
      );
    });
  });

  describe('getAddressUTXOs', () => {
    it('should get address UTXOs', async () => {
      const mockUTXOs = [
        {
          txid: 'tx1',
          vout: 0,
          value: 100000000,
          status: { confirmed: true, block_height: 100 },
          asset: 'asset123',
        },
      ];
      mockedAxios.get = vi.fn().mockResolvedValue({ data: mockUTXOs });

      const result = await client.getAddressUTXOs('addr123');

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        txid: 'tx1',
        vout: 0,
        address: 'addr123',
        amount: 1,
        asset: 'asset123',
      });
    });
  });

  describe('broadcastTransaction', () => {
    it('should broadcast transaction', async () => {
      const mockTxid = 'tx123';
      mockedAxios.post = vi.fn().mockResolvedValue({ data: mockTxid });

      const result = await client.broadcastTransaction('0100000000');

      expect(result).toBe(mockTxid);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://blockstream.info/liquidtestnet/api/tx',
        '0100000000',
        {
          headers: {
            'Content-Type': 'text/plain',
          },
        }
      );
    });

    it('should handle broadcast error', async () => {
      mockedAxios.post = vi.fn().mockRejectedValue({
        response: { data: 'Transaction rejected' },
        message: 'Broadcast failed',
      });

      await expect(client.broadcastTransaction('0100000000')).rejects.toThrow(
        'Failed to broadcast transaction'
      );
    });
  });

  describe('getFeeEstimates', () => {
    it('should get fee estimates', async () => {
      const mockEstimates = { '1': 1.5, '6': 1.2, '12': 1.0 };
      mockedAxios.get = vi.fn().mockResolvedValue({ data: mockEstimates });

      const result = await client.getFeeEstimates();

      expect(result).toEqual(mockEstimates);
    });
  });

  describe('wallet methods (not available)', () => {
    it('should return error for getAddressInfo', async () => {
      const result = await client.getAddressInfo('addr123');

      expect(result).toHaveProperty('error');
      expect(result.error).toContain('not available via Esplora API');
    });

    it('should throw error for listUnspent without address', async () => {
      await expect(client.listUnspent()).rejects.toThrow(
        'listUnspent requires an address'
      );
    });

    it('should return UTXOs for listUnspent with address', async () => {
      const mockUTXOs = [
        {
          txid: 'tx1',
          vout: 0,
          value: 100000000,
          status: { confirmed: true, block_height: 100 },
        },
      ];
      mockedAxios.get = vi.fn().mockResolvedValue({ data: mockUTXOs });

      const result = await client.listUnspent('addr123');

      expect(result).toHaveLength(1);
    });

    it('should return error for listIssuances', async () => {
      const result = await client.listIssuances();

      expect(result[0]).toHaveProperty('error');
    });

    it('should return error for getPeginAddress', async () => {
      const result = await client.getPeginAddress();

      expect(result).toHaveProperty('error');
    });

    it('should throw error for generateToAddress', () => {
      expect(() => client.generateToAddress(1, 'addr')).toThrow(
        'not available via Esplora API'
      );
    });

    it('should return error for getBalance', async () => {
      const result = await client.getBalance();

      expect(result).toHaveProperty('error');
    });

    it('should return error for getNewAddress', async () => {
      const result = await client.getNewAddress();

      expect(result).toHaveProperty('error');
    });

    it('should return error for sendToAddress', async () => {
      const result = await client.sendToAddress('addr', 1);

      expect(result).toHaveProperty('error');
    });

    it('should return error for listTransactions', async () => {
      const result = await client.listTransactions();

      expect(result[0]).toHaveProperty('error');
    });

    it('should throw error for decodeRawTransaction', () => {
      expect(() => client.decodeRawTransaction('hex')).toThrow(
        'not supported via Esplora API'
      );
    });
  });

  describe('getBlockCount', () => {
    it('should get block count', async () => {
      mockedAxios.get = vi.fn().mockResolvedValue({ data: '12345' });

      const result = await client.getBlockCount();

      expect(result).toBe(12345);
    });
  });
});

