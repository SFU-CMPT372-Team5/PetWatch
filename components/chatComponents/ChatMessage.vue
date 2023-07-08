<template>
    <component :is="authorIsLocal ? 'VSlideXReverseTransition' : 'VSlideXTransition'">
        <VCard v-if="ready"
            :class="authorIsLocal ? 'messageLocalAuthor' : 'messageRemoteAuthor'" 
            class="message"
            :color="authorIsLocal ? 'teal' : ''"
        >
        <!-- "ready" makes the animation pretty -->
        <VCardText>{{ messageContent }}</VCardText>
        </VCard>
    </component>
</template>

<script lang="ts">
export default {
    props: {
        "messageContent": String,
        "authorIsLocal": Boolean
    },
    data() {
        return {
            ready: false
        }
    },
    mounted() {
        this.ready = true;
    }
}
</script>

<style scoped>
.message {
    width: fit-content;
    max-width: 66%;
}
.messageLocalAuthor {
    align-self: end;
    text-align: right;
}
</style>