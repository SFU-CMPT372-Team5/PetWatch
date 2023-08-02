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
        // Find a missing pet with the given ID and update its 'missingDetails.lastSeen' array with the new location and time.
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
        // If the pet is found and its last seen details are updated, return 200 (OK) status and the updated pet details.
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
        // If there is an error while updating the pet, return 500 (Internal Server Error) status.
        console.error("Error updating pet:", error);
        setResponseStatus(event, 500);
        return { status: 500, body: { error: "Server error" } };
    }
});
