
import { Request, Response } from "express";
import { ErrorModel } from "../../../util/error_handling/models/error";
import { PermisoDAO } from "global/permiso/repository/permisoDAO";


let permiso = new PermisoDAO();

export class PermisoController {
	/*-------------------------------- app --------------------------------------------------------*/

	public async getPermiso(req: Request, res: Response, next) {
		try {
			res.status(201).send(await permiso.getPermiso());
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 404
			next(err);
			console.log(
				"An error occurred while getting users :" +
				error +
				`: ${PermisoController.name} -> getPermiso`
			);
		}
	}

	public async getPermisoById(req: Request, res: Response, next) {
		try {
			let result = (await permiso.getPermisoById(req.body));
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
				"An error occurred while getting permiso :" +
				error +
				`: ${PermisoController.name} -> getPermisoById`
			);
		}
	}

	public async updatePermiso(req: Request, res: Response, next) {
		try {
			let result = (await permiso.updatePermiso(req.body));
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
				"An error occurred while updating permiso :" +
				error +
				`: ${PermisoController.name} -> updatePermiso`
			);
		}
	}

	public async deletePermiso(req: Request, res: Response, next) {
		try {
			let result = (await permiso.deletePermiso(req.body.id));
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
				"An error occurred while deleting permiso :" +
				error +
				`: ${PermisoController.name} -> deletePermiso`
			);
		}
	}

}