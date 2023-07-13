<template>
    <VList>
        <template v-for="detail in expectedPetDetails">
            <VListItem v-if="data?.contactDetails[detail.key] != undefined"
                :title="detail.displayName"
                :subtitle="data?.contactDetails[detail.key] as string"
            />
        </template>
    </VList>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type PetModel from "~/types/models/pet"

export default {
    props: {
        data: Object as PropType<PetModel>
    },
    data() {
        return {
            expectedPetDetails: [
                {key: "name", displayName: "Owner's Name"},
                {key: "address", displayName: "Address"},
                {key: "phone", displayName: "Phone Number"},
            ] as {
                key: keyof PetModel['contactDetails'],
                displayName: string
            }[]
        }
    }
}
</script>