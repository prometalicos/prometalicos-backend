
import { Request, Response } from "express";
import { ErrorModel } from "../../error_handling/models/error";
import { ConcesionDAO } from "../repository/concesionDAO";


let concesion = new ConcesionDAO();

export class ConcesionController {
	/*-------------------------------- app --------------------------------------------------------*/
	public async insertConcesion(req: Request, res: Response, next) {
		try {
			res.send(await concesion.insertConcesion(req.body));
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 400
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
			err.status = 404
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
			res.send(await concesion.getConcesionById(req.body));
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 404
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
			res.send(await concesion.updateConcesion(req.body));
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 400
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
			res.send(await concesion.deleteConcesion(req.body.id));
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