

import * as uuid from "uuid";
import { DataBaseService } from "../../../util/db_connection/services/dataBaseService";
import { Rol } from "../models/rol";
import { DataBaseInterface } from "../../../util/db_connection/services/databaseInterface";
import { SocketServiceBasic } from "./../../../util/sockets/socketServiceBasic";

export class RolDAO {

    private log
    private connection;
    constructor() {
        this.connection = DataBaseInterface.getInstance('global')
    }

    public async insertRol(rol: Rol) {
        try {
            let id = uuid.v4();
            rol.rol_id = id;

            let query = await this.connection.pool.query(`INSERT INTO adm.rol (
                rol_id,
                nombre_rol) VALUES ($1,$2);`, [rol.rol_id,
            rol.nombre_rol]);
            return rol;

        } catch (error) {
            throw new Error(error)
        }
    }

    public async getRol() {
        try {
            let query = await this.connection.pool.query(`SELECT
                        rol_id,
                        nombre_rol
                        FROM adm.rol;`);

            let socketService = SocketServiceBasic.getInstance()
            return query.rows;

        } catch (error) {
            throw new Error(error)
        }
    }

    public async getRolById(rolId: Rol) {
        try {

            let query = await this.connection.pool.query(`SELECT
                        rol_id,
                        nombre_rol
                        FROM adm.rol
                        WHERE rol_id = $1;`, [rolId.rol_id]);
            return query.rows;

        } catch (error) {
            return new Error(error);
        }
    }

    public async updateRol(rol: Rol) {
        try {

            let query = await this.connection.pool.query(`UPDATE adm.rol SET
                nombre_rol = $1
                WHERE rol_id = $2;`,
                [
                    rol.nombre_rol,
                    rol.rol_id
                ]);

            return query.rows;
        } catch (error) {
            throw new Error(error)
        }
    }

    public async deleteRol(rolId: string) {
        try {

            let query = await this.connection.pool.query(`DELETE FROM adm.rol 
                        WHERE rol_id = $1;`, [rolId]);

            return query.rows;
        } catch (error) {
            throw new Error(error)
        }
    }

}
