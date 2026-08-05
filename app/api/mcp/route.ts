import { createMcpHandler } from 'mcp-handler';
import { z } from 'zod';
import { createFromSource } from 'fumadocs-core/search/server';
import { source, getLLMText } from '@/lib/source';
import { appName } from '@/lib/shared';

const searchAPI = createFromSource(source);

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      'search_docs',
      {
        title: 'Search Docs',
        description: 'Search the documentation and return matching pages/sections with URLs',
        inputSchema: z.object({
          query: z.string().describe('Search query'),
        }),
      },
      async ({ query }) => {
        const results = await searchAPI.search(query);
        return {
          content: results.map((r) => ({
            type: 'text',
            text: `[${r.type}] ${r.url}\n${r.content}`,
          })),
        };
      },
    );

    server.registerTool(
      'list_docs',
      {
        title: 'List Docs',
        description: 'List all documentation pages with their title, description, and URL',
        inputSchema: z.object({}),
      },
      async () => {
        const pages = source.getPages();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                pages.map((page) => ({
                  title: page.data.title,
                  description: page.data.description,
                  url: page.url,
                })),
              ),
            },
          ],
        };
      },
    );

    server.registerTool(
      'get_doc',
      {
        title: 'Get Doc',
        description: 'Get the full Markdown content of a documentation page by its URL path',
        inputSchema: z.object({
          url: z.string().describe("Page URL, e.g. '/docs/auth'"),
        }),
      },
      async ({ url }) => {
        const slugs = url.replace(/^\/?docs\/?/, '').split('/').filter(Boolean);
        const page = source.getPage(slugs);

        if (!page) {
          return {
            content: [{ type: 'text', text: `No page found for url: ${url}` }],
            isError: true,
          };
        }

        return {
          content: [{ type: 'text', text: await getLLMText(page) }],
        };
      },
    );
  },
  {
    serverInfo: {
      name: appName,
      version: '1.0.0',
    },
  },
);

export { handler as GET, handler as POST, handler as DELETE };
