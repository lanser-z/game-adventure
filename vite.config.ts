import { defineConfig, Plugin } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

/**
 * 自定义插件：在微信小游戏 HTML 中注入 weapp-adapter
 */
function wechatAdapterInject(): Plugin {
  return {
    name: 'wechat-adapter-inject',
    transformIndexHtml(html) {
      if (html.includes('game-canvas')) {
        return html.replace(
          /(<script type="module"[^>]*src=")([^"]+)("[^>]*><\/script>)/,
          '<script src="/assets/weapp-adapter.js"></script>\n$1$2$3'
        );
      }
      return html;
    }
  };
}

export default defineConfig({
  plugins: [
    wechatAdapterInject(),
    viteStaticCopy({
      targets: [
        { src: 'public/assets/**/*', dest: 'assets' },
        { src: 'sitemap.json', dest: '.' },
        { src: 'project.wechat.json', dest: '.', rename: 'game.json' },
        { src: 'src/platforms/adapter/weapp-adapter.js', dest: 'assets', rename: 'weapp-adapter.js' },
        { src: 'src/platforms/adapter/symbol.js', dest: 'assets', rename: 'symbol.js' },
        { src: 'src/platforms/adapter/MutationObserver.js', dest: 'assets', rename: 'MutationObserver.js' }
      ]
    })
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      input: {
        main: 'index.html',
        wechat: 'index.wechat.html'
      },
      output: {
        manualChunks: {
          phaser: ['phaser']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
