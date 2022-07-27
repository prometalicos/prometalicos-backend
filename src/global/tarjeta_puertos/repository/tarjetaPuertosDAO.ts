import * as uuid from "uuid";
import { DataBaseService } from "../../../util/db_connection/services/dataBaseService";
import { TarjetaPuertos } from "../models/tarjetaPuertos";
import { DataBaseInterface } from "../../../util/db_connection/services/databaseInterface";

export class TarjetaPuertosDAO {

    private log
    private connection;
    constructor() {
        this.connection = DataBaseInterface.getInstance('global');
    }

    public async insertTarjetaPuertos(tarjetaPuertos: TarjetaPuertos) {
        try {
            let id = uuid.v4();
            tarjetaPuertos.tarjeta_puertos_id = id;

            let query = await this.connection.pool.query(`INSERT INTO adm.tarjeta_puertos (
                tarjeta_puertos_id,
                puerto,
                periferico_id,
                ip,
                nombre_tarjeta_puertos,
                tipo,
                estado,
                url) VALUES ($1,$2,$3,$4,$5,$6,$7);`, [
                    tarjetaPuertos.tarjeta_puertos_id,
                    tarjetaPuertos.puerto,
                    tarjetaPuertos.periferico_id,
                    tarjetaPuertos.ip,
                    tarjetaPuertos.nombre_tarjeta_puertos,
                    tarjetaPuertos.tipo,
                    tarjetaPuertos.estado
                ]);

            return tarjetaPuertos
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getTarjetaPuertos() {
        try {

            let query = await this.connection.pool.query(`SELECT
                    tarjeta_puertos_id,
                    puerto,
                    periferico_id,
                    ip,
                    nombre_tarjeta_puertos,
                    tipo,
                    estado
                FROM adm.tarjeta_puertos;`);
            return query.rows
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getTarjetaPuertosById(tarjetaPuertos: TarjetaPuertos) {
        try {

            let query = await this.connection.pool.query(`SELECT
                    tarjeta_puertos_id,
                    puerto,
                    periferico_id,
                    ip,
                    nombre_tarjeta_puertos,
                    tipo,
                    estado
                FROM adm.tarjeta_puertos
                WHERE tarjeta_puertos_id = $1;`, [tarjetaPuertos.tarjeta_puertos_id]);
            return query.rows;
        } catch (error) {
            return new Error(error);
        }
    }

    public async updateTarjetaPuertos(tarjetaPuertos: TarjetaPuertos) {
        try {

            let query = await this.connection.pool.query(`UPDATE adm.tarjeta_puertos SET
                    puerto = $1,
                    periferico_id = $2,
                    ip = $3,
                    nombre_tarjeta_puertos = $4,
                    tipo = $5,
                    estado = $6
                WHERE tarjeta_puertos_id = $7;`,
                    [
                        tarjetaPuertos.puerto,
                        tarjetaPuertos.periferico_id,
                        tarjetaPuertos.ip,
                        tarjetaPuertos.nombre_tarjeta_puertos,
                        tarjetaPuertos.tipo,
                        tarjetaPuertos.estado,
                        tarjetaPuertos.tarjeta_puertos_id
                    ]);
            return query.rows
        } catch (error) {
            throw new Error(error)
        }
    }

    public async deleteTarjetaPuertos(tarjeta_puertos_id: string) {
        try {

            let query = await this.connection.pool.query(`DELETE FROM adm.tarjeta_puertos WHERE tarjeta_puertos_id = $1;`, [tarjeta_puertos_id]);
            return query
        } catch (error) {
            throw new Error(error)
        }
    }

}
