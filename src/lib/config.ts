/**
 * Configuration management
 */

export interface Config {
  elementsRpcUrl: string;
  elementsRpcUser: string;
  elementsRpcPassword: string;
}

export function loadConfig(): Config {
  return {
    elementsRpcUrl: process.env.ELEMENTS_RPC_URL || 'http://127.0.0.1:18884',
    elementsRpcUser: process.env.ELEMENTS_RPC_USER || 'elementsuser',
    elementsRpcPassword: process.env.ELEMENTS_RPC_PASSWORD || 'elementspass',
  };
}
