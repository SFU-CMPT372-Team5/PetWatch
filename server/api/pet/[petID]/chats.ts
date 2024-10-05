import { getToken } from "#auth";
import { chat } from "../../../mongo/models";

export default defineEventHandler(async (event) => {
  const token = await getToken({ event }); //The { } are important!

  // Check if the user is logged in.
  if (token?.sub != undefined) {
    // Find all chat entries that match the provided 'petID' and where the user is the owner.
    const chats = await chat.find(
      {
        ownerID: token.sub,
        petID: event.context.params?.petID,
      },
      { _id: 0 }
    );

    // Return the list of chats associated with the specified pet.
    return chats;
  }

  // If the user is not logged in, set the response status to 401 (Unauthorized).
  setResponseStatus(event, 401);

  // Return an object with a 'status' property set to 401 to indicate the unauthorized status.
  return { status: 401 };
});
