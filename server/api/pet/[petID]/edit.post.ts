import { pet } from "../../../mongo/models";
import { getToken } from "#auth";
import {readFiles} from "h3-formidable"

export default defineEventHandler(async (event) => {
  const token = await getToken({ event });
  if (token?.sub == undefined) {
    setResponseStatus(event, 401);
    return { status: 401, body: { error: "Unauthorized" } };
  }

  const body = await readBody(event);

  console.dir(body); return;

  const { pName, pSpecies, pBreed, pColour } = body;

  try {
    const updatedPet = await pet.findOneAndUpdate(
      { Pet_UID: event.context.params.petID, petOwnerID: token.sub },
      {
        petDetails: {
          name: pName,
          species: pSpecies,
          breed: pBreed,
          colour: pColour,
        },
      },
      { new: true }
    );

    if (updatedPet) {
      console.log("pet updated!");
      setResponseStatus(event, 200);
      return { status: 200, body: updatedPet, message: "Pet updated successfully"};
    } else {
      setResponseStatus(event, 404);
      console.log("pet NOT updated!");
      return { status: 404, body: { error: "Pet not found" } };
    }
  } catch (error) {
    console.error("Error updating pet:", error);
    setResponseStatus(event, 500);
    return { status: 500, body: { error: "Server error" } };
  }
});
