<template>
    <VDialog :fullscreen="$vuetify.display.xs" v-model="dialog" :max-width="$vuetify.display.mdAndUp ? '50%': 'unset'">
        <template #activator="{props}">
            <VBtn v-bind="props" variant="elevated" color="blue-darken-2">Add new pet</VBtn>
        </template>
        <VCard>
            <VCardTitle class="text-center">Add new Pet</VCardTitle>
            <VCardText>
                <v-form validate-on="lazy" @submit.prevent="submitForm" ref="form">
                    <v-row>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="name" label="Name" :rules="nonEmptyRule"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="species" label="Species" :rules="nonEmptyRule"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="breed" label="Breed"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="colour" label="Colour" :rules="nonEmptyRule"></v-text-field>
                        </v-col>
                    </v-row>
                    <br/>
                    <p class="text-center"><VIcon>mdi-information-outline</VIcon>You will be able to upload a picture and mark your pet as lost after adding it</p><br/>
                    <!-- <v-select v-model="lostStatus" :items="options" label="Is the pet Lost"></v-select> -->
                    <v-btn color="grey-darken-2" class="mr-2" @click="dialog=false">Cancel</v-btn>
                    <v-btn type="submit" :color="submitError ? 'error' : 'success'" :loading="submitting">Add</v-btn>
                </v-form>
            </VCardText>
        </VCard>
    </VDialog>
</template>

<script lang="ts">
export default {

  data() {
    return {
        dialog: false,
        submitting: false,
        submitError: false,

        name: '',
        species: '',
        colour: '',
        breed: '',

        nonEmptyRule: [
            (s: string|undefined) => s != undefined && s.length > 0 || "Cannot be empty!"
        ]
    };
  },

  methods: {
    async submitForm() {
        //validate
        const {valid} = await (this.$refs.form as any).validate();

        if (!valid) return;
        this.submitting = true;

        //post new pet, server will assign and return assigned petID
        try {
            const newPetRes = await $fetch("/api/pet/create", {
                method: 'POST',
                body: {
                    name: this.name,
                    species: this.species,
                    colour: this.colour,
                    breed: this.breed.length > 0 ? this.breed : undefined
                }
            });

            
            setTimeout(() => { //looks nicer with delay
                this.submitError = false;
                this.submitting = false;
                
                if ("Pet_ID" in newPetRes) {
                    //navigate
                    this.$router.push(`/pets/${newPetRes.Pet_ID}`)
                }
            }, 300)
        } catch(e) {
            this.submitError = true;
            this.submitting = false;
            alert("New pet could not be created. Please try again");
        }
    }
}
};
</script>