import { getToken } from '#auth'
import { chat } from '../../../../../mongo/models';

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
            setResponseStatus(event, 404)
            return {status: 404};
        }

        return chatHost;
    }

    setResponseStatus(event, 401)
    return {status: 401};
})