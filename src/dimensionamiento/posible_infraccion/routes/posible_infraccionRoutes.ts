
import {Request, Response, NextFunction} from "express";
import * as auth from '../../../util/auth/services/authService'
import * as cors from 'cors'
import { PosibleInfraccionController } from "../controller/posible_infraccionController";

export class PosibleInfraccionRoutes { 
    
    public posibleInfraccionController: PosibleInfraccionController = new PosibleInfraccionController();

    public routes(app): void {   

        app.use(cors());

        app.route('/clase_vehiculo')
        .post(this.posibleInfraccionController.insertPosibleInfraccion)

        app.route('/clase_vehiculo/get')
        .get(this.posibleInfraccionController.getPosibleInfraccion)

        app.route('/clase_vehiculo/getById')
        .get(this.posibleInfraccionController.getPosibleInfraccionById)

        app.route('/clase_vehiculo/update')
        .put(this.posibleInfraccionController.updatePosibleInfraccion)

        app.route('/clase_vehiculo/delete')
        .delete(this.posibleInfraccionController.deletePosibleInfraccion)
    }
}