/**
 * Tests for handlers
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ElementsClient } from '../lib/elements-client.js';
import { createHandlers } from '../lib/handlers.js';

vi.mock('../elements-client.js');

describe('Handlers', () => {
  let mockClient: any;
  let handlers: ReturnType<typeof createHandlers>;

  beforeEach(() => {
    mockClient = {
      getBlockchainInfo: vi.fn(),
      getBlock: vi.fn(),
      getTransaction: vi.fn(),
      decodeRawTransaction: vi.fn(),
      getAddressInfo: vi.fn(),
      listUnspent: vi.fn(),
      listIssuances: vi.fn(),
      getPeginAddress: vi.fn(),
    };

    handlers = createHandlers(mockClient);
  });

  describe('Simplicity Tools', () => {
    it('should encode program to hex', async () => {
      const result = await handlers.simplicity_encode({
        program: 'test',
        format: 'hex',
      });
      const data = JSON.parse(result.content[0].text);

      expect(data.encoded).toBe(Buffer.from('test').toString('hex'));
      expect(data.format).toBe('hex');
    });

    it('should encode program to base64', async () => {
      const result = await handlers.simplicity_encode({
        program: 'test',
        format: 'base64',
      });
      const data = JSON.parse(result.content[0].text);

      expect(data.encoded).toBe(Buffer.from('test').toString('base64'));
      expect(data.format).toBe('base64');
    });

    it('should decode program from hex', async () => {
      const hex = Buffer.from('test').toString('hex');
      const result = await handlers.simplicity_decode({
        data: hex,
        format: 'hex',
      });
      const data = JSON.parse(result.content[0].text);

      expect(data.program).toBe('test');
      expect(data.node_type).toBe('ConstructNode');
    });

    it('should decode program from base64', async () => {
      const base64 = Buffer.from('test').toString('base64');
      const result = await handlers.simplicity_decode({
        data: base64,
        format: 'base64',
      });
      const data = JSON.parse(result.content[0].text);

      expect(data.program).toBe('test');
    });

    it('should validate valid program', async () => {
      const result = await handlers.simplicity_validate({ program: 'test' });
      const data = JSON.parse(result.content[0].text);

      expect(data.valid).toBe(true);
      expect(data.errors).toEqual([]);
    });

    it('should validate empty program as invalid', async () => {
      const result = await handlers.simplicity_validate({ program: '' });
      const data = JSON.parse(result.content[0].text);

      expect(data.valid).toBe(false);
      expect(data.errors).toContain('Program is empty');
    });

    it('should construct expression', async () => {
      const result = await handlers.simplicity_construct({
        expression: 'test_expr',
        context: { key: 'value' },
      });
      const data = JSON.parse(result.content[0].text);

      expect(data.construct).toBe('test_expr');
      expect(data.context).toEqual({ key: 'value' });
      expect(data.status).toBe('constructed');
    });

    it('should analyze program', async () => {
      const result = await handlers.simplicity_analyze({ program: 'test' });
      const data = JSON.parse(result.content[0].text);

      expect(data.source_type).toBe('Unit');
      expect(data.target_type).toBe('Unit');
      expect(data.node_count).toBe(4);
      expect(data.estimated_cost).toBe(100);
    });

    it('should finalize construct', async () => {
      const result = await handlers.simplicity_finalize({ construct: 'test' });
      const data = JSON.parse(result.content[0].text);

      expect(data.construct).toBe('test');
      expect(data.commitment).toBe('placeholder_commitment_hash');
      expect(data.status).toBe('finalized');
    });
  });

  describe('Elements Tools', () => {
    it('should get blockchain info', async () => {
      const mockInfo = { chain: 'regtest', blocks: 100 };
      mockClient.getBlockchainInfo.mockResolvedValue(mockInfo as any);

      const result = await handlers.elements_get_blockchain_info({});
      const data = JSON.parse(result.content[0].text);

      expect(data).toEqual(mockInfo);
      expect(mockClient.getBlockchainInfo).toHaveBeenCalled();
    });

    it('should get block by hash', async () => {
      const mockBlock = { hash: 'abc123', height: 100 };
      mockClient.getBlock.mockResolvedValue(mockBlock as any);

      const result = await handlers.elements_get_block({ hash: 'abc123' });
      const data = JSON.parse(result.content[0].text);

      expect(data).toEqual(mockBlock);
      expect(mockClient.getBlock).toHaveBeenCalledWith('abc123');
    });

    it('should get block by height', async () => {
      const mockBlock = { hash: 'abc123', height: 100 };
      mockClient.getBlock.mockResolvedValue(mockBlock as any);

      const result = await handlers.elements_get_block({ height: 100 });
      const data = JSON.parse(result.content[0].text);

      expect(data).toEqual(mockBlock);
      expect(mockClient.getBlock).toHaveBeenCalledWith(100);
    });

    it('should throw error when neither hash nor height provided', async () => {
      await expect(handlers.elements_get_block({})).rejects.toThrow(
        "Either 'hash' or 'height' must be provided"
      );
    });

    it('should get transaction', async () => {
      const mockTx = { txid: 'tx123' };
      mockClient.getTransaction.mockResolvedValue(mockTx as any);

      const result = await handlers.elements_get_transaction({
        txid: 'tx123',
        verbose: true,
      });
      const data = JSON.parse(result.content[0].text);

      expect(data).toEqual(mockTx);
      expect(mockClient.getTransaction).toHaveBeenCalledWith('tx123', true);
    });

    it('should decode raw transaction', async () => {
      const mockDecoded = { txid: 'tx123' };
      mockClient.decodeRawTransaction.mockResolvedValue(mockDecoded as any);

      const result = await handlers.elements_decode_rawtransaction({
        hex: '0100000000',
      });
      const data = JSON.parse(result.content[0].text);

      expect(data).toEqual(mockDecoded);
    });

    it('should get address info', async () => {
      const mockInfo = { address: 'addr123', ismine: true };
      mockClient.getAddressInfo.mockResolvedValue(mockInfo as any);

      const result = await handlers.elements_get_address_info({
        address: 'addr123',
      });
      const data = JSON.parse(result.content[0].text);

      expect(data).toEqual(mockInfo);
    });

    it('should list unspent outputs', async () => {
      const mockUnspent = [{ txid: 'tx1' }];
      mockClient.listUnspent.mockResolvedValue(mockUnspent as any);

      const result = await handlers.elements_list_unspent({
        address: 'addr123',
      });
      const data = JSON.parse(result.content[0].text);

      expect(data).toEqual(mockUnspent);
      expect(mockClient.listUnspent).toHaveBeenCalledWith('addr123');
    });

    it('should get asset info', async () => {
      const result = await handlers.elements_get_asset_info({
        asset_id: 'asset123',
      });
      const data = JSON.parse(result.content[0].text);

      expect(data.asset_id).toBe('asset123');
      expect(data.message).toContain('not directly supported');
    });

    it('should list issuances', async () => {
      const mockIssuances = [{ asset: 'asset1' }];
      mockClient.listIssuances.mockResolvedValue(mockIssuances as any);

      const result = await handlers.elements_list_issuances({});
      const data = JSON.parse(result.content[0].text);

      expect(data).toEqual(mockIssuances);
    });

    it('should get pegin address', async () => {
      const mockAddress = { mainchain_address: 'btc123' };
      mockClient.getPeginAddress.mockResolvedValue(mockAddress as any);

      const result = await handlers.elements_get_pegin_address({});
      const data = JSON.parse(result.content[0].text);

      expect(data).toEqual(mockAddress);
    });
  });

  describe('Integration Tools', () => {
    it('should decode simplicity transaction', async () => {
      const mockTx = { txid: 'tx123', vin: [], vout: [] };
      mockClient.getTransaction.mockResolvedValue(mockTx as any);

      const result = await handlers.decode_simplicity_transaction({
        txid: 'tx123',
        output_index: 1,
      });
      const data = JSON.parse(result.content[0].text);

      expect(data.txid).toBe('tx123');
      expect(data.output_index).toBe(1);
      expect(data.transaction).toEqual(mockTx);
      expect(mockClient.getTransaction).toHaveBeenCalledWith('tx123', true);
    });

    it('should use default output index', async () => {
      const mockTx = { txid: 'tx123' };
      mockClient.getTransaction.mockResolvedValue(mockTx as any);

      const result = await handlers.decode_simplicity_transaction({
        txid: 'tx123',
      });
      const data = JSON.parse(result.content[0].text);

      expect(data.output_index).toBe(0);
    });

    it('should verify simplicity script with witness', async () => {
      const result = await handlers.verify_simplicity_script({
        program: 'test',
        witness: 'witness_data',
      });
      const data = JSON.parse(result.content[0].text);

      expect(data.valid).toBe(true);
      expect(data.witness_provided).toBe(true);
      expect(data.execution_cost).toBe(150);
    });

    it('should verify simplicity script without witness', async () => {
      const result = await handlers.verify_simplicity_script({
        program: 'test',
      });
      const data = JSON.parse(result.content[0].text);

      expect(data.witness_provided).toBe(false);
    });

    it('should estimate simplicity cost', async () => {
      const result = await handlers.estimate_simplicity_cost({
        program: 'test_program',
      });
      const data = JSON.parse(result.content[0].text);

      expect(data.estimated_cost).toBe(200);
      expect(data.max_cost).toBe(1000);
      expect(data.node_count).toBe(12);
    });

    it('should analyze simplicity in block', async () => {
      const mockBlock = { hash: 'block123', height: 100, tx: [{}, {}] };
      mockClient.getBlock.mockResolvedValue(mockBlock as any);

      const result = await handlers.analyze_simplicity_in_block({
        block_hash: 'block123',
      });
      const data = JSON.parse(result.content[0].text);

      expect(data.block_hash).toBe('block123');
      expect(data.block_height).toBe(100);
      expect(data.total_transactions).toBe(2);
    });
  });
});
