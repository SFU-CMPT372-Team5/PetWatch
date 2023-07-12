import {user} from "../../mongo/models"
import { getToken } from '#auth'

export default defineEventHandler(async (event) => {
    const token = await getToken({event}); //The { } are important!
    
    if (token?.sub != undefined) { //User is logged in
        //Find database entry. If none exists, create a new entry

        try {
            const userRes = await user.findOne({
                User_UID: token.sub
            }, {"_id": 0});
            
            if (userRes != null) return userRes;

            const createUser = await user.create({
                User_UID: token.sub,
                dateCreated: Date.now(),
                userDetails: {
                    name: token.name,
                    email: token.email
                }
            })

            console.log(`[MONGO] Create new account entry for user ${token.sub}`)

            return createUser;
        } catch(e) {
            return e;
        }

    } else {
        setResponseStatus(event, 401);
        return null
    }
})
