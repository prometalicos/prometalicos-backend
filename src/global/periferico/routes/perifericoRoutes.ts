
import {Request, Response, NextFunction} from "express";
import * as auth from '../../../util/auth/services/authService'
import * as cors from 'cors'
import { PerifericoController } from "../controller/perifericoController";

export class PerifericoRoutes { 
    
    public perifericoController: PerifericoController = new PerifericoController();

    public routes(app): void {   

        app.use(cors());

        app.route('/periferico')
        .post(this.perifericoController.insertPeriferico)

        app.route('/periferico/get')
        .get(this.perifericoController.getPeriferico)

        app.route('/periferico/getById')
        .get(this.perifericoController.getPerifericoById)

        app.route('/periferico')
        .put(this.perifericoController.updatePeriferico)

        app.route('/periferico')
        .delete(this.perifericoController.deletePeriferico)

    }
}