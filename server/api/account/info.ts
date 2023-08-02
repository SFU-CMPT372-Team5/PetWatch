import {user} from "../../mongo/models"
import { getToken } from '#auth'

export default defineEventHandler(async (event) => {
    const token = await getToken({ event }); //The { } are important!

    // Check if user is logged in
    if (token?.sub != undefined) {
        // If the user is logged in, find the user's database entry. If none exists, create a new entry.
        try {
            // Find the user's database entry with the matching 'User_UID' property.
            const userRes = await user.findOne({
                User_UID: token.sub
            }, { "_id": 0 });

            // If a user entry exists, return it.
            if (userRes != null) return userRes;

            // If no user entry is found, create a new entry in the database for the user.
            const createUser = await user.create({
                User_UID: token.sub,
                dateCreated: Date.now(),
                userDetails: {
                    name: token.name,
                    email: token.email
                }
            });

            // Log that a new account entry has been created for the user.
            console.log(`[MONGO] Create new account entry for user ${token.sub}`);
            // Return the newly created user entry.
            return createUser;
        } catch (e) {
            // If an error occurs during the database operations, return the error.
            return e;
        }
    } else {
        // If the user is not logged in, set the response status to 401 (Unauthorized).
        setResponseStatus(event, 401);
        return null;
    }
});