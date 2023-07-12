import config from "./config.json";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // Add in the modules we are using
  modules: [
    //None for now, but later on this might have things like 
    //axios for web requests, a websocket library and other things like auth or whatnot
    'nuxt-vuefire',
  ],

  // Tell Nuxt to load Vuetify css
  css: [
    "vuetify/lib/styles/main.css", //Vuetify itself
    "@mdi/font/css/materialdesignicons.min.css" //Icons and pictograms which can be useful
  ],

  // Tell Nuxt to build Vuetify
  build: {
    transpile: ["vuetify"]
  },

  vuefire: {
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: 'localhost',
      projectId: 'petwatch-firebase',
      appId: process.env.FIREBASE_APP_ID,
      // there could be other properties depending on the project
    },
    auth: true,
    appCheck: {
      // Allows you to use a debug token in development
      debug: process.env.NODE_ENV !== 'production',
      isTokenAutoRefreshEnabled: true,
      provider: 'ReCaptchaV3',
      // Find the instructions in the Firebase documentation, link above
      key: '6Lc3wxcnAAAAAEOD11XlOwXyXEqECLRks_8mF17P',
    },
  },

  // Whether or not to use server-side-rendering
  ssr: config.ssr
})
