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
    
    isMissing: boolean,
    missingDetails?: { //Potentially defined if `isMissing` is true
        lastSeen?: { //Optional
            location: string, //Address or map pin (coordinates)
            time: number //Unix Timestamp, Date::getTime() in node
        }
    }
}

export interface LimitedPetModel {
    Pet_UID: string,
    // petOwnerID: string,
    petDetails: {
        name: string,
    },
    isMissing: boolean
}