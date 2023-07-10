<template>
    <!-- https://vuetifyjs.com/en/components/sheets/ I normally just follow examples to see how to use these -->
    
    <VSheet rounded height="100%">
        <!-- Fluid means "fill parent div horizontally as best as possible with snapping to only select dimensions" -->
        <VContainer fluid style="display: flex; flex-direction: column; height: 100%;">
            <!-- Chat feed -->
            <VSheet color="grey-lighten-2" rounded style="overflow-y: auto; flex-grow: 1; height: 100%;">
                <VContainer fluid class="chatContainer" ref="chatContainer">
                    <InfoMessage/>

                    <template v-for="(message, index) in messages">
                        <!-- Assume messages are in chronological order -->
                        <TimeMessage v-if="timeDiffSignificant(message.timestamp, messages[index-1]?.timestamp ?? 0)"
                            :timestamp="message.timestamp"
                        />

                        <ChatMessage
                            :message-content="message.text" 
                            :author-is-local="message.fromLocalAuthor"
                        /> <!-- The ':' in :message-content means "the following text is code, probably referencing a variable" -->
                    </template>

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

const SIGNIFICANT_TIME_DIFFERENCE = 1000 * 60 * 30 //30 minutes;

export default {
    components: {ChatMessage, InfoMessage, TimeMessage},
    data() {
        return {
            messages: [
                {text: "Hi", fromLocalAuthor: false, timestamp: Date.now() - (1000 * 60 * 60 * 108)},
                {text: "Hi", fromLocalAuthor: false, timestamp: Date.now() - (1000 * 60 * 60 * 48)},
                {text: "Hi", fromLocalAuthor: false, timestamp: Date.now() - (1000 * 60 * 60 * 24)},
                {text: "Hey", fromLocalAuthor: false, timestamp: Date.now()},
                // {text: "Yo", fromLocalAuthor: false, timestamp: Date.now()},
                // {text: "Sup", fromLocalAuthor: false, timestamp: Date.now()},
            ] as TextMessagePayload[],
            textBoxData: "",
        }
    },
    methods: {
        submitTextBox() {
            if (this.textBoxData.length <= 0) return;
            this.postMessage({
                text: this.textBoxData,
                fromLocalAuthor: true,
                timestamp: Date.now()
            });
            this.textBoxData = "";
        },

        postMessage(messagePayload: TextMessagePayload) {
            this.messages.push(messagePayload);
        },

        /**
         * 
         * @param timeA Time such that timeA >= timeB
         * @param timeB 
         * @returns True if timeA >= timeB + Significant diff constant
         */
        timeDiffSignificant(timeA: number, timeB: number) {
            return timeA >= timeB + SIGNIFICANT_TIME_DIFFERENCE
        }
    },
    mounted() {
        //Temporary to simulate incoming messages
        setInterval(() => {
            this.postMessage({text: "Ping", fromLocalAuthor: false, timestamp: Date.now()});
        }, 60000)
    }
}
</script>

<style lang="css" scoped>
.chatContainer {
    display: flex;
    min-height: 100% !important;
    flex-direction: column;
    
    justify-content: flex-end;
    align-content: flex-end;
}
</style>