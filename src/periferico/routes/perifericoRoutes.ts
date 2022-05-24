
import {Request, Response, NextFunction} from "express";
import * as auth from '../../auth/services/authService'
import * as cors from 'cors'
import { PerifericoController } from "../../periferico/controller/perifericoController";

export class PerifericoRoutes { 
    
    public perifericoController: PerifericoController = new PerifericoController();

    public routes(app): void {   

        app.use(cors());

        app.route('/periferico')
        .post(this.perifericoController.insertPeriferico)

        app.route('/periferico/get')
        .post(auth,this.perifericoController.getPeriferico)

        app.route('/periferico/getById')
        .post(auth,this.perifericoController.getPerifericoById)

        app.route('/periferico/update')
        .post(auth,this.perifericoController.updatePeriferico)

        app.route('/periferico/delete')
        .post(auth,this.perifericoController.deletePeriferico)

    }
}