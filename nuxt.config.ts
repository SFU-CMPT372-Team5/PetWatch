import config from "./config.json";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2024-09-25',

  typescript: {
    typeCheck: true,
    strict: false
  },

  runtimeConfig: {
    mongoUrl: "",

    auth0ClientId: "",
    auth0ClientSecret: "",
    auth0Issuer: "",
    authSecret: "",
    authOrigin: "",

    azureBlobConnectionString: "",
    azureBlobContainerName: "",

    sendgridApiKey: "",
  },
  
  // Add in the modules we are using
  modules: [
    
    //None for now, but later on this might have things like 
    //axios for web requests, a websocket library and other things like auth or whatnot
    '@sidebase/nuxt-auth',
  ],

  auth: {
    isEnabled: true,
    provider: {
      defaultProvider: "auth0",
      type: "authjs"
    },
    sessionRefresh: {
      enableOnWindowFocus : true,
    }
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
