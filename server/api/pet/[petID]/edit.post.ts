import { pet } from "../../../mongo/models";
import { getToken } from "#auth";
import {getManagerInstance} from "~/server/utils/cloudStorage"
import PetModel from "../../../../types/models/pet";
import {imageUploadMaxBytes} from "~/config.json"


export default defineEventHandler(async (event) => {
  const token = await getToken({ event });
  if (token?.sub == undefined) {
    setResponseStatus(event, 401);
    return { status: 401, body: { error: "Unauthorized" } };
  }

  const formData = await readMultipartFormData(event);

  if (formData == undefined) {
    setResponseStatus(event, 400);
    return {"message": "Bad request"};
  }

  //Let's start by attempting to find the pet, this way we know it exists before we potentially upload an image to GCP
  let petKey;
  let existingImageUrl
  try {
    const existingPet = await pet.findOne({
      Pet_UID: event.context.params!.petID, petOwnerID: token.sub
    })

    if (existingPet == undefined) {
      setResponseStatus(event, 404);
      return { status: 401, message: "Pet not found/no access rights"};
    }

    petKey = existingPet!._id;
    existingImageUrl = existingPet!.imageURL;
  } catch(e) {
    setResponseStatus(event, 404);
    return { status: 401, message: "Pet not found/no access rights"};
  }

  const petDetailsUpdate = {} as Partial<PetModel['petDetails']>
  let somethingAdded = false;
  //Validate
  for (const data of formData) {
    if (data.name == undefined || data.data == undefined) continue;

    switch(data.name) {
      case "name":
      case "species":
      case "breed":
      case "colour":
        petDetailsUpdate[data.name] = data.data.toString().trim();
        break;

      case "default":
        continue;
    }

    somethingAdded = true;
  }

  if (!somethingAdded) {
    setResponseStatus(event, 400);
    return {message: "No valid parameters to add"};
  }

  //If we get here, we have a valid payload, so it's time to upload the potential image
  const imageEntry = formData.find((v) => v.name == "image");

  let resultImgURL;
  if (imageEntry != undefined && imageEntry.type) {
    //Let's impose a upper limit on a maximum file size
    if (imageEntry.data.length > imageUploadMaxBytes) { //Set to 10mb
      //Too big!
      setResponseStatus(event, 413);
      return {status: 413, message: "Image too big! Max size (bytes): " + imageUploadMaxBytes}
    }
    
    //Is an image-type file
    const fileExt = imageEntry.filename?.split('.').pop();
    if (fileExt == undefined) return;

    const fileUploadRes = await getManagerInstance().upload(
      event.context.params!.petID, 
      imageEntry.data,
      imageEntry.type,
      fileExt
    );

    //Attempt to delete the old image if the new image doesn't share the same file extension 
    //(prevents orphaning files, but ensures the image was replaced before deleting the old one)
    if (fileUploadRes != undefined && existingImageUrl?.endsWith(fileExt) == false) {
      await getManagerInstance().delete(event.context.params!.petID, existingImageUrl);
    }

    //Do this regardless
    resultImgURL = fileUploadRes;
  }

  try {
    const updatedPet = await pet.findOneAndUpdate(
      { Pet_UID: event.context.params!.petID, petOwnerID: token.sub },
      {
        petDetails: petDetailsUpdate,
        imageURL: resultImgURL //FIXME, i believe if this is undefined, it will just mean nothing happens
      },
      { new: true }
    );

    if (updatedPet != undefined) {
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
