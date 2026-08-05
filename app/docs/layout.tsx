import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';
import { BookOpen, Code2 } from 'lucide-react';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...baseOptions()}
      tabs={[
        {
          title: 'Docs',
          description: 'Guides & Documentation',
          icon: <BookOpen className="size-4" />,
          url: '/docs',
        },
        {
          title: 'Technical',
          description: 'Architecture & Technical Specs',
          icon: <Code2 className="size-4" />,
          url: '/docs/technical',
        },
      ]}
    >
      {children}
    </DocsLayout>
  );
}
