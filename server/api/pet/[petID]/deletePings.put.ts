import { getToken } from "#auth";
import { pet } from "../../../mongo/models";

export default defineEventHandler(async (event) => {
    const token = await getToken({ event });

    if (token?.sub == undefined) {
        setResponseStatus(event, 401);
        return { status: 401, body: { error: "Unauthorized" } };
    }

    if (event.context.params && event.context.params.petID) {
        const id = event.context.params.petID;

        try {
            const deletedPet = await pet.findOneAndUpdate({ Pet_UID: id }, {
                missingDetails: null
            });

            if (deletedPet) {
                return { status: 200, message: "Pings deleted successfully" };
            } else {
                return { status: 404, message: "Pet not found" };
            }
        } catch (error) {
            setResponseStatus(event, 500);
            return { status: 500, body: { error: "Server error" } };
        }
    } else {
        return { status: 500, body: { error: "Missing Pet ID In Parameters" } };
    }
});