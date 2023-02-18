// vite.config.ts
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'wavesms',
            // formats: ['es', 'cjs'], // adding 'umd' requires globals set to every external module
            fileName: format => `wavesms.${format}.js`,
        },
        rollupOptions: {
            input: resolve(__dirname, 'src/index.ts')
        },
        sourcemap: true,
    },
    plugins: [dts()],
});