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
        <span v-if="petData != undefined"> {{petData.petDetails.name }}'s Profile</span>
        <!-- Loaded w/out data -->
        <span v-else-if="!petPending"> Pet not found</span>

        <!-- Not loaded -->
        <span v-else><VProgressCircular indeterminate style="opacity: 0.3;"/></span>
      </VFadeTransition>
    </v-toolbar-title>
  </v-app-bar>
  
  <v-container :class="!petPending && petData == undefined ? 'bg-red-accent-1' : 'bg-indigo-lighten-4'"
    class="fill-height mt-15" fluid style="flex-direction: column; transition: background-color 0.3s linear;">
    <VFadeTransition group leave-absolute>
      <!-- Loading -->
      <SharedPageLoading v-if="petPending"/>

      <!-- Loaded w/out data -->
      <template v-else-if="petData == undefined">
        <VRow justify="center" align="center" class="fill-height">
          <VCol>
            <VCard class=text-center>
              <VIcon size="112" color="error">mdi-close-circle-outline</VIcon>
              <VCardTitle>That pet doesn't exist!</VCardTitle>
              <VCardActions style="justify-content: center;"><VBtn @click="navigateTo('/account')" variant="elevated" color="blue-darken-2">Go to Account</VBtn></VCardActions>
            </VCard>
          </VCol>
        </VRow>
      </template>


      <!-- Loaded w/ data -->
      <template v-else>

        <VCard class="mb-3 bg-indigo-lighten-3" width="100%">
          <VRow style="width: 100%">
            <VCol :cols="cols[1]" style="display: flex;">
              <VImg class="mt-3 mb-3 ml-6" :src="imageUrl" :lazy-src="placeholderImgURL" cover>
                <template #placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                  </div>
                </template>
                <VFadeTransition>
                  <VBtn location="center" prepend-icon="mdi-upload" text="Upload Image" color="green-darken-1"
                    @click="triggerImageUpload" :loading="isUploadingNewImage" v-if="editing" :disabled="submitting" />
                </VFadeTransition>
                <input ref="imgUploader" class="d-none" type="file" @change="handleImageChange" accept="image/*" />
              </VImg>
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
                              <VBtn color="grey-darken-1" variant="elevated" @click="cancelEdit()"
                                :disabled="submitting">
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
                          <PetProfileContactDetails :data="userData?.userDetails"/>
                        </VCard>
                      </VCol>
                    </VRow>
                    <VRow style="justify-content: right;">
                      <div class="mr-3 mt-3">
                        <VBtn v-if="!editing" color="error" prepend-icon="mdi-delete" text="Delete Pet"
                          variant="elevated" @click="showConfirmationDialog = true">
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
        <VCard width="100%">
          <VCardTitle>
            <h2 class="text-center">Find your Pet</h2>
          </VCardTitle>
          <VCardText>
            <VRow style="width: 100%">
              <VCol v-if="!petData.isMissing">
                <VCard :max-width="$vuetify.display.mdAndUp ? '40%' : '100%'" location="center"
                  class="mb-10 bg-pink-lighten-5">
                  <VCardTitle class="text-center">Your pet isn't currently marked as missing</VCardTitle>
                  <VCardActions style="justify-content: center;">
                    <VBtn @click="setLost(true)" color="error" variant="elevated">Mark Pet as Lost</VBtn>
                  </VCardActions>
                </VCard>
              </VCol>
              <VCol v-else>
                <h2 class="text-center">Chats</h2>
                <VContainer>
                  <VRow justify="center">
                    <VCol :cols="chatCardCols" v-for="chat in chatData">
                      <ChatCard :chatData="chat" :petID="(chat.petID as string)" />
                    </VCol>
                  </VRow>
                  <VRow justify="center">
                    <VBtn color="green-darken-2" @click="setLost(false)">Mark Pet as Found</VBtn>
                  </VRow>
                </VContainer>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </template>
    </VFadeTransition>
  </v-container>
</template>

<script lang="ts">
import QrcodeVue from 'qrcode.vue';
import UserModel from 'types/models/user';
import ChatCard from "~/components/petProfile/ChatCard.vue";
import PetDetails from "~/components/petProfile/PetDetails.vue"
import type PetModel from "~/types/models/pet";
import type ChatModel from 'types/models/chat'

const PLACEHOLDER_IMAGE_URL = "/images/paw.jpg";

