import {pet} from "../../../mongo/models"
import { getToken } from '#auth'

//Returns 200 if requester is pet owner, 401 otherwise
export default defineEventHandler(async (event) => {
    const token = await getToken({event}); //The { } are important!

    if (token?.sub != undefined) {
        const petRes = await pet.findOne({
            "Pet_UID": event.context.params.petID,
            "petOwnerID": token.sub
        })
        
        if (petRes != null) {
            setResponseStatus(event, 200);
            return {status: 200}
        };
    }

    setResponseStatus(event, 401);
    return {status: 401};
})