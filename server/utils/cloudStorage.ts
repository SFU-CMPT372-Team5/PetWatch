import { Storage } from "@google-cloud/storage";
const BUCKET_NAME = "petwatch-images";
const BASE_PUB_URL = `https://storage.googleapis.com/${BUCKET_NAME}/`

export type TypeCloudStorageManager = typeof CloudStorageManager
class CloudStorageManager {
    static Instance: CloudStorageManager

    Storage: Storage
    constructor() {
        this.Storage = new Storage({
            keyFilename: "gcp_service_account.json",
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
}

export function getManagerInstance() {
    if (CloudStorageManager.Instance == undefined) {
        return new CloudStorageManager();
    }

    return CloudStorageManager.Instance;
}