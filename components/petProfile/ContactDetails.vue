<template>
    <VForm v-if="editing" ref="form" validate-on="lazy">
        <VTextField v-for="detail in expectedContactDetails"
            density="compact" 
            :label="detail.displayName" 
            variant="solo"
            v-model="curValues[detail.key]"
            :disabled="isNonEditableField(detail.key)"
            :rules="detail.ruleset"
        >
        </VTextField>
    </VForm>
    <VList v-else>
        <VListItem v-for="detail in expectedContactDetails"
            :title="detail.displayName"
            :subtitle="data != undefined && data[detail.key] ? data[detail.key] : 'Not Provided'"
        />
    </VList>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type UserModel from "~/types/models/user"
import { type VForm } from 'vuetify/lib/components/index.mjs';

const FORM_RULES = {
    nonEmpty: [
        (value: String) => {
            if (value && value.length > 0) return true
            return 'Please enter a value'
        },
    ],
    email: [
        (value: string) => {
            //https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
            if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)) return true
            return 'Must be a valid e-mail.'
        }
    ],
    phone: [
        (value: string) => {
            if (!value || (value?.length > 9 && /[0-9-]+/.test(value))) return true
            return 'Phone number invalid.'
        }
    ]
}

export default {
    props: {
        data: Object as PropType<UserModel['userDetails']>,
        editing: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        isNonEditableField(fieldName: string) {
            //Some fields (like email) can't be edited because they are tied to the auth0 account
            switch (fieldName) {
                case "email":
                //Add others here
                    return true;
                default:
                    return false;
            }
        },
        async validate() {
            const validRes = await (this.$refs.form as VForm).validate()

            return validRes.valid;
        }
    },
    data() {
        return {
            expectedContactDetails: [
                {key: "name", displayName: "Owner's Name", ruleset: FORM_RULES.nonEmpty},
                {key: "email", displayName: "Email", ruleset: FORM_RULES.email},
                {key: "address", displayName: "Address", ruleset: []},
                {key: "phone", displayName: "Phone Number", ruleset: FORM_RULES.phone},
            ] as {
                key: keyof Omit<UserModel['userDetails'], "additionalInfo">,
                displayName: string,
                ruleset: any[] //FIXME should be vuetify's ValidationRule type, but I don't know where those typings are located
            }[],

            curValues: {
                name: "" as string|undefined,
                email: "" as string|undefined,
                address: "" as string|undefined,
                phone: "" as string|undefined
            }
        }
    },
    watch: {
        editing(newVal, oldVal) {
            if (newVal && !oldVal) {
                this.curValues.name = this.data?.name;
                this.curValues.email = this.data?.email;
                this.curValues.address = this.data?.address;
                this.curValues.phone = this.data?.phone;
            }
        }
    }
}
</script>