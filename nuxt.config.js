export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: process.env.PAGE_OWNER || 'Joh Doe' + ' HomePage',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  env: {
    PAGE_OWNER_MAIL: process.env.PAGE_OWNER_MAIL || 'example@example.com',
    PAGE_OWNER_GITHUB: process.env.PAGE_OWNER_GITHUB || 'https://www.github.com',
    BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
    PAGE_OWNER: process.env.PAGE_OWNER || 'Joh Doe',
    PAGE_OWNER_SLUG:
      process.env.PAGE_OWNER_SLUG || 'Your super individual quote here',
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['~layouts/global.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],
  generate: {
    fallback: true,
  },

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    '@nuxt/content'
  ],

  content: {
    liveEdit: true
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
