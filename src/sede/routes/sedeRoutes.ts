
import {Request, Response, NextFunction} from "express";
import * as auth from '../../auth/services/authService'
import * as cors from 'cors'
import { SedeController } from "sede/controller/sedeController";

export class SedeRoutes { 
    
    public sedeController: SedeController = new SedeController();

    public routes(app): void {   

        app.use(cors());

        app.route('/sede')
        .post(this.sedeController.insertSede)

        app.route('/sede/get')
        .post(auth,this.sedeController.getSede)

        app.route('/sede/getById')
        .post(auth,this.sedeController.getSedeById)

        app.route('/sede/update')
        .post(auth,this.sedeController.updateSede)

        app.route('/sede/delete')
        .post(auth,this.sedeController.deleteSede)

    }
}