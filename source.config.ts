import { defineConfig } from 'fumadocs-mdx/config';
import rehypeRaw from 'rehype-raw';
import { remarkMdxMermaid } from 'fumadocs-mermaid';

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMdxMermaid],
    rehypePlugins: [
      [
        rehypeRaw,
        {
          passThrough: [
            'mdxFlowExpression',
            'mdxJsxFlowElement',
            'mdxJsxTextElement',
            'mdxTextExpression',
            'mdxjsEsm',
          ],
        },
      ],
    ],
  },
});

