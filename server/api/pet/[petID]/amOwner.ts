import { pet } from "../../../mongo/models";
import { getToken } from "#auth";

export default defineEventHandler(async (event) => {
  const token = await getToken({ event }); //The { } are important!

  // Check if the user is logged in.
  if (token?.sub != undefined) {
    // Find a pet entry that matches the provided 'petID' and where the user is the owner
    const petRes = await pet.findOne({
      Pet_UID: event.context.params?.petID,
      petOwnerID: token.sub,
    });

    // If a pet entry is found, the user is the owner of the pet.
    if (petRes != null) {
      setResponseStatus(event, 200);

      // Return an object with a 'owner' property set to true to indicate that the user is the owner of the pet.
      return { owner: true };
    }
  }
  // If the user is not logged in (no token or 'sub' property) or the pet is not found or the user is not the owner,
  // set the response status to 200 (OK) and return an object with a 'owner' property set to false.
  // In other words, if the user is a finder
  setResponseStatus(event, 200);
  return { owner: false };
});
