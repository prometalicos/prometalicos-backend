import { DataBaseInterface } from "../../../util/db_connection/services/databaseInterface";
import { PosibleInfraccion } from "../models/posible_infraccion.model";

export class PosibleInfraccionDAO {

    private log
    private connection;
    constructor() {
        this.connection = DataBaseInterface.getInstance('dimensionamiento');
    }

    public async insertPosibleInfraccion(posibles_infracciones: PosibleInfraccion) {
        try {

            let query = await this.connection.pool.query(`INSERT INTO adm.posibles_infracciones (
                evento_transito_id,
                funcionario_id,
                infracciones_adm_id,
                fecha_hora,
                estado) VALUES ($1, $2, $3, to_timestamp($4), $5) RETURNING posibles_infracciones_id;`, [
                posibles_infracciones.evento_transito_id,
                posibles_infracciones.funcionario_id,
                posibles_infracciones.infracciones_adm_id,
                Date.parse(posibles_infracciones.fecha_hora),
                posibles_infracciones.estado]);
                if (query.rows.length > 0) {
                    posibles_infracciones.posibles_infracciones_id = query.rows[0]["posibles_infracciones_id"]
                }

            return posibles_infracciones
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getPosibleInfraccion() {
        try {

            let query = await this.connection.pool.query(`SELECT
                        posibles_infracciones_id,
                        evento_transito_id
                        funcionario_id,
                        infracciones_adm_id,
                        fecha_hora,
                        estado,
                        fecha_novedad,
                        nota
                        FROM adm.posibles_infracciones;`);

            return query
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getPosibleInfraccionById(posibles_infracciones_id: string) {
        try {

            let query = await this.connection.pool.query(`SELECT
                        posibles_infracciones_id,
                        evento_transito_id,
                        funcionario_id,
                        infracciones_adm_id,
                        fecha_hora,
                        estado,
                        fecha_novedad,
                        nota
                        FROM adm.posibles_infracciones
                        WHERE posibles_infracciones_id = $1;`, [posibles_infracciones_id]);

            return query;
        } catch (error) {
            return new Error(error);
        }
    }

    public async updatePosibleInfraccion(posibles_infracciones: PosibleInfraccion) {
        try {

            let query = await this.connection.pool.query(`UPDATE adm.posibles_infracciones SET
                funcionario_id = $1,
                infracciones_adm_id = $2,
                fecha_hora = $3,
                estado = $4,
                fecha_novedad = $5,
                nota = $6
                WHERE posibles_infracciones_id = $7;`,
                [
                    posibles_infracciones.funcionario_id,
                    posibles_infracciones.infracciones_adm_id,
                    Date.parse(posibles_infracciones.fecha_hora),
                    posibles_infracciones.estado,
                    Date.parse(posibles_infracciones.fecha_novedad),
                    posibles_infracciones.nota,
                    posibles_infracciones.posibles_infracciones_id]);

            return query
        } catch (error) {
            throw new Error(error)
        }
    }

    public async deletePosibleInfraccion(posibles_infracciones_id: string) {
        try {

            let query = await this.connection.pool.query(`DELETE FROM adm.posibles_infracciones WHERE posibles_infracciones_id = $1;`, [posibles_infracciones_id]);
            return query
        } catch (error) {
            throw new Error(error)
        }
    }

}
