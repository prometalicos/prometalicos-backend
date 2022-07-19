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
                lectura_sensores_id) VALUES ($1, to_timestamp($2), $3, $4) RETURNING evento_transito_id;`, [
                eventoTransito.tipo,
                Date.parse(eventoTransito.fecha_hora),
                eventoTransito.lectura_camara_lpr_id,
                eventoTransito.lectura_sensores_id]);
            if (query.rows.length > 0) {
                eventoTransito.evento_transito_id = query.rows[0]["evento_transito_id"]
            }

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
                        lectura_sensores_id
                        FROM adm.evento_transito;`);

            return query
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getDimensionamientoAll() {
        try {

            let query = await this.connection.pool.query(`SELECT evt.tipo, evt.fecha_hora, cv.descripcion, cv.url_picture, lsl.height, lsl.width, lsl.length, lcl.placa_identificada, lcl.url_foto_ampliada 
            FROM adm.evento_transito evt 
            inner join lectura_sensores_laser lsl on lsl.lectura_sensores_id = evt .lectura_sensores_id
            inner join lectura_camara_lpr lcl on lcl.lectura_camara_lpr_id = evt.lectura_camara_lpr_id 
            inner join clase_vehiculo cv on lsl.class_id = cv.clase_vehiculo_id;`);

            return query
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getDimensionamientoFlash() {
        try {
            let query = await this.connection.pool.query(`SELECT evt.tipo, evt.fecha_hora, cv.descripcion, cv.url_picture, lsl.height, lsl.width, lsl.length, lcl.placa_identificada, lcl.url_foto_ampliada 
            FROM adm.evento_transito evt 
            inner join lectura_sensores_laser lsl on lsl.lectura_sensores_id = evt .lectura_sensores_id
            inner join lectura_camara_lpr lcl on lcl.lectura_camara_lpr_id = evt.lectura_camara_lpr_id 
            inner join clase_vehiculo cv on lsl.class_id = cv.clase_vehiculo_id;`);

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
                        lectura_sensores_id
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
                WHERE evento_transito_id = $5;`,
                [eventoTransito.tipo,
                Date.parse(eventoTransito.fecha_hora),
                eventoTransito.lectura_camara_lpr_id,
                eventoTransito.lectura_sensores_id,
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
