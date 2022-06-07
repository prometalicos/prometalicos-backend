
import { Request, Response } from "express";
import * as jwt from 'jsonwebtoken'
import { Token } from "../models/interfaces/token.interface";
import { ErrorModel } from "../../error_handling/models/error";
import { UsuariosDAO } from "../../../global/usuarios/repository/usuarioDAO";


let usuario = new UsuariosDAO();

export class AuthController {
	/*-------------------------------- app --------------------------------------------------------*/

	public async valUser(req: Request, res: Response, next) {
		try {
			var result = await usuario.val(req.body.nombre, req.body.contrasena);

			let token: Token;
			if (result.length > 0) {
				result.map((item: any) => {
					token = {
						usuario_id: item.usuario_id,
                        tipo_usuario_id: item.tipo_usuario_id,
                        nombre_completo: item.nombre_completo,
						estado: item.estado,
						contrasena: item.contrasena
					};
				});
				var tokenReturn = jwt.sign(token, process.env.SECRET, {
					expiresIn: 60 * 60 * 24 // expires in 24 hours
				});		
				res.send({
					user: result[0],
					tokenReturn
				});
			} else {
				let err: ErrorModel = new Error('Incorrect user or password');
				err.status = 403
				next(err);
			}
		} catch (error) {
			let err: ErrorModel = new Error(error);
			err.status = 500
			next(err);
			console.log(
				"An error occurred while validating user :" +
				error +
				`: ${AuthController.name} -> val`
			);
		}
	}
	
}