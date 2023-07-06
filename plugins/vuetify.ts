import { createVuetify } from "vuetify";
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"

import config from "~/config.json"

//This controls the configuration of Vuetify on the site, 
//you can change or add values here to impact the styling everywhere
//https://vuetifyjs.com/en/features/global-configuration/
//https://vuetifyjs.com/en/features/theme/

export default defineNuxtPlugin(nuxtApp => {
    const vuetify = createVuetify({
        components,
        directives,
        ssr: config.ssr
    })

    nuxtApp.vueApp.use(vuetify)
})