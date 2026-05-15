import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      // Entry file pointing to the component you want to share
      entry: path.resolve(__dirname, 'src/App.jsx'),
      name: 'CertificatePlugin',
      // Generates both ES Module (.js) and CommonJS (.cjs) bundles
      fileName: (format) => `certificate-plugin.${format}.js`,
    },
    rollupOptions: {
      // Keep all React imports external so CRA/webpack can resolve them statically
      external: (id) =>
        id === 'react' ||
        id === 'react-dom' ||
        id.startsWith('react/') ||
        id.startsWith('react-dom/'),
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
