import { EventoTransito } from "../models/evento_transito.model";
import { DataBaseInterface } from "../../../util/db_connection/services/databaseInterface";

export class EventoTransitoDAO {

    private log
    private connection;
    constructor() {
        this.connection = DataBaseInterface.getInstance('dimensionamiento');
    }

    public async insertEventoTransito(eventoTransito: EventoTransito) {
        try {
            let query = await this.connection.pool.query(`INSERT INTO adm.evento_transito (
                tipo,
                fecha_hora,
                lectura_camara_lpr_id,
                lectura_sensores_id,
                clase_vehiculo_id) VALUES ($1, to_timestamp($2), $3, $4, $5);`, [
                    eventoTransito.tipo,
	                Date.parse(eventoTransito.fecha_hora),
                    eventoTransito.lectura_camara_lpr_id,
                    eventoTransito.lectura_sensores_id,
                    eventoTransito.clase_vehiculo_id]);

            return eventoTransito
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getEventoTransito() {
        try {

            let query = await this.connection.pool.query(`SELECT
                        evento_transito_id,
                        tipo,
                        fecha_hora,
                        lectura_camara_lpr_id,
                        lectura_sensores_id,
                        clase_vehiculo_id
                        FROM adm.evento_transito;`);

            return query
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getEventoTransitoById(eventoTransito: EventoTransito) {
        try {

            let query = await this.connection.pool.query(`SELECT
                        evento_transito_id,
                        tipo,
                        fecha_hora,
                        lectura_camara_lpr_id,
                        lectura_sensores_id,
                        clase_vehiculo_id
                        FROM adm.evento_transito
                        WHERE evento_transito_id = $1;`, [eventoTransito.evento_transito_id]);

            return query;
        } catch (error) {
            return new Error(error);
        }
    }

    public async updateEventoTransito(eventoTransito: EventoTransito) {
        try {

            let query = await this.connection.pool.query(`UPDATE adm.evento_transito SET
                tipo = $1,
                fecha_hora = to_timestamp($2),
                lectura_camara_lpr_id = $3,
                lectura_sensores_id = $4,
                clase_vehiculo_id = $5
                WHERE evento_transito_id = $6;`,
                    [   eventoTransito.tipo,
	                    Date.parse(eventoTransito.fecha_hora),
                        eventoTransito.lectura_camara_lpr_id,
                        eventoTransito.lectura_sensores_id,
                        eventoTransito.clase_vehiculo_id,
                        eventoTransito.evento_transito_id]);

            return query
        } catch (error) {
            throw new Error(error)
        }
    }

    public async deleteEventoTransito(eventoTransitoId: string) {
        try {
            let query = await this.connection.pool.query(`DELETE FROM adm.evento_transito WHERE evento_transito_id = $1;`, [eventoTransitoId]);
            return query
        } catch (error) {
            throw new Error(error)
        }
    }

}
