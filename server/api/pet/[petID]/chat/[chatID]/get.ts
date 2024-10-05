import { getToken } from "#auth";
import { chat } from "../../../../../mongo/models";

export default defineEventHandler(async (event) => {
  const token = await getToken({ event }); //The { } are important!

  // Check if the user is logged in.
  if (token?.sub != undefined) {
    // Find a chat entry that matches the provided 'chatID' and where the user is either the owner or the stranger.
    const chatHost = await chat.findOne({
      Chat_UID: event.context.params?.chatID,
      $or: [{ ownerID: token.sub }, { strangerID: token.sub }],
    });

    // If no matching chat entry is found, set the response status to 404 (Not Found).
    if (chatHost == undefined) {
      setResponseStatus(event, 404);

      // Return an object with a 'status' property set to 404 to indicate the resource is not found.
      return { status: 404 };
    }

    // Return the found chat entry.
    return chatHost;
  }

  // If the user is not logged in (no token or 'sub' property), set the response status to 401 (Unauthorized).
  setResponseStatus(event, 401);

  // Return an object with a 'status' property set to 401 to indicate the unauthorized status.
  return { status: 401 };
});
