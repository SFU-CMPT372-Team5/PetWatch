<template>
    <v-main>
        <v-app-bar scroll-behavior="hide" app color="blue-accent-1" dark>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>PetWatch</v-toolbar-title>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" app class="bg-indigo-lighten-3">
            <v-list>
                <v-list-item link href="#home">
                    <v-list-item-title class="text-h5">Home</v-list-item-title>
                </v-list-item>
                <v-list-item link href="#about">
                    <v-list-item-title class="text-h5">About</v-list-item-title>
                </v-list-item>
                <v-list-item link href="#contact">
                    <v-list-item-title class="text-h5">Contact</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-container id="home" fluid class="p-0 m-0">
            <v-row class="bg-image-pink d-flex justify-center align-center" style="height: 100vh;">
                <v-col cols="10" md="5" class="d-flex justify-center align-center">
                    <v-card class="pa-10">
                        <v-card-text>
                            <p class="text-h3">Welcome to PetWatch!</p>
                            <br>
                            <p>PetWatch is the ultimate platform for reporting lost pets and reuniting them with
                                their
                                owners. We understand how heart-wrenching it can be when a beloved pet goes missing, and
                                that's
                                why we're here to help. Join our community and sign up today to take advantage of our
                                comprehensive pet recovery system.</p>
                        </v-card-text>
                        <v-card-actions>
                            <template v-if="!loggedIn">
                                <v-btn color="white" class="bg-blue-accent-1" dark elevation="2" outlined @click="signIn">
                                    Login
                                </v-btn>
                                <v-btn color="white" class="bg-blue-accent-1" dark elevation="2" outlined @click="signIn">
                                    Sign Up
                                </v-btn>
                            </template>
                            <template v-else>
                                <v-btn color="white" class="bg-blue-accent-1" dark elevation="2" outlined
                                    @click="toAccount">
                                    My Account
                                </v-btn>
                                <v-btn color="white" class="bg-blue-accent-1" dark elevation="2" outlined @click="signOut">
                                    Sign Out
                                </v-btn>
                            </template>
                        </v-card-actions>
                    </v-card>
                </v-col>
                <v-col cols="10" md="5" class="d-flex justify-center">
                    <v-img src="/images/appicon.png"></v-img>
                </v-col>
            </v-row>
            <v-spacer id="about"></v-spacer>
        </v-container>
        <v-container fluid class="pt-10 pb-10">
            <v-row class="text-center">
                <v-col>
                    <div>
                        <p class="text-h2">About Us</p>
                    </div>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-container>
                        <p>Our mission is to provide pet owners with peace of mind when their beloved animals venture beyond
                            the
                            confines of their yard. By seamlessly blending innovation and compassion, our project aims to
                            establish an unwavering bond between pets and their humans. With PetWatch, all you need to do is
                            to
                            create an account, and input your contact information and any essential details about you furry
                            companions. In return, we provide a unique QR code for each of your pets. The magic happens when
                            a
                            personalized QR code is printed and delicately attached to your furry friend's collar. In the
                            unfortunate event that a pet goes missing, our app acts as a
                            bridge between concerned citizens, whom we fondly refer to as "finders," and pet owners. By
                            simply
                            scanning the QR code on a lost pet's collar, finders gain instant access to vital contact
                            information and other valuable details shared by the pet owner. Through our integrated
                            in-platform
                            chat service, finders can directly communicate with the owner, fostering swift and efficient
                            reunions. Additionally, finders have the ability to mark the current location of the pet on a
                            map,
                            aiding in the search efforts. We are dedicated to leveraging technology to create a strong and
                            compassionate community of pet lovers, ensuring that no pet goes unnoticed or uncared for. Join
                            us
                            in our mission to enhance pet safety and reunite cherished companions with their loving
                            families.
                        </p>
                    </v-container>
                </v-col>
            </v-row>
            <v-row class="text-center d-flex flex-wrap pa-5">
                <v-col cols="12" md="4">
                    <v-card class="d-flex justify-center align-center flex-column pa-5 bg-indigo-lighten-3">
                        <v-img src="/images/qr.png" height="100" width="100"></v-img>

                        <v-card-title>
                            <h2>QR Code</h2>
                        </v-card-title>

                        <v-card-text>
                            <p>We provide a unique QR code for each pet in your account. The QR code serves as a quick and
                                convenient way for finders to access the profile of the lost pet's owner. By scanning the QR
                                code using a smartphone or compatible device, the finder will be automatically redirected to
                                the owner's profile page.</p>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" md="4">
                    <v-card class="d-flex justify-center align-center flex-column pa-5 bg-indigo-lighten-3">
                        <v-img class="text-center" src="/images/pet-map.png" height="100" width="100"></v-img>

                        <v-card-title>
                            <h2>Mapping</h2>
                        </v-card-title>

                        <v-card-text>
                            <p>Our Map Feature serves as a powerful visual aid, providing a clear and interactive interface
                                for both finders and owners. It allows finders to quickly and conveniently pin their current
                                location on the map when they come across a lost pet, enabling pet owners to focus their
                                search efforts in the right direction.</p>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" md="4">
                    <v-card class="d-flex justify-center align-center flex-column pa-5 bg-indigo-lighten-3">
                        <v-img src="/images/chat.png" height="100" width="100"></v-img>

                        <v-card-title>
                            <h2>Chat</h2>
                        </v-card-title>

                        <v-card-text>
                            <p>With open lines of communication and a shared goal of bringing joy and relief, finders and
                                owners can work hand in hand using our chat feature. This direct communication channel
                                between pet finders and owners can significantly streamline the process of reuniting lost
                                pets with their rightful guardians.</p>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-spacer id="contact"></v-spacer>
        </v-container>

        <v-footer class="bg-red-lighten-4 text-center d-flex flex-column p-10 p-md-5">
            <v-form v-model="valid" class="w-100 w-md-80" cols="4">
                <p class="text-h2 font-weight-light my-4">Have Any Questions?</p>
                <p class="text-h4 font-weight-light my-4">Contact Us</p>
                <v-container>
                    <v-text-field class="my-6 b" v-model="firstname" :rules="nameRules" :counter="20" label="First name"
                        dense required></v-text-field>
                    <v-text-field class="my-6" v-model="lastname" :rules="nameRules" :counter="20" label="Last name" dense
                        required></v-text-field>
                    <v-text-field class="my-6" v-model="email" :rules="emailRules" label="E-mail" dense
                        required></v-text-field>
                    <v-textarea class="my-6" v-model="message" :rules="messageRules" label="Messsage" dense
                        required></v-textarea>
                    <v-btn color="pink-darken-1" class="mb-6" dark
                        style="font-family: 'Roboto', sans-serif; font-size: 20px; width: 100%; height: 2.5rem;"
                        @click="submitQuestions()">
                        Submit
                    </v-btn>
                </v-container>
            </v-form>
            <v-divider></v-divider>
            <div>
                {{ new Date().getFullYear() }} — <strong>PetWatch</strong>
            </div>
        </v-footer>
    </v-main>
