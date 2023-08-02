import VueGoogleMaps from "@fawmi/vue-google-maps";

export default defineNuxtPlugin((nuxtApp) => {
  // Get the runtime config from Nuxt
  const config = useRuntimeConfig();

  // Use the VueGoogleMaps plugin in the Vue app
  nuxtApp.vueApp.use(VueGoogleMaps, {
    // Provide the Google Maps API key from the runtime config
    load: {
      key: `${config.public.googleKey}`,
    },
  });
});
