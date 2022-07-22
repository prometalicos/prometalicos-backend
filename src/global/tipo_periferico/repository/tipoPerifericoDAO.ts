

import * as uuid from "uuid";
import { DataBaseService } from "../../../util/db_connection/services/dataBaseService";
import { tipoPeriferico } from "../models/tipoPeriferico";
import { DataBaseInterface } from "../../../util/db_connection/services/databaseInterface";

export class tipoPerifericoDAO {

    private log
    private connection;
    constructor() {
        this.connection = DataBaseInterface.getInstance('global')
    }

    public async inserttipoPeriferico(tipoPeriferico: tipoPeriferico) {
        try {
            let id = uuid.v4();
            tipoPeriferico.tipo_periferico_id = id;

            let query = await this.connection.pool.query(`INSERT INTO adm.sub_sistema (
                tipo_periferico_id,
                sede_id,
                nombre_tipo_periferico,
                estado) VALUES ($1,$2,$3,$4);`, [
                    tipoPeriferico.tipo_periferico_id,
                    tipoPeriferico.nombre_tipo_periferico,
                    tipoPeriferico.estado]);

            return tipoPeriferico
        } catch (error) {
            throw new Error(error)
        }
    }

    public async gettipoPeriferico() {
        try {

            let query = await this.connection.pool.query(`select
                        tipo_periferico_id,
                        nombre_tipo_periferico,
                        estado
                        from adm.sub_sistema`);

            return query.rows
        } catch (error) {
            throw new Error(error)
        }
    }

    public async gettipoPerifericoById(sub_sistemaId: tipoPeriferico) {
        try {

            let query = await this.connection.pool.query(`SELECT
                        nombre_tipo_periferico,
                        estado
                        FROM adm.sub_sistema
                        WHERE tipo_periferico_id = $1;`, [sub_sistemaId.tipo_periferico_id]);

            return query.rows
        } catch (error) {
            return new Error(error);
        }
    }

    public async updatetipoPeriferico(tipoPeriferico: tipoPeriferico) {
        try {

            let query = await this.connection.pool.query(`UPDATE adm.sub_sistema SET
                sede_id = $1,
                nombre_tipo_periferico = $2,
                estado = $3
                WHERE tipo_periferico_id = $4;`,
                    [
                     tipoPeriferico.nombre_tipo_periferico,
                     tipoPeriferico.estado,
                     tipoPeriferico.tipo_periferico_id]);
            return query.rows
        } catch (error) {
            throw new Error(error)
        }
    }

    public async deletetipoPeriferico(sub_sistemaId: string) {
        try {

            let query = await this.connection.pool.query(`DELETE FROM adm.sub_sistema 
                        WHERE tipo_periferico_id = $1;`, [sub_sistemaId]);

            return query.rows
        } catch (error) {
            throw new Error(error)
        }
    }

}
