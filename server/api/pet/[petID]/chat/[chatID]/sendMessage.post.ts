import { getToken } from "#auth";
import { message, chat } from "../../../../../mongo/models";

export default defineEventHandler(async (event) => {
  const token = await getToken({ event }); //The { } are important!

  const body = await readBody(event);

  if (
    body.text == undefined ||
    typeof body.text != "string" ||
    body.text.length == 0
  ) {
    setResponseStatus(event, 400);
    return { status: 400, message: "Invalid Text" };
  }

  // Check if the user is logged in.
  if (token?.sub != undefined) {
    // Find the chat entry that matches the provided 'chatID'.
    const hostChat = await chat.findOne({
      Chat_UID: event.context.params.chatID,
    });

    // If the chat entry is found, create and save the message with the provided text and other details.
    if (hostChat != undefined) {
      const sentMessage = await message.create({
        Chat_UID: event.context.params.chatID,
        text: body.text,
        timeSent: Date.now(),
        isOwnerMessage: hostChat.ownerID == token.sub,
      });

      // If the message is not created successfully, set the response status to 500 (Internal Server Error).
      if (sentMessage == undefined) {
        setResponseStatus(event, 500);

        // Return an object with a 'status' property set to 500 to indicate the server error.
        return { status: 500 };
      } else {
        // Return the created message.
        return sentMessage;
      }
    } else {
      setResponseStatus(event, 404);

      // Return an object with a 'status' property set to 404 to indicate the chat entry is not found.
      return { status: 404 };
    }
  }

  // If the user is not logged in, set the response status to 401 (Unauthorized).
  setResponseStatus(event, 401);

  // Return an object with a 'status' property set to 401 to indicate the unauthorized status.
  return { status: 401 };
});
