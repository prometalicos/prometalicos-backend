

import * as uuid from "uuid";
import { DataBaseService } from "../../../util/db_connection/services/dataBaseService";
import { Permiso } from "global/permiso/models/permiso.model";
import { DataBaseInterface } from "../../../util/db_connection/services/databaseInterface";



export interface NavData {
    name?: string;
    url?: string;
    icon?: string;
    children?: NavData[];
}

export class PermisoDAO {

    private log
    private connection;
    constructor() {
        this.connection = DataBaseInterface.getInstance('global')
    }

    public async getPermiso() {
        try {

            let query = await this.connection.pool.query(`SELECT
                        permiso_id,
                        padre,
                        nivel,
                        nombre,
                        icono,
                        url
                        FROM adm.permiso;`);

            return query
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getPermisoById(permisoId: Permiso) {
        try {

            let query = await this.connection.pool.query(`SELECT
                        padre
                        nivel
                        nombre
                        icono
                        url
                        FROM adm.permiso
                        WHERE permiso_id = $1;`, [permisoId.permiso_id]);

            return query;
        } catch (error) {
            return new Error(error);
        }
    }

    public async updatePermiso(permiso: Permiso) {
        try {

            let query = await this.connection.pool.query(`UPDATE adm.permiso SET
                padre = $1,
                nivel = $2,
                nombre = $3,
                icono = $4,
                url = $5,
                WHERE permiso_id = $6;`,
                    [permiso.padre,
                    permiso.nivel,
                    permiso.nombre,
                    permiso.icono,
                    permiso.url,
                    permiso.permiso_id]);

            return query
        } catch (error) {
            throw new Error(error)
        }
    }

    public async deletePermiso(permisoId: string) {
        try {

            let query = await this.connection.pool.query(`DELETE FROM adm.permiso 
                        WHERE permiso_id = $1;`, [permisoId]);

            return query
        } catch (error) {
            throw new Error(error)
        }
    }

}
