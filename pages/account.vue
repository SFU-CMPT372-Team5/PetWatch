<template>
    <VSheet rounded color="blue-accent-1" class="fill-height">
        <VContainer fluid>
            <v-row justify="center">
                <v-col :cols="$vuetify.display.smAndDown ? 11 : 10">
                    <v-card>
                        <v-card-title class="bg-grey-lighten-2">
                            <span class="text-h5">Your Account</span>
                            <v-spacer></v-spacer>
                        </v-card-title>
                        <VContainer fluid>
                            <v-spacer></v-spacer>
                            <v-list rounded>
                                <VListItem title="Name" :subtitle="(apiData as UserModel).userDetails.name"/>
                                <VListItem title="Email" :subtitle="(apiData as UserModel).userDetails.email"/>
                                <VListItem title="Address" :subtitle="(apiData as UserModel).userDetails.address"/>
                                <VListItem title="Phone" :subtitle="(apiData as UserModel).userDetails.phone"/>
                            </v-list>

                            <v-btn @click="openSettings" color="blue-darken-2">Edit Profile</v-btn>
                        </VContainer>
                    </v-card>
                    <VCard class="mt-3">
                        <VCardText>
                            <span class="text-h5">Your Pets</span>
                        </VCardText>
                        <VContainer fluid>
                            <VRow justify="center">
                                <VCol v-if="((petApiData as PetModel[])?.length ?? 0) > 0"
                                    v-for="pet in (petApiData as PetModel[])" :cols="chatCardCols">
                                    <VCard @click="navigateTo('/pets/'+pet.Pet_UID)">
                                        <VImg src="/images/paw.jpg" cover />
                                        <VCardTitle>{{ pet.petDetails.name }}</VCardTitle>
                                    </VCard>
                                </VCol>
                                <VCol v-else>
                                    <VCard class="text-center" color="green-accent-1">
                                        <VCardTitle>You don't have any pets!</VCardTitle>
                                        <VCardText>Add a pet to your profile by clicking below</VCardText>
                                    </VCard>
                                </VCol>
                                <VCardActions style="justify-content: center;">
                                    <VBtn @click="navigateTo('/pets/new')" variant="elevated" color="blue-darken-2">Create
                                        new Pet</VBtn>
                                </VCardActions>
                            </VRow>
                        </VContainer>
                    </VCard>
                </v-col>
            </v-row>
        </VContainer>
    </VSheet>
</template>

<script lang="ts" setup>
import type UserModel from 'types/models/user';
import type PetModel from "types/models/pet";

definePageMeta({
    middleware: "auth"
})

const {data: apiData } = await useFetch("/api/account/info")
const {data: petApiData} = await useFetch("/api/account/pets")
</script>

<script lang="ts">
export default {
    data() {
        return {
            expectedApiData: {
                userDetails: {
                    name: "",

                }
            }
        }
    },
    computed: {
        chatCardCols() {
            if (this.$vuetify.display.lgAndUp) return 3;
            if (this.$vuetify.display.md) return 4;
            if (this.$vuetify.display.sm) return 6;
            return 12;
        }
    },

    methods: {
        //temp function to nicely display info labels from account information
        formatLabel(string: String) {
            string = string.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
            string = string.charAt(0).toUpperCase() + string.slice(1)
            string = string.replace("_", " ")
            return string
        },
        openPetProfile(pet: any) {
            console.log("View", pet.name)
        },
        async openSettings() {
            await navigateTo('/account-settings')
        }
    }
}
</script>