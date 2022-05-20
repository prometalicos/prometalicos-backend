
import {Request, Response, NextFunction} from "express";
import * as auth from '../../auth/services/authService'
import * as cors from 'cors'
import { ConcesionController } from "concesion/controller/concesionController";

export class ConcesionRoutes { 
    
    public concesionController: ConcesionController = new ConcesionController();

    public routes(app): void {   

        app.use(cors());

        app.route('/user')
        .post(this.concesionController.insertConcesion)

        app.route('/user/get')
        .post(auth,this.concesionController.getConcesion)

        app.route('/user/getById')
        .post(auth,this.concesionController.getConcesionById)

        app.route('/user/update')
        .post(auth,this.concesionController.updateConcesion)

        app.route('/user/delete')
        .post(auth,this.concesionController.deleteConcesion)

    }
}