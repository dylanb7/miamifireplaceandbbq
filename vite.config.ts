import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from "nitro/vite"
import netlify from '@netlify/vite-plugin-tanstack-start'


const config = defineConfig({
  server: {

    port: 3333,
  },
  plugins: [
    devtools(),
    //nitro({ preset: "bun" }),
    netlify({}),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config


