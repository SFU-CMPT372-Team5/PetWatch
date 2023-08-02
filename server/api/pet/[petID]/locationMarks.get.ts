import { getToken } from '#auth'
import { pet } from '../../../mongo/models';

export default defineEventHandler(async (event) => {
    const token = await getToken({event}); //The { } are important!

    if (token?.sub == undefined) {
        setResponseStatus(event, 401)
        return {status: 401};
    }

    if (token?.sub != undefined) {
        try {
            const petRes = await pet.findOne({
                "Pet_UID": event.context.params.petID,
                "petOwnerID": token.sub,
                "isMissing": true
            }, {"_id": 0, "missingDetails": 1})
    
            if (petRes == undefined) throw Error();

            return petRes.missingDetails?.lastSeen;
        } catch(e) {}
    }

    setResponseStatus(event, 404)
    return {status: 404};
})