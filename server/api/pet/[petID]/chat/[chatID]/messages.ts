import { getToken } from '#auth'
import { message, chat } from '../../../../../mongo/models';

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
            "Chat_UID": event.context.params.chatID
        }, {"_id": 0}).sort({timeSent: 1})

        return messages
    }

    setResponseStatus(event, 401)
    return {status: 401, message: "You are not logged in"};
})