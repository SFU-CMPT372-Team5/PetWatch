import { pet } from "../../../mongo/models";
import { getToken } from '#auth';
import {purgeChatForPet, purgeLocationPointsForPet} from "~/server/utils/petDelete";

export default defineEventHandler(async (event) => {
  const token = await getToken({ event });

  // Check if the token or its 'sub' property is missing, indicating unauthorized access
  if (token?.sub == undefined) {
    setResponseStatus(event, 401);
    return { status: 401, body: { error: "Unauthorized" } };
  }

  // Read the request body
  const body = await readBody(event);

  try {
    // Check if the 'status' property is missing in the request body
    if(body.status == undefined){
      console.log("pid undef")
      setResponseStatus(event,400);
      return { status: 400, body: { error: 'Bad Request' } }; 
    }

    const status = body.status as boolean; // Assuming the status is sent in the request body
    
    // Find the pet by ID and update the isMissing field to true
    const updatedPet = await pet.findOneAndUpdate(
      { Pet_UID: event.context.params?.petID, petOwnerID: token.sub },
      { isMissing: status },
      { new: true }
    );

    // Check if the pet was not found and send a response appropriately
    if (!updatedPet) {
      console.log("did not updated!");
      setResponseStatus(event,404);
      return { status: 404, body: { error: 'Pet not found' } };
    }
    
    console.log("pet lost status updated");
    // If the pet is not missing, delete all chat messages related to this pet
    if (!updatedPet.isMissing) {
      //Delete all chat messages for this pet
      purgeChatForPet(updatedPet.Pet_UID);
      purgeLocationPointsForPet(updatedPet.Pet_UID);
    }

    // Set the response status to 200 (OK) and return the updated pet in the response body
    setResponseStatus(event,200);
    return { status: 200, body: updatedPet };
    
  } catch (error) {
    console.error('Error updating pet:', error);
    setResponseStatus(event,500);
    return { status: 500, body: { error: 'Server error' } };
  }
});