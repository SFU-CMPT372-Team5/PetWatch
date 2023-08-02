import mongoose from "mongoose";

const schema = new mongoose.Schema({
    chatID: {
        type: String, 
        required: true,
    },

    isOwnerMessage: {type: Boolean, required: true}, //If the owner of the chat sent the message or not

    timeSent: {type: Number, required: true}, //Unix Timestamp, Date::getTime() in node
    
    text: {type: String, required: true}
})

export default mongoose.model("Message", schema, "messages");
