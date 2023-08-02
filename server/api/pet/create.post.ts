import { pet } from "../../mongo/models";
import {getToken} from "#auth"

export default defineEventHandler(async (event) => {
    //ensure user signed in
    const token = await getToken({event});

    if (token?.sub == undefined) {
        setResponseStatus(event, 401);
        return {status: 401, message: "Not logged in"};
    }

    const body = await readBody(event);

    //Validate body payload
    //requires: name, species, colour

    if (
        body.name != undefined && typeof(body.name) == "string" &&
        body.species != undefined && typeof(body.species) == "string" &&
        body.colour != undefined && typeof(body.colour) == "string"
    ) {
        try {
            //Create unique pet id
            //FIXME This formula should be good enough for now, but in reality it should probably hash the provided pet details plus the time
            //However, even if two pets get created at the exact same time, mongoose queueing should automatically reject all but one, given the other people 500 error returns
            //Then they can just submit again and have better luck next time.
            const PET_ID = "PET" + Date.now()

            await pet.create({
                Pet_UID: PET_ID,
                petOwnerID: token.sub,
                petDetails: {
                    name: body.name,
                    species: body.species,
                    colour: body.colour
                }
            })
            return { message: 'Pet created', Pet_ID: PET_ID }
        } catch (e) {
            setResponseStatus(event, 500);
            return {status: 500, message: "Internal server error. Pet not created"}
        }
    } else {
        setResponseStatus(event, 400);
        return {status: 400, message: "Invalid body payload"}
    }

});