<template>
    <component :is="authorIsLocal ? 'VSlideXReverseTransition' : 'VSlideXTransition'">
        <VRow no-gutters v-if="ready">
            <VCol cols="9" :offset="authorIsLocal ? 3 : 0" 
                style="display: flex;" :style="authorIsLocal ? 'justify-content: end' : ''"
            >
                <VCard :class="authorIsLocal ? 'messageLocalAuthor' : 'messageRemoteAuthor'" class="message"
                    :color="authorIsLocal ? 'teal' : ''"
                >
                    {{ messageContent }}
                </VCard>
            </VCol>
        </VRow>
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
    display: flex;
    margin-bottom: 3px;
    padding-right: 9px;
    padding-left: 9px;

}
.messageLocalAuthor {
    justify-content: end;
    text-align: right;
}
</style>