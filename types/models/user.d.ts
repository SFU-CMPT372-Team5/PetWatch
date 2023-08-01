export default interface UserModel {
    User_UID: string, //Primary Key
    dateCreated: string,
    userDetails: UserDetails
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