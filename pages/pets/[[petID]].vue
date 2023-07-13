<!-- Pet profile -->

<template>
  <v-container class="bg-blue-accent-1 fill-height" fluid style="flex-direction: column;">
    <VCard class="mb-1" width="100%">
      <VRow style="width: 100%">
        <VCol :cols="cols[1]" style="display: flex;">
          <VImg src="/images/paw.jpg" lazy-src="/images/paw.jpg" cover >
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular
                  color="grey-lighten-4"
                  indeterminate
                ></v-progress-circular>
              </div>
            </template>
          </VImg>
        </VCol >
        <VCol :cols="cols[0]" style="justify-content: space-around; display: flex; flex-direction: column;">
          <v-card>
            <v-card-text>
              <VContainer fluid>
                <VRow>
                  <VCol :cols="$vuetify.display.mdAndDown ? 12 : 6">
                    <VCard height="100%">
                      <VCardTitle><h3 class=text-center>Pet Details</h3></VCardTitle>
                      <VCardText>
                        <VTextField v-if="editing" v-for="(val, key) in apiData.petDetails"
                          density="compact" 
                          :label="key" 
                          variant="solo"
                          v-model="apiData.petDetails[key]"
                        />
                        <p v-else v-for="(val, key) in apiData.petDetails">
                            <b>{{key}}:</b> {{ val ?? "" }}
                        </p>
                      </VCardText>
                    </VCard>
                  </VCol>
                  <VCol>
                    <VCard height="100%">
                      <VCardTitle><h3 class=text-center>Contact Details</h3></VCardTitle>
                      <VCardText>
                        <VTextField v-if="editing" v-for="(val, key) in apiData.contactDetails"
                          density="compact" 
                          :label="key" 
                          variant="solo"
                          v-model="apiData.contactDetails[key]"
                        />
                        <p v-else v-for="(val, key) in apiData.contactDetails">
                            <b>{{key}}:</b> {{ val ?? "" }}
                        </p>
                      </VCardText>
                    </VCard>
                  </VCol>
                </VRow>
              </VContainer>
            </v-card-text>
            <VCardActions style="justify-content: center;">
              <VBtn color="blue-darken-2" variant="elevated" @click="startEdit" v-if="!editing">Edit Information</VBtn>
              <template v-else>
                <VBtn color="grey-darken-1" variant="text" @click="cancelEdit">Cancel</VBtn>
                <VBtn color="success" variant="text" @click="submitEdit">Save Changes</VBtn>
              </template>
            </VCardActions>
          </v-card>
          <VCard>
            <VCardTitle><h2 class="text-center">QR Code</h2></VCardTitle>
            <VCardText>
              <p class=text-center>
                Attach this QR Code to your pet so that if your pet is lost others can help you find them
                <br/><br/>
                <qrcode-vue :value="value" level="H" ref="qrCode" /> 
                <br/>
                <VBtn @click="downloadQr" color="blue-darken-2">Download as Image</VBtn>
              </p>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VCard>
    <VCard width="100%">
      <VCardTitle><h2 class="text-center">Find your Pet</h2></VCardTitle>
      <VCardText>
        <VRow style="width: 100%">
          <VCol v-if="!apiData.isMissing">
            <VCard :max-width="$vuetify.display.mdAndUp ? '40%' : '100%'" 
              location="center"
              class="mb-10"
            >
              <VCardTitle class="text-center">Your pet isn't currently marked as missing</VCardTitle>
              <VCardActions style="justify-content: center;"><VBtn @click="marklostFunc()" color="error" variant="elevated">Mark Pet as Lost</VBtn></VCardActions>
            </VCard>
          </VCol>
          <VCol v-else>
            <h2 class="text-center">Chats</h2>
            <VContainer>
              <VRow justify="center">
                <VCol :cols="chatCardCols" v-for="chatID in apiData.chats">
                  <ChatCard :chatID="chatID"/>
                </VCol>
              </VRow>
            </VContainer>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
    
  </v-container>
</template>

<script lang="ts">
import QrcodeVue from 'qrcode.vue'
import ChatCard from "~/components/petProfile/ChatCard.vue"

export default {
  data() {
    return {
      value: "https://example.com",
      editing: false,

      apiData: {
        petDetails: {
          name: "Hamburger",
          species: "Dog",
          breed: "Corgi",
          colour: "Green",
        },
        contactDetails: {
          name: "Human",
          address: "1234 Address Way", 
          phone: "(123) 456-7890", 
        },

        isMissing: false,

        chats: [
          "Chat1",
          "Chat2",
          "Chat3"
        ]
      },

      backupPetDetails: {}, //Copy current values to here when editing is start so they can be recovered
      backupContactDetails: {}

    };
  },
  computed: {
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
      Object.entries(this.apiData.petDetails).forEach((keyVal) => {
        //@ts-expect-error Because ts doesn't know how to deal with this
        this.$data.backupPetDetails[keyVal[0]] = keyVal[1];
      })

      Object.entries(this.apiData.contactDetails).forEach((keyVal) => {
        //@ts-expect-error Because ts doesn't know how to deal with this
        this.$data.backupContactDetails[keyVal[0]] = keyVal[1];
      })
      this.editing = true;
    },
    cancelEdit() {
      if (this.$data.backupPetDetails) {
        Object.entries(this.$data.backupPetDetails).forEach((keyVal) => {
          //@ts-expect-error Because ts doesn't know how to deal with this
          this.apiData.petDetails[keyVal[0]] = keyVal[1];
        })
      }

      if (this.$data.backupContactDetails) {
        Object.entries(this.$data.backupContactDetails).forEach((keyVal) => {
          //@ts-expect-error Because ts doesn't know how to deal with this
          this.apiData.contactDetails[keyVal[0]] = keyVal[1];
        })
      }
      this.editing = false;
    },
    async marklostFunc(){
      const lostRes = await $fetch("/api/pet/marklost", {
        method:"POST",
        body: {
          pid:this.$route.params.petID
        }
      })
      if ((lostRes as any).status == 200){
        this.apiData.isMissing=true;
      }
    },
    submitEdit() {
      //TODO
      alert("Submit")
    }
  }
};
</script>

<style>
</style>