<template>
    <component :is="authorIsLocal ? 'VSlideXReverseTransition' : 'VSlideXTransition'">
        <VCard v-if="ready"
            :class="authorIsLocal ? 'messageLocalAuthor' : 'messageRemoteAuthor'" 
            class="message"
            :color="authorIsLocal ? 'teal' : ''"
        >
        <!-- "ready" makes the animation pretty -->
        <VCardText>{{ messageContent }} {{ scrollAtBottom }}</VCardText>
        </VCard>
    </component>
</template>

<script lang="ts">
import { once } from 'events';

export default {
    props: {
        "messageContent": String,
        "authorIsLocal": Boolean,
    },
    data() {
        return {
            ready: false
        }
    },
    mounted() {
        this.ready = true;
    },
    watch: {
        ready(newVal, oldVal) {
            //TODO if you wanna make this funkier to this:
                //If user is current at bottom of chat (latest chats), then scroll on new message
            
                //Otherwise hard snap if local sent message
                //Otherwise do nothing (if not at bottom and remote sent message)

            this.$nextTick(() => { //Otherwise the element will still be a v-if placeholder in the DOM
                if (newVal && !oldVal && this.$el && this.$el.scrollIntoView) {
                    this.$el.scrollIntoView({behavior: 'smooth'})
                }
            })
        }
    }
}
</script>

<style scoped>
.message {
    width: fit-content;
    max-width: 66%;
}
.messageLocalAuthor {
    align-self: flex-end;
    text-align: right;
}
</style>