import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  base: '/compscie/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    // Lets tests read real design tokens with `global.css?raw` (Vitest blanks CSS otherwise).
    css: { include: [/src\/styles\/global\.css/] },
    globalSetup: ['./vitest.global-setup.ts'],
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./src/test/setup.ts'],
  },
})
