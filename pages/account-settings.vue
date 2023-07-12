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
                        <v-list-item :value="1" onclick="">

                            <v-list-item-title>[insert user attribute]</v-list-item-title>

                            <v-list-item-subtitle>
                                Update your account's [insert user attribute]
                            </v-list-item-subtitle>
                        </v-list-item>
                    </v-list>

                    <v-divider></v-divider>

                    <v-list lines="two" select-strategy="classic">

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
                    </v-list>
                </v-card>
            </v-col>
        </v-row>
    </VContainer>
</template>

<script lang="ts">
export default {
    data() {
        return {
            
        }
    },

    methods: {
    }
}

</script>