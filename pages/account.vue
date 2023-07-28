<template>
    <VSheet rounded color="blue-accent-1" class="fill-height">
        <VContainer fluid>
            <v-row justify="center">
                <v-col :cols="$vuetify.display.smAndDown ? 11 : 10">
                    <v-card v-if="!isEditing">
                        <v-card-title class="bg-grey-lighten-2">
                            <span class="text-h5">Your Account</span>
                            <v-spacer></v-spacer>
                        </v-card-title>
                        <VContainer fluid>
                            <v-spacer></v-spacer>
                            <v-list rounded>
                                <VListItem title="Name" :subtitle="(apiData as UserModel).userDetails.name" />
                                <VListItem title="Email" :subtitle="(apiData as UserModel).userDetails.email" />
                                <VListItem title="Address" :subtitle="(apiData as UserModel).userDetails.address" />
                                <VListItem title="Phone" :subtitle="(apiData as UserModel).userDetails.phone" />
                            </v-list>

                            <v-btn @click="isEditing = !isEditing" color="blue-darken-2">Edit Profile</v-btn>
                        </VContainer>
                    </v-card>
                    <v-card v-else>
                        <v-card-title class="bg-grey-lighten-2">
                            <span class="text-h5">Edit</span>
                            <v-spacer></v-spacer>
                        </v-card-title>
                        <VContainer fluid>
                            <v-list rounded>
                                <!-- Edit form -->
                                <v-form @submit.prevent="submitForm" ref="form" rounded>
                                    <v-text-field v-model="userDetails.name" :rules="nameRules" label="Name"
                                        required></v-text-field>
                                    <v-text-field v-model="userDetails.address" label="Address"></v-text-field>
                                    <!-- Email updated should update mongodb and auth0 -->
                                    <v-text-field v-model="userDetails.email" label="Email" :rules="emailRules"
                                        disabled></v-text-field>
                                    <v-text-field v-model="userDetails.phone" label="Phone"
                                        :rules="phoneRules"></v-text-field>
                                    <v-btn type="submit" block color="blue-darken-2">Submit</v-btn>
                                </v-form>
                            </v-list>
                            <v-btn @click="isEditing = !isEditing" color="red-darken-2">Cancel</v-btn>
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
                                    <VCard>
                                        <VCardTitle class="text-center">{{ pet.petDetails.name }}</VCardTitle>
                                        <VImg src="/images/paw.jpg" cover />
                                        <div class="d-flex justify-end mb-3 mt-3">
                                            <VBtn class="mr-3" color="error" variant="elevated"
                                                @click="showConfirmationDialog = true">
                                                <v-tooltip activator="parent" location="start">Delete Pet</v-tooltip>
                                                <VIcon>mdi-delete</VIcon>
                                            </VBtn>
                                            <VBtn class="mr-3" variant="elevated" color="indigo-lighten-1"
                                                @click="navigateTo('/pets/' + pet.Pet_UID)">
                                                <v-tooltip activator="parent" location="end">View Pet
                                                    Information</v-tooltip>
                                                <VIcon>mdi-open-in-new</VIcon>
                                            </VBtn>
                                        </div>

                                        <!-- Confirmation Dialog -->
                                        <v-dialog v-model="showConfirmationDialog" max-width="500">
                                            <v-card>
                                                <v-card-title
                                                class="text-center font-weight-bold"
                                                >Delete Confirmation</v-card-title>
                                                <v-card-text>Are you sure you want to delete {{ pet.petDetails.name
                                                }}?</v-card-text>
                                                <v-card-actions
                                                class="d-flex justify-end mb-3 mt-3"
                                                >
                                                    <VBtn color="red" @click="showConfirmationDialog = false">Cancel
                                                    </VBtn>
                                                    <VBtn color="green" @click="deletePet(pet)">Delete</VBtn>
                                                </v-card-actions>
                                            </v-card>
                                        </v-dialog>
                                    </VCard>


                                </VCol>
                                <VCol v-else>
                                    <VCard class="text-center" color="green-accent-1">
                                        <VCardTitle>You don't have any pets!</VCardTitle>
                                        <VCardText>Add a pet to your profile by clicking below</VCardText>
                                    </VCard>
                                </VCol>
                                <VCardActions style="justify-content: center">
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
import type UserModel from "types/models/user";
import type PetModel from "types/models/pet";

definePageMeta({
    middleware: "auth",
});

const { data: apiData } = await useFetch("/api/account/info");
const { data: petApiData } = await useFetch("/api/account/pets");
</script>

<script lang="ts">
export default {
    data() {
        return {
            isEditing: false,
            showConfirmationDialog: false,
            userDetails: {
                name: "",
                address: "",
                email: "",
                phone: "",
            },
            nameRules: [
                (value: String) => {
                    if (value) return true;

                    return "You must enter a name.";
                },
            ],
            emailRules: [
                (value: string) => {
                    //https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
                    if (
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                            value
                        )
                    )
                        return true;

                    return "Must be a valid e-mail.";
                },
            ],
            phoneRules: [
                (value: string) => {
                    if (!value || (value?.length > 9 && /[0-9-]+/.test(value)))
                        return true;

                    return "Phone number needs to be at least 9 digits.";
                },
            ],
        };
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
        //temp function to nicely display info labels from account information
        formatLabel(string: String) {
            string = string.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
            string = string.charAt(0).toUpperCase() + string.slice(1);
            string = string.replace("_", " ");
            return string;
        },
        async fetchUserData() {
            const apiData = await $fetch("/api/account/info");
            if (apiData) {
                this.userDetails = (apiData as UserModel).userDetails;
            }
        },

        async submitForm() {
            const { valid } = await (this.$refs?.form as any).validate();
            if (valid) {
                await $fetch("/api/account/update", {
                    method: "PUT",
                    body: {
                        userDetails: this.userDetails,
                    },
                });
                this.$router.go(0);
            }
        },

        async deletePet(pet: PetModel) {
            this.showConfirmationDialog = false;
            const id = pet.Pet_UID;
            const name = pet.petDetails.name;

            try {
                const deleteRes = await $fetch(`/api/pet/delete/${id}`, {
                    method: "DELETE",
                });

                if (deleteRes.status === 200) {
                    window.location.reload();
                } else {
                    alert(`Failed to delete ${name}.`);
                }
            } catch (error) {
                console.error('Error deleting pet:', error);
                alert(`An error occurred while deleting ${name}.`);
            }

        },

    },

    mounted() {
        this.fetchUserData();
    },
};
</script>