export default {
  computed: {
    qrValue() {
      return `http://${window.location.host}/pets/found/${this.$route.params.petID}`
    },
    cols() {
      return this.$vuetify.display.smAndDown ? [12, 12] : [7, 5]
    },
    chatCardCols() {
      if (this.$vuetify.display.lgAndUp) return 3;
      if (this.$vuetify.display.md) return 4;
      if (this.$vuetify.display.sm) return 6;
      return 12;
    },

    imageUrl() {
      if (this.editing) {
        if (this.uploadedImageData != undefined) {
          return URL.createObjectURL(this.uploadedImageData)
        }
      }

      if (this.petData?.imageURL != undefined && this.petData?.imageURL?.length > 0) {
        return this.petData.imageURL;
      }

      return PLACEHOLDER_IMAGE_URL;
    },
    placeholderImgURL() {
      return PLACEHOLDER_IMAGE_URL
    }
  },
  data() {
    return {
      editing: false,
      showConfirmationDialog: false,

      submitting: false, //Loading spinner for save changes
      submitError: false,

      isUploadingNewImage: false, //Loading spinner for uploading a file
      uploadedImageData: undefined as File | undefined,
      inEditImageURL: undefined as undefined | string,
    }
  },
  components: { QrcodeVue, ChatCard, PetDetails },
  setup() {
    definePageMeta({
      middleware: ["auth"]
    })

    const route = useRoute();

    let userData = ref(undefined as UserModel | undefined);
    let petData = ref(undefined as PetModel | undefined);
    let chatData = ref(undefined as ChatModel[] | undefined);

    let userPending = ref(true);
    let petPending = ref(true);
    let chatPending = ref(true);
    $fetch<UserModel>(`/api/account/info`)
      .then((userRes) => {
        userData.value = userRes;
      })
      .finally(() => userPending.value = false);

    $fetch<PetModel>(`/api/pet/${route.params.petID}`)
      .then((petRes) => {
        petData.value = petRes;

        if (petRes.isMissing) {
          $fetch<ChatModel[]>(`/api/pet/${route.params.petID}/chats`)
            .then((chatRes) => {
              chatData.value = chatRes;
            })
            .finally(() => chatPending.value = false);
        }
      })
      .finally(() => petPending.value = false);

    return { userData, petData, chatData, userPending, petPending, chatPending };
  },
  methods: {
    downloadQr() {
      //https://github.com/scopewu/qrcode.vue/issues/50
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
    startEdit() {
      this.uploadedImageData = undefined;
      this.inEditImageURL = this.petData?.imageURL;
      this.editing = true;
    },
    cancelEdit() {
      this.editing = false;
    },
    async submitEdit() {
      this.submitting = true;

      const editSubmit = new FormData();

      //Get details from PetDetails component
      const isValid = await (this.$refs.petDetails as typeof PetDetails).validate();
      const newPetDetails = (this.$refs.petDetails as typeof PetDetails).curValues;

      if (!isValid || newPetDetails == undefined) {
        this.submitting = false;
        this.submitError = true;
        return;
      }

      newPetDetails.name != undefined && newPetDetails.name.length > 0 ? editSubmit.append("name", newPetDetails.name) : null;
      newPetDetails.species != undefined && newPetDetails.species.length > 0 ? editSubmit.append("species", newPetDetails.species) : null;
      newPetDetails.breed != undefined && newPetDetails.breed.length > 0 ? editSubmit.append("breed", newPetDetails.breed) : null;
      newPetDetails.colour != undefined && newPetDetails.colour.length > 0 ? editSubmit.append("colour", newPetDetails.colour) : null;

      if (this.uploadedImageData != undefined) { //Potentially new image uploaded
        editSubmit.append("image", this.uploadedImageData);
      }

      try {
        const editRes = await $fetch(`/api/pet/${this.$route.params.petID}/edit`, {
          method: "POST",
          body: editSubmit
        })

        if (editRes.status == 200) {
          setTimeout(() => { //Makes it look nicer if a bit of delay
            this.submitting = false;
            this.editing = false;
            this.submitError = false;
            this.isUploadingNewImage = false; //Because the new image is now the "original"
            this.petData!.imageURL = this.inEditImageURL;

            for (const pair of editSubmit.entries()) {
              switch (pair[0]) {
                case "name":
                case "species":
                case "breed":
                case "colour":
                  this.petData!.petDetails[pair[0]] = pair[1].toString().trim()
                  break;
              }
            }

          }, 300)
        } else {
          this.submitError = true;
          this.submitting = false;
          alert('Failed to update pet information.');
        }
      } catch (e) {
        this.submitError = true;
        this.submitting = false;
        console.error('Error updating pet information:', e);
        alert('An error occurred while updating pet information.');
      }
    },

    async deletePet(pet: PetModel) {
      this.showConfirmationDialog = false;
      const id = pet.Pet_UID;
      const name = pet.petDetails.name;

      try {
        const deleteRes = await $fetch(`/api/pet/${id}/delete`, {
          method: "DELETE",
        });

        if (deleteRes.status === 200) {
          navigateTo('/account')
        } else {
          alert(`Failed to delete ${name}.`);
        }
      } catch (error) {
        console.error('Error deleting pet:', error);
        alert(`An error occurred while deleting ${name}.`);
      }
    },

    triggerImageUpload() {
      this.isUploadingNewImage = true;

      window.addEventListener('focus', () => {
        this.isUploadingNewImage = false
      }, { once: true });

      (this.$refs.imgUploader as HTMLElement)?.click();
    },

    handleImageChange(event: Event) {
      if ((event.target as HTMLInputElement)?.files && (event.target as HTMLInputElement).files!.length > 0) {
        this.uploadedImageData = (event.target as HTMLInputElement).files![0];
        this.inEditImageURL = URL.createObjectURL(this.uploadedImageData);
      }
    },


    async setLost(newLostStatus: boolean) {
      if (newLostStatus && this.petData!.isMissing) return;

      const lostRes = await $fetch(`/api/pet/${this.$route.params.petID}/setLost`, {
        method: "POST",
        body: {
          status: newLostStatus
        }
      })
      if ((lostRes as any).status == 200) {
        console.log("updated")
        this.petData!.isMissing = newLostStatus

        // FIXME temporary, because chat enrollment isn't updated here (yet)
        if (newLostStatus == true) location.reload();
      }
    },
  }
};

</script>