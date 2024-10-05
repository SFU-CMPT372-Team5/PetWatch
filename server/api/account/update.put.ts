import { user } from '../../mongo/models'
import { getToken } from '#auth'

//const sgMail = require('@sendgrid/mail')
import sgMail from '@sendgrid/mail'

const config = useRuntimeConfig();
sgMail.setApiKey(config.sendgridApiKey);


export default defineEventHandler(async (event) => {
    const token = await getToken({event});

    const body = await readBody(event);

    // Validate request body
    if (body.userDetails == undefined) {
        setResponseStatus(event, 400);
        return {status: 400, message: "Invalid body syntax"}
    }

    // Check if user is logged in
    if (token?.sub != undefined) {
        try {
            await user.findOneAndUpdate({ User_UID: token?.sub }, { 
                "userDetails.name": body.userDetails.name,
                //Email is not allowed to be updated
                "userDetails.address": body.userDetails.address,
                "userDetails.phone": body.userDetails.phone 
            });

            await user.findOneAndUpdate({ User_UID: token?.sub }, { userDetails: body.userDetails })
            const msg = {
                to:  body.userDetails.email, // Change to your recipient
                from: 'petwatchmanagement@gmail.com', // Change to your verified sender
                subject: 'PetWatch Account Updated',
                text: 'Your PetWatch Account Details were recently edited, Please ensure this was correct.',
                html: '<strong>Hello! Your PetWatch Account Details were recently edited, Please ensure this was correct.</strong>',
            }
            sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent')
            })
            .catch((error: any) => {
                console.error(error)
            })
            
            return {message: "Account updated"}
        } catch (e) {
            setResponseStatus(event, 500);
            return {message: e}
            
        } 
    }
    // If the user is not logged in, set the response status to 401 (Unauthorized).
    setResponseStatus(event, 401);
    return {status: 401, message: "Unauthorized"}
})
