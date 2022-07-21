
import {Request, Response, NextFunction} from "express";
import * as auth from '../../../util/auth/services/authService'
import * as cors from 'cors'
import { SubSistemaController } from "../../subSistema/controller/subSistemaController";

export class SubSistemaRoutes { 
    
    public subSistemaController: SubSistemaController = new SubSistemaController();

    public routes(app): void {   

        app.use(cors());

        app.route('/sub_sistema')
        .post(this.subSistemaController.insertSubSistema)

        app.route('/sub_sistema/get')
        .get(this.subSistemaController.getSubSistema)

        app.route('/sub_sistema/getById')
        .get(this.subSistemaController.getSubSistemaById)

        app.route('/sub_sistema')
        .put(this.subSistemaController.updateSubSistema)

        app.route('/sub_sistema')
        .delete(this.subSistemaController.deleteSubSistema)

    }
}