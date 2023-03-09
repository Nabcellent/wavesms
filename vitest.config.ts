import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        coverage: {
            exclude: [
                'node_modules/',
                './tests/setup.ts',
            ],
        },
        setupFiles: ['./tests/setup.ts'],
    },
})