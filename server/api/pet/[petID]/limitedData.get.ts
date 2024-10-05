import { pet } from "../../../mongo/models";

export default defineEventHandler(async (event) => {
  // Find a pet entry that matches the provided 'Pet_UID' (pet ID) and retrieve specific fields.
  if (event.context.params?.petID !== undefined) {
    const petRes = await pet.findOne(
      {
        Pet_UID: event.context.params?.petID,
      },
      {
        _id: 1,
        "petDetails.name": 1,
        isMissing: 1,
        imageURL: 1,
      }
    );
  
    // If a pet entry is found, continue processing
    if (petRes != null) {
      // Check if the pet is marked as missing
      if (petRes.isMissing) {
        // If the pet is missing, return more data (excluding 'chats' field) for missing pets.
        const missingPetRes = await pet.findById(petRes._id, {
          _id: 0,
          chats: 0,
        });
  
        // If the additional data for missing pets is found, return it.
        if (missingPetRes != undefined) {
          return missingPetRes;
        } else {
          // If there is an error while retrieving additional data for missing pets, return 500 (Internal Server Error) status.
          setResponseStatus(event, 500);
          return { status: 500 };
        }
      } else {
        // If the pet is not missing, return the pet details.
        delete (petRes as any)['_id']
        return petRes;
      }
    }
  }

  // If the pet entry is not found, return 404 (Not Found) status.
  setResponseStatus(event, 404);
  return { status: 404 };
});
