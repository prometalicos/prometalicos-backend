

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
                nombre) VALUES ($1,$2);`, [rol.rol_id,
            rol.nombre]);

            return rol
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getRol() {
        try {
            let query = await this.connection.pool.query(`SELECT
                        rol_id,
                        nombre
                        FROM adm.rol;`);

            let socketService = SocketServiceBasic.getInstance()

            socketService.emit("dimensionamiento-emit", { data: "message" });
            return query

        } catch (error) {
            throw new Error(error)
        }
    }

    public async getRolById(rolId: Rol) {
        try {

            let query = await this.connection.pool.query(`SELECT
                        rol_id,
                        nombre
                        FROM adm.rol
                        WHERE rol_id = $1;`, [rolId.rol_id]);

            return query;
        } catch (error) {
            return new Error(error);
        }
    }

    public async updateRol(rol: Rol) {
        try {

            let query = await this.connection.pool.query(`UPDATE adm.rol SET
                nombre = $1
                WHERE rol_id = $82;`,
                [rol.nombre,
                rol.rol_id]);

            return query
        } catch (error) {
            throw new Error(error)
        }
    }

    public async deleteRol(rolId: string) {
        try {

            let query = await this.connection.pool.query(`DELETE FROM adm.rol 
                        WHERE rol_id = $1;`, [rolId]);

            return query
        } catch (error) {
            throw new Error(error)
        }
    }

}
