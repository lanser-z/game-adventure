import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'public/assets',
          dest: 'assets'
        },
        {
          src: 'sitemap.json',
          dest: '.'
        },
        {
          src: 'project.wechat.json',
          dest: '.',
          rename: 'game.json'
        }
      ]
    })
  ],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false, // 微信小游戏生产环境不需要 sourcemap
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
