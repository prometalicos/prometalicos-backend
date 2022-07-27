
import {Request, Response, NextFunction} from "express";
import * as auth from '../../../util/auth/services/authService'
import * as cors from 'cors'
import { TarjetaPuertosController } from "../controller/tarjetaPuertosController";

export class PuertosRoutes { 
    
    public tarjetaPuertosController: TarjetaPuertosController = new TarjetaPuertosController();

    public routes(app): void {   

        app.use(cors());

        app.route('/tarjeta_puertos')
        .post(this.tarjetaPuertosController.insertTarjetaPuertos)

        app.route('/tarjeta_puertos/get')
        .get(this.tarjetaPuertosController.getTarjetaPuertos)

        app.route('/tarjeta_puertos/getById')
        .get(this.tarjetaPuertosController.getTarjetaPuertosById)

        app.route('/tarjeta_puertos')
        .put(this.tarjetaPuertosController.updateTarjetaPuertos)

        app.route('/tarjeta_puertos')
        .delete(this.tarjetaPuertosController.deleteTarjetaPuertos)
    }
}