
import {Request, Response, NextFunction} from "express";
import * as auth from '../../../util/auth/services/authService'
import * as cors from 'cors'
import { ClaseVehiculoController } from "../controller/clase_vehiculoController";

export class ClaseVehiculoRoutes { 
    
    public claseVehiculoController: ClaseVehiculoController = new ClaseVehiculoController();

    public routes(app): void {   

        app.use(cors());

        app.route('/clase_vehiculo')
        .post(this.claseVehiculoController.insertClaseVehiculo)

        app.route('/clase_vehiculo/get')
        .get(this.claseVehiculoController.getClaseVehiculo)

        app.route('/clase_vehiculo/getById')
        .get(this.claseVehiculoController.getClaseVehiculoById)

        app.route('/clase_vehiculo/update')
        .put(this.claseVehiculoController.updateClaseVehiculo)

        app.route('/clase_vehiculo/delete')
        .delete(this.claseVehiculoController.deleteClaseVehiculo)
    }
}