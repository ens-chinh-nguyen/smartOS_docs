import defaultMdxComponents from "fumadocs-ui/mdx";
import { Mermaid } from "../mermaid-client";
import type { MDXComponents } from "mdx/types";
import { createCustomLink } from "./custom-link";
import { CustomImg } from "./custom-img";

export * from "./file-preview";
export { CustomImg } from "./custom-img";
export { createCustomLink } from "./custom-link";

export function getMDXComponents(components?: MDXComponents) {
  const { a: providedA, ...otherComponents } = components || {};
  const DefaultA = providedA || defaultMdxComponents.a;

  return {
    ...defaultMdxComponents,
    Mermaid,
    a: createCustomLink(DefaultA),
    img: CustomImg,
    ...otherComponents,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
