
import { Request, Response } from "express";
import { ErrorModel } from "../../../util/error_handling/models/error";
import { TipoPerifericoDAO } from "../repository/tipoPerifericoDAO";
import { ResponseModel } from "../../../util/models/response.model";

let tipoPeriferico = new TipoPerifericoDAO();

export class TipoPerifericoController {
	/*-------------------------------- app --------------------------------------------------------*/
	public async insertTipoPeriferico(req: Request, res: Response, next) {
		try {
			let res_obj = new ResponseModel();
			res_obj.data = await tipoPeriferico.insertTipoPeriferico(req.body)
			res_obj.message = 'TipoPeriferico inserted'
			res_obj.status = 201
			res.status(res_obj.status).send(res_obj);
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
			next(err);
			console.log(
				"An error occurred while inserting TipoPeriferico :" +
				error +
				`: ${TipoPerifericoController.name} -> insertTipoPeriferico`
			);
		}
	}

	public async getTipoPeriferico(req: Request, res: Response, next) {
		try {
			let res_obj = new ResponseModel();
			res_obj.data = await tipoPeriferico.getTipoPeriferico()
			res_obj.message = 'TipoPerifericoes obtained'
			if (res_obj.data.length == 0) {
				res_obj.message = 'No TipoPerifericoes present'
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
				`: ${TipoPerifericoController.name} -> getTipoPeriferico`
			);
		}
	}

	public async getTipoPerifericoById(req: Request, res: Response, next) {
		try {
			let res_obj = new ResponseModel();
			res_obj.data = await tipoPeriferico.getTipoPerifericoById(req.body);
			if (res_obj.data.length != 0) {
				res_obj.message = 'TipoPeriferico obtained'
				res_obj.status = 200
				res.status(res_obj.status).send(res_obj);
			} else {
				res_obj.message = 'TipoPeriferico not found'
				res_obj.status = 404
				res.status(res_obj.status).send(res_obj);
			}
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
			next(err);
			console.log(
				"An error occurred while getting TipoPeriferico :" +
				error +
				`: ${TipoPerifericoController.name} -> getTipoPerifericoById`
			);
		}
	}

	public async updateTipoPeriferico(req: Request, res: Response, next) {
		try {
			let res_obj = new ResponseModel();
			res_obj.data = await tipoPeriferico.updateTipoPeriferico(req.body);
			if (res_obj.data.length == 0) {
				res_obj.message = 'TipoPeriferico updated'
				res_obj.status = 200
				res.status(res_obj.status).send(res_obj);
			} else {
				res_obj.message = 'TipoPeriferico not found'
				res_obj.status = 404
				res.status(res_obj.status).send(res_obj);
			}
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
			next(err);
			console.log(
				"An error occurred while updating TipoPeriferico :" +
				error +
				`: ${TipoPerifericoController.name} -> updateTipoPeriferico`
			);
		}
	}

	public async deleteTipoPeriferico(req: Request, res: Response, next) {
		try {
			let res_obj = new ResponseModel();
			res_obj.data = await tipoPeriferico.deleteTipoPeriferico(req.body.sub_sistema_id);
			if (res_obj.data.length == 0) {
				res_obj.message = 'TipoPeriferico deleted'
				res_obj.status = 200
				res.status(res_obj.status).send(res_obj);
			} else {
				res_obj.message = 'TipoPeriferico not found'
				res_obj.status = 404
				res.status(res_obj.status).send(res_obj);
			}
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
			next(err);
			console.log(
				"An error occurred while deleting TipoPeriferico :" +
				error +
				`: ${TipoPerifericoController.name} -> deleteTipoPeriferico`
			);
		}
	}


}