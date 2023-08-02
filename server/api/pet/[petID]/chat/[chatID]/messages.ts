import { getToken } from "#auth";
import { message, chat } from "../../../../../mongo/models";

export default defineEventHandler(async (event) => {
  const token = await getToken({event}); //The { } are important!

  // Check if the user is logged in.
  if (token?.sub != undefined) {
      // Find a chat entry that matches the provided 'chatID' and where the user is either the owner or the stranger.
      const chatHost = await chat.findOne({
          "Chat_UID": event.context.params.chatID,
          $or: [
              {
                  ownerID: token.sub
              },
              {
                  strangerID: token.sub
              }
          ]
      })

      // If no matching chat entry is found or the user is not authorized with the chat host, set the response status to 401 (Unauthorized).
      if (chatHost == undefined) {
          setResponseStatus(event, 401)
          return {status: 401, message: "Failed to authorize with chat host"};
      }

      // Find all messages associated with the provided chat ID and sort them by the 'timeSent' property in ascending order (latest message last).
      const messages = await message.find({
          "chatID": event.context.params.chatID
      }, {"_id": 0}).sort({timeSent: 1})

      return messages
  }
  // If the user is not logged in, set the response status to 401 (Unauthorized).
  setResponseStatus(event, 401);
  return { status: 401, message: "You are not logged in" };
});
