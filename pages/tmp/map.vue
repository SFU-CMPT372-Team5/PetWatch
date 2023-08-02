<template>
    <GMapMap
      ref="myMapRef"
      :center="center"
      :zoom="10"
      map-type-id="terrain"
      style="width: 100vw; height: 20rem"
    >
      <GMapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        :draggable="true"
        @click="openMarker(m.id)"
        @closeclick="openMarker(null)"
      >
        <GMapInfoWindow
          :closeclick="true"
          @closeclick="openMarker(null)"
          :opened="openedMarkerID === m.id"
        >
          <div>I am in info window {{ m.id }}</div>
        </GMapInfoWindow>
      </GMapMarker>
    </GMapMap>
  </template>
  
  <script>
  export default {
    data() {
      return {
        openedMarkerID: null,
        center: { lat: 51.093048, lng: 6.84212 },
        markers: [
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
      this.$refs.myMapRef.$mapPromise.then((map) => {
        map.addListener('click', (mapsMouseEvent) => {
          console.log(mapsMouseEvent.latLng.lat());
          console.log(mapsMouseEvent.latLng.lng());
        });
      });
    },
    methods: {
      openMarker(id) {
        this.openedMarkerID = id;
      },
      showPosition(event, two) {
        console.log(event.latLng);
      },
    },
  };
  </script>
  
  <style>
  body {
    margin: 0;
  }
  </style>