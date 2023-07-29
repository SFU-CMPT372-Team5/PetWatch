<template>
    <v-sheet elevation="12" width="100vw" class="pa-4 text-center mx-auto fill-height" :color="(!pending && !found) || petData?.isMissing ? 'red-accent-1' : 'blue-accent-1'" style="transition: background-color 1s linear;">
        <VFadeTransition group>
            <template v-if="pending">
                <VRow justify="center" align="center" class="fill-height">
                    <VCol>
                        <VProgressCircular indeterminate color="grey-lighten-4" size="large"/>
                    </VCol>
                </VRow>
            </template>
    
            <template v-else>
                <template v-if="found">
                    <template v-if="petData?.isMissing">
                        <VCard class="mb-1" width="100%">
                            <VRow style="width: 100%">
                            <VCol :cols="colWidths[0]" style="display: flex;">
                                <VImg :src="petImageUrl" :lazy-src="PLACEHOLDER_IMAGE_URL" cover >
                                    <template #placeholder>
                                        <div class="d-flex align-center justify-center fill-height">
                                        <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                                        </div>
                                    </template>
                                </VImg>
                            </VCol>
                            <VCol :cols="colWidths[1]" style="justify-content: space-around; display: flex; flex-direction: column;">
                                <VCard color="grey-lighten-4" class="mb-4">
                                    <VCardTitle>
                                        You found {{ petData.petDetails.name }}!
                                    </VCardTitle>
                                    <VCardText style="font-size: medium;">
                                        {{ petData.petDetails.name }} has been marked as lost<br>Let's help reunite them with their owner
                                    </VCardText>
                                </VCard>
                                <v-card>
                                <v-card-text>
                                    <VContainer fluid>
                                    <VRow>
                                        <VCol :cols="$vuetify.display.mdAndDown ? 12 : 6">
                                        <VCard height="100%">
                                            <VCardTitle><h3 class=text-center>Pet Details</h3></VCardTitle>
                                            <VCardText>
                                                <PetDetails :data="(petData as PetModel)"/>
                                            </VCardText>
                                        </VCard>
                                        </VCol>
                                        <VCol>
                                        <VCard height="100%">
                                            <VCardTitle><h3 class=text-center>Owner Contact Details</h3></VCardTitle>
                                            <VCardText>
                                                <ContactDetails :data="(contactData)"/>
                                            </VCardText>
                                        </VCard>
                                        </VCol>
                                    </VRow>
                                    </VContainer>
                                </v-card-text>
                                </v-card>
                                <VCard>
                                    <VCardTitle>Contact {{ ownerName }}</VCardTitle>
                                    <VCardText>
                                        <VRow justify="center">
                                            <VCol cols="6">
                                                <ChatLauncher :loggedIn="loggedIn" :ownerName="ownerName"/>
                                            </VCol>
                                        </VRow>
                                    </VCardText>
                                </VCard>
                            </VCol>
                            </VRow>
                        </VCard>
                    </template>
                    <template v-else>
                        <VRow class="fill-height" justify="center" align="center">
                            <VCol :cols="cardWidthCols">
                                <VCard>
                                    <VImg :src="petImageUrl" :lazy-src="PLACEHOLDER_IMAGE_URL" cover >
                                        <template #placeholder>
                                            <div class="d-flex align-center justify-center fill-height">
                                            <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                                            </div>
                                        </template>
                                    </VImg>
                                    <VCardTitle>You met {{ petData?.petDetails.name }}!</VCardTitle>
                                    <!-- <v-icon class="mb-5" color="success" icon="mdi-check-circle" size="112"></v-icon> -->
                                    
                                    <VCardText>
                                        {{ petData!.petDetails.name }} isn't marked as lost. No further action is required.
                                    </VCardText>
                                </VCard>
                            </VCol>
                        </VRow>            
                    </template>
            
                    <VContainer v-if="(petData as LimitedPetModel).isMissing">

                    </VContainer>
            
                </template>
                <template v-else>
                    <VRow class="fill-height" justify="center" align="center">
                        <VCol :cols="cardWidthCols">
                            <VCard>
                            <v-icon class="mb-5" color="error" icon="mdi-close-circle-outline" size="112"></v-icon>
                            <VCardTitle>Hmm, that pet wasn't found in our database</VCardTitle>
                            <VCardText style="font-size: large;">If this is your pet, please make sure the QR code is fully visible and free from damage</VCardText>
                            <VCardActions style="justify-content: center;">

                                <VBtn v-if="!loggedIn" 
                                    color="blue-darken-2" 
                                    variant="elevated"
                                    text="Go Home"
                                    :to="{path: '/'}"
                                />
                                <VBtn v-else
                                    color="blue-darken-2" 
                                    variant="elevated"
                                    text="Go to Your Account"
                                    :to="{path: '/account'}"
                                />
                            </VCardActions>
                            </VCard>
                        </VCol>
                    </VRow>
                </template>            
            </template>
        </VFadeTransition>
    </v-sheet>
</template>

<script setup lang="ts">
const PLACEHOLDER_IMAGE_URL = "/images/paw.jpg";

const route = useRoute();

const limitedDataRes = await useLazyFetch<LimitedPetModel|PetModel>(`/api/pet/${route.params.petID}/limitedData`);
const contactDataRes = await useLazyFetch(`/api/pet/${route.params.petID}/contactDetails`);
const contactData = contactDataRes.data;
const petData = limitedDataRes.data;
const pending = limitedDataRes.pending;

const session = await getSession();

let found = false;
const loggedIn = session.user != undefined;

watch(limitedDataRes.pending, async (dataVal) => {
    if (dataVal == true) return;

    if (limitedDataRes.error.value != undefined) return;
    found = true;

    const {data: amOwner, error} = await useFetch<{owner: boolean}>(`/api/pet/${route.params.petID}/amOwner`)

    if (amOwner.value?.owner) {
        useRouter().push(`/pets/${route.params.petID}`);
        return;
    }
})

const petImageUrl = computed(() => {
    return petData.value?.imageURL ?? PLACEHOLDER_IMAGE_URL
})

</script>

<script lang="ts">
import PetDetails from "~/components/petProfile/PetDetails.vue"
import ContactDetails from "~/components/petProfile/ContactDetails.vue";
import type PetModel from "~/types/models/pet"
import { type LimitedPetModel } from "~/types/models/pet";
import ChatLauncher from "~/components/foundPet/ChatLauncher.vue"
const { getSession} = useAuth();

export default {
    components: {PetDetails, ContactDetails, ChatLauncher},
    computed: {
        colWidths() {
            return this.$vuetify.display.smAndDown ? [12, 12] : [5, 7]
        },
        cardWidthCols() {
            if (this.$vuetify.display.lgAndUp) return 5;
            if (this.$vuetify.display.md) return 7;
            if (this.$vuetify.display.sm) return 9;
            return 12;
        },
        ownerName() {
            return "The Pet's Owner"

            return (petData?.value as PetModel)?.contactDetails.name ?? "The Pet's Owner"
        }
    }
}
</script>