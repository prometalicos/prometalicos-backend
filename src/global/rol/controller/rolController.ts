
import { Request, Response } from "express";
import { ErrorModel } from "../../../util/error_handling/models/error";
import { RolDAO } from "../repository/rolDAO";

let rol = new RolDAO();

export class RolController {
	/*-------------------------------- app --------------------------------------------------------*/
	public async insertRol(req: Request, res: Response, next) {
		try {
			res.send(await rol.insertRol(req.body));
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 400
			next(err);
			console.log(
				"An error occurred while inserting rol :" +
				error +
				`: ${RolController.name} -> insertRol`
			);
		}
	}

	public async getRol(req: Request, res: Response, next) {
		try {
			res.send(await rol.getRol());
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 404
			next(err);
			console.log(
				"An error occurred while getting rol :" +
				error +
				`: ${RolController.name} -> getRol`
			);
		}
	}

	public async getRolById(req: Request, res: Response, next) {
		try {
			res.send(await rol.getRolById(req.body));
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 404
			next(err);
			console.log(
				"An error occurred while getting rol :" +
				error +
				`: ${RolController.name} -> getRolById`
			);
		}
	}

	public async updateRol(req: Request, res: Response, next) {
		try {
			res.send(await rol.updateRol(req.body));
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 400
			next(err);
			console.log(
				"An error occurred while updating rol :" +
				error +
				`: ${RolController.name} -> updateRol`
			);
		}
	}

	public async deleteRol(req: Request, res: Response, next) {
		try {
			res.send(await rol.deleteRol(req.body.id));
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
			next(err);
			console.log(
				"An error occurred while deleting rol :" +
				error +
				`: ${RolController.name} -> deleteRol`
			);
		}
	}

}