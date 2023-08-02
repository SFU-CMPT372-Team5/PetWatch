import { pet } from "../../mongo/models";
import {getToken} from "#auth"

export default defineEventHandler(async (event) => {
   const token = await getToken({ event });

   // If the user is not logged in
   if (token?.sub == undefined) {
       // Set the response status to 401 (Unauthorized) as the user is not logged in.
       setResponseStatus(event, 401);
       return { status: 401, message: "Not logged in" };
   }
   
   const body = await readBody(event);

   // Validate the body payload: It should contain 'name', 'species', and 'colour' properties of type string.
   if (
       body.name != undefined && typeof(body.name) == "string" &&
       body.species != undefined && typeof(body.species) == "string" &&
       body.colour != undefined && typeof(body.colour) == "string"
   ) {
       try {
           // Create a unique pet ID using the current timestamp.
           const PET_ID = "PET" + Date.now();
           // Create a new pet entry in the 'pet' collection in the database.
           await pet.create({
               Pet_UID: PET_ID,
               petOwnerID: token.sub,
               petDetails: {
                   name: body.name,
                   species: body.species,
                   colour: body.colour
               }
           });
           // Return a success message along with the newly created pet's ID.
           return { message: 'Pet created', Pet_ID: PET_ID };
       } catch (e) {
           // If an error occurs during the database operation, set the response status to 500 (Internal Server Error).
           setResponseStatus(event, 500);
           return { status: 500, message: "Internal server error. Pet not created" };
       }
   } else {
       // If the body payload is invalid, set the response status to 400 (Bad Request).
       setResponseStatus(event, 400);
       return { status: 400, message: "Invalid body payload" };
   }
});