// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@red-technology/tripla-ui'],
  devtools: { enabled: true },
  vite: {
    optimizeDeps: {
      // Fixes error "does not provide an export named 'default'" when using layers.
      include: [
        '@editorjs/header',
        '@editorjs/link',
        '@editorjs/list',
        '@editorjs/raw',
        '@editorjs/simple-image',
        '@editorjs/table',
        'qrcode',
        'mime-match',
        '@transloadit/prettier-bytes',
        'namespace-emitter',
        'lodash/**/*.js',
        'classnames',
        'p-queue',
        'is-shallow-equal',
        'editorjs-html',
      ],
    },
  },
  devServer: {
    port: parseInt(process.env.TRIPLA_UI_SERVER_PORT || '') || 3010,
  },
});
