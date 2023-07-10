<template>
    <div style="display: flex; width: 100%; max-height: 100%;" class="justify-center">
        <!-- justify-center is a class provided by vuetify -->

        <!-- Setting width only temp for development -->
        <Chat style="width: 50%; height: 100vh;"/>
    </div>
</template>
<script>
import Chat from '~/components/Chat.vue';
export default {
    components: {Chat}
}
</script>