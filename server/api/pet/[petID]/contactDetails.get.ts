import { user, pet } from "../../../mongo/models"

export default defineEventHandler(async (event) => {
    const petRes = await pet.findOne({"Pet_UID": event.context.params.petID});
    const userRes = await user.findOne({"User_UID": petRes?.petOwnerID})
    if (userRes != null) {
        return userRes.userDetails
    } else {
        setResponseStatus(event, 404);
        return {status: 404}
    }
})