
import {Request, Response, NextFunction} from "express";
import * as auth from '../../../util/auth/services/authService'
import * as cors from 'cors'
import { SubSistemaController } from "global/subSistema/controller/subSistemaController";

export class RolRoutes { 
    
    public subSistemaController: SubSistemaController = new SubSistemaController();

    public routes(app): void {   

        app.use(cors());

        app.route('/subSistema')
        .post(this.subSistemaController.insertSubSistema)

        app.route('/subSistema/get')
        .post(auth,this.subSistemaController.getSubSistema)

        app.route('/subSistema/getById')
        .post(auth,this.subSistemaController.getSubSistemaById)

        app.route('/subSistema/update')
        .post(auth,this.subSistemaController.updateSubSistema)

        app.route('/subSistema/delete')
        .post(auth,this.subSistemaController.deleteSubSistema)

    }
}