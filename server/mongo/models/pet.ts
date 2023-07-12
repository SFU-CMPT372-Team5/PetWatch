import mongoose from "mongoose";

const schema = new mongoose.Schema({
    Pet_UID: {
        type: String,
        unique: true,
        required: true
    }, //Primary Key: This will also double as our url endpoint, so the qr codes point to ex) https://PetWatch.com/found/<Pet_UID>
    petOwnerID: {
        type: String,
        required: true
    },
    petDetails: {
        name: {type: String, required: true},
        species: String,
        breed: String, //Optional
        colour: String,
        // gender: String, //Optional
        additionalInfo: [ //Optional
            {
                detailName: String,
                detailValue: String
            }
        ]
    },
    
    isMissing: {type: Boolean, required: true, default: false},
    missingDetails: { //Potentially defined if `isMissing` is true
        lastSeen: { //Optional
            location: String, //Address or map pin (coordinates)
            time: Number //Unix Timestamp, Date::getTime() in node
        }
    },

    contactDetails: { //In the future this will have to be changed to add privacy settings
        name: String,
        address: String,
        phone: String,
        additionalInfo: [ //Optional
            {
                detailName: String,
                detailValue: String
            }
        ]
    },

    chats: [String]
})

export default mongoose.model("Pet", schema, "pets");
