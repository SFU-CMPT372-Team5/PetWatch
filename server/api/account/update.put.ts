import { user } from '../../mongo/models'
import { getToken } from '#auth'

export default defineEventHandler(async (event) => {
    const token = await getToken({event});
    const body = await readBody(event)
    if (token?.sub != undefined) {
        try {
            await user.findOneAndUpdate({ User_UID: token?.sub }, { userDetails: body.userDetails })
            return {message: "Account updated"}
        } catch (e) {
            return {message: e}
            }
            
        } else {
        return {status: 401}
    }

})
