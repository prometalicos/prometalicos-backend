import * as jwt from 'jsonwebtoken'
import { ErrorModel } from "util/error_handling/models/error";

const auth = (req, res, next) => {
    var token = req.headers['authorization']
    if (!token) {
        let error: ErrorModel = new Error('Token Not Found');
        error.status = 401
        next(error);
        return;
    }
    token = token.replace('Bearer ', '')

    jwt.verify(token, 'fcasc3210sdfjnmku+98KJH45f', (err, user) => {
        if (err) {
            let error: ErrorModel = new Error('Invalid Token');
            error.status = 401
            next(error);
        } else {
            res.locals.user = user
            next()
        }
    })
}

module.exports = auth