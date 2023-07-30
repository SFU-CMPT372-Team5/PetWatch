import { user } from '../../mongo/models'
import { getToken } from '#auth'

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
            
            return {message: "Account updated"}
        } catch (e) {
            setResponseStatus(event, 500);
            return {message: e}
            
        } 
    }

    setResponseStatus(event, 401);
    return {status: 401, message: "Unauthorized"}
})
