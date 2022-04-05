import { ErrorModel } from "error_handling/models/error";


export class ErrorHandler {

    public routes(app): void {

        app.use((req, res, next) => {
            let error: ErrorModel = new Error('Not Found');
            error.status = 404
            next(error);
        })

        app.use((error: ErrorModel, req, res, next) => {
            res.status(error.status || 500)
            res.json({
                status: error.status,
                message: error.message
            })
        })
    }
}