
import {Request, Response, NextFunction} from "express";
import * as auth from '../../../util/auth/services/authService'
import * as cors from 'cors'
import { SubSistemaController } from "../../subSistema/controller/subSistemaController";

export class SubSistemaRoutes { 
    
    public subSistemaController: SubSistemaController = new SubSistemaController();

    public routes(app): void {   

        app.use(cors());

        app.route('/tipo_periferico')
        .post(this.subSistemaController.insertSubSistema)

        app.route('/tipo_periferico/get')
        .get(this.subSistemaController.getSubSistema)

        app.route('/tipo_periferico/getById')
        .get(this.subSistemaController.getSubSistemaById)

        app.route('/tipo_periferico')
        .put(this.subSistemaController.updateSubSistema)

        app.route('/tipo_periferico')
        .delete(this.subSistemaController.deleteSubSistema)

    }
}