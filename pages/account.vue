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

            <SharedPageLoading v-if="accountPending" />
            <VContainer v-else fluid>
                <v-row justify="center">
                    <v-col :cols="$vuetify.display.smAndDown ? 11 : 10">
                        <VCard>
                            <v-card-title class="bg-grey-lighten-2">
                                <span v-if="!isEditing" class="text-h5">Your Account</span>
                                <span v-else class="text-h5">Editing</span>
                            </v-card-title>

                            <VCardText :style="{maxWidth: $vuetify.display.smAndDown ? 'unset':'50%'}">
                                <VContainer fluid>
                                    <ContactDetails :data="apiData?.userDetails" :editing="isEditing" ref="form" />
                                </VContainer>
                            </VCardText>

                            <VCardActions v-if="!isEditing">
                                <v-btn @click="isEditing = !isEditing" color="blue-darken-2">Edit Profile</v-btn>
                            </VCardActions>
                            <VCardActions v-else>
                                <v-btn @click="isEditing = !isEditing" color="grey-darken-1">Cancel</v-btn>
                                <v-btn @click="submitForm()" :color="accountUpdateError ? 'error' : 'success'"
                                    :loading="submittingAccountUpdate">Submit</v-btn>
                            </VCardActions>
                        </VCard>

                        <VCard class="mt-3">
                            <VRow class="mt-3">
                                <VCardText>
                                    <span class="text-h5 ml-3">Your Pets</span>
                                </VCardText>
                                <VCardActions class="mr-6" style="justify-content: end">
                                    <NewPet />
                                    <!-- <VBtn @click="navigateTo('/pets/new')" variant="elevated" color="blue-darken-2">Create
                                    new Pet</VBtn> -->
                                </VCardActions>
                            </VRow>
                            <VContainer fluid>
                                <VRow justify="center">
                                    <VCol v-if="((petApiData as PetModel[])?.length ?? 0) > 0"
                                        v-for="pet in (petApiData as PetModel[])" :cols="chatCardCols">
                                        <VCard class="bg-grey-darken-3" @click="navigateTo('/pets/' + pet.Pet_UID)">
                                            <VCardTitle class="text-center">{{ pet.petDetails.name }}</VCardTitle>
                                            <PetProfilePetImage :petData="pet" />
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
// Importing required type definitions and components
import type UserModel from "~/types/models/user"; // Type definition for UserModel
import type PetModel from "~/types/models/pet"; // Type definition for PetModel
import ContactDetails from '~/components/petProfile/ContactDetails.vue'; // Custom ContactDetails component
definePageMeta({
    middleware: "auth" // Require authentication middleware for accessing this page
});
export default {
    components: { ContactDetails }, // Registering the ContactDetails component
    data() {
        return {
            // Data properties for the component
            drawer: false, // Control the visibility of the side drawer
            isEditing: false, // Flag to indicate if the user is in editing mode
            submittingAccountUpdate: false, // Loading spinner for account update submission
            accountUpdateError: false, // Flag to indicate if there was an error during account update

            subject: 'test',
            message: 't',
        }
    },
    async setup() {
        // Setup function that runs during component initialization

        // Set page title and define page meta information with "auth" middleware
        useHead({
            title: "My Account | PetWatch"
        });

        // Fetch user data and pets data using lazy fetching
        const { data: apiData, pending: accountPending } = await useLazyFetch<UserModel>("/api/account/info");
        const { data: petApiData, pending: petsPending } = await useLazyFetch<PetModel[]>("/api/account/pets");

        // Return the fetched data and their pending status
        return { apiData, petApiData, accountPending, petsPending };
    },
    computed: {
        // Compute the number of columns to use for the chat card based on screen size
        chatCardCols() {
            if (this.$vuetify.display.lgAndUp) return 3;
            if (this.$vuetify.display.md) return 4;
            if (this.$vuetify.display.sm) return 6;
            return 12;
        },
    },

    methods: {
        // Method to fetch user data from the server
        async fetchUserData() {
            const apiData = await $fetch("/api/account/info");
            if (apiData) {
                this.apiData = (apiData as UserModel);
            }
        },

        // Method to submit the form for account update
        async submitForm() {
            // Set the submittingAccountUpdate flag to show the loading spinner
            this.submittingAccountUpdate = true;

            // Validate the form using the ContactDetails component's validate() method
            const valid = await (this.$refs?.form as typeof ContactDetails).validate();
            const newValues = (this.$refs.form as typeof ContactDetails).curValues;

            // If the form is valid and newValues is not undefined, update the user details
            if (valid && newValues != undefined) {
                this.apiData!.userDetails = newValues;
                try {
                    // Send a PUT request to update the account details
                    await $fetch("/api/account/update", {
                        method: 'PUT',
                        body: {
                            userDetails: newValues
                        }
                    });
                    // If the request is successful, reset the accountUpdateError flag
                    this.accountUpdateError = false;
                } catch (e) {
                    // If an error occurs during the request, show an alert and set the accountUpdateError flag
                    alert("Failed to update account details, please try again");
                    this.accountUpdateError = true;
                    this.submittingAccountUpdate = false;
                    // Early exit here to prevent changing back out of the editing screen
                    return;
                }
            }

            // Delay the resetting of flags to provide a smoother user experience
            setTimeout(() => {
                this.isEditing = false;
                this.submittingAccountUpdate = false;
            }, 400);
        },
    },

    mounted() {
        // Fetch user data when the component is mounted
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
