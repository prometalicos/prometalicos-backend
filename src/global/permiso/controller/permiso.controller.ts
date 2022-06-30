
import { Request, Response } from "express";
import { ErrorModel } from "../../../util/error_handling/models/error";
import { PermisoDAO } from "global/permiso/repository/permisoDAO";
import { ResponseModel } from "util/models/response.model";


let permiso = new PermisoDAO();

export class PermisoController {
	/*-------------------------------- app --------------------------------------------------------*/

	public async getPermiso(req: Request, res: Response, next) {
		try {
			let res_obj = new ResponseModel();
			res_obj.data = await permiso.getPermiso()
			res_obj.message = 'Permisoes obtained'
			if (res_obj.data["rowCount"] == 0) {
				res_obj.message = 'No Permisos present'
			}
			res_obj.status = 200
			res.status(res_obj.status).send(res_obj);
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
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
			let res_obj = new ResponseModel();
			res_obj.data = await permiso.getPermisoById(req.body);
			if (res_obj.data["rowCount"] != 0) {
				res_obj.message = 'Permiso obtained'
				res_obj.status = 200
				res.status(res_obj.status).send(res_obj);
			} else {
				res_obj.message = 'Permiso not found'
				res_obj.status = 404
				res.status(res_obj.status).send(res_obj);
			}
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
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
			let res_obj = new ResponseModel();
			res_obj.data = await permiso.updatePermiso(req.body);
			if (res_obj.data["rowCount"] != 0) {
				res_obj.message = 'Permiso updated'
				res_obj.status = 204
				res.status(res_obj.status).send(res_obj);
			} else {
				res_obj.message = 'Permiso not found'
				res_obj.status = 404
				res.status(res_obj.status).send(res_obj);
			}
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
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
			let res_obj = new ResponseModel();
			res_obj.data = await permiso.deletePermiso(req.body.permiso_id);
			if (res_obj.data["rowCount"] != 0) {
				res_obj.message = 'Permiso deleted'
				res_obj.status = 202
				res.status(res_obj.status).send(res_obj);
			} else {
				res_obj.message = 'Permiso not found'
				res_obj.status = 404
				res.status(res_obj.status).send(res_obj);
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