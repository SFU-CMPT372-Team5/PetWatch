<!-- Pet profile -->

<template>
  <v-app-bar scroll-behavior="hide" app color="indigo-lighten-1" dark>
    <v-app-bar-nav-icon variant="elevated" class="bg-pink-lighten-4" @click="navigateTo('/account')">
      <VIcon>mdi-arrow-left</VIcon>
    </v-app-bar-nav-icon>
    <v-toolbar-title>
      <span class="hover-underline" @click="navigateTo('/')">PetWatch</span>
      <VIcon>mdi-chevron-right</VIcon>
      <span class="hover-underline" @click="navigateTo('/account')">My Account</span>
      <VIcon>mdi-chevron-right</VIcon>

      <VFadeTransition leave-absolute>
        <!-- Loaded w/data-->
        <span v-if="petData != undefined"> {{ petData.petDetails.name }}'s Profile</span>
        <!-- Loaded w/out data -->
        <span v-else-if="!petPending"> Pet not found</span>

        <!-- Not loaded -->
        <span v-else>
          <VProgressCircular indeterminate style="opacity: 0.3;" />
        </span>
      </VFadeTransition>
    </v-toolbar-title>
  </v-app-bar>

  <v-container :class="!petPending && petData == undefined ? 'bg-red-accent-1' : 'bg-indigo-lighten-4'"
    class="fill-height mt-15" fluid style="flex-direction: column; transition: background-color 0.3s linear;">
    <VFadeTransition group leave-absolute>
      <!-- Loading -->
      <SharedPageLoading v-if="petPending" />

      <!-- Loaded w/out data -->
      <template v-else-if="petData == undefined">
        <VRow justify="center" align="center" class="fill-height">
          <VCol>
            <VCard class=text-center>
              <VIcon size="112" color="error">mdi-close-circle-outline</VIcon>
              <VCardTitle>That pet doesn't exist!</VCardTitle>
              <VCardActions style="justify-content: center;">
                <VBtn @click="navigateTo('/account')" variant="elevated" color="blue-darken-2">Go to Account</VBtn>
              </VCardActions>
            </VCard>
          </VCol>
        </VRow>
      </template>


      <!-- Loaded w/ data -->
      <template v-else>

        <VCard class="mb-3 bg-indigo-lighten-3" width="100%">
          <VRow style="width: 100%">
            <VCol :cols="cols[1]" style="display: flex;">
              <PetProfilePetImage class="mt-3 mb-3 ml-3 rounded" ref="petImage" :editing="editing" :disabled="submitting"
                :petData="petData" />
            </VCol>
            <VCol :cols="cols[0]" style="justify-content: space-around; display: flex; flex-direction: column;">
              <VCard class="mt-3 bg-pink-lighten-5">
                <v-card-text>
                  <VContainer fluid>
                    <VRow>
                      <VCol :cols="$vuetify.display.mdAndDown ? 12 : 6">
                        <VCard height="100%">
                          <VCardTitle>
                            <h3 class=text-center>Pet Details</h3>
                          </VCardTitle>
                          <PetDetails :editing="editing" ref="petDetails" :data="petData.petDetails" />
                          <VCardActions style="justify-content: right;">
                            <VBtn color="indigo-lighten-1" prepend-icon="mdi-pencil" text="Edit Details"
                              variant="elevated" @click="startEdit()" v-if="!editing">
                            </VBtn>
                            <template v-else>
                              <VBtn color="grey-darken-1" variant="elevated" @click="cancelEdit()" :disabled="submitting">
                                Cancel</VBtn>
                              <VBtn :color="submitError ? 'error' : 'success'" variant="elevated" @click="submitEdit()"
                                :loading="submitting">Save Changes</VBtn>
                            </template>
                          </VCardActions>
                        </VCard>
                      </VCol>
                      <VCol>
                        <VCard height="100%">
                          <VCardTitle>
                            <h3 class=text-center>Contact Details</h3>
                          </VCardTitle>
                          <PetProfileContactDetails :data="userData?.userDetails" />
                        </VCard>
                      </VCol>
                    </VRow>
                    <VRow style="justify-content: right;">
                      <div class="mr-3 mt-3">
                        <VBtn v-if="!editing" color="error" prepend-icon="mdi-delete" text="Delete Pet" variant="elevated"
                          @click="showConfirmationDialog = true">
                        </VBtn>
                      </div>
                      <!-- Confirmation Dialog -->
                      <v-dialog v-model="showConfirmationDialog" max-width="500">
                        <v-card v-if="!petData.isMissing">
                          <v-card-title class="text-center font-weight-bold">CONFIRMATION</v-card-title>
                          <v-card-text class="text-h6">Are you sure you want to delete {{ petData.petDetails.name
                          }}?</v-card-text>
                          <v-card-actions class="d-flex justify-end mb-3 mt-3">
                            <VBtn variant="elevated" color="grey" @click="showConfirmationDialog = false">Cancel
                            </VBtn>
                            <VBtn variant="elevated" color="red" @click="deletePet(petData)">Delete</VBtn>
                          </v-card-actions>
                        </v-card>
                        <v-card v-if="petData.isMissing">
                          <v-card-title class="text-center font-weight-bold">WARNING</v-card-title>
                          <v-card-text class="text-h6">Uh-Oh... You cannot delete a lost pet. Please mark your pet
                            as found and try again.</v-card-text>
                          <v-card-actions class="d-flex justify-end mb-3 mt-3">
                            <VBtn variant="elevated" color="green" @click="showConfirmationDialog = false">OK
                            </VBtn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </VRow>
                  </VContainer>
                </v-card-text>
              </VCard>
              <VCard class="mt-3 mb-3">
                <VCardTitle>
                  <h2 class="text-center">QR Code</h2>
                </VCardTitle>
                <VCardText>
                  <p class=text-center>
                    Attach this QR Code to your pet so that if your pet is lost others can help you find them
                    <br /><br />
                    <qrcode-vue :value="qrValue" level="H" ref="qrCode" />
                    <br />
                    {{ qrValue }}
                    <br />
                    <VBtn @click="downloadQr" color="indigo-lighten-1">Download as Image</VBtn>
                  </p>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </VCard>
        <VCard width="100%" color="red-lighten-4">
          <VCardTitle>
            <h2 class="text-center">Find your Pet</h2>
          </VCardTitle>
          <VCardText><VContainer fluid>
            <VRow style="width: 100%" justify="center" no-gutters>
              <VCol v-if="!petData.isMissing">
                <VCard :max-width="$vuetify.display.mdAndUp ? '40%' : '100%'" location="center"
                  class="mb-10 bg-pink-lighten-5">
                  <VCardTitle class="text-center">Your pet isn't currently marked as missing</VCardTitle>
                  <VCardActions style="justify-content: center;">
                    <VBtn @click="setLost(true)" color="error" variant="elevated">Mark Pet as Lost</VBtn>
                  </VCardActions>
                </VCard>
              </VCol>
              <template v-else>
                <VCol cols="12">
                  <PetProfileChats :petID="$route.params.petID as string"/>
                </VCol>

                <VCol cols="12">
                  <PetProfileMap :petID="$route.params.petID as string"/>
                </VCol>
              </template>
            </VRow></VContainer>
          </VCardText>
          <VCardActions style="justify-content: center;" v-if="petData.isMissing">
            <VBtn color="green-darken-2" variant="elevated" @click="setLost(false)">Mark Pet as Found</VBtn>
          </VCardActions>
        </VCard>
      </template>
    </VFadeTransition>
  </v-container>
