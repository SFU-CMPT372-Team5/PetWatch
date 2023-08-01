import { getToken } from '#auth'
import { chat, pet, user } from '../../../../mongo/models';



import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY1!);

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
                const owenerDetails = await user.findOne({User_UID:petOwner.petOwnerID})
                const strangerDetails = await user.findOne({User_UID:newChat.strangerID})
                const strangerName = strangerDetails?.userDetails?.name
                const petFoundDetails = await pet.findOne({Pet_UID:newChat.petID})
                const petFoundName = petFoundDetails?.petDetails?.name
                const msg = {
                    to:  owenerDetails?.userDetails?.email, // Change to your recipient
                    from: 'olivia0001002@gmail.com', // Change to your verified sender
                    subject: 'PetWatch Chat Initiated',
                    text: `${strangerName}  A pet finder would like to chat with you, please check your account for messages.`,
                    html: `<strong> Pet finder ${strangerName} would like to chat with you about pet: ${petFoundName}, please check your account for messages.</strong>`,
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