import * as jwt from 'jsonwebtoken'

const isAuth = async (token) => {
    try {
        token = token.replace('Bearer ', '')

        let user = await jwt.verify(token, 'fcasc3210sdfjnmku+98KJH45f')
        return user
    } catch (error) {
        throw new Error(error)
    }
}
module.exports = { isAuth }