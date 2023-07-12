<template>
    <v-sheet elevation="12" width="100vw" rounded="lg" class="pa-4 text-center mx-auto fill-height" color="blue-accent-1">
        <VFadeTransition group>
            <template v-if="loading">
                <VRow justify="center" align="center" class="fill-height">
                    <VCol>
                        <VProgressCircular indeterminate color="grey-lighten-4" size="large"/>
                    </VCol>
                </VRow>
            </template>
    
            <template v-else>
                <template v-if="found">
                    <VRow class="fill-height" justify="center" align="center">
                        <VCol :cols="cardWidthCols">
                            <VCard>
                                <VImg src="/images/tmp-demo-dog-img.jpg" cover />
                                <VCardTitle>You met {{ petData?.petDetails.name }}!</VCardTitle>
                                <!-- <v-icon class="mb-5" color="success" icon="mdi-check-circle" size="112"></v-icon> -->
                                
                                <p v-if="(petData as LimitedPetModel).isMissing" class="mb-4 text-medium-emphasis text-body-2">
                                    My owner has marked me as lost. Thank you for finding me!
                                </p>
                        
                                <p v-else class="mb-4 text-medium-emphasis text-body-2">
                                    Looks like my owner doesn't think I'm lost, but thanks for saying hi!
                                </p>
                            </VCard>
                        </VCol>
                    </VRow>            
            
                    <VContainer v-if="(petData as LimitedPetModel).isMissing">
            
                        Pet Info
                    </VContainer>
            
                    <v-divider class="mb-4"></v-divider>
            
                    <div class="text-end">
        
                        Chat Stuff
                    </div>                    
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

<script lang="ts">
import type {LimitedPetModel} from "~/types/models/pet"
const { getSession} = useAuth();

export default {
    computed: {
        cardWidthCols() {
            if (this.$vuetify.display.lgAndUp) return 5;
            if (this.$vuetify.display.md) return 7;
            if (this.$vuetify.display.sm) return 9;
            return 12;
        }
    },
    data() {
        return {
            found: false,
            loading: true,
            petData: ({} as LimitedPetModel),
            loggedIn: false
        }
    },
    async mounted() {
        const session = await getSession();
        if (session?.user != undefined) {
            if ((await fetch(`/api/pet/isOwner/${this.$route.params.petID}`)).status == 200) {
                this.$router.push(`/pets/${this.$route.params.petID}`)
                return;
            }
            this.loggedIn = true;
        }

        const limitedPetData = await fetch(`/api/pet/limited/${this.$route.params.petID}`);

        if (limitedPetData.status != 200) {
        } else {
            this.found = true;
            this.petData = await limitedPetData.json();
        }
        this.loading = false;
    }
}
</script>