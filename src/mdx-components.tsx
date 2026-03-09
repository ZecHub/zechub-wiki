import type { MDXComponents } from 'mdx/types'
import ZecToZatsConverter from '@/components/Converter/ZecToZatsConverter'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ZecToZatsConverter,   // ← this line makes the tag work everywhere
  }
}
