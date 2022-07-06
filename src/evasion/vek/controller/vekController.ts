
import { Request, Response } from "express";
import { ErrorModel } from "../../../util/error_handling/models/error";
import { VekDAO } from "../repository/vekDAO";


let vek = new VekDAO();

export class VekController {
	/*-------------------------------- app --------------------------------------------------------*/
	public async insertVek(req: Request, res: Response, next) {
		try {
			res.send(await vek.insertVek(req.body, '2')); // Hacer lectura
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 400
			next(err);
			console.log(
				"An error occurred while inserting vek :" +
				error +
				`: ${VekController.name} -> insertVek`
			);
		}
	}

	public async getVek(req: Request, res: Response, next) {
		try {
			let result = await vek.getVek();
			if (result["rowCount"] != 0) {
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
				`: ${VekController.name} -> getVek`
			);
		}
	}

	public async getVekById(req: Request, res: Response, next) {
		try {
			let result = (await vek.getVekById(req.body));
			if (result["rowCount"] != 0) {
				res.send(result);
			} else {
				res.status(404).send(result);
			}
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 404
			next(err);
			console.log(
				"An error occurred while getting vek :" +
				error +
				`: ${VekController.name} -> getVekById`
			);
		}
	}

	public async deleteVek(req: Request, res: Response, next) {
		try {
			let hex = "020404029430011A11h125A1D332D332D6D66704"
			var str = '';
			for (var n = 0; n < hex.length; n += 2) {
				str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
			}
			console.log(str)

			let plot1 = hex.slice(0, 12)
			let dataField = hex.slice(12, 36)
			let plot2 = hex.slice(36, hex.length)
			console.log(plot1)
			console.log(dataField)
			console.log(plot2)
			res.send();
			/*let result = (await vek.deleteVek(req.body.Vek_id));
			if (result["rowCount"] != 0) {
				res.status(202).send(result);
			} else {
				res.status(404).send(result);
			}*/
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
			next(err);
			console.log(
				"An error occurred while deleting vek :" +
				error +
				`: ${VekController.name} -> deleteVek`
			);
		}
	}


	public async checkVek() {
		try {
			/*"020404029430----6704" 12
			"011A11h125A1D332D332D6D6" 24*/
			console.log('entre')
			let hex = "020404029430011A11h125A1D332D332D6D66704"
			let plot1 = hex.slice(0, 12)
			let dataField = hex.slice(12, 36)
			let plot2 = hex.slice(36, hex.length)
			console.log(plot1)
			console.log(dataField)
			console.log(plot2)
		} catch (error) {
			console.log(
				"An error occurred while checking vek :" +
				error +
				`: ${VekController.name} -> checkVek`
			);
		}
	}

}