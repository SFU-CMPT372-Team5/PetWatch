import { getToken } from '#auth'
import MessageModel from '~/types/models/message';
import { message, chat } from '~/server/mongo/models';

export default defineEventHandler(async (event) => {
    const token = await getToken({event}); //The { } are important!

    if (token?.sub != undefined) {
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

        if (chatHost == undefined) {
            setResponseStatus(event, 401)
            return {status: 401, message: "Failed to authorize with chat host"};
        }

        const messages = await message.find({
            "chatID": event.context.params.chatID
        }, {"_id": 0}).sort({timeSent: -1}).limit(1);

        if (messages.length > 0) return messages[0] as MessageModel;
        return undefined;
    }

    setResponseStatus(event, 401)
    return {status: 401, message: "You are not logged in"};
})