
import { Request, Response } from "express";
import { ErrorModel } from "../../../util/error_handling/models/error";
import { EventoTransitoDAO } from "../repository/evento_transitoDAO";


let EventoTransito = new EventoTransitoDAO();

export class EventoTransitoController {
	/*-------------------------------- app --------------------------------------------------------*/
	public async insertEventoTransito(req: Request, res: Response, next) {
		try {
			res.send(await EventoTransito.insertEventoTransito(req.body));
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 400
			next(err);
			console.log(
				"An error occurred while inserting EventoTransito :" +
				error +
				`: ${EventoTransitoController.name} -> insertEventoTransito`
			);
		}
	}

	public async getEventoTransitoAll(req: Request, res: Response, next) {
		try {
			let result = await EventoTransito.getDimensionamientoAll();
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
				`: ${EventoTransitoController.name} -> getEventoTransito`
			);
		}
	}

	public async getEventoTransitoFlash(req: Request, res: Response, next) {
		try {
			let result = await EventoTransito.getDimensionamientoAll();
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
				`: ${EventoTransitoController.name} -> getEventoTransito`
			);
		}
	}

	public async getEventoTransitoById(req: Request, res: Response, next) {
		try {
			let result = (await EventoTransito.getEventoTransitoById(req.body));
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
				"An error occurred while getting EventoTransito :" +
				error +
				`: ${EventoTransitoController.name} -> getEventoTransitoById`
			);
		}
	}

	public async updateEventoTransito(req: Request, res: Response, next) {
		try {
			let result = (await EventoTransito.updateEventoTransito(req.body));
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
				"An error occurred while updating EventoTransito :" +
				error +
				`: ${EventoTransitoController.name} -> updateEventoTransito`
			);
		}
	}

	public async deleteEventoTransito(req: Request, res: Response, next) {
		try {
			let result = (await EventoTransito.deleteEventoTransito(req.body.EventoTransito_id));
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
				"An error occurred while deleting EventoTransito :" +
				error +
				`: ${EventoTransitoController.name} -> deleteEventoTransito`
			);
		}
	}

}