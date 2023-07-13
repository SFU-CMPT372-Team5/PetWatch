import { getToken } from '#auth'
import { chat } from '../../../mongo/models';

export default defineEventHandler(async (event) => {
    const token = await getToken({event}); //The { } are important!

    if (token?.sub != undefined) {
        const chats = await chat.find({
            "ownerID": token.sub,
            "petID": event.context.params.petID
        }, {"_id": 0})

        return chats
    }

    setResponseStatus(event, 401)
    return {status: 401};
})