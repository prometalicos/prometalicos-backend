
import { Request, Response } from "express";
import { ErrorModel } from "../../../util/error_handling/models/error";
import { SedeDAO } from "./../repository/sedeDAO";
import { ResponseModel } from "../../../util/models/response.model";


let sede = new SedeDAO();

export class SedeController {
	/*-------------------------------- app --------------------------------------------------------*/
	public async insertSede(req: Request, res: Response, next) {
		try {
			let res_obj = new ResponseModel();
			res_obj.data = await sede.insertSede(req.body)
			res_obj.message = 'Sede inserted'
			res_obj.status = 201
			res.status(res_obj.status).send(res_obj);
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
			next(err);
			console.log(
				"An error occurred while inserting sede :" +
				error +
				`: ${SedeController.name} -> insertSede`
			);
		}
	}

	public async getSede(req: Request, res: Response, next) {
		try {
			let res_obj = new ResponseModel();
			res_obj.data = await sede.getSede()
			res_obj.message = 'Sedees obtained'
			if (res_obj.data.length == 0) {
				res_obj.message = 'No Sedees present'
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
				`: ${SedeController.name} -> getSede`
			);
		}
	}

	public async getSedeById(req: Request, res: Response, next) {
		try {
			let res_obj = new ResponseModel();
			res_obj.data = await sede.getSedeById(req.body);
			if (res_obj.data.length != 0) {
				res_obj.message = 'Sede obtained'
				res_obj.status = 200
				res.status(res_obj.status).send(res_obj);
			} else {
				res_obj.message = 'Sede not found'
				res_obj.status = 404
				res.status(res_obj.status).send(res_obj);
			}
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
			next(err);
			console.log(
				"An error occurred while getting sede :" +
				error +
				`: ${SedeController.name} -> getSedeById`
			);
		}
	}

	public async updateSede(req: Request, res: Response, next) {
		try {
			let res_obj = new ResponseModel();
			res_obj.data = await sede.updateSede(req.body);
			if (res_obj.data.length == 0) {
				res_obj.message = 'Sede updated'
				res_obj.status = 204
				res.status(res_obj.status).send(res_obj);
			} else {
				res_obj.message = 'Sede not found'
				res_obj.status = 404
				res.status(res_obj.status).send(res_obj);
			}
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
			next(err);
			console.log(
				"An error occurred while updating sede :" +
				error +
				`: ${SedeController.name} -> updateSede`
			);
		}
	}

	public async deleteSede(req: Request, res: Response, next) {
		try {
			let res_obj = new ResponseModel();
			res_obj.data = await sede.deleteSede(req.body.sede_id);
			if (res_obj.data.length != 0) {
				res_obj.message = 'Sede deleted'
				res_obj.status = 202
				res.status(res_obj.status).send(res_obj);
			} else {
				res_obj.message = 'Sede not found'
				res_obj.status = 404
				res.status(res_obj.status).send(res_obj);
			}
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
			next(err);
			console.log(
				"An error occurred while deleting sede :" +
				error +
				`: ${SedeController.name} -> deleteSede`
			);
		}
	}


}