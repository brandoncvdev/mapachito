import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  // test: {
  //   environment: 'jsdom',
  //   globals: true,
  // },

  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'mapachito',
      fileName: (format) => `mapachito.${format}.js`,
    },
    rollupOptions: {
      // No incluimos dependencias externas
      external: [],
      output: {
        globals: {},
      },
    },
  },
  resolve: {
    alias: {
      '@mapachito': path.resolve(__dirname, 'src/')
    }
  }
});
