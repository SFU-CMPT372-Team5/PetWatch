<template>
    <VCard>
        <VCardTitle>
            Chat with: {{ chatID }}
        </VCardTitle>
        <VCardText>Laura: This is a message</VCardText>
        <VCardActions style="justify-content: center;">
            <VBtn color="pink-accent-1" variant="elevated">Open Chat</VBtn>
        </VCardActions>
    </VCard>
</template>

<script lang="ts">
export default {
    props: {
        chatID: {
            type: String,
            required: true
        }
    }
}
</script>