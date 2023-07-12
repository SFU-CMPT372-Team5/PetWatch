import mongoose from "mongoose";

const schema = new mongoose.Schema({
    User_UID: {
        type: String,
        unique: true,
        required: true
    }, //Primary Key
    dateCreated: Number,
    userDetails: {
        name: String,
        address: String,
        email: String,
        phone: String,
        additionalInfo: [
            {
                detailName: String,
                detailValue: String
            }
        ]
    },
    pets: [String],  //A list of pets this person owns
    nonOwnerPetChats: [String] //A list of chats this person is in for pets that are not their own
})

export default mongoose.model("User", schema, "users");

