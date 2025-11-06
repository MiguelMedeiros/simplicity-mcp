/**
 * Tests for tools definitions
 */

import { describe, it, expect } from 'vitest';
import { tools } from '../lib/tools.js';

describe('Tools', () => {
  it('should export 33 tools', () => {
    expect(tools).toHaveLength(33);
  });

  it('should have all Simplicity tools', () => {
    const simplicityTools = tools.filter((t) =>
      t.name.startsWith('simplicity_')
    );
    expect(simplicityTools).toHaveLength(12);

    const names = simplicityTools.map((t) => t.name);
    expect(names).toContain('simplicity_encode');
    expect(names).toContain('simplicity_decode');
    expect(names).toContain('simplicity_validate');
    expect(names).toContain('simplicity_construct');
    expect(names).toContain('simplicity_analyze');
    expect(names).toContain('simplicity_finalize');
  });

  it('should have all Elements tools', () => {
    const elementsTools = tools.filter((t) => t.name.startsWith('elements_'));
    expect(elementsTools).toHaveLength(9);

    const names = elementsTools.map((t) => t.name);
    expect(names).toContain('elements_get_blockchain_info');
    expect(names).toContain('elements_get_block');
    expect(names).toContain('elements_get_transaction');
    expect(names).toContain('elements_decode_rawtransaction');
    expect(names).toContain('elements_get_address_info');
    expect(names).toContain('elements_list_unspent');
    expect(names).toContain('elements_get_asset_info');
    expect(names).toContain('elements_list_issuances');
    expect(names).toContain('elements_get_pegin_address');
  });

  it('should have all Integration tools', () => {
    const integrationTools = tools.filter(
      (t) =>
        !t.name.startsWith('simplicity_') && !t.name.startsWith('elements_')
    );
    expect(integrationTools).toHaveLength(12);

    const names = integrationTools.map((t) => t.name);
    expect(names).toContain('decode_simplicity_transaction');
    expect(names).toContain('verify_simplicity_script');
    expect(names).toContain('estimate_simplicity_cost');
    expect(names).toContain('analyze_simplicity_in_block');
  });

  it('should have valid input schemas for all tools', () => {
    tools.forEach((tool) => {
      expect(tool.inputSchema).toBeDefined();
      expect(tool.inputSchema.type).toBe('object');
      expect(tool.inputSchema.properties).toBeDefined();
    });
  });

  it('should have descriptions for all tools', () => {
    tools.forEach((tool) => {
      expect(tool.description).toBeDefined();
      expect(tool.description.length).toBeGreaterThan(0);
    });
  });

  it('should have required fields defined where needed', () => {
    const toolsWithRequired = tools.filter((t) => t.inputSchema.required);

    // Examples of tools that should have required fields
    const encodeTool = tools.find((t) => t.name === 'simplicity_encode');
    expect(encodeTool?.inputSchema.required).toContain('program');

    const getTransactionTool = tools.find(
      (t) => t.name === 'elements_get_transaction'
    );
    expect(getTransactionTool?.inputSchema.required).toContain('txid');
  });

  it('should have proper property types', () => {
    const encodeTool = tools.find((t) => t.name === 'simplicity_encode');
    expect(encodeTool?.inputSchema.properties?.program).toBeDefined();
    expect(encodeTool?.inputSchema.properties?.program?.type).toBe('string');
    expect(encodeTool?.inputSchema.properties?.format?.enum).toEqual([
      'hex',
      'base64',
    ]);
  });
});
