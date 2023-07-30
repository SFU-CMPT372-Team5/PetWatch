<template>
    <v-app-bar scroll-behavior="hide" app color="indigo-lighten-1" dark>
        <v-app-bar-nav-icon variant="elevated" class="bg-pink-lighten-4" @click="navigateTo('/')">
            <VIcon>mdi-arrow-left</VIcon>
        </v-app-bar-nav-icon>
        <v-toolbar-title>
            <span class="hover-underline" @click="navigateTo('/')">PetWatch</span>
            <VIcon>mdi-chevron-right</VIcon>
            <span>My Account</span>
        </v-toolbar-title>
    </v-app-bar>

    <VSheet rounded color="indigo-lighten-3" class="fill-height mt-15">
        <VFadeTransition group leave-absolute>
        <VContainer v-if="accountPending" fluid class="fill-height">
            <VRow justify="center" align="center" >
                <VProgressCircular indeterminate color="grey-lighten-4" size="large" />
            </VRow>
        </VContainer>
        <VContainer v-else fluid>
            <v-row justify="center">
                <v-col :cols="$vuetify.display.smAndDown ? 11 : 10">
                    <VCard >
                        <v-card-title class="bg-grey-lighten-2">
                            <span v-if="!isEditing" class="text-h5">Your Account</span>
                            <span v-else class="text-h5">Editing</span>
                        </v-card-title>

                        <VCardText style="max-width: 50%;">
                            <VContainer fluid>
                                <ContactDetails :data="apiData?.userDetails" :editing="isEditing" ref="form"/>
                            </VContainer>
                        </VCardText>
                        
                        <VCardActions v-if="!isEditing">
                            <v-btn @click="isEditing = !isEditing" color="blue-darken-2">Edit Profile</v-btn>
                        </VCardActions>
                        <VCardActions v-else>
                            <v-btn @click="isEditing = !isEditing" color="grey-darken-1">Cancel</v-btn>
                            <v-btn @click="submitForm()" :color="accountUpdateError ? 'error' : 'success'" :loading="submittingAccountUpdate">Submit</v-btn>
                        </VCardActions>
                    </VCard>

                    <VCard class="mt-3">
                        <VRow class="mt-3">
                            <VCardText>
                                <span class="text-h5 ml-3">Your Pets</span>
                            </VCardText>
                            <VCardActions class="mr-6" style="justify-content: end">
                                <VBtn @click="navigateTo('/pets/new')" variant="elevated" color="blue-darken-2">Create
                                    new Pet</VBtn>
                            </VCardActions>
                        </VRow>
                        <VContainer fluid>
                            <VRow justify="center">
                                <VCol v-if="((petApiData as PetModel[])?.length ?? 0) > 0"
                                    v-for="pet in (petApiData as PetModel[])" :cols="chatCardCols">
                                    <VCard class="bg-grey-darken-3" @click="navigateTo('/pets/' + pet.Pet_UID)">
                                        <VCardTitle class="text-center">{{ pet.petDetails.name }}</VCardTitle>
                                        <VImg :src="pet.imageURL ?? '/images/paw.jpg'" cover />
                                    </VCard>
                                </VCol>
                                <VCol v-else>
                                    <VCard class="text-center" color="green-accent-1">
                                        <VCardTitle>You don't have any pets!</VCardTitle>
                                        <VCardText>Add a pet to your profile by clicking below</VCardText>
                                    </VCard>
                                </VCol>
                            </VRow>
                        </VContainer>
                    </VCard>
                </v-col>
            </v-row>
        </VContainer>
    </VFadeTransition>
    </VSheet>
</template>

<script lang="ts">
import type UserModel from "types/models/user";
import type PetModel from "types/models/pet";
import ContactDetails from '~/components/petProfile/ContactDetails.vue';

export default {
    components: {ContactDetails},
    data() {
        return {
            drawer: false,
            isEditing: false,
            submittingAccountUpdate: false,
            accountUpdateError: false
        }
    },
    async setup() {
        definePageMeta({
            middleware: "auth"
        })

        const {data: apiData, pending: accountPending } = await useLazyFetch<UserModel>("/api/account/info");
        const {data: petApiData, pending: petsPending} = await useLazyFetch<PetModel[]>("/api/account/pets");

        return {apiData, petApiData, accountPending, petsPending};
    },
    computed: {
        chatCardCols() {
            if (this.$vuetify.display.lgAndUp) return 3;
            if (this.$vuetify.display.md) return 4;
            if (this.$vuetify.display.sm) return 6;
            return 12;
        },
    },

    methods: {
        async fetchUserData() {
            const apiData = await $fetch("/api/account/info");
            if (apiData) {
                this.apiData = (apiData as UserModel)
            }
        },

        async submitForm() {
            this.submittingAccountUpdate = true;
            const valid = await (this.$refs?.form as typeof ContactDetails).validate()
            const newValues = (this.$refs.form as typeof ContactDetails).curValues;

            
            if (valid && newValues != undefined) {
                this.apiData!.userDetails = newValues;
                try {
                    await $fetch("/api/account/update", {
                        method: 'PUT',
                        body: {
                            userDetails: newValues
                        }
                    })
                    //If here, no error
                    this.accountUpdateError = false;
                    
                } catch(e) {
                    alert("Failed to update account details, please try again");
                    this.accountUpdateError = true;
                    this.submittingAccountUpdate = false;
                    //Want to early exit here to prevent changing back out of editing screen, 
                    //so a little bit of code repeat required
                    return;
                }
            }

            setTimeout(() => {
                this.isEditing = false;
                this.submittingAccountUpdate = false;
            }, 400)
        },
    },

    mounted() {
        this.fetchUserData();
    },
};
</script>

<style>
/* CSS to add underline on hover */
.hover-underline:hover {
    text-decoration: underline;
    cursor: pointer;
}
</style>
