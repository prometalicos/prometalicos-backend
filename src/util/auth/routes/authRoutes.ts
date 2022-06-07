
import {Request, Response, NextFunction} from "express";
import { AuthController } from "../controllers/authController";
import * as cors from 'cors'

export class AuthRoutes { 
    
    public authController: AuthController = new AuthController();

    public routes(app): void {   

        app.use(cors());

        app.route('/user/val')
        .post(this.authController.valUser)

    }
    
}