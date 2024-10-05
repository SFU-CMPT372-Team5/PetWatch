export default interface UserModel {
    User_UID: string, //Primary Key
    dateCreated: string,
    userDetails: {
        name: string,
        address: string,
        phone: string,
        email: string,
        additionalInfo: [ //Optional
            {
                detailName?: string,
                detailValue?: string
            }
        ]
    },
    pets: string[],
    nonOwnerPetChats: string[] //A list of chats this person is in for pets that are not their own
}

export type UserDetails = UserModel['userDetails']