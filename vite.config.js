import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    allowedHosts: [
      '5173-i5aldlriknui2gxuyoqtp-7bf60741.manusvm.computer',
      'localhost',
      '127.0.0.1',
    ],
  },
});
