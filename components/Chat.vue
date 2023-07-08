<template>
    <!-- https://vuetifyjs.com/en/components/sheets/ I normally just follow examples to see how to use these -->
    
    <VSheet rounded>
        <!-- Fluid means "fill parent div horizontally as best as possible with snapping to only select dimensions" -->
        <VContainer fluid>
            <!-- Chat feed -->
            <VSheet height="50vh" color="grey-lighten-2" rounded style="overflow-y: auto;">
                <VContainer fluid class="chatContainer" ref="chatContainer">
                    <InfoMessage/>

                    <ChatMessage v-for="message in messages"
                        :message-content="message.text" 
                        :author-is-local="message.fromLocalAuthor"
                    /> <!-- The ':' in :message-content means "the following text is code, probably referencing a variable" -->
                </VContainer>
            </VSheet>

            <!-- Chat box -->
            <VTextField 
                placeholder="Send Message"
                single-line
                v-model="textBoxData"
                @keydown.enter="submitTextBox"
            >
                <!-- v-model is how text entered in the text box is added to a variable in the data object below -->

                <template v-slot:append-inner>
                    <VFadeTransition>
                        <VIcon 
                            color="green-accent-4" 
                            v-if="textBoxData.length > 0" 
                            @click="submitTextBox"
                        >mdi-send</VIcon>
                    </VFadeTransition>
                </template>
            </VTextField>
        </VContainer>
    </VSheet>
</template>

<script lang="ts">
import ChatMessage from "./chatComponents/ChatMessage.vue";
import InfoMessage from "./chatComponents/InfoMessage.vue";
import TimeMessage from "./chatComponents/TimeMessage.vue";
import {TextMessagePayload} from "~/types/chat/messageTypes";

export default {
    components: {ChatMessage, InfoMessage, TimeMessage},
    data() {
        return {
            messages: [
                {text: "Hi", fromLocalAuthor: false, timestamp: new Date(Date.now())},
                {text: "Hey", fromLocalAuthor: false, timestamp: new Date(Date.now())},
                // {text: "Yo", fromLocalAuthor: false, timestamp: new Date(Date.now())},
                // {text: "Sup", fromLocalAuthor: false, timestamp: new Date(Date.now())},
            ] as TextMessagePayload[],
            textBoxData: ""
        }
    },
    methods: {
        submitTextBox() {
            if (this.textBoxData.length <= 0) return;
            this.postMessage({
                text: this.textBoxData,
                fromLocalAuthor: true,
                timestamp: new Date(Date.now())
            });
            this.textBoxData = "";
        },

        postMessage(messagePayload: TextMessagePayload) {
            this.messages.push(messagePayload);
            this.$refs.chatContainer?.$el.scroll(0, -10000)

        }
    },
    mounted() {
        //Temporary to simulate incoming messages
        setInterval(() => {
            this.postMessage({text: "Ping", fromLocalAuthor: false, timestamp: new Date(Date.now())});
        }, 5000)
    }
}
</script>

<style lang="css" scoped>
.chatContainer {
    display: flex;
    min-height: 100% !important;
    flex-direction: column;
    
    justify-content: end;
    align-content: end;
}
</style>