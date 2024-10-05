//Return the UserDetail model for both users in a chat, given the the querying user is a part of the chat
import {getToken} from "#auth"
import {user, chat} from "~/server/mongo/models/"
import { UserDetails } from "~/types/models/user";

export default defineEventHandler(async event => {
    const token = await getToken({event});

    if (token?.sub == undefined) {
        setResponseStatus(event, 401);
        return {status: 401};
    }

    //Get chat details provided querying user is part of chat
    try {
        const chatRes = await chat.findOne({
            Chat_UID: event.context.params?.chatID,
            $or: [
                {
                    ownerID: token.sub
                },
                {
                    strangerID: token.sub
                }
            ]
        })

        if (chatRes == undefined) {
            setResponseStatus(event, 404);
            return {status: 404, message: "Chat not found/no access rights"};
        }

        //If here, the querier is part of the chat and the chat exists
        const owner = await user.findOne({User_UID: chatRes.ownerID});
        const stranger = await user.findOne({User_UID: chatRes.strangerID});

        if (owner == undefined || stranger == undefined) throw Error(); //Cause that shouldn't happen

        return {
            ownerDetails: owner?.userDetails as UserDetails|undefined,
            strangerDetails: stranger?.userDetails as UserDetails|undefined,
            status: 200
        };
    } catch(e) {}

    if (token?.sub == undefined) {
        setResponseStatus(event, 500);
        return {status: 500};
    }
})