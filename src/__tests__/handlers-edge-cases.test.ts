/**
 * Tests for handler edge cases to achieve 100% coverage
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createHandlers } from '../lib/handlers.js';
import type { ElementsClient } from '../lib/elements-client.js';

vi.mock('../elements-client.js');

describe('Handlers Edge Cases', () => {
  let mockClient: Partial<ElementsClient>;
  let handlers: ReturnType<typeof createHandlers>;

  beforeEach(() => {
    mockClient = {
      getBlock: vi.fn(),
      getTransaction: vi.fn(),
    };

    handlers = createHandlers(mockClient as ElementsClient);
  });

  it('should handle elements_get_block with hash = 0 (falsy but valid)', async () => {
    const mockBlock = { hash: '000', height: 0 };
    mockClient.getBlock.mockResolvedValue(mockBlock as any);

    const result = await handlers.elements_get_block({
      hash: '000',
      height: 0,
    });
    const data = JSON.parse(result.content[0].text);

    expect(data).toEqual(mockBlock);
    expect(mockClient.getBlock).toHaveBeenCalledWith('000');
  });

  it('should verify_simplicity_script with empty program', async () => {
    const result = await handlers.verify_simplicity_script({ program: '' });
    const data = JSON.parse(result.content[0].text);

    expect(data.valid).toBe(false);
    expect(data.errors).toContain('Program is empty');
  });

  it('should analyze_simplicity_in_block with block without transactions', async () => {
    const mockBlock = { hash: 'block123', height: 100 };
    mockClient.getBlock.mockResolvedValue(mockBlock as any);

    const result = await handlers.analyze_simplicity_in_block({
      block_hash: 'block123',
    });
    const data = JSON.parse(result.content[0].text);

    expect(data.total_transactions).toBe(0);
  });
});
