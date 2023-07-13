import {pet} from "../../../mongo/models"
import { getToken } from '#auth'

export default defineEventHandler(async (event) => {
    const token = await getToken({event}); //The { } are important!

    if (token?.sub != undefined) {
        const petRes = await pet.findOne({
            "Pet_UID": event.context.params.petID,
            "petOwnerID": token.sub
        })
        
        if (petRes != null) {
            setResponseStatus(event, 200);
            return {owner: true}
        };
    }

    setResponseStatus(event, 200);
    return {owner: false};
})