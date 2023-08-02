import { getToken } from "#auth";
import { pet } from "../../../mongo/models";

export default defineEventHandler(async (event) => {
  const token = await getToken({ event });

  // If user is not logged in, return 401 (Unauthorized) status
  if (token?.sub == undefined) {
    setResponseStatus(event, 401);
    return { status: 401, body: { error: "Unauthorized" } };
  }

  if (event.context.params && event.context.params.petID) {
    const id = event.context.params.petID;

    try {
      // Firstly, check if the owner of the pet matches the logged-in user and if pet is not missing
      const existingPet = await pet.findOne({
        Pet_UID: id,
        petOwnerID: token.sub,
        isMissing: false,
      });
      if (existingPet == undefined) {
        setResponseStatus(event, 404);
        return {
          status: 401,
          message:
            "Pet Not Found/No Access Rights/Cannot Delete Becuase Pet Is Marked Lost",
        };
      }

      // Secondly, if an image has been uploaded, delete the image
      const petImageUrl = existingPet.imageURL;
      if (petImageUrl != undefined) {
        await getManagerInstance().delete(id, petImageUrl);
      }

      // Lastly, delete the pet entry from the database
      const deletedPet = await pet.findOneAndDelete({ Pet_UID: id });

      // If the pet is deleted successfully, return 200 (OK) status and a success message
      if (deletedPet) {
        return { status: 200, message: "Pet deleted successfully" };
      } else {
        return { status: 404, message: "Pet not found" };
      }
    } catch (error) {
      setResponseStatus(event, 500);

      // If there is an error during the process, return 500 (Internal Server Error) status and an error message
      return { status: 500, body: { error: "Server error" } };
    }
  } else {
    // If the 'petID' is missing in the event parameters, return 500 (Internal Server Error) status and an error message
    return { status: 500, body: { error: "Missing Pet ID In Parameters" } };
  }
});
