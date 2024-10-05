import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import {validMimeToFileExt} from "~/config.json"

const config = useRuntimeConfig();

const connectionString = config.azureBlobConnectionString;
const containerName = config.azureBlobContainerName;

export default class CloudStorageManager {
    static Instance: CloudStorageManager

    private containerClient: ContainerClient

    /** ## Use `CloudStorageManager.getInstance()` */
    private constructor() {
        if (CloudStorageManager.Instance != undefined) {
            throw new Error("CloudStorageManager is a singleton, use CloudStorageManager.getInstance() instead");
        }

        CloudStorageManager.Instance = this;
        const serviceClient = BlobServiceClient.fromConnectionString(connectionString);
        this.containerClient = serviceClient.getContainerClient(containerName);

        return;
    }

    static getInstance() {
        if (this.Instance == undefined) {
            this.Instance = new CloudStorageManager();
        }

        return this.Instance;
    }

    /**
     * Attempts to upload file and returns URL to the created file
     * Returns undefined if could not upload
     */
    async upload(petID: string, imageBuffer: Buffer, imageMIME: keyof typeof validMimeToFileExt) {
        const imageExt = validMimeToFileExt[imageMIME];

        if (!imageExt) return undefined;
        
        const fileName = `${petID}.${imageExt}`

        try {
            const file = this.containerClient.getBlockBlobClient(fileName);

            try {
                const res = await file.uploadData(imageBuffer, {
                    blobHTTPHeaders: {
                        blobContentType: imageMIME
                    }
                })

                return {
                    url: res._response.request.url,
                    imageExt
                };
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
                await this.containerClient.getBlockBlobClient(fileName).delete();
    
                return true;
            } catch(e) {}
        }
        
        return false;
    }
}