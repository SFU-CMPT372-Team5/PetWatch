import { getToken } from '#auth'
import MessageModel from '~/types/models/message';
import { message, chat } from '~/server/mongo/models';

//With query parameter ?t=<timestamp>

export default defineEventHandler(async (event) => {
    const token = await getToken({event}); //The { } are important!

    const time = parseInt(getQuery(event).t as string);

    if (Number.isNaN(time) || !Number.isInteger(time)) {
        setResponseStatus(event, 400);
        return {status: 400, message:"Bad Query Parameter"};
    }
    

    if (token?.sub != undefined) {
        const chatHost = await chat.findOne({
            "Chat_UID": event.context.params?.chatID,
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
            "chatID": event.context.params?.chatID,
            timeSent: {$gt: time}
        }, {"_id": 0}).sort({timeSent: 1});

        return messages as MessageModel[]|undefined;
    }

    setResponseStatus(event, 401)
    return {status: 401, message: "You are not logged in"};
})