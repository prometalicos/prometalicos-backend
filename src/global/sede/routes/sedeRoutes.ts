
import {Request, Response, NextFunction} from "express";
import * as auth from '../../../util/auth/services/authService'
import * as cors from 'cors'
import { SedeController } from "global/sede/controller/sedeController";

export class SedeRoutes { 
    
    public sedeController: SedeController = new SedeController();

    public routes(app): void {   

        app.use(cors());

        app.route('/sede')
        .post(this.sedeController.insertSede)

        app.route('/sede/get')
        .get(this.sedeController.getSede)

        app.route('/sede/getById')
        .get(this.sedeController.getSedeById)

        app.route('/sede')
        .put(this.sedeController.updateSede)

        app.route('/sede')
        .delete(this.sedeController.deleteSede)

    }
}