import { pet } from "../../mongo/models";
import { getToken } from "#auth";

export default defineEventHandler(async (event) => {
  const token = await getToken({ event });
  if (token?.sub == undefined) {
    setResponseStatus(event, 401);
    return { status: 401, body: { error: "Unauthorized" } };
  }

  const body = await readBody(event);

  const { pid, petDetails, isMissing, missingDetails, contactDetails } = body;

  if (pid == undefined) {
    console.log("pid undef");
    setResponseStatus(event, 400);
    return { status: 400, body: { error: "Bad Request" } };
  }

  try {
    const updatedPet = await pet.findByIdAndUpdate(pid, {
      petDetails,
      isMissing,
      missingDetails,
      contactDetails,
    });

    if (updatedPet) {
      console.log("pet updated!");
      return { message: "Pet updated successfully" };
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
