
import { Request, Response } from "express";
import { ErrorModel } from "../../../util/error_handling/models/error";
import { SedeDAO } from "global/sede/repository/sedeDAO";


let sede = new SedeDAO();

export class SedeController {
	/*-------------------------------- app --------------------------------------------------------*/
	public async insertSede(req: Request, res: Response, next) {
		try {
			res.status(201).send(await sede.insertSede(req.body));
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 400
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
			res.send(await sede.getSede());
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 404
			next(err);
			console.log(
				"An error occurred while getting sede :" +
				error +
				`: ${SedeController.name} -> getSede`
			);
		}
	}

	public async getSedeById(req: Request, res: Response, next) {
		try {
			let result = (await sede.getSedeById(req.body));
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
				"An error occurred while getting sede :" +
				error +
				`: ${SedeController.name} -> getSedeById`
			);
		}
	}

	public async updateSede(req: Request, res: Response, next) {
		try {
			let result = (await sede.updateSede(req.body));
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
				"An error occurred while updating sede :" +
				error +
				`: ${SedeController.name} -> updateSede`
			);
		}
	}

	public async deleteSede(req: Request, res: Response, next) {
		try {
			let result = (await sede.deleteSede(req.body.id));
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
				"An error occurred while deleting sede :" +
				error +
				`: ${SedeController.name} -> deleteSede`
			);
		}
	}

}