<template>
    <VCard 
        class="infoMessage"
        color="red-lighten-3"
        density="compact"
    >
        <VCardText>Note: All chat messages are deleted when the pet is marked as found. <br>Please remember to not share confidential information</VCardText>
    </VCard>
</template>

<style scoped>
/* Scoped means "only apply css to this file" */
.infoMessage {
    margin-left: auto;
    margin-right: auto;
    width: 90%;
    text-align: center;
    margin-bottom: auto;
    position: sticky;
    top: 0px;
    z-index: 1;
}
</style>