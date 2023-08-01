import { getToken } from '#auth'
import { chat, pet } from '../../../../mongo/models';


import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY1!);

export default defineEventHandler(async (event) => {
    const token = await getToken({event}); //The { } are important!
    const body = await readBody(event)
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
                const msg = {
                    to:  body.userDetails.email, // Change to your recipient
                    from: 'olivia0001002@gmail.com', // Change to your verified sender
                    subject: 'PetWatch Chat Initiated',
                    text: 'A pet finder would like to chat with you, please check your account for messages.',
                    html: '<strong>A pet finder would like to chat with you, please check your account for messages..</strong>',
                }
                sgMail
                .send(msg)
                .then(() => {
                    console.log('Email sent')
                })
                .catch((error: any) => {
                    console.error(error)
                })
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