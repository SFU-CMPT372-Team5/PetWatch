<template>
    <VContainer>
        <VRow>
            <VCol cols="12" lg="8">
            <!-- <GMapMap :center="center" :zoom="10"
                :disableDefaultUI="true" map-type-id="terrain"
                style="width: auto; height: 400px; margin: auto; border-radius: 10px;" :options="{
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: true,
                streetViewControl: false,
                rotateControl: true,
                fullscreenControl: true,
                }">
                <GMapMarker v-for="(marker, i) in markers" @click="openMarkerInfo(i)" :key="i" :position="marker.coords" :icon="{ url: '/images/pet-marker.png', scaledSize: { width: 40, height: 40 } }">
                <GMapInfoWindow :opened="openedMarkerKey === i">
                    <p>{{ marker.timeFormatted }}</p>
                </GMapInfoWindow>
                </GMapMarker>
            </GMapMap> -->
            <VCard height="300px" class="align-center d-flex justify-center" color="grey-lighten-3">
                <p class="text-center text-subtitle-1">Google Maps credits expired. Not renewing because that costs money</p>
            </VCard>
            </VCol>
            <VCol >
            <h3>Location Pings</h3>
            <div style="height: 400px; overflow: auto;">
                <p v-if="markers.length == 0">Sorry, no pings yet.</p>
                <VContainer class="py-2" v-for="(marker, i) in markers" >
                    <VCard @mouseover="openMarkerInfo(i)" @click="center = (markers[i].coords as any)">
                    <VCardTitle>{{ marker.timeFormatted }}</VCardTitle>
                    <VCardSubtitle>{{ marker.name }}</VCardSubtitle>
                    </VCard>
                </VContainer>
            </div>
            </VCol>
        </VRow>
    </VContainer>
</template>
<script lang="ts">
import {LocationPoint} from '~/types/models/pet';

// Importing runtime configuration and Google API key
const config = useRuntimeConfig();
const googleKey = config.public.googleKey; // The Google API key used for geocoding

export default {
    props: {
        petID: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            openedMarkerKey: null as number | null, // Key of the currently opened marker info window
            updater: undefined as NodeJS.Timeout|undefined,
        }
    },
    setup() {
        let markers = ref([] as { name: any; coords: { lat: Number; lng: Number; }; time: Number; timeFormatted: string; }[])
        let center = ref({ lat: 49.18915852522481, lng: -122.85014097753391 })

        return {markers, center}
    },
    methods: {        
        openMarkerInfo(i: number | null) {
            this.openedMarkerKey = i
        },
        async fetchLocationMarks() {
            try {
                const marks = await $fetch<LocationPoint[]>(`/api/pet/${this.petID}/locationMarks`)

                if (marks != undefined) return marks;

                return marks;
            } catch(e) {
                console.error(e);
                clearInterval(this.updater) //Almost certainly means the pet is no longer lost
                return [];
            }
        },
        async updateLocationMarks() {
            const markers = await this.fetchLocationMarks();
            if (markers.length == 0) return;

            this.markers.length = 0;
            for (const marker of markers) {
                const res: any = await $fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${marker.location.lat},${marker.location.lng}&key=${googleKey}`)
                .catch((e) => {
                    console.error(e)
                })
                const time = new Date(marker.time as number)

                var format = 5 // results[5] is 6th format, includes up to postal code
                while (!res.results[format]) { //depending on location, format may not be available
                    format--
                }

                this.markers.push({
                    name: res.results[format].formatted_address,
                    coords: marker.location,
                    time: marker.time,
                    timeFormatted: time.toLocaleDateString("en-US",{ month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })
                })
            }

            //Set the center of the map to the latest marker. We can presume the array is ordered by date min-->max already as the array is pushed to
            if (markers.length > 0) {
                this.center = this.markers[markers.length-1].coords as any;
            }
        }
    },
    // async mounted() {
    //     // this.updater = setInterval(() => {
    //     //     this.updateLocationMarks()
    //     // }, 15000)

    //     // this.updateLocationMarks();
    // },
    // unmounted() {
    //     clearInterval(this.updater);
    // }
}
</script>