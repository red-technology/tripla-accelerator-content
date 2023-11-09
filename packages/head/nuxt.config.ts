// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@red-technology/tripla-head'],
  devtools: { enabled: true },
  tailwindcss: {
    cssPath: '~~/assets/css/tailwind-custom.css',
    config: {
      darkMode: 'class',
    },
  },
  devServer: {
    port: parseInt(process.env.TRIPLA_HEAD_SERVER_PORT || '') || 2010,
  },
});
