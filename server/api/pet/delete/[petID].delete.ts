import { getToken } from "#auth";
import { pet } from "../../../mongo/models";

export default defineEventHandler(async (event) => {
  const token = await getToken({ event });

  if (token?.sub == undefined) {
    setResponseStatus(event, 401);
    return { status: 401, body: { error: "Unauthorized" } };
  }

  if (event.context.params) {
    const id = event.context.params.petID;
    try {
      const deletedPet = await pet.findOneAndDelete({ Pet_UID: id });
      if (deletedPet) {
        return { status: 200, message: "Pet deleted successfully" };
      } else {
        return { status: 404, message: "Pet not found" };
      }
    } catch (error) {
      console.error("Error deleting pet:", error);
      setResponseStatus(event, 500);
      return { status: 500, body: { error: "Server error" } };
    }
  } else {
    return { status: 500, body: { error: "Missing Pet ID In Parameters" } };
  }
});
