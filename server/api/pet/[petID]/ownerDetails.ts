import { user, pet } from "../../../mongo/models";
import { getToken } from "#auth";
import { UserDetails } from "../../../../types/models/user";

export default defineEventHandler(async (event) => {
  // Check if the querying user is authenticated by getting the token.
  const token = await getToken({ event });

  // Check if the token is missing or invalid (unauthenticated).
  if (token?.sub == undefined) {
    setResponseStatus(event, 401);
    return { status: 401 };
  }

  try {
    // Find the pet with the given petID in the request URL parameters.
    const petRes = await pet.findOne({ Pet_UID: event.context.params.petID });

    // If the pet is not found, return 404 (Not Found) status.
    if (petRes == undefined) {
      setResponseStatus(event, 404);
      return { status: 404 };
    }

    // Check if the querying user is the owner of the pet or if the pet is lost.
    // If not, return 403 (Forbidden) status since the user is not authorized to access the information.
    if (petRes.petOwnerID != token.sub && petRes.isMissing == false) {
      setResponseStatus(event, 403);
      return { status: 403 }; //Forbidden
    }

    // If here, the user is authorized to view information.
    // Find the user details of the pet owner using the 'petOwnerID' field from the 'pet' document.
    const userRes = await user.findOne({ User_UID: petRes.petOwnerID });

    // If the user details are found and not undefined, return the user details as a partial 'UserDetails' object.
    if (userRes != undefined && userRes.userDetails != undefined) {
      return userRes.userDetails as unknown as Partial<UserDetails>;
    } else {
      // If the user details are undefined or not found, return 404 (Not Found) status.
      setResponseStatus(event, 404);
      return { status: 404 };
    }
  } catch (e) {
    // If there is an error while fetching the data, return 500 (Internal Server Error) status.
    setResponseStatus(event, 500);
    return { status: 500 };
  }
});