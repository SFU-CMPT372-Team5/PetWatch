import {pet} from "../../mongo/models"
import { getToken } from '#auth'

export default defineEventHandler(async (event) => {
    const token = await getToken({event}); //The { } are important!

    // Check if the user is logged in.
    if (token?.sub != undefined) {
        // If the user is logged in, find a 'pet' that matches the given 'Pet_UID' and 'petOwnerID'.
        const petRes = await pet.findOne({
            "Pet_UID": event.context.params?.petID,
            "petOwnerID": token.sub
        }, { "_id": 0 });

        // If a matching 'pet' is found, return it.
        if (petRes) return petRes;

        // If no matching 'pet' is found, set the response status to 404 (Not Found).
        setResponseStatus(event, 404);

        // Return an object with a 'status' property set to 404 to indicate the resource is not found.
        return { status: 404 };
    }

    // If the user is not logged in (no token or 'sub' property), set the response status to 401 (Unauthorized).
    setResponseStatus(event, 401);
    return { status: 401 };
});




