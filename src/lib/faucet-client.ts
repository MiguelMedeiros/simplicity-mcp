/**
 * Liquid Testnet Faucet Client
 * Interface for requesting LBTC from the testnet faucet
 */

import axios from 'axios';

const FAUCET_URL = 'https://liquidtestnet.com/faucet';

export interface FaucetRequest {
  address: string;
  asset?: 'lbtc' | 'asset';
}

export interface FaucetResponse {
  success: boolean;
  txid?: string;
  message?: string;
  error?: string;
}

export class FaucetClient {
  /**
   * Request LBTC from the Liquid testnet faucet
   */
  async requestFunds(request: FaucetRequest): Promise<FaucetResponse> {
    try {
      const response = await axios.get(FAUCET_URL, {
        params: {
          address: request.address,
          action: request.asset || 'lbtc',
        },
        timeout: 30000, // 30 second timeout
      });

      // Check if response contains txid
      const html = response.data as string;

      // Look for transaction ID in response
      const txidMatch = html.match(/[a-f0-9]{64}/);

      if (txidMatch && txidMatch[0]) {
        return {
          success: true,
          txid: txidMatch[0],
          message: 'Funds requested successfully',
        };
      }

      return {
        success: false,
        message: 'Faucet request sent but no txid found in response',
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: `Faucet request failed: ${error.message}`,
        };
      }

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error requesting funds',
      };
    }
  }

  /**
   * Request funds with retry logic
   */
  async requestFundsWithRetry(
    request: FaucetRequest,
    maxRetries = 3,
    delayMs = 2000
  ): Promise<FaucetResponse> {
    let lastError: string | undefined;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const result = await this.requestFunds(request);

      if (result.success) {
        return result;
      }

      lastError = result.error || result.message;

      if (attempt < maxRetries) {
        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    return {
      success: false,
      error: `Failed after ${maxRetries} attempts. Last error: ${lastError}`,
    };
  }

  /**
   * Check faucet availability
   */
  async checkFaucetStatus(): Promise<{
    available: boolean;
    message?: string;
  }> {
    try {
      const response = await axios.get(FAUCET_URL, { timeout: 5000 });

      if (response.status === 200) {
        return {
          available: true,
          message: 'Faucet is available',
        };
      }

      return {
        available: false,
        message: `Unexpected status code: ${response.status}`,
      };
    } catch (error) {
      return {
        available: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to check faucet status',
      };
    }
  }
}

/**
 * Helper function to validate Liquid address
 */
export function isValidLiquidAddress(address: string): boolean {
  // Basic validation for Liquid addresses
  // Liquid testnet addresses typically start with 'lq' or 'ex'
  // Mainnet addresses start with 'VJ' or other prefixes

  if (!address || typeof address !== 'string') {
    return false;
  }

  // Check prefix
  const validPrefixes = ['lq', 'ex', 'VJ', 'ert', 'el'];
  const hasValidPrefix = validPrefixes.some((prefix) =>
    address.startsWith(prefix)
  );

  if (!hasValidPrefix) {
    return false;
  }

  // Check length (typically 42-62 characters for segwit addresses)
  if (address.length < 26 || address.length > 90) {
    return false;
  }

  return true;
}


