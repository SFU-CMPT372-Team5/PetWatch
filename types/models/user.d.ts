export default interface UserModel {
    User_UID: string, //Primary Key
    accountDetails: {
        name: str,
        address: string,
        phone: string,
        dateCreated: string
        additionalInfo: [ //Optional
            {
                detailName: String,
                detailValue: String
            }
        ]
    },
    pets: string[],
    nonOwnerPetChats: string[] //A list of chats this person is in for pets that are not their own
}
