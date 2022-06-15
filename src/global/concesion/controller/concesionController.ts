
import { Request, Response } from "express";
import { ErrorModel } from "../../../util/error_handling/models/error";
import { ConcesionDAO } from "../repository/concesionDAO";


let concesion = new ConcesionDAO();

export class ConcesionController {
	/*-------------------------------- app --------------------------------------------------------*/
	public async insertConcesion(req: Request, res: Response, next) {
		try {
			res.status(201).send(await concesion.insertConcesion(req.body));
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
			res.send(await concesion.getConcesion());
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
			let result = await concesion.getConcesionById(req.body);
			if(result["rowCount"] != 0){
				res.send(result);
			} else {
				res.status(404).send(result);
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
			let result = await concesion.updateConcesion(req.body);
			if(result["rowCount"] != 0){
				res.status(204).send(result);
			} else {
				res.status(404).send(result);
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
			let result = await concesion.deleteConcesion(req.body.concesion_id);
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
				"An error occurred while deleting concesion :" +
				error +
				`: ${ConcesionController.name} -> deleteConcesion`
			);
		}
	}

}