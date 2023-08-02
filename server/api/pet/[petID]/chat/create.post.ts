import { getToken } from '#auth'
import { chat, pet, user } from '../../../../mongo/models';

import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY1!);

export default defineEventHandler(async (event) => {
    const token = await getToken({event}); //The { } are important!

    //Check if user logged in
    if (token?.sub != undefined) {
        // Find an existing chat entry that matches the provided 'petID' and where the user is the stranger.
        const existingChat = await chat.findOne({
            petID: event.context.params.petID,
            strangerID: token.sub,
        });

        // If an existing chat entry is found, return it.
        if (existingChat != null) return existingChat;

        const petOwner = await pet.findOne({
            Pet_UID: event.context.params.petID
        });

        // If the pet owner is found and the pet is missing, create a new chat entry between the user and the pet owner.
        if (petOwner != undefined && petOwner.isMissing) { //Only create if pet missing
            // Create a new chat entry with a unique Chat_UID based on the 'petID' and the user's token.
            const newChat = await chat.create({
                Chat_UID: `${event.context.params.petID}` + `${token.sub.replace("|", "")}`,
                petID: event.context.params.petID,
                strangerID: token.sub,
                ownerID: petOwner.petOwnerID
            });
            
            // If the new chat is created successfully, return it.
            if (newChat != undefined) {
                //But first lets send an email to the pet owner telling them someone wants to chat!
                const ownerDetails = await user.findOne({User_UID:petOwner.petOwnerID})
                const strangerDetails = await user.findOne({User_UID:newChat.strangerID})
                const strangerName = strangerDetails?.userDetails?.name
                const petFoundDetails = await pet.findOne({Pet_UID:newChat.petID})
                const petFoundName = petFoundDetails?.petDetails?.name
                const msg = {
                    to:  ownerDetails?.userDetails?.email, // Change to your recipient
                    from: 'petwatchmanagement@gmail.com', // Change to your verified sender
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

    // If the user is not logged in, set the response status to 401 (Unauthorized).
    setResponseStatus(event, 401);
    return { status: 401 };
});
