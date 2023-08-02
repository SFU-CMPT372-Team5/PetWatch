<template>
  <!-- Display the Google Map using GMapMap component -->
  <GMapMap ref="myMapRef" :center="center" :zoom="10" map-type-id="terrain" style="width: 100vw; height: 20rem">
    <!-- Loop through markers and create a GMapMarker for each -->
    <GMapMarker :key="index" v-for="(m, index) in markers" :position="m.position" :clickable="true" :draggable="true"
      @click="openMarker(m.id)" @closeclick="openMarker(null)">
      <!-- Display an info window when the marker is clicked -->
      <GMapInfoWindow :closeclick="true" @closeclick="openMarker(null)" :opened="openedMarkerID === m.id">
        <div>I am in info window {{ m.id }}</div>
      </GMapInfoWindow>
    </GMapMarker>
  </GMapMap>
</template>

<script>
export default {
  data() {
    return {
      openedMarkerID: null, // ID of the currently opened marker
      center: { lat: 51.093048, lng: 6.84212 }, // Default center for the map
      markers: [
        // Array of markers with their positions and IDs
        {
          id: 1,
          position: {
            lat: 51.093048,
            lng: 6.84212,
          },
        },
        {
          id: 2,
          position: {
            lat: 51.198429,
            lng: 6.69529,
          },
        },
      ],
    };
  },
  mounted() {
    // Wait for the map to be loaded, and then add a click event listener to it
    this.$refs.myMapRef.$mapPromise.then((map) => {
      map.addListener('click', (mapsMouseEvent) => {
        console.log(mapsMouseEvent.latLng.lat()); // Log the latitude of the clicked location
        console.log(mapsMouseEvent.latLng.lng()); // Log the longitude of the clicked location
      });
    });
  },
  methods: {
    // Method to open the info window of a specific marker
    openMarker(id) {
      this.openedMarkerID = id;
    },
    // Method to show the position of a clicked location on the map
    showPosition(event, two) {
      console.log(event.latLng); // Log the latitude and longitude of the clicked location
    },
  },
};
</script>

<style>
body {
  margin: 0;
}
</style>
