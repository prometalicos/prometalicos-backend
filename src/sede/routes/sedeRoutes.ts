
import {Request, Response, NextFunction} from "express";
import * as auth from '../../auth/services/authService'
import * as cors from 'cors'
import { SedeController } from "sede/controller/sedeController";

export class SedeRoutes { 
    
    public sedeController: SedeController = new SedeController();

    public routes(app): void {   

        app.use(cors());

        app.route('/user')
        .post(this.sedeController.insertSede)

        app.route('/user/get')
        .post(auth,this.sedeController.getSede)

        app.route('/user/getById')
        .post(auth,this.sedeController.getSedeById)

        app.route('/user/update')
        .post(auth,this.sedeController.updateSede)

        app.route('/user/delete')
        .post(auth,this.sedeController.deleteSede)

    }
}