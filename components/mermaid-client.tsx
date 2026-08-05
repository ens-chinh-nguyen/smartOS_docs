'use client';

import dynamic from 'next/dynamic';

const DynamicMermaid = dynamic(
  () => import('fumadocs-mermaid/ui').then((m) => m.Mermaid),
  { ssr: false }
);

export function Mermaid(props: any) {
  return <DynamicMermaid {...props} />;
}
