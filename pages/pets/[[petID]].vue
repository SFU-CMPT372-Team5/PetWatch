<!-- Pet profile -->

<template>
  <v-container :class="loaded && !hasData ? 'bg-red-accent-1' : 'bg-blue-accent-1'" class="fill-height" fluid
    style="flex-direction: column; transition: background-color 0.3s linear;">
    <VFadeTransition group>
      <template v-if="!loaded">
        <VRow justify="center" align="center" class="fill-height">
          <VCol>
            <VProgressCircular indeterminate color="grey-lighten-4" size="large" />
          </VCol>
        </VRow>
      </template>
      <template v-else>
        <template v-if="!hasData">
          <VRow justify="center" align="center" class="fill-height">
            <VCol>
              <VCard class=text-center>
                <VIcon size="112" color="error">mdi-close-circle-outline</VIcon>
                <VCardTitle>That pet doesn't exist!</VCardTitle>
              </VCard>
            </VCol>
          </VRow>
        </template>
        <template v-else>
          <VCard class="mb-1" width="100%">
            <VRow style="width: 100%">
              <VCol :cols="cols[1]" style="display: flex;">
                <VImg src="/images/paw.jpg" lazy-src="/images/paw.jpg" cover>
                  <template #placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                    </div>
                  </template>
                </VImg>
              </VCol>
              <VCol :cols="cols[0]" style="justify-content: space-around; display: flex; flex-direction: column;">
                <v-card>
                  <v-card-text>
                    <VContainer fluid>
                      <VRow>
                        <VCol :cols="$vuetify.display.mdAndDown ? 12 : 6">
                          <VCard height="100%">
                            <VCardTitle>
                              <h3 class=text-center>Pet Details</h3>
                            </VCardTitle>
                            <VCardText>
                              <VTextField v-if="editing" density="compact" :label="'Name'" variant="solo"
                                v-model="petName" @input="handleNameChange" />
                              <p v-else>
                                <b>Pet Name:</b> {{ petName }}
                              </p>
                            </VCardText>
                            <VCardText>
                              <VTextField v-if="editing" density="compact" :label="'Species'" variant="solo"
                                v-model="petSpecies" @input="handleSpeciesChange" />
                              <p v-else>
                                <b>Species:</b> {{ petSpecies }}
                              </p>
                            </VCardText>
                            <VCardText>
                              <VTextField v-if="editing" density="compact" :label="'Breed'" variant="solo"
                                v-model="petBreed" @input="handleBreedChange" />
                              <p v-else>
                                <b>Breed:</b> {{ petBreed }}
                              </p>
                            </VCardText>
                            <VCardText>
                              <VTextField v-if="editing" density="compact" :label="'Colour'" variant="solo"
                                v-model="petColour" @input="handleColourChange" />
                              <p v-else>
                                <b>Colour:</b> {{ petColour }}
                              </p>
                            </VCardText>
                            <VCardActions style="justify-content: right;">
                              <VBtn color="pink-accent-1" variant="elevated" @click="startEdit()" v-if="!editing">
                                <VIcon>mdi-pencil</VIcon>
                              </VBtn>
                              <template v-else>
                                <VBtn color="grey-darken-1" variant="text" @click="cancelEdit()">Cancel</VBtn>
                                <VBtn color="success" variant="text" @click="submitEdit()">Save Changes</VBtn>
                              </template>
                            </VCardActions>
                          </VCard>
                        </VCol>
                        <VCol>
                          <VCard height="100%">
                            <VCardTitle>
                              <h3 class=text-center>Contact Details</h3>
                            </VCardTitle>
                            <VCardText>
                              <p>
                                <b>Owner Name:</b> {{ userApiData?.userDetails.name }}
                              </p>
                            </VCardText>
                            <VCardText>
                              <p>
                                <b>Address:</b> {{ userApiData?.userDetails.address }}
                              </p>
                            </VCardText>
                            <VCardText>
                              <p>
                                <b>Phone Number:</b> {{ userApiData?.userDetails.phone }}
                              </p>
                            </VCardText>

                          </VCard>
                        </VCol>
                      </VRow>
                    </VContainer>
                  </v-card-text>
                </v-card>
                <VCard>
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
                <VCol v-if="!petApiData?.isMissing">
                  <VCard :max-width="$vuetify.display.mdAndUp ? '40%' : '100%'" location="center" class="mb-10">
                    <VCardTitle class="text-center">Your pet isn't currently marked as missing</VCardTitle>
                    <VCardActions style="justify-content: center;">
                      <VBtn @click="marklostFunc()" color="error" variant="elevated">Mark Pet as Lost</VBtn>
                    </VCardActions>
                  </VCard>
                </VCol>
                <VCol v-else>
                  <h2 class="text-center">Chats</h2>
                  <VContainer>
                    <VRow justify="center">
                      <VCol :cols="chatCardCols" v-for="chatID in petApiData.chats">
                        <ChatCard :chatID="chatID" />
                      </VCol>
                    </VRow>
                  </VContainer>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </template>
      </template>
    </VFadeTransition>
  </v-container>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"]
})

