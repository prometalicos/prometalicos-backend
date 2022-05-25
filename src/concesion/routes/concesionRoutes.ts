
import {Request, Response, NextFunction} from "express";
import * as auth from '../../auth/services/authService'
import * as cors from 'cors'
import { ConcesionController } from "../controller/concesionController";

export class ConcesionRoutes { 
    
    public concesionController: ConcesionController = new ConcesionController();

    public routes(app): void {   

        app.use(cors());

        app.route('/concesion')
        .post(this.concesionController.insertConcesion)

        app.route('/concesion/get')
        .post(this.concesionController.getConcesion)

        app.route('/concesion/getById')
        .post(auth,this.concesionController.getConcesionById)

        app.route('/concesion/update')
        .post(auth,this.concesionController.updateConcesion)

        app.route('/concesion/delete')
        .post(auth,this.concesionController.deleteConcesion)

    }
}