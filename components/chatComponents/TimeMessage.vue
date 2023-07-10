<template>
    <div class="timeMessage"><i>{{ timeString }}</i></div>
</template>

<script lang="ts">
import {DateTime} from "luxon"

function capitalizeFirstLetter(string: string|null) {
    if (!string) return "";
    //https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default {
    props: {
        timestamp: Number //In form Date.now() (millisecond unix time)
    },
    computed: {
        timeString() {
            if (!this.timestamp) return;
            const dt = DateTime.fromMillis(this.timestamp)

            const diffDays = Math.abs(dt.diffNow(["days"]).days)

            if (diffDays < 2) {
                return `${capitalizeFirstLetter(dt.toRelativeCalendar())} at ${dt.toFormat("h:mm a")}`
            } else if (diffDays < 4) {
                return dt.toFormat("EEEE h:mm a")
            } else {
                return dt.toFormat("DDD 'at' h:mm a")
            }
            
        }
    }
}
</script>

<style scoped>
.timeMessage {
    text-align: center;
    margin-top: 10px;
    margin-bottom: 5px;
    opacity: 60%;
    cursor: default;
}
</style>