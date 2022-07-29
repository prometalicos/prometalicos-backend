
import {Request, Response, NextFunction} from "express";
import * as auth from '../../../util/auth/services/authService'
import * as cors from 'cors'
import { RolController } from "../controller/rolController";

export class RolRoutes { 
    
    public rolController: RolController = new RolController();

    public routes(app): void {   

        app.use(cors());

        app.route('/rol')
        .post(this.rolController.insertRol)

        app.route('/rol/get')
        .get(this.rolController.getRol)

        app.route('/rol/getById')
        .get(this.rolController.getRolById)

        app.route('/rol')
        .put(this.rolController.updateRol)

        app.route('/rol')
        .delete(this.rolController.deleteRol)

    }
}