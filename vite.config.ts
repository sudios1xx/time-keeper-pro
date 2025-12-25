import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild', // Mais rápido que terser
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Chunks simplificados
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-progress',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-context-menu',
            '@radix-ui/react-hover-card',
            '@radix-ui/react-menubar',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group',
          ],
          'utils-vendor': [
            'class-variance-authority',
            'clsx',
            'date-fns',
            'tailwind-merge',
          ],
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
    cssCodeSplit: true,
    reportCompressedSize: false, // Desabilitar para acelerar
    chunkSizeWarningLimit: 1000,
  },
  server: {
    host: "::",
    port: 5173,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'class-variance-authority',
      'clsx',
      'phosphor-react',
    ],
    exclude: [
      // Evita erro de pré-empacotamento do Vite para lucide-react
      'lucide-react',
    ],
  },
}));
