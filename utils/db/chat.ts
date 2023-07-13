import { chat, message } from "../../server/mongo/models"

export async function purgeChatForPet(petID: string) {
    try {
        const chatIDs = await chat.find({
            petID: petID
        });
    
        chatIDs.forEach(async (id) => {
            try {
                const deleteRes = await message.deleteMany({
                    Chat_UID: id
                })
            } catch(e) {
                console.error(e);
            }
            try {
                const deleteRes = await chat.deleteOne({
                    Chat_UID: id
                })
            } catch(e) {
                console.error(e);
            }
        })
        console.log(`Deleted chat history for ${chatIDs.length} chats on pet ${petID}`)
    } catch(e) {
        console.error(e);
    }
}