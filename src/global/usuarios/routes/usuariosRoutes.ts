
import {Request, Response, NextFunction} from "express";
import * as auth from '../../../util/auth/services/authService'
import { UsuariosController } from "../controllers/usuariosController";
import * as cors from 'cors'

export class UsiariosRoutes { 
    
    public usuariosController: UsuariosController = new UsuariosController();

    public routes(app): void {   

        app.use(cors());

        app.route('/user')
        .post(this.usuariosController.insertUsuario)

        app.route('/user/get')
        .post(auth,this.usuariosController.getUsuario)

        app.route('/user/getById')
        .post(auth,this.usuariosController.getUsuarioById)

        app.route('/user/update')
        .post(auth,this.usuariosController.updateUsuario)

        app.route('/user/delete')
        .post(auth,this.usuariosController.deleteUsuario)

        app.route('/user/get_menu')
        .post(this.usuariosController.getMenu)

        app.route('/user/get_sub_menu')
        .post(auth,this.usuariosController.getSubMenu)
    }
}