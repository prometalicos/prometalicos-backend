
import {Request, Response, NextFunction} from "express";
import * as auth from '../../../util/auth/services/authService'
import * as cors from 'cors'
import { TipoPerifericoController } from "../../tipo_periferico/controller/tipoPerifericoController";

export class TipoPerifericoRoutes { 
    
    public tipoPerifericoController: TipoPerifericoController = new TipoPerifericoController();

    public routes(app): void {   

        app.use(cors());

        app.route('/tipo_periferico')
        .post(this.tipoPerifericoController.insertTipoPeriferico)

        app.route('/tipo_periferico/get')
        .get(this.tipoPerifericoController.getTipoPeriferico)

        app.route('/tipo_periferico/getById')
        .get(this.tipoPerifericoController.getTipoPerifericoById)

        app.route('/tipo_periferico')
        .put(this.tipoPerifericoController.updateTipoPeriferico)

        app.route('/tipo_periferico')
        .delete(this.tipoPerifericoController.deleteTipoPeriferico)

    }
}