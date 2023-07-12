export default interface MessageModel {
    chatID: string,

    isOwnerMessage: boolean, //If the owner of the chat sent the message or not

    timeSent: number, //Unix Timestamp, Date::getTime() in node
    
    text: string

}