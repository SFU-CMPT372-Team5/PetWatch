<template>
  
  <v-container>
    <h2 class="text-center">Pet Information</h2>
    <v-card>
      <v-card-text>
        <p><b>Name:</b> {{ formData.name }}</p>
        <p><b>Age:</b> {{ formData.age }}</p>
        <p><b>Pet Type:</b> {{ formData.petType }}</p>
        <p><b>Color:</b> {{ formData.petColor }}</p>
        <p><b>Breed:</b> {{ formData.breed }}</p>
        <p><b>lostStatus:</b> {{ formData.lostStatus }}</p>
      </v-card-text>
      <qrcode-vue :value="value" :size="size" level="H" /> 
    </v-card>
    
  </v-container>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
export default {
  data() {
    return {
      formData: {}
    };
  },
  mounted() {
    this.formData = this.$route.query;
  },
  components: {
      QrcodeVue,
  },
};
</script>

<style>
</style>