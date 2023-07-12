import {pet} from "../../mongo/models"
import { getToken } from '#auth'

export default defineEventHandler(async (event) => {
    const token = await getToken({event}); //The { } are important!

    if (token?.sub != undefined) {
        const petRes = pet.findOne({
            "Pet_UID": event.context.params.petID,
            "petOwnerID": token.sub
        }, {"_id": 0});

        if (petRes != null) return petRes;

        setResponseStatus(event, 404);
        return {status: 404};
    }

    setResponseStatus(event, 401);
    return {status: 401};
})    