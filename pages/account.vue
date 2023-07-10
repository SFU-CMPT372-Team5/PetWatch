<template>
    <VSheet rounded>

        <VContainer fluid>

            <v-row>

                <v-col cols="12" sm="10" offset-sm="1">

                    <v-card>

                        <v-card-title class="bg-grey-lighten-2">

                            <span class="text-h5">Your Account</span>

                            <v-spacer></v-spacer>

                            <v-menu>
                                <template v-slot:activator="{ props }">

                                    <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
                                </template>

                                <v-list>

                                    <v-list-item v-for="(item, i) in items" :key="i">

                                        <v-list-item-title>{{ item }}</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu>
                        </v-card-title>


                        <VContainer fluid>

                            <span class="text-h5">{{ account.username }}</span>

                            <v-spacer></v-spacer>

                            <v-list rounded>

                                <v-list-item v-for="(info, i) in account.info" :key="i">

                                    <v-list-item-title>{{ formatLabel(i) }}:</v-list-item-title>

                                    <v-list-item-subtitle v-text="info"></v-list-item-subtitle>
                                </v-list-item>
                            </v-list>
                        </VContainer>


                        <VContainer fluid>

                            <span class="text-h5">Pets</span>

                            <v-list class="bg-grey-lighten-4" rounded>

                                <v-list-item v-for="(pet, i) in pets" :key="i" :value="pet" base-color="teal"
                                    @click="openPetProfile(pet)">

                                    <v-list-item-title class="text-h6 text-black" v-text="pet.name"></v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </VContainer>
                    </v-card>
                </v-col>
            </v-row>

        </VContainer>

    </VSheet>
</template>

<script >
export default {
    data() {
        return {
            items: ["Settings", "Delete Account"],
            account: {
                "username": "User1",
                "password": "pass",
                "info": {
                    "email": "user1@petwatch.com",
                    "address": "12345 10st",
                    "dateCreated": "November 10",
                }

            },
            pets: [
                {
                    "name": "Dog1"
                },
                {
                    "name": "Dog2"
                }
            ]
        }
    },

    methods: {
        //temp function to nicely display info labels from account information
        formatLabel(string) {
            string = string.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
            string = string.charAt(0).toUpperCase() + string.slice(1)
            string = string.replace("_", " ")
            return string
        },
        openPetProfile(pet) {
            console.log("View", pet.name)
        }
    }
}
</script>