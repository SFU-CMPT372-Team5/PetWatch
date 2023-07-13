import {pet} from "../../../mongo/models"

export default defineEventHandler(async (event) => {
    const petRes = await pet.findOne({
        "Pet_UID": event.context.params.petID,
    }, {
        "_id": 1,
        "petDetails.name": 1,
        "isMissing": 1
    });

    if (petRes != null) {
        if (petRes.isMissing) {
            //Return more data
            const missingPetRes = await pet.findById(petRes._id, {
                "_id": 0,
                "chats": 0
            })

            if (missingPetRes == undefined) {
                setResponseStatus(event, 500);
                return {status: 500};
            } else {
                return missingPetRes;
            }
        } else {
            delete petRes["_id"];

            return petRes;
        } 
    }

    setResponseStatus(event, 404);
    return {status: 404};
})    