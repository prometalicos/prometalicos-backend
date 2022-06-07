

import * as uuid from "uuid";
import { DataBaseService } from "./../../util/db_connection/services/dataBaseService";
import { DataBaseInterface } from "./../../util/db_connection/services/databaseInterface";
import { LecturaCamaraLpr } from "lectura_camara_lpr/models/lectura_camara_lpr.model";

export class LecturaCamaraLPRDAO {

    private log
    private connection_dimensionamiento;
    private connection_evasion;
    private connection_fuga;

    constructor() {
        this.connection_dimensionamiento = DataBaseInterface.getInstance('dimensionamiento');
        this.connection_evasion = DataBaseInterface.getInstance('evasion');
        this.connection_fuga = DataBaseInterface.getInstance('fuga');
    }

    public getConnection(connection: string) {
        switch (connection) {
            case 'dimensionamiento':
                return this.connection_dimensionamiento;
                break;
            case 'evasion':
                return this.connection_evasion;
                break;
            case 'fuga':
                return this.connection_fuga;
                break;
        }
    }

    public async insertLecturaCamaraLPR(lectura_camara_lpr: LecturaCamaraLpr, connection) {
        try {
            let query = await this.getConnection(connection).pool.query(`INSERT INTO adm.lectura_camara_lpr (
                periferico_id,
                placa_identificada,
                estadistica,
                url_matricula,
                url_foto_ampliada,
                fecha_hora) VALUES ($1,$2,$3,$4,$5,to_timestamp($6));`, [
                lectura_camara_lpr.periferico_id,
                lectura_camara_lpr.placa_identificada,
                lectura_camara_lpr.estadistica,
                lectura_camara_lpr.url_matricula,
                lectura_camara_lpr.url_foto_ampliada,
                Date.parse(lectura_camara_lpr.fecha_hora)]);

            return lectura_camara_lpr
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getLecturaCamaraLPR(connection) {
        try {

            let query = await this.getConnection(connection).pool.query(`SELECT
                        lectura_camara_lpr_id,
                        nombre,
                        direccion,
                        estado,
                        telefono_contacto,
                        correo_e,
                        url
                        FROM adm.lectura_camara_lpr;`);

            return query
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getLecturaCamaraLPRById(lectura_camara_lpr: LecturaCamaraLpr, connection) {
        try {

            let query = await this.getConnection(connection).pool.query(`SELECT
                        lectura_camara_lpr_id,
                        nombre,
                        direccion,
                        estado,
                        telefono_contacto,
                        correo_e,
                        url
                        FROM adm.lectura_camara_lpr
                        WHERE lectura_camara_lpr_id = $1;`, [lectura_camara_lpr.lectura_camara_lpr_id]);

            return query;
        } catch (error) {
            return new Error(error);
        }
    }
}
