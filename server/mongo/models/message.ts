import mongoose from "mongoose";

const schema = new mongoose.Schema({
    chatID: String,

    isOwnerMessage: Boolean, //If the owner of the chat sent the message or not

    timeSent: Number, //Unix Timestamp, Date::getTime() in node
    
    text: String
})

export default mongoose.model("Message", schema, "messages");
