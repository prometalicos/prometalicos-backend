
import { Request, Response } from "express";
import { ErrorModel } from "../../../util/error_handling/models/error";
import { TarjetaPuertosDAO } from "../repository/tarjetaPuertosDAO";
import { ResponseModel } from "../../../util/models/response.model";

let tarjetaPuertosDAO = new TarjetaPuertosDAO();

export class TarjetaPuertosController {
	/*-------------------------------- app --------------------------------------------------------*/
	public async insertTarjetaPuertos(req: Request, res: Response, next) {
		try {
			let res_obj = new ResponseModel();
			res_obj.data = await tarjetaPuertosDAO.insertTarjetaPuertos(req.body)
			res_obj.message = 'Tarjeta puertos inserted'
			res_obj.status = 201
			res.status(res_obj.status).send(res_obj);
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
			next(err);
			console.log(
				"An error occurred while inserting tarjeta puertos :" +
				error +
				`: ${TarjetaPuertosController.name} -> insertTarjetaPuertos`
			);
		}
	}

	public async getTarjetaPuertos(req: Request, res: Response, next) {
		try {
			let res_obj = new ResponseModel();
			res_obj.data = await tarjetaPuertosDAO.getTarjetaPuertos();
			res_obj.message = 'Tarjeta puertos obtained'
			if (res_obj.data.length == 0) {
				res_obj.message = 'No tarjeta puertos present'
			}
			res_obj.status = 200
			res.status(res_obj.status).send(res_obj);
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
			next(err);
			console.log(
				"An error occurred while getting tarjeta puertos :" +
				error +
				`: ${TarjetaPuertosController.name} -> getTarjetaPuertos`
			);
		}
	}

	public async getTarjetaPuertosById(req: Request, res: Response, next) {
		try {
			let res_obj = new ResponseModel();
			res_obj.data = await tarjetaPuertosDAO.getTarjetaPuertosById(req.body);
			if (res_obj.data.length != 0) {
				res_obj.message = 'Tarjeta puertos obtained'
				res_obj.status = 200
				res.status(res_obj.status).send(res_obj);
			} else {
				res_obj.message = 'Tarjeta puertos not found'
				res_obj.status = 404
				res.status(res_obj.status).send(res_obj);
			}
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
			next(err);
			console.log(
				"An error occurred while getting tarjeta puertos :" +
				error +
				`: ${TarjetaPuertosController.name} -> getTarjetaPuertosById`
			);
		}
	}

	public async updateTarjetaPuertos(req: Request, res: Response, next) {
		try {
			let res_obj = new ResponseModel();
			res_obj.data = await tarjetaPuertosDAO.updateTarjetaPuertos(req.body);
			if (res_obj.data.length == 0) {
				res_obj.message = 'Tarjeta puertos updated'
				res_obj.status = 200
				res.status(res_obj.status).send(res_obj);
			} else {
				res_obj.message = 'Tarjeta puertos not found'
				res_obj.status = 404
				res.status(res_obj.status).send(res_obj);
			}
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
			next(err);
			console.log(
				"An error occurred while updating tarjeta puertos  :" +
				error +
				`: ${TarjetaPuertosController.name} -> updateTarjetaPuertos`
			);
		}
	}

	public async deleteTarjetaPuertos(req: Request, res: Response, next) {
		try {
			let res_obj = new ResponseModel();
			res_obj.data = await tarjetaPuertosDAO.deleteTarjetaPuertos(req.body.tarjeta_puertos_id);
			if (res_obj.data.length != 0) {
				res_obj.message = 'Tarjeta puertos deleted'
				res_obj.status = 200
				res.status(res_obj.status).send(res_obj);
			} else {
				res_obj.message = 'Tarjeta puertos not found'
				res_obj.status = 404
				res.status(res_obj.status).send(res_obj);
			}
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
			next(err);
			console.log(
				"An error occurred while deleting tarjeta puertos :" +
				error +
				`: ${TarjetaPuertosController.name} -> deleteTarjetaPuertos`
			);
		}
	}

}