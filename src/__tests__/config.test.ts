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
    delete process.env.ESPLORA_API_URL;

    const config = loadConfig();

    expect(config).toEqual({
      esploraApiUrl: 'https://blockstream.info/liquidtestnet/api',
    });
  });

  it('should load configuration from environment variables', () => {
    process.env.ESPLORA_API_URL = 'https://custom-esplora.com/api';

    const config = loadConfig();

    expect(config).toEqual({
      esploraApiUrl: 'https://custom-esplora.com/api',
    });
  });

  it('should use environment variables over defaults', () => {
    process.env.ESPLORA_API_URL = 'http://localhost:3000';

    const config = loadConfig();

    expect(config.esploraApiUrl).toBe('http://localhost:3000');
  });
});
