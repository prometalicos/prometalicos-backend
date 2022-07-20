import { DataBaseInterface } from "../../../util/db_connection/services/databaseInterface";
import { ClaseVehiculo } from "../models/clase_vehiculo.model";

export class ClaseVehiculoDAO {

    private log
    private connection;
    constructor() {
        this.connection = DataBaseInterface.getInstance('dimensionamiento');
    }

    public async insertClaseVehiculo(clase_vehiculo: ClaseVehiculo) {
        try {
            //let id = uuid.v4();
            //.id = id;

            let query = await this.connection.pool.query(`INSERT INTO adm.clase_vehiculo (
                clase_vehiculo_id,
                descripcion,
                url_picture,
                max_height,
                max_width,
                max_length) VALUES ($1, $2, $3, $4, $5, $6);`, [
                clase_vehiculo.clase_vehiculo_id,
                clase_vehiculo.descripcion,
                clase_vehiculo.url_picture,
                clase_vehiculo.max_height,
                clase_vehiculo.max_width,
                clase_vehiculo.max_length]);

            return clase_vehiculo
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getClaseVehiculo() {
        try {

            let query = await this.connection.pool.query(`SELECT
                        clase_vehiculo_id,
                        descripcion,
                        url_picture,
                        max_height,
                        max_width,
                        max_length
                        FROM adm.clase_vehiculo;`);

            return query
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getClaseVehiculoById(clase_vehiculo_id: string) {
        try {

            let query = await this.connection.pool.query(`SELECT
                        clase_vehiculo_id,
                        descripcion,
                        url_picture,
                        max_height,
                        max_width,
                        max_length
                        FROM adm.clase_vehiculo
                        WHERE clase_vehiculo_id = $1;`, [clase_vehiculo_id]);
            return query.rows;
        } catch (error) {
            return new Error(error);
        }
    }

    public async updateClaseVehiculo(clase_vehiculo: ClaseVehiculo) {
        try {

            let query = await this.connection.pool.query(`UPDATE adm.clase_vehiculo SET
                descripcion = $1,
                url_picture = $2,
                max_height = $3,
                max_width = $4,
                max_length = $5
                WHERE clase_vehiculo_id = $6;`,
                [
                    clase_vehiculo.descripcion,
                    clase_vehiculo.url_picture,
                    clase_vehiculo.max_height,
                    clase_vehiculo.max_width,
                    clase_vehiculo.max_length,
                    clase_vehiculo.clase_vehiculo_id]);

            return query
        } catch (error) {
            throw new Error(error)
        }
    }

    public async deleteClaseVehiculo(clase_vehiculo_id: string) {
        try {

            let query = await this.connection.pool.query(`DELETE FROM adm.clase_vehiculo WHERE clase_vehiculo_id = $1;`, [clase_vehiculo_id]);
            return query
        } catch (error) {
            throw new Error(error)
        }
    }

}
