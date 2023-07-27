<template>
    <VForm v-if="editing" ref="form" validate-on="lazy">
        <VTextField v-for="detail in expectedPetDetails"
            density="compact" 
            :label="detail.displayName" 
            variant="solo"
            v-model="curValues[detail.key]"
        />
    </VForm>
    <VList v-else>
        <VListItem v-for="detail in expectedPetDetails"
            :title="detail.displayName"
            :subtitle="data != undefined && data[detail.key] ? data[detail.key] : 'Not Provided'"
        />
    </VList>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { type VForm } from 'vuetify/lib/components/index.mjs';
import type PetModel from "~/types/models/pet"

export default {
    props: {
        data: Object as PropType<PetModel['petDetails']>,
        editing: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        async validate() {
            const validRes = await (this.$refs.form as VForm).validate();

            return validRes.valid;
        }
    },
    data() {
        return {
            rules: [
                (s: any) => s && s.length > 0 || "Field must not be empty"
            ],
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