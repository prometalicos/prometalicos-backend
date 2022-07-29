
import {Request, Response, NextFunction} from "express";
import * as auth from '../../../util/auth/services/authService'
import * as cors from 'cors'
import { PermisoController } from "../../permiso/controller/permiso.controller";

export class PermisoRoutes { 
    
    public permisoController: PermisoController = new PermisoController();

    public routes(app): void {   

        app.use(cors());

        app.route('/permiso')
        .post(this.permisoController.insertPermiso)

        app.route('/permiso/get')
        .get(this.permisoController.getPermiso)

        app.route('/permiso/getById')
        .post(this.permisoController.getPermisoById)

        app.route('/permiso')
        .put(this.permisoController.updatePermiso)

        app.route('/permiso')
        .delete(this.permisoController.deletePermiso)

    }
}