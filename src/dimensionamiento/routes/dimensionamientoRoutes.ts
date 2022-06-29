
import {Request, Response, NextFunction} from "express";
import * as auth from './../../util/auth//services/authService'
import * as cors from 'cors'
import { EventoTransitoController } from "./../evento_transito/controller/evento_transitoController";

export class DimensionamientoRoutes { 
    
    public eventoTransitoController: EventoTransitoController = new EventoTransitoController();

    public routes(app): void {   

        app.use(cors());

        app.route('/dimensionamiento_all')
        .get(this.eventoTransitoController.getEventoTransitoAll);

        app.route('/dimensionamiento_flash')
        .get(this.eventoTransitoController.getEventoTransitoFlash);

    }
}