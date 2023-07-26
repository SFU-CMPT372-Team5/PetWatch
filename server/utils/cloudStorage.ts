import { Storage } from "@google-cloud/storage";
const BUCKET_NAME = "petwatch-images";

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

    async upload(petID: string) {
        try {
            const file = this.Storage.bucket(BUCKET_NAME).file(petID);

            file.save()

            
        }
    }
}

export function getManagerInstance() {
    if (CloudStorageManager.Instance == undefined) {
        return new CloudStorageManager();
    }

    return CloudStorageManager.Instance;
}