
import {Request, Response, NextFunction} from "express";
import * as auth from '../../auth/services/authService'
import * as cors from 'cors'
import { RolController } from "rol/controller/rolController";

export class RolRoutes { 
    
    public rolController: RolController = new RolController();

    public routes(app): void {   

        app.use(cors());

        app.route('/rol')
        .post(this.rolController.insertRol)

        app.route('/rol/get')
        .post(auth,this.rolController.getRol)

        app.route('/rol/getById')
        .post(auth,this.rolController.getRolById)

        app.route('/rol/update')
        .post(auth,this.rolController.updateRol)

        app.route('/rol/delete')
        .post(auth,this.rolController.deleteRol)

    }
}