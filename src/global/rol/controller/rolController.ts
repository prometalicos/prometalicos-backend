
import { Request, Response } from "express";
import { ErrorModel } from "../../../util/error_handling/models/error";
import { RolDAO } from "../repository/rolDAO";
import { ResponseModel } from "../../../util/models/response.model";

let rol = new RolDAO();

export class RolController {
	/*-------------------------------- app --------------------------------------------------------*/
	public async insertRol(req: Request, res: Response, next) {
		try {
			let res_obj = new ResponseModel();
			res_obj.data = await rol.insertRol(req.body)
			res_obj.message = 'Rol inserted'
			res_obj.status = 201
			res.status(res_obj.status).send(res_obj);
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
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
			let res_obj = new ResponseModel();
			res_obj.data = await rol.getRol()
			res_obj.message = 'Roles obtained'
			if (res_obj.data["rowCount"] == 0) {
				res_obj.message = 'No Roles present'
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
				`: ${RolController.name} -> getRol`
			);
		}
	}

	public async getRolById(req: Request, res: Response, next) {
		try {
			let res_obj = new ResponseModel();
			res_obj.data = await rol.getRolById(req.body);
			if (res_obj.data["rowCount"] != 0) {
				res_obj.message = 'Rol obtained'
				res_obj.status = 200
				res.status(res_obj.status).send(res_obj);
			} else {
				res_obj.message = 'Rol not found'
				res_obj.status = 404
				res.status(res_obj.status).send(res_obj);
			}
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
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
			let res_obj = new ResponseModel();
			res_obj.data = await rol.updateRol(req.body);
			if (res_obj.data["rowCount"] != 0) {
				res_obj.message = 'Rol updated'
				res_obj.status = 204
				res.status(res_obj.status).send(res_obj);
			} else {
				res_obj.message = 'Rol not found'
				res_obj.status = 404
				res.status(res_obj.status).send(res_obj);
			}
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
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
			let res_obj = new ResponseModel();
			res_obj.data = await rol.deleteRol(req.body.rol_id);
			if (res_obj.data["rowCount"] != 0) {
				res_obj.message = 'Rol deleted'
				res_obj.status = 202
				res.status(res_obj.status).send(res_obj);
			} else {
				res_obj.message = 'Rol not found'
				res_obj.status = 404
				res.status(res_obj.status).send(res_obj);
			}
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