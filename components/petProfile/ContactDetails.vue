<template>
    <VList>
        <template v-for="detail in expectedContactDetails">
            <VListItem
                :title="detail.displayName"
                :subtitle="data?.userDetails[detail.key] as string ?? 'Not Provided'"
            />
        </template>
    </VList>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type UserModel from "~/types/models/user"

export default {
    props: {
        data: Object as PropType<UserModel>
    },
    data() {
        return {
            expectedContactDetails: [
                {key: "name", displayName: "Owner's Name"},
                {key: "address", displayName: "Address"},
                {key: "phone", displayName: "Phone Number"},
            ] as {
                key: keyof UserModel['userDetails'],
                displayName: string
            }[]
        }
    }
}
</script>