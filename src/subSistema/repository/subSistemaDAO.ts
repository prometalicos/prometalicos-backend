

import * as uuid from "uuid";
import { DataBaseService } from "../../db_connection/services/dataBaseService";
import { SubSistema } from "../../subSistema/models/subSistema";
import { DataBaseInterface } from "../../db_connection/services/databaseInterface";

export class SubSistemaDAO {

    private log
    private connection;
    constructor() {
        this.connection = DataBaseInterface.getInstance('global')
    }

    public async insertSubSistema(subSistema: SubSistema) {
        try {
            let id = uuid.v4();
            subSistema.sub_sistema_id = id;

            let query = await this.connection.pool.query(`INSERT INTO adm.subSistema (
                sub_sistema_id,
                sede_id,
                descripcion,
                estado) VALUES ($1,$2,$3,$4);`, [
                    subSistema.sub_sistema_id,
                    subSistema.sede_id,
                    subSistema.descripcion,
                    subSistema.estado]);

            return subSistema
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getSubSistema() {
        try {

            let query = await this.connection.pool.query(`SELECT
                        sub_sistema_id,
                        sede_id,
                        descripcion,
                        estado
                        FROM adm.subSistema;`);

            return query
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getSubSistemaById(sub_sistemaId: SubSistema) {
        try {

            let query = await this.connection.pool.query(`SELECT
                        sede_id,
                        descripcion,
                        estado
                        FROM adm.subSistema
                        WHERE sub_sistema_id = $1;`, [sub_sistemaId.sub_sistema_id]);

            return query;
        } catch (error) {
            return new Error(error);
        }
    }

    public async updateSubSistema(subSistema: SubSistema) {
        try {

            let query = await this.connection.pool.query(`UPDATE adm.subSistema SET
                sede_id = $1,
                descripcion = $2,
                estado = $3
                WHERE sub_sistema_id = $4;`,
                    [
                     subSistema.sede_id,
                     subSistema.descripcion,
                     subSistema.estado,
                     subSistema.sub_sistema_id]);

            return query
        } catch (error) {
            throw new Error(error)
        }
    }

    public async deleteSubSistema(sub_sistemaId: string) {
        try {

            let query = await this.connection.pool.query(`DELETE FROM adm.subSistema 
                        WHERE sub_sistema_id = $1;`, [sub_sistemaId]);

            return query
        } catch (error) {
            throw new Error(error)
        }
    }

}
