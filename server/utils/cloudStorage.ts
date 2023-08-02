import { Storage } from "@google-cloud/storage";
const BUCKET_NAME = "petwatch-images";
const BASE_PUB_URL = `https://storage.googleapis.com/${BUCKET_NAME}/`

//@ts-expect-error For some reason Typescript doesn't see that allowSyntheticDefaultImport is set and this errors anyway
import gcpServiceAccount from "~/gcp_service_account.json"

export type TypeCloudStorageManager = typeof CloudStorageManager
class CloudStorageManager {
    static Instance: CloudStorageManager

    Storage: Storage
    constructor() {
        this.Storage = new Storage({
            credentials: gcpServiceAccount,
            projectId: "cmpt372-team5-petwatch"
        });

        CloudStorageManager.Instance = this;
        return;
    }

    static getInstance() {
        return this.Instance;
    }

    async getPetImageUrl(petID: string) {
        try {
            const file = this.Storage.bucket(BUCKET_NAME).file(petID)
            const [exists] = await file.exists();
            console.log(exists)

            if (exists) {
                const url = file.publicUrl();
                console.log(url)
                if (url == undefined) return undefined;
                return url;
            }
        } catch(e) {}
        return undefined;
    }

    /**
     * Attempts to upload file and returns URL to the created file
     * Returns undefined if could not upload
     */
    async upload(petID: string, imageBuffer: Buffer, imageMIME: string, imageExt: string) {
        if (!imageMIME.startsWith("image/")) return undefined;
        
        const fileName = `${petID}.${imageExt}`

        try {
            const file = this.Storage.bucket(BUCKET_NAME).file(petID + "." + imageExt);

            try {
                const res = await file.save(imageBuffer, {
                    contentType: imageMIME
                })

                return BASE_PUB_URL+fileName
            } catch(e) {
                return undefined;
            }

            
        } catch(e) {
            //
        }
    }

    async delete(petID: string, imageURL: string) {

        const urlSegments = imageURL.split(".");
        //File ext is last dot

        if (urlSegments != undefined && urlSegments.length > 1) { //Proves at least 1 dot exists
            const fileExt = urlSegments[urlSegments.length - 1]

            const fileName = `${petID}.${fileExt}`
            
            try {
                await this.Storage.bucket(BUCKET_NAME).file(fileName).delete();
    
                return true;
            } catch(e) {}
        }
        
        return false;
    }
}

export function getManagerInstance() {
    if (CloudStorageManager.Instance == undefined) {
        return new CloudStorageManager();
    }

    return CloudStorageManager.Instance;
}