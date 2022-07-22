
import { Request, Response } from "express";
import { ErrorModel } from "../../../util/error_handling/models/error";
import { SubSistemaDAO } from "../repository/subSistemaDAO";
import { ResponseModel } from "../../../util/models/response.model";

let subSistema = new SubSistemaDAO();

export class SubSistemaController {
	/*-------------------------------- app --------------------------------------------------------*/
	public async insertSubSistema(req: Request, res: Response, next) {
		try {
			let res_obj = new ResponseModel();
			res_obj.data = await subSistema.insertSubSistema(req.body)
			res_obj.message = 'SubSistema inserted'
			res_obj.status = 201
			res.status(res_obj.status).send(res_obj);
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
			next(err);
			console.log(
				"An error occurred while inserting subSistema :" +
				error +
				`: ${SubSistemaController.name} -> insertSubSistema`
			);
		}
	}

	public async getSubSistema(req: Request, res: Response, next) {
		try {
			let res_obj = new ResponseModel();
			res_obj.data = await subSistema.getSubSistema()
			res_obj.message = 'SubSistemaes obtained'
			if (res_obj.data.length == 0) {
				res_obj.message = 'No SubSistemaes present'
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
				`: ${SubSistemaController.name} -> getSubSistema`
			);
		}
	}

	public async getSubSistemaById(req: Request, res: Response, next) {
		try {
			let res_obj = new ResponseModel();
			res_obj.data = await subSistema.getSubSistemaById(req.body);
			if (res_obj.data.length != 0) {
				res_obj.message = 'SubSistema obtained'
				res_obj.status = 200
				res.status(res_obj.status).send(res_obj);
			} else {
				res_obj.message = 'SubSistema not found'
				res_obj.status = 404
				res.status(res_obj.status).send(res_obj);
			}
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
			next(err);
			console.log(
				"An error occurred while getting subSistema :" +
				error +
				`: ${SubSistemaController.name} -> getSubSistemaById`
			);
		}
	}

	public async updateSubSistema(req: Request, res: Response, next) {
		try {
			let res_obj = new ResponseModel();
			res_obj.data = await subSistema.updateSubSistema(req.body);
			if (res_obj.data.length == 0) {
				res_obj.message = 'SubSistema updated'
				res_obj.status = 200
				res.status(res_obj.status).send(res_obj);
			} else {
				res_obj.message = 'SubSistema not found'
				res_obj.status = 404
				res.status(res_obj.status).send(res_obj);
			}
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
			next(err);
			console.log(
				"An error occurred while updating subSistema :" +
				error +
				`: ${SubSistemaController.name} -> updateSubSistema`
			);
		}
	}

	public async deleteSubSistema(req: Request, res: Response, next) {
		try {
			let res_obj = new ResponseModel();
			res_obj.data = await subSistema.deleteSubSistema(req.body.sub_sistema_id);
			if (res_obj.data.length == 0) {
				res_obj.message = 'SubSistema deleted'
				res_obj.status = 200
				res.status(res_obj.status).send(res_obj);
			} else {
				res_obj.message = 'SubSistema not found'
				res_obj.status = 404
				res.status(res_obj.status).send(res_obj);
			}
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
			next(err);
			console.log(
				"An error occurred while deleting subSistema :" +
				error +
				`: ${SubSistemaController.name} -> deleteSubSistema`
			);
		}
	}


}