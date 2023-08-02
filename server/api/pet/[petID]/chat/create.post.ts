import { getToken } from "#auth";
import { chat, pet } from "../../../../mongo/models";

export default defineEventHandler(async (event) => {
  const token = await getToken({ event }); //The { } are important!

  // Check if the user is logged in.
  if (token?.sub != undefined) {
    // Find an existing chat entry that matches the provided 'petID' and where the user is the stranger.
    const existingChat = await chat.findOne({
      petID: event.context.params.petID,
      strangerID: token.sub,
    });

    // If an existing chat entry is found, return it.
    if (existingChat != null) {
      return existingChat;
    }

    // Find the pet owner associated with the provided 'petID'.
    const petOwner = await pet.findOne({
      Pet_UID: event.context.params.petID,
    });

    // If the pet owner is found and the pet is missing, create a new chat entry between the user and the pet owner.
    if (petOwner != undefined && petOwner.isMissing) {
      // Create a new chat entry with a unique Chat_UID based on the 'petID' and the user's token.
      const newChat = await chat.create({
        Chat_UID:
          `${event.context.params.petID}` + `${token.sub.replace("|", "")}`,
        petID: event.context.params.petID,
        strangerID: token.sub,
        ownerID: petOwner.petOwnerID,
      });

      // If the new chat is created successfully, return it.
      if (newChat != undefined) {
        return newChat;
      } else {
        setResponseStatus(event, 500);

        // Return an object with a 'status' property set to 500 to indicate the server error.
        return { status: 500 };
      }
    } else {
      setResponseStatus(event, 404);

      // Return an object with a 'status' property set to 404 to indicate the pet or owner is not found.
      return { status: 404 };
    }
  }

  // If the user is not logged in, set the response status to 401 (Unauthorized).
  setResponseStatus(event, 401);

  // Return an object with a 'status' property set to 401 to indicate the unauthorized status.
  return { status: 401 };
});
