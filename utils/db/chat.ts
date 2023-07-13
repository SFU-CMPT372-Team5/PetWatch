import { chat, message } from "../../server/mongo/models"

export async function purgeChatForPet(petID: string) {
    try {
        const chatIDs = await chat.find({
            petID: petID
        });
    
        chatIDs.forEach(async (chatHost) => {
            try {
                await message.deleteMany({
                    Chat_UID: chatHost.Chat_UID
                })
            } catch(e) {
                console.error(e);
            }
            try {
                await chat.deleteOne({
                    Chat_UID: chatHost.Chat_UID
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