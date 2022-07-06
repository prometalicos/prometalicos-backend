
import { Request, Response } from "express";
import { ErrorModel } from "../../../util/error_handling/models/error";
import { PerifericoDAO } from "../repository/perifericoDAO";
import { ResponseModel } from "util/models/response.model";


let periferico = new PerifericoDAO();

export class PerifericoController {
	/*-------------------------------- app --------------------------------------------------------*/
	public async insertPeriferico(req: Request, res: Response, next) {
		try {
			let res_obj = new ResponseModel();
			res_obj.data = await periferico.insertPeriferico(req.body)
			res_obj.message = 'Periferico inserted'
			res_obj.status = 201
			res.status(res_obj.status).send(res_obj);
			
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
			next(err);
			console.log(
				"An error occurred while inserting periferico :" +
				error +
				`: ${PerifericoController.name} -> insertPeriferico`
			);
		}
	}

	public async getPeriferico(req: Request, res: Response, next) {
		try {
			let res_obj = new ResponseModel();
			res_obj.data = await periferico.getPeriferico()
			res_obj.message = 'Perifericos obtained'
			if (res_obj.data["rowCount"] == 0) {
				res_obj.message = 'No Perifericos present'
			}
			res_obj.status = 200
			res.status(res_obj.status).send(res_obj);
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
			next(err);
			console.log(
				"An error occurred while getting perifericos :" +
				error +
				`: ${PerifericoController.name} -> getPeriferico`
			);
		}
	}

	public async getPerifericoById(req: Request, res: Response, next) {
		try {
			let res_obj = new ResponseModel();
			res_obj.data = await periferico.getPerifericoById(req.body);
			if (res_obj.data["rowCount"] != 0) {
				res_obj.message = 'Periferico obtained'
				res_obj.status = 200
				res.status(res_obj.status).send(res_obj);
			} else {
				res_obj.message = 'Periferico not found'
				res_obj.status = 404
				res.status(res_obj.status).send(res_obj);
			}
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
			next(err);
			console.log(
				"An error occurred while getting periferico :" +
				error +
				`: ${PerifericoController.name} -> getPerifericoById`
			);
		}
	}

	public async updatePeriferico(req: Request, res: Response, next) {
		try {
			let res_obj = new ResponseModel();
			res_obj.data = await periferico.updatePeriferico(req.body)
			if (res_obj.data["rowCount"] != 0) {
				res_obj.message = 'Periferico updated'
				res_obj.status = 204
				res.status(res_obj.status).send(res_obj);
			} else {
				res_obj.message = 'Periferico not found'
				res_obj.status = 404
				res.status(res_obj.status).send(res_obj);
			}
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
			next(err);
			console.log(
				"An error occurred while updating periferico :" +
				error +
				`: ${PerifericoController.name} -> updatePeriferico`
			);
		}
	}

	public async deletePeriferico(req: Request, res: Response, next) {
		try {
			let res_obj = new ResponseModel();
			res_obj.data = await periferico.deletePeriferico(req.body.id)
			if (res_obj.data["rowCount"] != 0) {
				res_obj.message = 'Periferico deleted'
				res_obj.status = 202
				res.status(res_obj.status).send(res_obj);
			} else {
				res_obj.message = 'Periferico not found'
				res_obj.status = 404
				res.status(res_obj.status).send(res_obj);
			}
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
			next(err);
			console.log(
				"An error occurred while deleting periferico :" +
				error +
				`: ${PerifericoController.name} -> deletePeriferico`
			);
		}
	}

}