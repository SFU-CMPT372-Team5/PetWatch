<template>
    <div class="text-center">
        <v-dialog v-model="dialog">
            <template v-slot:activator="{ props }">
                <v-btn color="blue-darken-2" @click="openMap">
                    Send Location
                </v-btn>
            </template>
            <VSheet v-if="sent" elevation="12" max-width="600" rounded="lg" width="100%" class="pa-4 text-center mx-auto">
                <v-icon class="mb-5" color="success" icon="mdi-check-circle" size="112"></v-icon>
                <h2 class="text-h5 mb-6">Location sent successfully</h2>
                <p class="mb-4 text-medium-emphasis text-body-2">
                    Thank you for helping to find this pet!
                </p>
                <v-divider class="mb-4"></v-divider>
                <div class="text-end">
                    <v-btn @click="() => dialog = false" class="text-none" color="success" rounded variant="flat" width="90">
                        Done
                    </v-btn>
                </div>
            </VSheet>
            <VCard v-else class="text-center">
                <VCardActions>
                    <VBtn class="mr-4" color="red-darken-2" variant="elevated" @click="() => dialog = false">Cancel</VBtn>
                    <h2>Share Location with Owner</h2>
                </VCardActions>
                <VContainer fluid class="chatContainer" ref="chatContainer">
                    <VCard color="teal" variant="flat">
                        <VCardTitle>Set pet's location</VCardTitle>
                    </VCard>
                    <GMapMap v-bind:style="{ height: computedHeight }" ref="map" :center="center" :zoom="15"
                        :disableDefaultUI="true" map-type-id="terrain"
                        style="width: auto; margin: auto; border-radius: 10px;" :options="{
                            zoomControl: true,
                            mapTypeControl: false,
                            scaleControl: true,
                            streetViewControl: false,
                            rotateControl: true,
                            fullscreenControl: true,
                        }">

                        <GMapMarker :position="center" :draggable="true" :icon="{
                            url: '/images/pet-marker.png',
                            scaledSize: { width: 77, height: 77 },
                        }" @drag="handleDrag">
                            <GMapInfoWindow :opened="!dragged">
                                <p>Drag me!</p>
                            </GMapInfoWindow>
                        </GMapMarker>

                        <GMapMarker :position="center" :draggable="false" :clickable="false" :icon="{
                            url: '/images/user-marker.png',
                            scaledSize: { width: 50, height: 50 },
                        }"> </GMapMarker>
                    </GMapMap>

                </VContainer>
                <VBtn color="green" @click="sendLocation">Send</VBtn>
            </VCard>
        </v-dialog>
    </div>
</template>
<script>
import path from 'path';

export default {
    data() {
        return {
            sent: false,
            dragged: false,
            dialog: false,
            center: { lat: 49.18915852522481, lng: -122.85014097753391 },
            markerPosition: { lat: 49.18915852522481, lng: -122.85014097753391 }
        };
    },
    props: {
        petID: String
    },
    computed: {
        computedHeight() {
            return (window.innerHeight) * 2 / 3 + 'px'
        }
    },
    methods: {
        async openMap() {
            navigator.geolocation.getCurrentPosition(position => {
                this.center.lat = position.coords.latitude
                this.center.lng = position.coords.longitude
            })
            this.dialog = true;
        },
        handleDrag(e) {
            this.dragged = true
            this.markerPosition.lat = e.latLng.lat()
            this.markerPosition.lng = e.latLng.lng()
        },
        async sendLocation() {
            await $fetch(`/api/pet/${this.petID}/location`, {
                method: 'PUT',
                body: {
                    location: this.markerPosition
                }
            }).then((res) => {
                this.sent = true
            }).catch(e => {
                alert("Failed to send location")
            })
        }
    },
}
</script>