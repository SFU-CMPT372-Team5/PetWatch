<template>
    <!-- https://vuetifyjs.com/en/components/sheets/ I normally just follow examples to see how to use these -->
    
    <VSheet rounded>
        <!-- Fluid means "fill parent div horizontally as best as possible with snapping to only select dimensions" -->
        <VContainer fluid>
            <!-- Chat feed -->
            <VSheet height="50vh" color="grey-lighten-2" rounded style="overflow-y: scroll;">
                <VContainer fluid style="max-height: min-content;">
                    <Message v-for="message in messages" 
                        :message-content="message.text" 
                        :author-is-local="message.fromUs"
                    /> <!-- The : in :message-content means "run as javascript" -->
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
import Message from "./ChatAssets/Message.vue"
export default {
    components: {Message},
    data() {
        return {
            messages: [
                {text: "Hi", fromUs: false},
                {text: "Hey", fromUs: false},
                {text: "Yo", fromUs: false},
                {text: "Sup", fromUs: false},
            ],
            textBoxData: ""
        }
    },
    methods: {
        submitTextBox() {
            if (this.textBoxData.length <= 0) return;
            this.messages.push({
                text: this.textBoxData,
                fromUs: true
            });
            this.textBoxData = "";
        }
    },
    mounted() {
        return;
        //Temporary to simulate incoming messages
        setInterval(() => {
            this.messages.push({text: "Ping", fromUs: false});
        }, 3000)
    }
}
</script>