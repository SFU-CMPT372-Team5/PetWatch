<template>
  <v-container class="form-container">
    <h2 class="text-center">Add Pet Form</h2>
    <br>
    <v-form @submit.prevent="submitForm">
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field v-model="name" label="Name" required></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-model="age" label="Age" required></v-text-field>
        </v-col>

      </v-row>

      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field v-model="petType" label="Pet Type" required></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-model="petColor" label="Pet Color" required></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-model="breed" label="Breed" required></v-text-field>
        </v-col>

      </v-row>
      <v-container>
        <v-select v-model="lostStatus" :items="options" label="Is the pet Lost"></v-select>
      </v-container>



      <v-btn type="submit" color="primary">Submit</v-btn>
    </v-form>
  </v-container>
</template>
  
<script>
definePageMeta({ middleware: 'auth' })

const { data } = useAuth()

export default {

  data() {
    return {
      data: data,
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
    async submitForm() {
      await $fetch("/api/auth/userID").then(async (response) => {
        const Pet_UID = "PET" + Date.now()
        await $fetch("/api/pets/create", {
          method: 'POST',
          body: {
            Pet_UID: Pet_UID,
            petDetails: {
              petOwner: response,
              name: this.name,
              animalType: this.petType,
              colour: this.petColor,
              animalBreed: this.breed
            },
            isMissing: this.lostStatus === 'Lost'
          }
        }).catch(e => {
          console.error(e)
        }).then(() => {
          this.$router.push({
            //Navigate to the FormData page and pass Pet_UID as query parameter
            path: '/pets/'+Pet_UID
          })
        }
        )
      }).catch(e => {
        console.error(e)
      })
    }
  }, 
};
</script>
  
<style>
.form-container {
  max-width: 400px;
  margin: 0 auto;
}
</style>