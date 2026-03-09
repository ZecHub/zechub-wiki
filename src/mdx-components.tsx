import type { MDXComponents } from 'mdx/types'
import ZecToZatsConverter from '@/components/Converter/ZecToZatsConverter'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ZecToZatsConverter,   //  This line makes <ZecToZatsConverter /> work in Markdown!
  }
}
