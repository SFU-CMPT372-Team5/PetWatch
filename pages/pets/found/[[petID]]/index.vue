<template>
    <v-sheet elevation="12" width="100vw" class="pa-4 text-center mx-auto fill-height" :color="(!petPending && petData == undefined) || petData?.isMissing ? 'red-accent-1' : 'blue-accent-1'" style="transition: background-color 1s linear;">
        <VFadeTransition group>
            <!-- Loading -->
            <SharedPageLoading v-if="petPending"/>
            
            <!-- Loaded w/out data -->
            <VRow v-else-if="petData == undefined" class="fill-height" justify="center" align="center">
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

            <!-- Loaded w/ data -->
            <template v-else>
                <template v-if="petData?.isMissing">
                    <VCard class="mb-1" width="100%">
                        <VRow style="width: 100%">
                        <VCol :cols="colWidths[0]" style="display: flex;">
                            <PetProfilePetImage :petData="petData"/>
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
                                            <PetDetails :data="(petData as PetModel).petDetails"/>
                                        </VCardText>
                                    </VCard>
                                    </VCol>
                                    <VCol>
                                    <VCard height="100%">
                                        <VCardTitle><h3 class=text-center>Owner Contact Details</h3></VCardTitle>
                                        <VCardText>
                                            <VRow v-if="!loggedIn" justify="center">
                                                <VCard class="ma-2 pa-5" color="error" variant="tonal">
                                                    <VIcon size="xxx-large">mdi-close-circle-outline</VIcon><br/>
                                                    Login to see contact details
                                                </VCard>
                                            </VRow>
                                            <ContactDetails v-else :data="contactData"/>
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
                                        <VCol cols="12" sm="6">
                                            <ChatLauncher :loggedIn="loggedIn" :ownerName="ownerName"/>
                                        </VCol>
                                        <VCol cols="12" sm="6">
                                            <MapLauncher :petID="($route.params.petID as string)"/>
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
                                <PetProfilePetImage :petData="petData"/>
                                <VCardTitle>You met {{ petData?.petDetails.name }}!</VCardTitle>
                                <!-- <v-icon class="mb-5" color="success" icon="mdi-check-circle" size="112"></v-icon> -->
                                
                                <VCardText>
                                    {{ petData!.petDetails.name }} isn't marked as lost. No further action is required.
                                </VCardText>
                            </VCard>
                        </VCol>
                    </VRow>            
                </template>
            </template>   
        </VFadeTransition>
    </v-sheet>
</template>

<script lang="ts">
definePageMeta({
    validate: (route) => {
        //Don't load page if petID not provided
        return typeof(route.params.petID) === "string" && route.params.petID.length > 0;
    }
})

import PetDetails from "~/components/petProfile/PetDetails.vue"
import ContactDetails from "~/components/petProfile/ContactDetails.vue";
import type PetModel from "~/types/models/pet"
import { type LimitedPetModel } from "~/types/models/pet";
import { type UserDetails } from "~/types/models/user"

import ChatLauncher from "~/components/foundPet/ChatLauncher.vue"
import MapLauncher from "~/components/foundPet/MapLauncher.vue"
const { getSession, status } = useAuth();

export default {
    components: {PetDetails, ContactDetails, ChatLauncher, MapLauncher},
    async setup() {
        const route = useRoute();

        const {data: petData, pending: petPending, error: petError} = await useLazyFetch<LimitedPetModel|PetModel>(`/api/pet/${route.params.petID}/limitedData`);
        const {data: contactData, error: contactError} = await useLazyFetch<UserDetails>(`/api/pet/${route.params.petID}/ownerDetails`);

        const session = await getSession();

        const loggedIn = status.value === 'authenticated' && session != undefined;

        watch(petPending, async (dataVal) => {
            if (dataVal == true) return;

            if (petError.value != undefined) return;

            const {data: amOwner, error} = await useFetch<{owner: boolean}>(`/api/pet/${route.params.petID}/amOwner`)

            if (amOwner.value?.owner) {
                useRouter().push(`/pets/${route.params.petID}`);
                return;
            }
        })

        useHead({
            title: `Found ${petData.value != undefined ? `${petData.value.petDetails.name}` : 'Found Pet'} | PetWatch`
        })

        return {loggedIn, petData, petPending, contactData, contactError}
    },
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
            return this.contactData?.name ?? "The Pet's Owner"
        }
    },
    mounted() {
        //This is one place where users will potentially create an account and log in and then use their account details
        //The system isn't set up to automatically create a database entry when a person creates an account rather the first time
        //They click on the accounts page (and call get get account info api endpoint). 
        
        //As such this just calls that endpoint to ensure the user has a database entry
        $fetch("/api/account/info");
    }
}
</script>