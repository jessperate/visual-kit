import { defineConfig, Plugin } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Resolves Figma Make-specific `figma:asset/<hash>.png` imports to the
// matching files in src/assets/ so the project builds outside of Figma.
const figmaAssetPlugin: Plugin = {
  name: 'figma-asset-stub',
  enforce: 'pre',
  resolveId(id) {
    if (id.startsWith('figma:asset/')) {
      const filename = id.replace('figma:asset/', '')
      return path.resolve(__dirname, 'src/assets', filename)
    }
  },
}

export default defineConfig({
  plugins: [
    figmaAssetPlugin,
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
