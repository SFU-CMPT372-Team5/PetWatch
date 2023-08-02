export default interface PetModel extends LimitedPetModel {
    Pet_UID: string, //Primary Key: This will also double as our url endpoint, so the qr codes point to ex) https://PetWatch.com/found/<Pet_UID>
    petOwnerID: string,
    petDetails: {
        name: string,
        species: string,
        breed?: string, //Optional
        colour: string,
        // gender?": "Unspecified", //Optional
        additionalInfo?: [ //Optional
            {
                detailName: String,
                detailValue: String
            }
        ]
    },

    imageURL?: string
    
    isMissing: boolean,
    missingDetails?: { //Potentially defined if `isMissing` is true
        lastSeen?: [{ //Optional
            location: {
                lat: Number,
                lng: Number
            }, //Address or map pin (coordinates)
            time: Number //Unix Timestamp, Date::getTime() in node
        }],
        lastSeenByOwner: {
            location: {
                lat: Number,
                lng: Number
            },
            time: Number           
        }
    },
}

export interface LimitedPetModel {
    Pet_UID: string,
    // petOwnerID: string,
    petDetails: {
        name: string,
    },
    isMissing: boolean,
    imageURL?: string
}