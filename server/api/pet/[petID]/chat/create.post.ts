import { getToken } from '#auth'
import { chat, pet } from '../../../../mongo/models';

export default defineEventHandler(async (event) => {
    const token = await getToken({event}); //The { } are important!

    if (token?.sub != undefined) {
        const existingChat = await chat.findOne({
            petID: event.context.params.petID,
            strangerID: token.sub,
        });

        if (existingChat != null) return existingChat;

        const petOwner = await pet.findOne({
            Pet_UID: event.context.params.petID
        });

        if (petOwner != undefined && petOwner.isMissing) { //Only create if pet missing
            const newChat = await chat.create({
                Chat_UID: `${event.context.params.petID}` + `${token.sub.replace("|", "")}`,
                petID: event.context.params.petID,
                strangerID: token.sub,
                ownerID: petOwner.petOwnerID
            });
            
            if (newChat != undefined) {
                return newChat
            } else {
                setResponseStatus(event, 500);
                return {status: 500};
            }
        } else {
            setResponseStatus(event, 404)
            return {status: 404};
        }
    }

    setResponseStatus(event, 401)
    return {status: 401};
})