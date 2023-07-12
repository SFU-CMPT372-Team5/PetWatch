<template>
    <v-sheet elevation="12" width="100vw" rounded="lg" class="pa-4 text-center mx-auto fill-height" color="blue-accent-1">
        <template v-if="noData">
            <v-icon class="mb-5" color="error" icon="mdi-cookie" size="112"></v-icon>
            
        </template>
        <template v-else>
            <v-icon class="mb-5" color="success" icon="mdi-check-circle" size="112"></v-icon>
    
            <!-- <h2 class="text-h5 mb-6">You scanned {{ (petData as LimitedPetModel)?.petDetails.name }}!</h2> -->
    
            <p v-if="(petData as LimitedPetModel).isMissing" class="mb-4 text-medium-emphasis text-body-2">
                My owner has marked me as lost. Thank you for finding me!
            </p>
    
            <p v-else class="mb-4 text-medium-emphasis text-body-2">
                Looks like my owner doesn't think I'm lost, but thanks for saying hi!
            </p>
    
            <VContainer v-if="(petData as LimitedPetModel).isMissing">
    
                Pet Info
            </VContainer>
    
            <v-divider class="mb-4"></v-divider>
    
            <div class="text-end">

                Chat Stuff
            </div>
        </template>

    </v-sheet>
</template>

<script setup>
</script>

<script lang="ts">
import type {LimitedPetModel} from "~/types/models/pet"
const { getSession} = useAuth();

export default {
    data() {
        return {
            noData: false,
            loading: true,
            petData: {}
        }
    },
    async mounted() {
        const session = await getSession();
        if (session != undefined) {
            if ((await fetch(`/api/pet/isOwner/${this.$route.params.petID}`)).status == 200) {
                this.$router.push(`/pets/${this.$route.params.petID}`)
                return;
            }
        };

        const limitedPetData = await fetch(`/api/pet/limited/${this.$route.params.petID}`);

        if (limitedPetData.status != 200) {
            this.noData = true;
            this.loading = false;
        } else {
            this.petData = await limitedPetData.json();
        }
    }
}
</script>