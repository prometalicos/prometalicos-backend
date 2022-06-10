
import { Request, Response } from "express";
import { ErrorModel } from "../../../util/error_handling/models/error";
import { SubSistemaDAO } from "global/subSistema/repository/subSistemaDAO";

let subSistema = new SubSistemaDAO();

export class SubSistemaController {
	/*-------------------------------- app --------------------------------------------------------*/
	public async insertSubSistema(req: Request, res: Response, next) {
		try {
			res.status(201).send(await subSistema.insertSubSistema(req.body));
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 400
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
			res.send(await subSistema.getSubSistema());
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 404
			next(err);
			console.log(
				"An error occurred while getting subSistema :" +
				error +
				`: ${SubSistemaController.name} -> getSubSistema`
			);
		}
	}

	public async getSubSistemaById(req: Request, res: Response, next) {
		try {
			let result = (await subSistema.getSubSistemaById(req.body));
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
				"An error occurred while getting subSistema :" +
				error +
				`: ${SubSistemaController.name} -> getSubSistemaById`
			);
		}
	}

	public async updateSubSistema(req: Request, res: Response, next) {
		try {
			let result = (await subSistema.updateSubSistema(req.body));
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
				"An error occurred while updating subSistema :" +
				error +
				`: ${SubSistemaController.name} -> updateSubSistema`
			);
		}
	}

	public async deleteSubSistema(req: Request, res: Response, next) {
		try {
			let result = (await subSistema.deleteSubSistema(req.body.id));
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
				"An error occurred while deleting subSistema :" +
				error +
				`: ${SubSistemaController.name} -> deleteSubSistema`
			);
		}
	}

}