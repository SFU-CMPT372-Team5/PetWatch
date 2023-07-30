<template>
  <v-container class="bg-pink-lighten-3 fill-height" fluid style="flex-direction: column; transition: background-color 0.3s linear;">
    <v-card class="ma-5">
      <v-container style="width: 400px;">
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
          <v-select v-model="lostStatus" :items="options" label="Is the pet Lost"></v-select>
          <v-btn color="error" class="mr-2" @click="navigateTo('/account')">Cancel</v-btn>
          <v-btn :disabled="!validForm" type="submit" color="primary">Submit</v-btn>
        </v-form>
      </v-container>
    </v-card>
  </v-container>
</template>
  
<script>
definePageMeta({ middleware: 'auth' })

const { data } = useAuth()

export default {

  data() {
    return {
      validForm: false,
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

  watch: {
    name: 'checkFormValidity',
    age: 'checkFormValidity',
    petType: 'checkFormValidity',
    petColor: 'checkFormValidity',
    breed: 'checkFormValidity',
    lostStatus: 'checkFormValidity',
  },

  methods: {
    async submitForm() {
      await $fetch("/api/account/info").then(async (response) => {
        const Pet_UID = "PET" + Date.now()
        console.log(response)
        await $fetch("/api/pet/create", {
          method: 'POST',
          body: {
            Pet_UID: Pet_UID,
            petOwnerID: response.User_UID,
            petDetails: {
              name: this.name,
              species: this.petType,
              colour: this.petColor,
              breed: this.breed
            },
            isMissing: this.lostStatus === 'Lost'
          }
        }).catch(e => {
          console.error(e)
        }).then(() => {
          this.$router.push({
            //Navigate to the FormData page and pass Pet_UID as query parameter
            path: '/pets/' + Pet_UID
          })
        }
        )
      }).catch(e => {
        console.error(e)
      })
    },
    checkFormValidity() {
      // Check if all required fields are filled and lostStatus is selected
      this.validForm = !!this.name && !!this.age && !!this.petType && !!this.petColor && !!this.breed && !!this.lostStatus;
    },
  },

  mounted() {
    // Call the checkFormValidity method on component mount to set the initial state of validForm
    this.checkFormValidity();
  },
};
</script>
  