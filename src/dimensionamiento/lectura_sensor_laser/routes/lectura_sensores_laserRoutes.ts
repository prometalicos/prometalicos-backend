
import {Request, Response, NextFunction} from "express";
import * as auth from '../../../util/auth/services/authService'
import * as cors from 'cors'
import { LecturaSensoresLaserController } from "../controller/lectura_sensores_laserController";

export class ConcesionRoutes { 
    
    public lecturaSensoresLaserController: LecturaSensoresLaserController = new LecturaSensoresLaserController();

    public routes(app): void {   

        app.use(cors());

        app.route('/lectura_sensores_laser')
        .post(this.lecturaSensoresLaserController.insertLecturaSensoresLaser)

        app.route('/lectura_sensores_laser/get')
        .get(this.lecturaSensoresLaserController.getLecturaSensoresLaser)

        app.route('/lectura_sensores_laser/getById')
        .get(this.lecturaSensoresLaserController.getLecturaSensoresLaserById)

        app.route('/lectura_sensores_laser/update')
        .put(this.lecturaSensoresLaserController.updateLecturaSensoresLaser)

        app.route('/lectura_sensores_laser/delete')
        .delete(this.lecturaSensoresLaserController.deleteLecturaSensoresLaser)
    }
}