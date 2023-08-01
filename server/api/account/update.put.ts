import { user } from '../../mongo/models'
import { getToken } from '#auth'

//const sgMail = require('@sendgrid/mail')
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY1!);


export default defineEventHandler(async (event) => {
    const token = await getToken({event});

    const body = await readBody(event);

    if (body.userDetails == undefined) {
        setResponseStatus(event, 400);
        return {status: 400, message: "Invalid body syntax"}
    }

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
                from: 'olivia0001002@gmail.com', // Change to your verified sender
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

    setResponseStatus(event, 401);
    return {status: 401, message: "Unauthorized"}
})
