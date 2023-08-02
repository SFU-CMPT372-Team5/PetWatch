export default interface UserModel {
    User_UID: string, //Primary Key
    dateCreated: string,
    userDetails: {
        name: str,
        address: string,
        phone: string,
        email: string,
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

export interface UserDetails {
    name: string,
    address: string,
    phone: string,
    email: string,
    additionalInfo: [ //Optional
        {
            detailName: String,
            detailValue: String
        }
    ]
}