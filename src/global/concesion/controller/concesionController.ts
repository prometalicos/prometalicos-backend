
import { Request, Response } from "express";
import { ErrorModel } from "../../../util/error_handling/models/error";
import { ConcesionDAO } from "../repository/concesionDAO";
import { ResponseModel } from "util/models/response.model";


let concesion = new ConcesionDAO();

export class ConcesionController {
	/*-------------------------------- app --------------------------------------------------------*/
	public async insertConcesion(req: Request, res: Response, next) {
		try {
			let res_obj = new ResponseModel();
			res_obj.data = await concesion.insertConcesion(req.body)
			res_obj.message = 'Concesion inserted'
			res_obj.status = 201
			res.status(res_obj.status).send(res_obj);
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
			next(err);
			console.log(
				"An error occurred while inserting concesion :" +
				error +
				`: ${ConcesionController.name} -> insertConcesion`
			);
		}
	}

	public async getConcesion(req: Request, res: Response, next) {
		try {
			let res_obj = new ResponseModel();
			res_obj.data = await concesion.getConcesion()
			res_obj.message = 'Concesiones obtained'
			if (res_obj.data["rowCount"] == 0) {
				res_obj.message = 'No concesiones present'
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
				`: ${ConcesionController.name} -> getConcesion`
			);
		}
	}

	public async getConcesionById(req: Request, res: Response, next) {
		try {
			let res_obj = new ResponseModel();
			res_obj.data = await concesion.getConcesionById(req.body);
			if (res_obj.data["rowCount"] != 0) {
				res_obj.message = 'Concesion obtained'
				res_obj.status = 200
				res.status(res_obj.status).send(res_obj);
			} else {
				res_obj.message = 'Concesion not found'
				res_obj.status = 404
				res.status(res_obj.status).send(res_obj);
			}
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
			next(err);
			console.log(
				"An error occurred while getting concesion :" +
				error +
				`: ${ConcesionController.name} -> getConcesionById`
			);
		}
	}

	public async updateConcesion(req: Request, res: Response, next) {
		try {
			let res_obj = new ResponseModel();
			res_obj.data = await concesion.updateConcesion(req.body);
			if (res_obj.data["rowCount"] != 0) {
				res_obj.message = 'Concesion updated'
				res_obj.status = 204
				res.status(res_obj.status).send(res_obj);
			} else {
				res_obj.message = 'Concesion not found'
				res_obj.status = 404
				res.status(res_obj.status).send(res_obj);
			}
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
			next(err);
			console.log(
				"An error occurred while updating concesion :" +
				error +
				`: ${ConcesionController.name} -> updateConcesion`
			);
		}
	}

	public async deleteConcesion(req: Request, res: Response, next) {
		try {
			let res_obj = new ResponseModel();
			res_obj.data = await concesion.deleteConcesion(req.body.concesion_id);
			if (res_obj.data["rowCount"] != 0) {
				res_obj.message = 'Concesion deleted'
				res_obj.status = 202
				res.status(res_obj.status).send(res_obj);
			} else {
				res_obj.message = 'Concesion not found'
				res_obj.status = 404
				res.status(res_obj.status).send(res_obj);
			}
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
			next(err);
			console.log(
				"An error occurred while deleting concesion :" +
				error +
				`: ${ConcesionController.name} -> deleteConcesion`
			);
		}
	}

}