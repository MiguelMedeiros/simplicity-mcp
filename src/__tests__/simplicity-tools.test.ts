/**
 * Tests for Simplicity Tools
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  SimplicityTools,
  MockSimplicityTools,
  extractTransaction,
  isValidBase64Program,
} from '../lib/simplicity-tools.js';

describe('SimplicityTools', () => {
  let tools: SimplicityTools;

  beforeEach(() => {
    tools = new SimplicityTools();
  });

  describe('isSimcAvailable', () => {
    it('should check if simc is available', async () => {
      const result = await tools.isSimcAvailable();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('isHalSimplicityAvailable', () => {
    it('should check if hal-simplicity is available', async () => {
      const result = await tools.isHalSimplicityAvailable();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('compileFile', () => {
    it('should return error for non-existent file', async () => {
      const result = await tools.compileFile('/nonexistent/file.simf');
      expect(result.success).toBe(false);
      expect(result.error).toContain('File not found');
    });

    it('should check file existence before simc availability', async () => {
      // File check happens first, so non-existent file returns "not found"
      const result = await tools.compileFile('test.simf');
      expect(result.success).toBe(false);
      expect(result.error).toContain('File not found');
    });
  });

  describe('createWitnessTemplate', () => {
    it('should create empty witness template', () => {
      const template = tools.createWitnessTemplate('empty');
      expect(template).toEqual({});
    });

    it('should create p2ms witness template', () => {
      const template = tools.createWitnessTemplate('p2ms');
      expect(template).toHaveProperty('sig1');
      expect(template).toHaveProperty('sig2');
      expect(template).toHaveProperty('sig3');
    });

    it('should create htlc witness template', () => {
      const template = tools.createWitnessTemplate('htlc');
      expect(template).toHaveProperty('preimage');
      expect(template).toHaveProperty('signature');
    });

    it('should create vault witness template', () => {
      const template = tools.createWitnessTemplate('vault');
      expect(template).toHaveProperty('signature');
      expect(template).toHaveProperty('withdrawal_block');
    });

    it('should return empty object for unknown type', () => {
      const template = tools.createWitnessTemplate('unknown');
      expect(template).toEqual({});
    });
  });
});

describe('MockSimplicityTools', () => {
  describe('mockCompile', () => {
    it('should return success with JA== program', () => {
      const result = MockSimplicityTools.mockCompile('test.simf');
      expect(result.success).toBe(true);
      expect(result.program).toBe('JA==');
      expect(result.warnings).toBeDefined();
    });
  });

  describe('mockProgramInfo', () => {
    it('should return mock program info', () => {
      const info = MockSimplicityTools.mockProgramInfo('JA==');
      expect(info.address).toBeDefined();
      expect(info.program_hash).toBeDefined();
      expect(info.witness_structure).toBeDefined();
      expect(info.error).toContain('mock');
    });
  });
});

describe('extractTransaction', () => {
  it('should extract transaction from output', () => {
    const output = 'Some line\nwith.transaction abc123def456.ext\nmore text';
    const txid = extractTransaction(output);
    expect(txid).toBe('abc123def456');
  });

  it('should return null if no transaction found', () => {
    const output = 'No transaction here';
    const txid = extractTransaction(output);
    expect(txid).toBeNull();
  });

  it('should handle empty string', () => {
    const txid = extractTransaction('');
    expect(txid).toBeNull();
  });
});

describe('isValidBase64Program', () => {
  it('should validate correct base64', () => {
    expect(isValidBase64Program('JA==')).toBe(true);
    expect(isValidBase64Program('SGVsbG8=')).toBe(true);
  });

  it('should reject invalid base64', () => {
    expect(isValidBase64Program('not-base64!!!')).toBe(false);
    // Empty string is technically valid base64 (empty buffer)
    expect(isValidBase64Program('invalid base64 with spaces')).toBe(false);
  });

  it('should reject malformed base64', () => {
    expect(isValidBase64Program('JA=')).toBe(false); // Wrong padding
  });
});

