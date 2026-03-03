import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts']
  },
  resolve: {
    alias: {
      '@mtn/shared': path.resolve(__dirname, 'packages/shared/src/index.ts'),
      '@mtn/domain': path.resolve(__dirname, 'packages/domain/src/index.ts'),
      '@mtn/storage': path.resolve(__dirname, 'packages/storage/src/index.ts'),
      '@mtn/adapters': path.resolve(__dirname, 'packages/adapters/src/index.ts')
    }
  }
})
