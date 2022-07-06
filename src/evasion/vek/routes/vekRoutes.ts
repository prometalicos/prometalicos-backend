
import {Request, Response, NextFunction} from "express";
import * as auth from '../../../util/auth/services/authService'
import * as cors from 'cors'
import { VekController } from "../controller/vekController";

export class VekRoutes { 
    
    public vekController: VekController = new VekController();

    public routes(app): void {   

        app.use(cors());

        app.route('/vek')
        .post(this.vekController.insertVek)

        app.route('/vek/get')
        .get(this.vekController.getVek)

        app.route('/vek/getById')
        .get(this.vekController.getVekById)

        app.route('/vek/update')
        .put(this.vekController.updateVek)

        app.route('/vek/delete')
        .delete(this.vekController.deleteVek)
    }
}