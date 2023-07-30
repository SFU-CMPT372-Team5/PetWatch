<template>
    <VImg  :src="imageUrl" :lazy-src="DEFAULT_IMAGE" cover>
        <template #placeholder>
            <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
            </div>
        </template>
        <VFadeTransition>
            <VBtn v-if="editing" 
                @click="triggerImageUpload" 
                text="Upload Image" 

                :disabled="disabled"
                :loading="uploadInProgress" 

                location="center" 
                prepend-icon="mdi-upload" 
                color="green-darken-1"
            />
        </VFadeTransition>
        <input ref="imgUploader" class="d-none" type="file" @change="handleImageChange" accept="image/*" />
    </VImg>
</template>

<script lang="ts">
import { LimitedPetModel } from "~/types/models/pet";
import {type PropType} from "vue"

const DEFAULT_IMAGE = "/images/paw.jpg"

export default {
    props: {
        petData: Object as PropType<LimitedPetModel>, //Only needs the image url
        editing: {
            type: Boolean,
            default: false
        },
        disabled: {
            default: true,
            type: Boolean
        }
    },
    data() {
        return {
            DEFAULT_IMAGE: DEFAULT_IMAGE,

            uploadInProgress: false,

            uploadedImageData: undefined as undefined|File,
            inEditUrl: undefined as string|undefined
        }
    },
    computed: {
        imageUrl() {
            if (this.editing) {
                if (this.uploadedImageData != undefined) {
                    if (this.inEditUrl != undefined) return this.inEditUrl;

                    this.inEditUrl = URL.createObjectURL(this.uploadedImageData)

                    return this.inEditUrl;
                }
            }

            if (this.petData?.imageURL != undefined && this.petData?.imageURL?.length > 0) {
                return this.petData.imageURL;
            }

            return DEFAULT_IMAGE;
        },
    },
    methods: {
        newImagePending() {
            return this.uploadedImageData != undefined;
        },
        triggerImageUpload() {
            this.uploadInProgress = true;

            window.addEventListener('focus', () => {
                this.uploadInProgress = false
            }, { once: true });

            (this.$refs.imgUploader as HTMLElement)?.click();
        },

        handleImageChange(event: Event) {
            if ((event.target as HTMLInputElement)?.files && (event.target as HTMLInputElement).files!.length > 0) {
                this.uploadedImageData = (event.target as HTMLInputElement).files![0];
                this.inEditUrl = URL.createObjectURL(this.uploadedImageData);
            }
        },
    },
    watch: {
        editing(newVal, oldVal) {
            if (newVal && !oldVal) {
                this.inEditUrl = undefined;
                this.uploadedImageData = undefined;
            }
        } 
    }
}
</script>