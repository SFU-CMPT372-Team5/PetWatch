<template>
    <v-btn @click="petProfile.lost = !petProfile.lost">Click To Toggle lost= {{ petProfile.lost }}</v-btn>

    <v-sheet elevation="12" max-width="600" rounded="lg" width="100%" class="pa-4 text-center mx-auto">

        <v-icon class="mb-5" color="success" icon="mdi-check-circle" size="112"></v-icon>

        <h2 class="text-h5 mb-6">You scanned {{ petProfile.name }}!</h2>

        <p v-if="petProfile.lost" class="mb-4 text-medium-emphasis text-body-2">
            My owner has marked me as lost. Thank you for finding me!
        </p>

        <p v-else class="mb-4 text-medium-emphasis text-body-2">
            Looks like my owner doesn't think I'm lost, but thanks for saying hi!
        </p>

        <VContainer v-if="petProfile.lost">

            <v-list-item v-for="(info, i) in petProfile.info" :key="i">

                <v-list-item-title>{{ formatLabel(i) }}:</v-list-item-title>

                <v-list-item-subtitle v-text="info"></v-list-item-subtitle>
            </v-list-item>
        </VContainer>

        <v-divider class="mb-4"></v-divider>

        <div class="text-end">

            <v-btn v-if="petProfile.chat && petProfile.lost" class="text-none" color="success" rounded variant="flat"
                width="90">
                Chat
                <v-icon icon="mdi-open-in-new"></v-icon>
            </v-btn>
            
            <v-btn class="text-none" color="success" rounded variant="flat" width="90" @click="navigateTo('/')">
                Done
            </v-btn>
        </div>
    </v-sheet>
</template>

<script lang="ts">
export default {
    data() {
        return {
            petProfile: {
                name: "DogName",
                lost: false,
                chat: true,
                info: {
                    address: "12345 30 st"
                }
            }
        }
    },

    methods: {
        formatLabel(string: String) {
            string = string.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
            string = string.charAt(0).toUpperCase() + string.slice(1)
            string = string.replace("_", " ")
            return string
        }
    }
}
</script>