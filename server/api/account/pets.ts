//Returns a list of full pet objects associated with this account
import {pet} from "../../mongo/models"
import { getToken } from '#auth'

export default defineEventHandler(async (event) => {
    const token = await getToken({event}); //The { } are important!

    if (token?.sub != undefined) {
        // If the user is logged in, find all pets associated with the user
        const petRes = await pet.find({
            petOwnerID: token.sub
        }, { "_id": 0 });
        return petRes;
    } else {
        // If the user is not logged in, set the response status to 401 (Unauthorized).
        setResponseStatus(event, 401);
        return { status: 401 };
    }
});