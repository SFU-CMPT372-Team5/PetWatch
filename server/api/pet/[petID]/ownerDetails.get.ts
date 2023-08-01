import { user, pet } from "../../../mongo/models"
import {getToken} from "#auth"
import { UserDetails } from "../../../../types/models/user";

export default defineEventHandler(async (event) => {
    //Two requirements to access this information
    //1) Querying user is authenticated
    //2) The pet is lost OR the owner is the user querying
    
    const token = await getToken({event});


    //Check if authenticated
    if (token?.sub == undefined) {
        setResponseStatus(event, 401);
        return {status: 401}
    }

    //Check if pet is lost
    try {
        var petRes = await pet.findOne({Pet_UID: event.context.params.petID}); //Use var to make file-scoped
        if (petRes == undefined) {
            throw Error();
        }

        //If not the pet owner AND pet isn't lost, forbidden
        if (petRes.petOwnerID != token.sub && petRes.isMissing == false) {
            setResponseStatus(event, 403);
            return {status: 403} //Forbidden
        }
    } catch(e) {
        setResponseStatus(event, 404);
        return {status: 404};
    }
    //If here, user is authorized to view information

    try {
        const userRes = await user.findOne({"User_UID": petRes.petOwnerID})

        if (userRes != undefined && userRes.userDetails != undefined) {
            return userRes.userDetails as unknown as Partial<UserDetails>
        } else {
            setResponseStatus(event, 404);
            return {status: 404}
        }
    } catch(e) {
        setResponseStatus(event, 500);
        return {status: 500}
    }
})