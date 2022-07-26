

import * as uuid from "uuid";
import { DataBaseService } from "../../../util/db_connection/services/dataBaseService";
import { SubSistema } from "../models/subSistema";
import { DataBaseInterface } from "../../../util/db_connection/services/databaseInterface";

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

            let query = await this.connection.pool.query(`INSERT INTO adm.sub_sistema (
                sub_sistema_id,
                sede_id,
                nombre_sub_sistema,
                estado) VALUES ($1,$2,$3,$4);`, [
                    subSistema.sub_sistema_id,
                    subSistema.sede_id,
                    subSistema.nombre_sub_sistema,
                    subSistema.estado]);

            return subSistema
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getSubSistema() {
        try {

            let query = await this.connection.pool.query(`select
                        ss.sub_sistema_id,
                        ss.sede_id,
                        s.nombre_sede sede_nombre,
                        ss.nombre_sub_sistema,
                        ss.estado
                        from adm.sub_sistema ss
                        inner join adm.sede s on ss.sede_id = s.sede_id `);

            return query.rows
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getSubSistemaById(sub_sistemaId: SubSistema) {
        try {

            let query = await this.connection.pool.query(`SELECT
                        sede_id,
                        nombre_sub_sistema,
                        estado
                        FROM adm.sub_sistema
                        WHERE sub_sistema_id = $1;`, [sub_sistemaId.sub_sistema_id]);

            return query.rows
        } catch (error) {
            return new Error(error);
        }
    }

    public async updateSubSistema(subSistema: SubSistema) {
        try {
            let query = await this.connection.pool.query(`UPDATE adm.sub_sistema SET
                sede_id = $1,
                nombre_sub_sistema = $2,
                estado = $3
                WHERE sub_sistema_id = $4;`,
                    [
                     subSistema.sede_id,
                     subSistema.nombre_sub_sistema,
                     subSistema.estado,
                     subSistema.sub_sistema_id]);
            return query.rows
        } catch (error) {
            throw new Error(error)
        }
    }

    public async deleteSubSistema(sub_sistemaId: string) {
        try {
            console.log("Modificando ", sub_sistemaId);
            let query = await this.connection.pool.query(`DELETE FROM adm.sub_sistema 
                        WHERE sub_sistema_id = $1;`, [sub_sistemaId]);

            return query.rows
        } catch (error) {
            throw new Error(error)
        }
    }

}
