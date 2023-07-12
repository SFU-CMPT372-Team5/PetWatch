export default interface ChatModel {
    Chat_UID: string, //Primary Key
    
    petID: string,
    
    ownerID: string,
    strangerID: string, //Or undefined if not logged in
}