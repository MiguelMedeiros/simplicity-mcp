/**
 * Tests for Faucet Client
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FaucetClient, isValidLiquidAddress } from '../lib/faucet-client.js';
import axios from 'axios';

vi.mock('axios');

describe('FaucetClient', () => {
  let client: FaucetClient;

  beforeEach(() => {
    client = new FaucetClient();
    vi.clearAllMocks();
  });

  describe('requestFunds', () => {
    it('should request funds successfully', async () => {
      const mockTxid = 'a'.repeat(64);
      vi.mocked(axios.get).mockResolvedValue({
        data: `Transaction sent: ${mockTxid}`,
        status: 200,
      } as any);

      const result = await client.requestFunds({
        address: 'lq1qqtest',
      });

      expect(result.success).toBe(true);
      expect(result.txid).toBe(mockTxid);
    });

    it('should handle request failure', async () => {
      vi.mocked(axios.get).mockRejectedValue(new Error('Network error'));

      const result = await client.requestFunds({
        address: 'lq1qqtest',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Network error');
    });

    it('should handle timeout', async () => {
      vi.mocked(axios.get).mockRejectedValue({
        code: 'ECONNABORTED',
        message: 'timeout',
      });

      const result = await client.requestFunds({
        address: 'lq1qqtest',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('requestFundsWithRetry', () => {
    it('should retry on failure', async () => {
      const mockTxid = 'a'.repeat(64);
      vi.mocked(axios.get)
        .mockRejectedValueOnce(new Error('First attempt failed'))
        .mockResolvedValueOnce({
          data: mockTxid,
          status: 200,
        } as any);

      const result = await client.requestFundsWithRetry(
        { address: 'lq1qqtest' },
        2,
        100
      );

      expect(axios.get).toHaveBeenCalledTimes(2);
      expect(result.success).toBe(true);
    });

    it('should fail after max retries', async () => {
      vi.mocked(axios.get).mockRejectedValue(new Error('Always fails'));

      const result = await client.requestFundsWithRetry(
        { address: 'lq1qqtest' },
        2,
        100
      );

      expect(axios.get).toHaveBeenCalledTimes(2);
      expect(result.success).toBe(false);
    });
  });

  describe('checkFaucetStatus', () => {
    it('should return available when faucet is up', async () => {
      vi.mocked(axios.get).mockResolvedValue({
        status: 200,
        data: 'OK',
      } as any);

      const result = await client.checkFaucetStatus();
      expect(result.available).toBe(true);
    });

    it('should return unavailable on error', async () => {
      vi.mocked(axios.get).mockRejectedValue(new Error('Connection refused'));

      const result = await client.checkFaucetStatus();
      expect(result.available).toBe(false);
    });
  });
});

describe('isValidLiquidAddress', () => {
  it('should validate liquid testnet addresses', () => {
    // Valid addresses need proper length
    expect(isValidLiquidAddress('lq1qq2xm9gxdtqx7w2gvqd23vvl2d8')).toBe(true);
    expect(isValidLiquidAddress('ex1qq2xm9gxdtqx7w2gvqd23vvl2d8')).toBe(true);
  });

  it('should validate liquid mainnet addresses', () => {
    expect(isValidLiquidAddress('VJL12345678901234567890123456')).toBe(true);
  });

  it('should reject invalid addresses', () => {
    expect(isValidLiquidAddress('')).toBe(false);
    expect(isValidLiquidAddress('bc1qtest')).toBe(false); // Bitcoin, not Liquid
    expect(isValidLiquidAddress('123')).toBe(false); // Too short
    expect(isValidLiquidAddress('x'.repeat(100))).toBe(false); // Too long
  });

  it('should reject non-string input', () => {
    expect(isValidLiquidAddress(null as any)).toBe(false);
    expect(isValidLiquidAddress(undefined as any)).toBe(false);
    expect(isValidLiquidAddress(123 as any)).toBe(false);
  });
});