</template>


<script lang="ts">
import emailjs from '@emailjs/browser';

const { signIn, signOut, getSession, status } = useAuth();

export default {
    computed: {
        loggedIn() {
            console.log(status.value)
            return status.value == "authenticated"
        }
    },
    data: () => ({
        drawer: false,
        formInputWidth: '700px',
        valid: false,
        firstname: '',
        lastname: '',
        nameRules: [
            (value: any) => {
                if (value) return true

                return 'Name is required.'
            },
            (value: string | any[]) => {
                if (value?.length <= 20) return true

                return 'Name must be less than 20 characters.'
            },
        ],
        email: '',
        emailRules: [
            (value: any) => {
                if (value) return true

                return 'E-mail is requred.'
            },
            (value: string) => {
                if (/.+@.+\..+/.test(value)) return true

                return 'E-mail must be valid.'
            },
        ],
        message: '',
        messageRules: [
            (value: any) => {
                if (value) return true

                return 'Message is required.'
            },
            (value: string | any[]) => {
                if (value?.length <= 300) return true

                return 'Message must be less than 300 characters.'
            },
        ],
    }),
    methods: {
        toAccount() {
            this.$router.push({
                path: "/account"
            })
        },
        signIn() {
            return signIn("auth0")
        },
        signOut() {
            return signOut();
        },
        submitQuestions() {       
            emailjs.init('qM5O9B4X9jYSRNguq');
            
            emailjs.send(
                'service_6pc0hhb',
                'template_r2dq36s',
                {
                    from_name: `${this.firstname} ${this.lastname}`,
                    to_name: "PetWatch",
                    email_id: this.email,
                    message: this.message,
                }
            ).then((result) => {
                    console.log('SUCCESS!', result.text);
                }, (error) => {
                    console.log('FAILED...', error.text);
                });
        }
    }
};
</script>

<style scoped>
.bg-image-pink {
    background-image: url('/images/paw.jpg');
    background-size: cover;
    background-position: center;
}
</style>
