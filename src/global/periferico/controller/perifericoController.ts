
import { Request, Response } from "express";
import { ErrorModel } from "../../../util/error_handling/models/error";
import { PerifericoDAO } from "../repository/perifericoDAO";


let periferico = new PerifericoDAO();

export class PerifericoController {
	/*-------------------------------- app --------------------------------------------------------*/
	public async insertPeriferico(req: Request, res: Response, next) {
		try {
			res.status(201).send(await periferico.insertPeriferico(req.body));
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 400
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
			let result = (await periferico.getPeriferico());
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 404
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
			let result = (await periferico.getPerifericoById(req.body));
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
				"An error occurred while getting periferico :" +
				error +
				`: ${PerifericoController.name} -> getPerifericoById`
			);
		}
	}

	public async updatePeriferico(req: Request, res: Response, next) {
		try {
			let result = (await periferico.updatePeriferico(req.body));
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
				"An error occurred while updating periferico :" +
				error +
				`: ${PerifericoController.name} -> updatePeriferico`
			);
		}
	}

	public async deletePeriferico(req: Request, res: Response, next) {
		try {
			let result = (await periferico.deletePeriferico(req.body.id));
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
				"An error occurred while deleting periferico :" +
				error +
				`: ${PerifericoController.name} -> deletePeriferico`
			);
		}
	}

}