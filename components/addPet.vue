<template>
  <v-container class="form-container">
    <h2 class="text-center">Add Pet Form</h2>
    <br>
    <v-form @submit.prevent="submitForm">
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="name"
            label="Name"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="age"
            label="Age"
            required
          ></v-text-field>
        </v-col>
        
      </v-row>

      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="petType"
            label="Pet Type"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="petColor"
            label="Pet Color"
            required
          ></v-text-field>
        </v-col>
         <v-col cols="12" sm="6">
          <v-text-field
            v-model="breed"
            label="Breed"
            required
          ></v-text-field>
        </v-col>
        
      </v-row>
    <v-container>
        <v-select
        v-model="lostStatus"
        :items="options"
        label="Is the pet Lost"
        ></v-select>
     </v-container>
      
      

      <v-btn type="submit" color="primary">Submit</v-btn>
    </v-form>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      age: '',
      petType: '',
      petColor: '',
      breed: '',
      lostStatus: null,
      options: [
        'Lost',
        'Not Lost',
      ]

    };
  },
  methods: {
    submitForm() {
      // Navigate to the FormData page and pass the form data as query parameters
      this.$router.push({
        path: '/petInfo',
        query: {
          name: this.name,
          age: this.age,
          petType: this.petType,
          petColor: this.petColor,
          breed: this.breed,
          lostStatus: this.lostStatus
         
        }
      });
    }
  }
};
</script>

<style>
.form-container {
  max-width: 400px;
  margin: 0 auto;
}
</style>