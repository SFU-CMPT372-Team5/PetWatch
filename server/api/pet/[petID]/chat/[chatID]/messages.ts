import { getToken } from '#auth'
import { message } from '../../../../../mongo/models';

export default defineEventHandler(async (event) => {
    const token = await getToken({event}); //The { } are important!

    if (token?.sub != undefined) {
        const messages = await message.find({
            "Chat_UID": event.context.params.chatID
        }, {"_id": 0}).sort({timeSent: 1})

        return messages
    }

    setResponseStatus(event, 401)
    return {status: 401};
})