<!-- This is called the default view https://nuxt.com/docs/getting-started/views -->
<!-- Every page on the website will use this code as it's "root html" -->
<!-- NuxtPage maps to the .vue file in pages/ which the user is currently navigated to -->
<!-- You can make changes to this file to affect the entire website -->

<!-- This app.vue can be replaced with the layouts/ folder if multiple page layouts are required later on -->

<template>
  <!-- Vuetify is added as a global plugin, which means the tags it exports can be used everywhere -->
  <!-- Run Vuetify on the entire application for styling consistency -->
  <VApp>
    <NuxtPage/>
    <!-- <NuxtWelcome /> -->
  </VApp>
</template>
