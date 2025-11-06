/**
 * Tests for config module
 */

import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest';
import { loadConfig } from '../lib/config.js';

describe('Config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should load default configuration', () => {
    delete process.env.ELEMENTS_RPC_URL;
    delete process.env.ELEMENTS_RPC_USER;
    delete process.env.ELEMENTS_RPC_PASSWORD;

    const config = loadConfig();

    expect(config).toEqual({
      elementsRpcUrl: 'http://127.0.0.1:18884',
      elementsRpcUser: 'elementsuser',
      elementsRpcPassword: 'elementspass',
    });
  });

  it('should load configuration from environment variables', () => {
    process.env.ELEMENTS_RPC_URL = 'http://custom:8080';
    process.env.ELEMENTS_RPC_USER = 'testuser';
    process.env.ELEMENTS_RPC_PASSWORD = 'testpass';

    const config = loadConfig();

    expect(config).toEqual({
      elementsRpcUrl: 'http://custom:8080',
      elementsRpcUser: 'testuser',
      elementsRpcPassword: 'testpass',
    });
  });

  it('should use environment variables over defaults', () => {
    process.env.ELEMENTS_RPC_URL = 'http://override:9999';

    const config = loadConfig();

    expect(config.elementsRpcUrl).toBe('http://override:9999');
    expect(config.elementsRpcUser).toBe('elementsuser');
    expect(config.elementsRpcPassword).toBe('elementspass');
  });
});
