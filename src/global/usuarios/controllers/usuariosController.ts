
import { Request, Response } from "express";
import { UsuariosDAO } from "../repository/usuarioDAO";
import { ErrorModel } from "../../../util/error_handling/models/error";
//import { } from "express-jwt";

let usuarios = new UsuariosDAO();

export class UsuariosController {
	/*-------------------------------- app --------------------------------------------------------*/
	public async insertUsuario(req: Request, res: Response, next) {
		try {
			res.status(201).send(await usuarios.insertUsuario(req.body));
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 400
			next(err);
			console.error(error)
			console.log(
				"An error occurred while inserting user :" +
				error +
				`: ${UsuariosController.name} -> insertUsuario`
			);
		}
	}

	public async getUsuario(req: Request, res: Response, next) {
		try {
			res.send(await usuarios.getUsuario());
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 404
			next(err);
			console.log(
				"An error occurred while getting users :" +
				error +
				`: ${UsuariosController.name} -> getUsuario`
			);
		}
	}

	public async getUsuarioById(req: Request, res: Response, next) {
		try {
			let result = (await usuarios.getUsuarioById(req.body));
			if(result["rowCount"] != 0){
				res.send(result);
			} else {
				res.status(404).send(result);
			}
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 404
			next(err);
			console.log(
				"An error occurred while getting user :" +
				error +
				`: ${UsuariosController.name} -> getUsuarioById`
			);
		}
	}

	public async updateUsuario(req: Request, res: Response, next) {
		try {
			let result = (await usuarios.updateUsuario(req.body));
			if(result["rowCount"] != 0){
				res.status(204).send(result);
			} else {
				res.status(404).send(result);
			}
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 400
			next(err);
			console.log(
				"An error occurred while updating user :" +
				error +
				`: ${UsuariosController.name} -> updateUsuario`
			);
		}
	}

	public async deleteUsuario(req: Request, res: Response, next) {
		try {
			let result = (await usuarios.deleteUsuario(req.body.id));
			if(result["rowCount"] != 0){
				res.status(202).send(result);
			} else {
				res.status(404).send(result);
			}
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
			next(err);
			console.log(
				"An error occurred while deleting user :" +
				error +
				`: ${UsuariosController.name} -> deleteUsuario`
			);
		}
	}

	public async getMenu(req: Request, res: Response, next) {
		try {
			res.send(await usuarios.getMenu(req.body.id, req.body.op));
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
			next(err);
			console.log(
				"An error occurred while get menu :" +
				error +
				`: ${UsuariosController.name} -> getMenu`
			);
		}
	}

	public async getSubMenu(req: Request, res: Response, next) {
		try {
			let result = (await usuarios.getSubMenu(req.body.id));
			if(result["rowCount"] != 0){
				res.send(result);
			} else {
				res.status(404).send(result);
			}
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
			next(err);
			console.log(
				"An error occurred while get sub menu :" +
				error +
				`: ${UsuariosController.name} -> getSubMenu`
			);
		}
	}
}