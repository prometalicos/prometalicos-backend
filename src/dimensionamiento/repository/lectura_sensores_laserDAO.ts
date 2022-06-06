

import * as uuid from "uuid";
import { DataBaseService } from "../../db_connection/services/dataBaseService";
import { Transit_end } from "../models/transit_end";
import { DataBaseInterface } from "../../db_connection/services/databaseInterface";

export class LecturaSensoresLaserDAO {

    private log
    private connection;
    constructor() {
        this.connection = DataBaseInterface.getInstance('dimensionamiento');
    }

    public async insertLecturaSensoresLaser(lecturaSensoresLaser: Transit_end, periferico_id: string) {
        try {
            //let id = uuid.v4();
            //.id = id;

            let query = await this.connection.pool.query(`INSERT INTO adm.lectura_sensores_laser (
                
                periferico_id,
                id,
                lane,
                lane_id,
                time_iso,
                speed,
                height,
                width,
                length,
                refl_pos,
                gap,
                headway,
                occupancy,
                class_id,
                position,
                direction,
                wrong_way,
                stop_and,
                url_file_pds) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19);`, [
                    periferico_id,
                    lecturaSensoresLaser.id, 
                    lecturaSensoresLaser.lane, 
                    lecturaSensoresLaser.lane_id, 
                    lecturaSensoresLaser.time_iso, 
                    lecturaSensoresLaser.speed,
                    lecturaSensoresLaser.height,
                    lecturaSensoresLaser.width, 
                    lecturaSensoresLaser.length, 
                    lecturaSensoresLaser.refl_pos, 
                    lecturaSensoresLaser.gap,
                    lecturaSensoresLaser.headway,
                    lecturaSensoresLaser.occupancy,
                    lecturaSensoresLaser.class_id, 
                    lecturaSensoresLaser.position, 
                    lecturaSensoresLaser.direction, 
                    lecturaSensoresLaser.wrong_way,
                    lecturaSensoresLaser.stop_and,
                    lecturaSensoresLaser.stop_and]);

            return lecturaSensoresLaser
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getLecturaSensoresLaser() {
        try {

            let query = await this.connection.pool.query(`SELECT
                        LecturaSensoresLaser_id,
                        nombre,
                        direccion,
                        estado,
                        telefono_contacto,
                        correo_e,
                        url
                        FROM adm.LecturaSensoresLaser;`);

            return query
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getLecturaSensoresLaserById(lecturaSensoresLaser: Transit_end) {
        try {

            let query = await this.connection.pool.query(`SELECT
                        LecturaSensoresLaser_id,
                        nombre,
                        direccion,
                        estado,
                        telefono_contacto,
                        correo_e,
                        url
                        FROM adm.LecturaSensoresLaser
                        WHERE LecturaSensoresLaser_id = $1;`, [lecturaSensoresLaser.id]);

            return query;
        } catch (error) {
            return new Error(error);
        }
    }

    public async updateLecturaSensoresLaser(lecturaSensoresLaser: Transit_end) {
        try {

            let query = await this.connection.pool.query(`UPDATE adm.LecturaSensoresLaser SET
                nombre = $1,
                direccion = $2,
                estado = $3,
                telefono_contacto = $4,
                correo_e = $5,
                url = $6
                WHERE LecturaSensoresLaser_id = $7;`,
                    [
                        lecturaSensoresLaser.id, 
                        lecturaSensoresLaser.lane, 
                        lecturaSensoresLaser.lane_id, 
                        lecturaSensoresLaser.time_iso, 
                        lecturaSensoresLaser.speed,
                        lecturaSensoresLaser.height,
                        lecturaSensoresLaser.width, 
                        lecturaSensoresLaser.length, 
                        lecturaSensoresLaser.refl_pos, 
                        lecturaSensoresLaser.gap,
                        lecturaSensoresLaser.headway,
                        lecturaSensoresLaser.occupancy,
                        lecturaSensoresLaser.class_id, 
                        lecturaSensoresLaser.position, 
                        lecturaSensoresLaser.direction, 
                        lecturaSensoresLaser.wrong_way,
                        lecturaSensoresLaser.stop_and]);

            return query
        } catch (error) {
            throw new Error(error)
        }
    }

    public async deleteLecturaSensoresLaser(LecturaSensoresLaser_id: string) {
        try {

            let query = await this.connection.pool.query(`DELETE FROM adm.LecturaSensoresLaser WHERE LecturaSensoresLaser_id = $1;`, [LecturaSensoresLaser_id]);
            return query
        } catch (error) {
            throw new Error(error)
        }
    }

}
