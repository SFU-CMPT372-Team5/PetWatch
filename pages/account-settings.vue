<template>
    <VContainer fluid>

        <v-row>

            <v-col cols="12" sm="10" offset-sm="1">

                <v-card>
                    <v-toolbar color="grey-lighten-2">

                        <v-btn icon="mdi-arrow-left" @click="$router.go(-1)"></v-btn>

                        <v-toolbar-title>Settings</v-toolbar-title>

                    </v-toolbar>

                    <v-list lines="one">

                        <v-list-subheader>User Information</v-list-subheader>

                        <!-- Use template once we know what attributes user will have -->
                        <v-form @submit.prevent="submitForm" ref="form">
                            <v-text-field v-model="userDetails.name" :rules="nameRules" label="Name" required></v-text-field>
                            <v-text-field v-model="userDetails.address" label="Address"></v-text-field>
                            <v-text-field v-model="userDetails.email" label="Email" :rules="emailRules"></v-text-field>
                            <v-text-field v-model="userDetails.phone" label="Phone" :rules="phoneRules"></v-text-field>
                            <v-btn type="submit" block class="mt-2">Submit</v-btn>
                        </v-form>
                    </v-list>

                    <v-divider></v-divider>
                    <!-- Possible privacy settings for all pets -->
                    <!-- <v-list lines="two" select-strategy="classic">

                        <v-list-subheader>Privacy</v-list-subheader>

                        <v-list-item value="DisableQR">

                            <template v-slot:prepend="{ isActive }">

                                <v-list-item-action start>

                                    <v-checkbox-btn :model-value="isActive"></v-checkbox-btn>
                                </v-list-item-action>
                            </template>

                            <v-list-item-title>Disable all QR codes</v-list-item-title>

                            <v-list-item-subtitle>
                                Prevent others from viewing any of your pets' profiles via QR scan.
                            </v-list-item-subtitle>
                        </v-list-item>

                        <v-list-item value="DisableChat">

                            <template v-slot:prepend="{ isActive }">
                                <v-list-item-action start>

                                    <v-checkbox-btn :model-value="isActive"></v-checkbox-btn>
                                </v-list-item-action>
                            </template>

                            <v-list-item-title>Disable all chats</v-list-item-title>

                            <v-list-item-subtitle>
                                Stop recieving all chat messages. Your saved chats will remain viewable.
                            </v-list-item-subtitle>
                        </v-list-item>
                    </v-list> -->
                </v-card>
            </v-col>
        </v-row>
    </VContainer>
</template>

<script lang="ts" setup>
import type UserModel from 'types/models/user'

definePageMeta({
    middleware: "auth"
})

</script>

<script lang="ts">
export default {

    data() {
        return {
            constUserDetails: {
                name: "",
                address: "",
                email: "",
                phone: "",
            },
            userDetails: {
                name: "",
                address: "",
                email: "",
                phone: "",
            },
            nameRules: [
                (value: String) => {
                    if (value) return true

                    return 'You must enter a name.'
                },
            ],
            emailRules: [
                (value: string) => {
                    if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true

                    return 'Must be a valid e-mail.'
                }
            ],
            phoneRules: [
                (value: string) => {
                    if (!value || (value?.length > 9 && /[0-9-]+/.test(value))) return true

                    return 'Phone number needs to be at least 9 digits.'
                },
            ]
        }
    },

    methods: {
        async fetchUserData() {
            const apiData = await $fetch("/api/account/info")
            if (apiData) {
                this.constUserDetails = (apiData as UserModel).userDetails
                this.userDetails = (apiData as UserModel).userDetails
            }
        },

        async submitForm() {
            const { valid } = await (this.$refs?.form as any).validate()
            if (valid) {
                await $fetch("/api/account/update", {
                    method: 'PUT',
                    body: {
                        userDetails: this.userDetails
                    }
                })
                this.$router.go(0)
            }
        },
    },

    mounted() {
        this.fetchUserData()
    }
}

</script>