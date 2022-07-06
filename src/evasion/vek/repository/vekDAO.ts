import { DataBaseInterface } from "../../../util/db_connection/services/databaseInterface";
import { Vek } from "../models/vek.model";

export class VekDAO {

    private log
    private connection;
    constructor() {
        this.connection = DataBaseInterface.getInstance('dimensionamiento');
    }

    public async insertVek(vek: Vek, periferico_id: string) {
        try {
            //let id = uuid.v4();
            //.id = id;

            let query = await this.connection.pool.query(`INSERT INTO adm.lectura_vek (
	            periferico_id,
                fecha_hora,
                loop_status,
                vehicle_class,
                vehicle_length,
                vehicle_speed,
                time_gap,
                busy_time,
                axle_number,
                axle_class) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`, [
                    periferico_id,
                    vek.fecha_hora,
                    vek.loop_status,
                    vek.vehicle_class,
                    vek.vehicle_length,
                    vek.vehicle_speed,
                    vek.time_gap,
                    vek.busy_time,
                    vek.axle_number,
                    vek.axle_class
                ]);

            return vek
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getVek() {
        try {

            let query = await this.connection.pool.query(`SELECT
                        lectura_vek_id,
                        periferico_id,
                        fecha_hora,
                        loop_status,
                        vehicle_class,
                        vehicle_length,
                        vehicle_speed,
                        time_gap,
                        busy_time,
                        axle_number,
                        axle_class
                        FROM adm.lectura_vek;`);

            return query
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getVekById(vek: Vek) {
        try {

            let query = await this.connection.pool.query(`SELECT
                        lectura_vek_id,
                        periferico_id,
                        fecha_hora,
                        loop_status,
                        vehicle_class,
                        vehicle_length,
                        vehicle_speed,
                        time_gap,
                        busy_time,
                        axle_number,
                        axle_class
                        FROM adm.lectura_vek
                        WHERE lectura_vek_id = $1;`, [vek.lectura_vek_id]);

            return query;
        } catch (error) {
            return new Error(error);
        }
    }

    public async deleteVek(lectura_vek_id: string) {
        try {

            let query = await this.connection.pool.query(`DELETE FROM adm.lectura_vek WHERE lectura_vek_id = $1;`, [lectura_vek_id]);
            return query
        } catch (error) {
            throw new Error(error)
        }
    }

}
