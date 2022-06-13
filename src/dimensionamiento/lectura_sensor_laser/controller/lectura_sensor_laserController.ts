
import { Request, Response } from "express";
import { ErrorModel } from "../../../util/error_handling/models/error";
import { LecturaSensoresLaserDAO } from "../repository/lectura_sensores_laserDAO";


let LecturaSensoresLaser = new LecturaSensoresLaserDAO();

export class LecturaSensoresLaserController {
	/*-------------------------------- app --------------------------------------------------------*/
	public async insertLecturaSensoresLaser(req: Request, res: Response, next) {
		try {
			res.send(await LecturaSensoresLaser.insertLecturaSensoresLaser(req.body, '2'));
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 400
			next(err);
			console.log(
				"An error occurred while inserting LecturaSensoresLaser :" +
				error +
				`: ${LecturaSensoresLaserController.name} -> insertLecturaSensoresLaser`
			);
		}
	}

	public async getLecturaSensoresLaser(req: Request, res: Response, next) {
		try {
			let result = await LecturaSensoresLaser.getLecturaSensoresLaser();
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
				`: ${LecturaSensoresLaserController.name} -> getLecturaSensoresLaser`
			);
		}
	}

	public async getLecturaSensoresLaserById(req: Request, res: Response, next) {
		try {
			let result = (await LecturaSensoresLaser.getLecturaSensoresLaserById(req.body));
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
				"An error occurred while getting LecturaSensoresLaser :" +
				error +
				`: ${LecturaSensoresLaserController.name} -> getLecturaSensoresLaserById`
			);
		}
	}

	public async updateLecturaSensoresLaser(req: Request, res: Response, next) {
		try {
			let result = (await LecturaSensoresLaser.updateLecturaSensoresLaser(req.body));
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
				"An error occurred while updating LecturaSensoresLaser :" +
				error +
				`: ${LecturaSensoresLaserController.name} -> updateLecturaSensoresLaser`
			);
		}
	}

	public async deleteLecturaSensoresLaser(req: Request, res: Response, next) {
		try {
			let result = (await LecturaSensoresLaser.deleteLecturaSensoresLaser(req.body.LecturaSensoresLaser_id));
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
				"An error occurred while deleting LecturaSensoresLaser :" +
				error +
				`: ${LecturaSensoresLaserController.name} -> deleteLecturaSensoresLaser`
			);
		}
	}

}