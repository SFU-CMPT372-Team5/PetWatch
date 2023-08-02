import { getToken } from '#auth'
import { chat } from '../../mongo/models';

export default defineEventHandler(async (event) => {
    const token = await getToken({event}); //The { } are important!
    // Check if user is logged in
    if (token?.sub != undefined) {
        const chats = await chat.find({
            "strangerID": token.sub,
        }, { "_id": 0 });

        // Return the chats associated with the account.
        return chats;
    }

    // If the user is not logged in, set the response status to 401 (Unauthorized).
    setResponseStatus(event, 401);
    return { status: 401 };
})