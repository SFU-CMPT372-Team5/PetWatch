import { pet } from "../../../mongo/models";

export default defineEventHandler(async (event) => {
    const pId = event.context.params?.petID
    const body = await readBody(event)
    if (pId == undefined) {
        console.log("pid undef");
        setResponseStatus(event, 400);
        return { status: 400, body: { error: "Bad Request" } };
    }

    //Validate body
    if (
        (typeof(body.location?.lat) != "number" || typeof(body.location?.lng) != "number")
    ) {
        console.error("Location body illegal")
        setResponseStatus(event, 400);
        return { status: 400, body: { error: "Bad Request" } };
    }
    try {
        const locatedPet = await pet.findOneAndUpdate(
            { 
                Pet_UID: pId,
                isMissing: { "$eq" : true }
            },
            {
                    $push: { 'missingDetails.lastSeen': {
                        location: body.location,
                        time: Date.now()
                    }}
            },
            { new: true}
        )
        if (locatedPet) {
            console.log("pet located!");
            setResponseStatus(event, 200);
            return { status: 200, body: locatedPet, message: "Pet located successfully" };
        } else {
            setResponseStatus(event, 404);
            console.log("pet NOT located!");
            return { status: 404, body: { error: "Pet not found" } };
        }
    } catch (error) {
        console.error("Error updating pet:", error);
        setResponseStatus(event, 500);
        return { status: 500, body: { error: "Server error" } };
    }
});