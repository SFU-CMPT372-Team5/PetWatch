<template >
    <VList>
        <template v-for="detail in expectedPetDetails">
            <template v-if="editing">
                <VTextField 
                    density="compact" 
                    :label="detail.displayName" 
                    variant="solo"
                    v-model="curValues[detail.key]"
                />
            </template>
            <template v-else>
                <VListItem
                    :title="detail.displayName"
                    :subtitle="data != undefined && data[detail.key] ? data[detail.key] : 'Not Provided'"
                />
            </template>
        </template>
    </VList>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type PetModel from "~/types/models/pet"

export default {
    props: {
        data: Object as PropType<PetModel['petDetails']>,
        editing: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            expectedPetDetails: [
                {key: "name", displayName: "Name"},
                {key: "species", displayName: "Species"},
                {key: "breed", displayName: "Breed"},
                {key: "colour", displayName: "Colour"},
            ] as {
                key: keyof Omit<PetModel['petDetails'], 'additionalInfo'>, //For now to fix typings enforce that no additional info exists
                displayName: string
            }[],

            curValues: {
                name: "" as string|undefined,
                species: "" as string|undefined,
                breed: "" as string|undefined,
                colour: "" as string|undefined
            }
        }
    },
    watch: {
        editing(newVal, oldVal) {
            if (newVal && !oldVal) {
                this.curValues.breed = this.data?.breed;
                this.curValues.species = this.data?.species;
                this.curValues.name = this.data?.name;
                this.curValues.colour = this.data?.colour;
            }
        }
    }
}
</script>