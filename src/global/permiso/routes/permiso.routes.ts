
import {Request, Response, NextFunction} from "express";
import * as auth from '../../../util/auth/services/authService'
import * as cors from 'cors'
import { PermisoController } from "global/permiso/controller/permiso.controller";

export class ConcesionRoutes { 
    
    public permisoController: PermisoController = new PermisoController();

    public routes(app): void {   

        app.use(cors());

        app.route('/permiso/get')
        .post(auth,this.permisoController.getPermiso)

        app.route('/permiso/getById')
        .post(auth,this.permisoController.getPermisoById)

        app.route('/permiso/update')
        .post(auth,this.permisoController.updatePermiso)

        app.route('/permiso/delete')
        .post(auth,this.permisoController.deletePermiso)

    }
}