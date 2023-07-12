import { pet } from "../../mongo/models";

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    try {
        await pet.create(body)
        return { message: 'Pet created' }
    } catch (e) {
        console.error(e)
    }
});