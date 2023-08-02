import { chat, message, pet } from "../../server/mongo/models"

export async function purgeChatForPet(petID: string) {
    try {
        const chatIDs = await chat.find({
            petID: petID
        });
    
        chatIDs.forEach(async (chatHost) => {
            try {
                await message.deleteMany({
                    chatID: chatHost.Chat_UID
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

export async function purgeLocationPointsForPet(petID: string) {
    try {
        const petRes = await pet.updateOne({
            Pet_UID: petID
        }, {$unset: {
            "missingDetails": 1
        }});

        if (petRes.modifiedCount < 1) throw Error("Did not delete chat history for pet " + petID);
    
        console.log(`Deleted location history for pet ${petID}`)
    } catch(e) {
        console.error(e);
    }
}