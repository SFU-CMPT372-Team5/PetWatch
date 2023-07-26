// No authentication required, just need a valid pet ID
// FIXME, is this the best-idea??


import {getManagerInstance} from "~/server/utils/cloudStorage"

export default defineEventHandler(async e => {
    const potentialUrl = await getManagerInstance().getPetImageUrl(e.context.params.petID);

    console.log(potentialUrl)
    if (potentialUrl != undefined) return potentialUrl;


    setResponseStatus(e, 404);
    return {
        status: 404,
        message: "pet not found/no image available"
    }
})