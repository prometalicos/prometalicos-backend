
import { Request, Response } from "express";
import { ErrorModel } from "../../../util/error_handling/models/error";
import { PosibleInfraccionDAO } from "../repository/posible_infraccionDAO";


let posibleInfraccionDAO = new PosibleInfraccionDAO();

export class PosibleInfraccionController {
	/*-------------------------------- app --------------------------------------------------------*/
	public async insertPosibleInfraccion(req: Request, res: Response, next) {
		try {
			res.send(await posibleInfraccionDAO.insertPosibleInfraccion(req.body)); // Hacer lectura
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 400
			next(err);
			console.log(
				"An error occurred while inserting posibleInfraccionDAO :" +
				error +
				`: ${PosibleInfraccionController.name} -> insertPosibleInfraccion`
			);
		}
	}

	public async getPosibleInfraccion(req: Request, res: Response, next) {
		try {
			let result = await posibleInfraccionDAO.getPosibleInfraccion();
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
				"An error occurred while getting users :" +
				error +
				`: ${PosibleInfraccionController.name} -> getPosibleInfraccion`
			);
		}
	}

	public async getPosibleInfraccionById(req: Request, res: Response, next) {
		try {
			let result = (await posibleInfraccionDAO.getPosibleInfraccionById(req.body));
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
				"An error occurred while getting posibleInfraccionDAO :" +
				error +
				`: ${PosibleInfraccionController.name} -> getPosibleInfraccionById`
			);
		}
	}

	public async updatePosibleInfraccion(req: Request, res: Response, next) {
		try {
			let result = (await posibleInfraccionDAO.updatePosibleInfraccion(req.body));
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
				"An error occurred while updating posibleInfraccionDAO :" +
				error +
				`: ${PosibleInfraccionController.name} -> updatePosibleInfraccion`
			);
		}
	}

	public async deletePosibleInfraccion(req: Request, res: Response, next) {
		try {
			let result = (await posibleInfraccionDAO.deletePosibleInfraccion(req.body.PosibleInfraccion_id));
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
				"An error occurred while deleting posibleInfraccionDAO :" +
				error +
				`: ${PosibleInfraccionController.name} -> deletePosibleInfraccion`
			);
		}
	}

}