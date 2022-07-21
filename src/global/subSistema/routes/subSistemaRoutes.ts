
import {Request, Response, NextFunction} from "express";
import * as auth from '../../../util/auth/services/authService'
import * as cors from 'cors'
import { SubSistemaController } from "global/subSistema/controller/subSistemaController";

export class SubSistemaRoutes { 
    
    public subSistemaController: SubSistemaController = new SubSistemaController();

    public routes(app): void {   

        app.use(cors());

        app.route('/sub_sistema')
        .post(this.subSistemaController.insertSubSistema)

        app.route('/sub_sistema/get')
        .post(auth,this.subSistemaController.getSubSistema)

        app.route('/sub_sistema/getById')
        .post(auth,this.subSistemaController.getSubSistemaById)

        app.route('/sub_sistema/update')
        .post(auth,this.subSistemaController.updateSubSistema)

        app.route('/sub_sistema/delete')
        .post(auth,this.subSistemaController.deleteSubSistema)

    }
}