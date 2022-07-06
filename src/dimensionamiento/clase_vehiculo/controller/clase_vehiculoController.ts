
import { Request, Response } from "express";
import { ErrorModel } from "../../../util/error_handling/models/error";
import { ClaseVehiculoDAO } from "../repository/clase_vehiculoDAO";


let clase_vehiculoDAO = new ClaseVehiculoDAO();

export class ClaseVehiculoController {
	/*-------------------------------- app --------------------------------------------------------*/
	public async insertClaseVehiculo(req: Request, res: Response, next) {
		try {
			res.send(await clase_vehiculoDAO.insertClaseVehiculo(req.body)); // Hacer lectura
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 400
			next(err);
			console.log(
				"An error occurred while inserting clase_vehiculoDAO :" +
				error +
				`: ${ClaseVehiculoController.name} -> insertClaseVehiculo`
			);
		}
	}

	public async getClaseVehiculo(req: Request, res: Response, next) {
		try {
			let result = await clase_vehiculoDAO.getClaseVehiculo();
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
				`: ${ClaseVehiculoController.name} -> getClaseVehiculo`
			);
		}
	}

	public async getClaseVehiculoById(req: Request, res: Response, next) {
		try {
			let result = (await clase_vehiculoDAO.getClaseVehiculoById(req.body));
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
				"An error occurred while getting clase_vehiculoDAO :" +
				error +
				`: ${ClaseVehiculoController.name} -> getClaseVehiculoById`
			);
		}
	}

	public async updateClaseVehiculo(req: Request, res: Response, next) {
		try {
			let result = (await clase_vehiculoDAO.updateClaseVehiculo(req.body));
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
				"An error occurred while updating clase_vehiculoDAO :" +
				error +
				`: ${ClaseVehiculoController.name} -> updateClaseVehiculo`
			);
		}
	}

	public async deleteClaseVehiculo(req: Request, res: Response, next) {
		try {
			let result = (await clase_vehiculoDAO.deleteClaseVehiculo(req.body.ClaseVehiculo_id));
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
				"An error occurred while deleting clase_vehiculoDAO :" +
				error +
				`: ${ClaseVehiculoController.name} -> deleteClaseVehiculo`
			);
		}
	}

}