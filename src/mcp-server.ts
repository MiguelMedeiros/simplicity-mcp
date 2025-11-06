#!/usr/bin/env node

/**
 * Simplicity MCP Server - Main Entry Point
 * A Model Context Protocol server for Simplicity and Elements blockchain
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  TextContent,
} from '@modelcontextprotocol/sdk/types.js';
import { loadConfig } from './lib/config.js';
import { ElementsClient } from './lib/elements-client.js';
import { createHandlers } from './lib/handlers.js';
import { tools } from './lib/tools.js';

async function main(): Promise<void> {
  // Load configuration
  const config = loadConfig();

  // Initialize Elements client
  const elementsClient = new ElementsClient(
    config.elementsRpcUrl,
    config.elementsRpcUser,
    config.elementsRpcPassword
  );

  // Create tool handlers
  const toolHandlers = createHandlers(elementsClient);

  // Create MCP server
  const server = new Server(
    {
      name: 'simplicity-mcp',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Register list tools handler
  server.setRequestHandler(ListToolsRequestSchema, () => {
    return Promise.resolve({ tools });
  });

  // Register call tool handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (!toolHandlers[name]) {
      throw new Error(`Unknown tool: ${name}`);
    }

    try {
      return await toolHandlers[name](args || {});
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          } as TextContent,
        ],
        isError: true,
      };
    }
  });

  // Connect server to stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Log server startup
  console.error('Simplicity MCP Server running on stdio');
}

// Start the server
main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
