import config from "./config.json";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  runtimeConfig: {
    mongoUrl: process.env.MONGO_URL,
    public: {
      googleKey: process.env.GOOGLE_KEY
    }
  },
  
  // Add in the modules we are using
  modules: [
    
    //None for now, but later on this might have things like 
    //axios for web requests, a websocket library and other things like auth or whatnot
    '@sidebase/nuxt-auth',
  ],

  auth: {
    isEnabled: true,
    defaultProvider: "auth0",
    origin: process.env.AUTH_ORIGIN
  },

  // Tell Nuxt to load Vuetify css
  css: [
    "vuetify/lib/styles/main.css", //Vuetify itself
    "@mdi/font/css/materialdesignicons.min.css" //Icons and pictograms which can be useful
  ],
  

  // Tell Nuxt to build Vuetify
  build: {
    transpile: ["vuetify", "@fawmi/vue-google-maps"]
  },
  
  nitro: {
    plugins: ["~/server/mongo/index.ts"]
  },

  // Whether or not to use server-side-rendering
  ssr: config.ssr
})
