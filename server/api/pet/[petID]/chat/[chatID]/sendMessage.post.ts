import { getToken } from '#auth'
import MessageModel from '~/types/models/message';
import { message, chat } from '../../../../../mongo/models';

export default defineEventHandler(async (event) => {
    const token = await getToken({event}); //The { } are important!

    const body = await readBody(event)

    if (body.text == undefined || typeof(body.text) != "string" || body.text.length == 0) {
        setResponseStatus(event, 400);
        return {status: 400, message: "Invalid Text"};
    }

    if (token?.sub != undefined) {
        const hostChat = await chat.findOne({
            "Chat_UID": event.context.params.chatID
        });

        if (hostChat != undefined) {
            const sentMessage = await message.create({
                chatID: event.context.params.chatID,
                text: body.text,
                timeSent: Date.now(),
                isOwnerMessage: hostChat.ownerID == token.sub
            });

            if (sentMessage == undefined) {
                setResponseStatus(event, 500)
                return {status: 500};
            } else {
                return sentMessage as MessageModel
            }
        } else {
            setResponseStatus(event, 404)
            return {status: 404};
        }
    }

    setResponseStatus(event, 401)
    return {status: 401};
})