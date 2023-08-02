import { pet } from "../../../mongo/models";
import { getToken } from '#auth'

export default defineEventHandler(async (event) => {
    const pId = event.context.params?.petID
    const body = await readBody(event)
    if (pId == undefined) {
        console.log("pid undef");
        setResponseStatus(event, 400);
        return { status: 400, body: { error: "Bad Request" } };
    }
    try {
        const token = await getToken({event})
        const missingPet = await pet.findOneAndUpdate(
            { 
                Pet_UID: pId,
                petOwnerID: { "$eq" : token?.sub}

            },
            {
                    'missingDetails.lastSeenByOwner': {
                        location: body.location,
                        time: body.time
                    }
            },
            { new: true}
        )
        if (missingPet) {
            setResponseStatus(event, 200);
            return { status: 200, body: missingPet, message: "Pet location changed successfully" };
        } else {
            setResponseStatus(event, 404);
            return { status: 404, body: { error: "Pet not found" } };
        }
    } catch (error) {
        console.error("Error updating pet:", error);
        setResponseStatus(event, 500);
        return { status: 500, body: { error: "Server error" } };
    }
});