import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import appCss from '../styles.css?url'
import { ThemeProvider } from '@/components/theme-provider'
import { NotFound } from '@/components/NotFound'
import { getTaxonomy } from '@/server/admin'
import { getBrandsData } from '@/data/brands'
import { buildNavigationStructure } from '@/data/navigation'

export const Route = createRootRoute({
  loader: async () => {
    const [taxonomy, brands] = await Promise.all([
      getTaxonomy(),
      getBrandsData(),
    ])
    const navigation = buildNavigationStructure(taxonomy)
    return { navigation, brands }
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Miami Fireplace & BBQ',
      },
    ],
    links: [
      {
        rel: 'icon',
        href: '/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          {children}
          <Scripts />
        </ThemeProvider>
        <noscript>
          <style>{`
            .no-js-hidden {
              display: none !important;
            }
          `}</style>
        </noscript>
      </body>
    </html>
  )
}