const route = useRoute();

const petID = route.params.petID

const { data: petApiData, error } = await useFetch<PetModel>(`/api/pet/${petID}`);
const { data: userApiData } = await useFetch<UserModel>(`/api/account/info`);

let loaded = false;
let hasData = false;

if (error.value == undefined) { //The pet is owned by this account and exists
  hasData = true;
}
loaded = true;

</script>

<script lang="ts">
import QrcodeVue from 'qrcode.vue';
import UserModel from 'types/models/user';
import ChatCard from "~/components/petProfile/ChatCard.vue";
import type PetModel from "~/types/models/pet";

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
    }
  },
  data() {
    return {
      editing: false,
      petName: "",
      petSpecies: "",
      petBreed: "",
      petColour: "",
    }
  },
  components: { QrcodeVue, ChatCard },
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
      this.editing = true;
    },
    cancelEdit() {
      this.editing = false;
    },
    async submitEdit() {
      this.editing = false;
      await $fetch("/api/pet/edit", {
        method: "POST",
        body: {
          pId: this.$route.params.petID,
          pName: this.petName,
          pSpecies: this.petSpecies,
          pBreed: this.petBreed,
          pColour: this.petColour,
        }

      })
        .then(editRes => {
          if ((editRes as any).status == 200) {
            alert('Pet information updated successfully!');
          }
          else {
            alert('Failed to update pet information.');
          }
        })
        .catch(error => {
          console.error('Error updating pet information:', error);
          alert('An error occurred while updating pet information.');
        }
        );
    },

    handleNameChange(event: any) {
      this.petName = event.target.value;
    },

    handleSpeciesChange(event: any) {
      this.petSpecies = event.target.value;
    },
    handleBreedChange(event: any) {
      this.petBreed = event.target.value;
    },
    handleColourChange(event: any) {
      this.petColour = event.target.value;
    },


    async marklostFunc() {
      const lostRes = await $fetch("/api/pet/marklost", {
        method: "POST",
        body: {
          pid: this.$route.params.petID
        }
      })
      if ((lostRes as any).status == 200) {
        petApiData.value!.isMissing = true;
      }
    },

    async fetchPetData() {
      const apiData = await $fetch(`/api/pet/${this.$route.params.petID}`);
      if (apiData) {
        this.petName = (apiData as PetModel)!.petDetails.name;
        this.petSpecies = (apiData as PetModel)!.petDetails.species;
        const breed = (apiData as PetModel)!.petDetails.breed;
        if (breed != undefined) {
          this.petBreed = breed;
        }
        else {
          this.petBreed = "N/A";
        }
        this.petColour = (apiData as PetModel)!.petDetails.colour;
      }
    },
  },
  mounted() {
    this.fetchPetData();
  }
};

</script>

<style></style>