</template>

<script lang="ts">
// Importing required modules and components
import QrcodeVue from 'qrcode.vue'; // A QrcodeVue component for generating QR codes
import type UserModel from 'types/models/user'; // Type definition for UserModel
import type PetModel from 'types/models/pet';
import PetDetails from "~/components/petProfile/PetDetails.vue"; // Custom PetDetails component for displaying pet details

// Define page meta information with middleware and validation for route parameters
definePageMeta({
  middleware: ["auth"], // Require authentication middleware for accessing this page
  validate: (route) => {
    // Don't load the page if no petID is provided
    return typeof (route.params.petID) === "string" && route.params.petID.length > 0;
  }
});

export default {
  computed: {
    // Compute the value for the QR code based on the current route's petID
    qrValue() {
      return `http://${window.location.host}/pets/found/${this.$route.params.petID}`;
    },

    // Compute the number of columns to use for the layout based on screen size
    cols() {
      return this.$vuetify.display.smAndDown ? [12, 12] : [7, 5];
    },
  },
  data() {
    return {
      editing: false,// Flag to indicate if the user is in editing mode

      showConfirmationDialog: false,

      submitting: false, // Loading spinner for save changes
      submitError: false, // Flag to indicate if there was an error during form submission
    }
  },
  components: { QrcodeVue, PetDetails }, // Registering the imported components
  setup() {
    // Setup function that runs during component initialization

    // Initialize reactive variables using Vue's composition API
    const route = useRoute();

    let userData = ref(undefined as UserModel | undefined); // User data object
    let petData = ref(undefined as PetModel | undefined); // Pet data object

    let userPending = ref(true); //Is data still being fetched?
    let petPending = ref(true);

    // Fetch user data from the server
    $fetch<UserModel>(`/api/account/info`)
      .then((userRes) => {
        userData.value = userRes;
      })
      .finally(() => userPending.value = false);

    // Fetch pet data from the server
    $fetch<PetModel>(`/api/pet/${route.params.petID}`)
      .then(async (petRes) => {
        petData.value = petRes;
      })
      .finally(() => petPending.value = false);

    // Set page title based on the pet's name
    useHead({
      title: `${petData.value != undefined ? `${petData.value.petDetails.name}'s Pet Profile` : 'Pet Profile'} | PetWatch`
    });

    // Return the reactive variables that can be accessed in the template
    return { userData, petData, userPending, petPending };
  },
  methods: {
    // Component methods

    // Download the QR code image
    downloadQr() {
      // Use a workaround to download the QR code image as a PNG file
      let canvasImage = (this.$refs.qrCode as any).$el.toDataURL('image/png');
      let xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function () {
        let a = document.createElement('a');
        a.href = window.URL.createObjectURL(xhr.response);
        a.download = `PetWatchQRCode.png`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
      };
      xhr.open('GET', canvasImage);
      xhr.send();
    },

    // Start editing the pet details
    startEdit() {
      this.editing = true;
    },

    // Cancel the editing of pet details
    cancelEdit() {
      this.editing = false;
    },

    // Submit the edited pet details to the server
    async submitEdit() {
      // Set submitting flag to show the loading spinner
      this.submitting = true;

      // Create a new FormData object to hold the edited details
      const editSubmit = new FormData();

      // Get details from the PetDetails component and validate them
      const isValid = await (this.$refs.petDetails as typeof PetDetails).validate();
      const newPetDetails = (this.$refs.petDetails as typeof PetDetails).curValues;

      // If details are not valid or are undefined, show an error and return
      if (!isValid || newPetDetails == undefined) {
        this.submitting = false;
        this.submitError = true;
        return;
      }

      // Append the new pet details to the FormData object
      newPetDetails.name != undefined && newPetDetails.name.length > 0 ? editSubmit.append("name", newPetDetails.name) : null;
      newPetDetails.species != undefined && newPetDetails.species.length > 0 ? editSubmit.append("species", newPetDetails.species) : null;
      newPetDetails.breed != undefined && newPetDetails.breed.length > 0 ? editSubmit.append("breed", newPetDetails.breed) : null;
      newPetDetails.colour != undefined && newPetDetails.colour.length > 0 ? editSubmit.append("colour", newPetDetails.colour) : null;

      // Check if a new pet image was uploaded and append it to the FormData object
      const petImage = (this.$refs.petImage as any)
      if (petImage != undefined && petImage.newImagePending()) { // Potentially new image uploaded
        editSubmit.append("image", petImage.uploadedImageData);
      }

      try {
        // Send the edited pet details to the server using a POST request
        const editRes = await $fetch(`/api/pet/${this.$route.params.petID}/edit`, {
          method: "POST",
          body: editSubmit
        });

        // If the request is successful (status code 200), update the component's data with the new values
        if (editRes.status == 200) {
          if (petImage.inEditUrl != undefined) {
            this.petData!.imageURL = petImage.inEditUrl;
          }

          for (const pair of editSubmit.entries()) {
            switch (pair[0]) {
              case "name":
              case "species":
              case "breed":
              case "colour":
                this.petData!.petDetails[pair[0]] = pair[1].toString().trim();
                break;
            }
          }

          // Delay the resetting of flags to provide a smoother user experience
          setTimeout(() => {
            this.submitting = false;
            this.editing = false;
            this.submitError = false;
          }, 300);
        } else {
          // Show an error if the request was not successful
          this.submitError = true;
          this.submitting = false;
          alert('Failed to update pet information.');
        }
      } catch (e) {
        // Show an error if an error occurred during the request
        this.submitError = true;
        this.submitting = false;
        console.error('Error updating pet information:', e);
        debugger

        if ("status" in (e as any) && (e as any).status === 413) {
          alert("Image uploaded is too large! Please try again with a smaller image.");
        } else {
          alert('An error occurred while updating pet information. Please try again.');
        }
      }
    },

    // Delete the pet from the server
    async deletePet(pet: PetModel) {
      // Hide the confirmation dialog
      this.showConfirmationDialog = false;
      const id = pet.Pet_UID;
      const name = pet.petDetails.name;

      try {
        // Send a DELETE request to delete the pet
        const deleteRes = await $fetch(`/api/pet/${id}/delete`, {
          method: "DELETE",
        });

        // If the request is successful (status code 200), navigate to the account page
        if (deleteRes.status === 200) {
          navigateTo('/account');
        } else {
          // Show an error if the request was not successful
          alert(`Failed to delete ${name}.`);
        }
      } catch (error) {
        // Show an error if an error occurred during the request
        console.error('Error deleting pet:', error);
        alert(`An error occurred while deleting ${name}.`);
      }
    },

    // Set the pet's lost status and reload the page if necessary
    async setLost(newLostStatus: boolean) {
      if (newLostStatus && this.petData!.isMissing) return;

      // Send a POST request to set the lost status of the pet
      const lostRes = await $fetch(`/api/pet/${this.$route.params.petID}/setLost`, {
        method: "POST",
        body: {
          status: newLostStatus
        }
      });

      // If the request is successful (status code 200), update the component's data with the new value
      if ((lostRes as any).status == 200) {
        console.log("updated")
        this.petData!.isMissing = newLostStatus
      }
    },
  }
};
</script>