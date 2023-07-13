<template>
    <VList>
        <template v-for="detail in expectedPetDetails">
            <VListItem v-if="data?.petDetails[detail.key] != undefined"
                :title="detail.displayName"
                :subtitle="data?.petDetails[detail.key] as string"
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
                {key: "name", displayName: "Name"},
                {key: "species", displayName: "Species"},
                {key: "breed", displayName: "Breed"},
                {key: "colour", displayName: "Colour"},
            ] as {
                key: keyof PetModel['petDetails'],
                displayName: string
            }[]
        }
    }
}
</script>