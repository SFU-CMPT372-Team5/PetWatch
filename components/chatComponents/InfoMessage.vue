<template>
    <VCard 
        class="infoMessage"
        color="orange-accent-3"
        variant="elevated"
    >
        <VCardText>Warning: This user isn't logged in to a PetWatch account.<br>Be careful sharing private information. Message history will not be saved.</VCardText>
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
    top: 3px;
    z-index: 1;
}
</style>