import mongoose from "mongoose";

const schema = new mongoose.Schema({
    Chat_UID: { //Primary Key
        type: String,
        unique: true,
        required: true
    },
    
    petID: {
        type: String,
        required: true
    },
    // isTemporary: Boolean, //Such as when a guest messages, we need to store this briefly as the owner needs to see the messages
    
    ownerID: {type: String, required: true},
    strangerID: {type: String, required: true}, //Or undefined if not logged in
})

export default mongoose.model("Chat", schema, "chats");