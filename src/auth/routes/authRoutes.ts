
import {Request, Response, NextFunction} from "express";
import { AuthController } from "../controllers/authController";

export class AuthRoutes { 
    
    public authController: AuthController = new AuthController();

    public routes(app): void {   

        app.route('/user/val')
        .post(this.authController.valUser)

    }
    
}