import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

/**
 * Peers only (see isExternal). `use-sync-external-store/with-selector` is aliased to an
 * ESM shim so the library bundle never emits `require("react")` for browser consumers.
 */
function isExternal(id) {
  if (id === 'react' || id === 'react-dom' || id === 'react/jsx-runtime') return true;
  if (id.startsWith('react-dom/')) return true;
  if (id.startsWith('react/')) return true;
  if (id === 'react-router-dom' || id.startsWith('react-router-dom/')) return true;
  return false;
}

const scssInclude = path.resolve(__dirname, 'node_modules');

export default defineConfig(({ command }) => {
  const isDev = command === 'serve';

  const shared = {
    plugins: [react(), ...(isDev ? [] : [libInjectCss()])],
    resolve: {
      extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
      alias: {
        'use-sync-external-store/with-selector.js': path.resolve(
          __dirname,
          'src/shims/useSyncExternalStoreWithSelector.js',
        ),
        'use-sync-external-store/with-selector': path.resolve(
          __dirname,
          'src/shims/useSyncExternalStoreWithSelector.js',
        ),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: [scssInclude],
          quietDeps: true,
          silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'],
        },
      },
    },
  };

  if (isDev) {
    return {
      ...shared,
      root: '.',
      optimizeDeps: {
        include: ['jspdf', 'html2canvas'],
      },
    };
  }

  return {
    ...shared,
    build: {
      lib: {
        entry: path.resolve(__dirname, 'src/index.jsx'),
        name: 'CertificatePlugin',
        fileName: (format) => `certificate-plugin.${format}.js`,
      },
      rollupOptions: {
        external: isExternal,
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'react/jsx-runtime',
            'react-router-dom': 'ReactRouterDOM',
          },
          assetFileNames: 'certificate-plugin.[ext]',
        },
      },
      cssCodeSplit: false,
      sourcemap: true,
    },
  };
});
