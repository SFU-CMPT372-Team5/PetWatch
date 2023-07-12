export default interface ChatModel {
    Chat_UID: string, //Primary Key
    
    petID: string,
    
    // isTemporary: boolean

    ownerID: string,
    strangerID: string, //Or undefined if not logged in
}