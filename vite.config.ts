import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import * as fs from 'fs';
// import legacy from '@vitejs/plugin-legacy'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    // ie11 polyfills
    // legacy({
    //   targets: ['ie >= 11'],
    //   additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    // }),
  ],

  server: {
    port: 3000,
    host: true,
    https: {
      key: fs.readFileSync('./secrets/privkey.pem'),
      cert: fs.readFileSync('./secrets/fullchain.pem'),
    },
  },
  preview: {
    port: 3000,
    host: true,
    https: {
      key: fs.readFileSync('./secrets/privkey.pem'),
      cert: fs.readFileSync('./secrets/fullchain.pem'),
    },
  },
});
