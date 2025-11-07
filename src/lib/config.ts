/**
 * Configuration management
 */

export interface Config {
  esploraApiUrl: string;
}

export function loadConfig(): Config {
  return {
    esploraApiUrl: process.env.ESPLORA_API_URL || 'https://blockstream.info/liquidtestnet/api',
  };
}
