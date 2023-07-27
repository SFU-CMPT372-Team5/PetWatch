<template>
    <VList>
        <template v-if="data != undefined" v-for="detail in expectedPetDetails">
            <VListItem v-if="data[detail.key] != undefined"
                :title="detail.displayName"
                :subtitle="(data[detail.key] as string)"
            />
        </template>
    </VList>
</template>

<script lang="ts">
export default {
    props: {
        data: Object
    },
    data() {
        return {
            expectedPetDetails: [
                {key: "name", displayName: "Owner's Name"},
                {key: "address", displayName: "Address"},
                {key: "phone", displayName: "Phone Number"},
            ]
        }
    }
}
</script>