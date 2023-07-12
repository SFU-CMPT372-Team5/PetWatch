//Returns a list of full pet objects associated with this account
import {pet} from "../../mongo/models"
import { getToken } from '#auth'

export default defineEventHandler(async (event) => {
    const token = await getToken({event}); //The { } are important!

    if (token?.sub != undefined) {
        const petRes = await pet.find({
            petOwnerID: token.sub
        }, {"_id": 0})

        return petRes

    } else {
        setResponseStatus(event, 401);
        return {status: 401}
    }
})