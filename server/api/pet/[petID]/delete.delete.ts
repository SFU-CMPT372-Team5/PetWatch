import { getToken } from "#auth";
import { pet } from "../../../mongo/models";

export default defineEventHandler(async (event) => {
  const token = await getToken({ event });

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
        return { status: 401, message: "Pet Not Found/No Access Rights/Cannot Delete Becuase Pet Is Marked Lost" };
      }

      // Secondly, if an image has been uploaded, delete the image
      const petImageUrl = existingPet.imageURL;
      if (petImageUrl != undefined) {
        await getManagerInstance().delete(id, petImageUrl);
      }

      // Lastly, delete the pet
      const deletedPet = await pet.findOneAndDelete({ Pet_UID: id });

      if (deletedPet) {
        return { status: 200, message: "Pet deleted successfully" };
      } else {
        return { status: 404, message: "Pet not found" };
      }
    } catch (error) {
      setResponseStatus(event, 500);
      return { status: 500, body: { error: "Server error" } };
    }
  } else {
    return { status: 500, body: { error: "Missing Pet ID In Parameters" } };
  }
});
