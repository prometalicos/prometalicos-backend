

import * as uuid from "uuid";
import * as bcrypt from 'bcrypt'
import { DataBaseService } from "../../db_connection/services/dataBaseService";
import { Usuario } from "../../usuarios/models/usuario";

export interface NavData {
    name?: string;
    url?: string;
    icon?: string;
    children?: NavData[];
}

export class UsuariosDAO {

    private log
    private connection;
    constructor() {
        this.connection = DataBaseService.getInstance();
    }

    public async insertUsuario(usuario: Usuario) {
        try {
            let id = uuid.v4();
            usuario.contrasena = bcrypt.hashSync(usuario.contrasena, 10)
            usuario.usuario_id = id;

            let query = await this.connection.pool.query(`INSERT INTO adm.usuario (
                usuario_id,
                tipo_usuario_id,
                nombre_completo,
                direccion,
                estado,
                contrasena) VALUES ($1,$2,$3,$4,$5,$6);`, [usuario.usuario_id, usuario.tipo_usuario_id, usuario.nombre_completo, usuario.direccion, usuario.estado, usuario.contrasena]);

            return usuario
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getUsuario() {
        try {

            let query = await this.connection.pool.query(`SELECT
                        usuario_id,
                        tipo_usuario_id,
                        nombre_completo,
                        direccion,
                        estado,
                        "*****" as contrasena
                        FROM adm.usuario;`);

            return query
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getUsuarioById(usuarioId: Usuario) {
        try {

            let query = await this.connection.pool.query(`SELECT
                        usuario_id,
                        tipo_usuario_id,
                        nombre_completo,
                        direccion,
                        estado,
                        "*****" as contrasena
                        FROM adm.usuario
                        WHERE usuario_id = $1;`, [usuarioId.usuario_id]);

            return query;
        } catch (error) {
            return new Error(error);
        }
    }

    public async updateUsuario(usuario: Usuario) {
        try {
            usuario.contrasena = bcrypt.hashSync(usuario.contrasena, 10)

            let query = await this.connection.pool.query(`UPDATE adm.usuario SET
                        nombre_completo = $1,
                        contrasena = $2,
                        direccion = $3,
                        estado = $4,
                        tipo_usuario_id = $5
                        WHERE usuario_id = $6;`,
                [usuario.nombre_completo,
                usuario.contrasena,
                usuario.direccion,
                usuario.estado,
                usuario.tipo_usuario_id,
                usuario.usuario_id]);

            return query
        } catch (error) {
            throw new Error(error)
        }
    }

    public async deleteUsuario(usuarioId: string) {
        try {

            let query = await this.connection.pool.query(`DELETE FROM adm.usuario 
                        WHERE usuario_id = $1;`, [usuarioId]);

            return query
        } catch (error) {
            throw new Error(error)
        }
    }

    public async val(nombre: string, pass: string) {
        try {
            let query = await this.connection.pool.query(`SELECT
                        usuario_id,
                        tipo_usuario_id,
                        nombre_completo,
                        direccion,
                        estado,
                        contrasena
                        FROM adm.usuario
                        WHERE nombre_completo = $1 ;`, [nombre]);
            if (query.rows.length > 0) {
                if (bcrypt.compareSync(pass, query.rows[0].contrasena)) {
                    // Passwords match
                    query.rows[0].contrasena = ''
                    return query.rows
                } else {
                    // Passwords don't match
                    query = []
                    return query
                }
            } else {
                return []
            }
        } catch (error) {
            console.error(error);
            return new Error(error);
        }
    }

    public async getMenu(usuarioId: string, op?: any) {
        let result = new Array();
        try {
            let con = await this.connection.getConnection();
            let query_usuario_menu = await con.query(`SELECT
                        usuario_id,
                        opciones_menu_id
                        FROM usario_menu
                        WHERE usuario_id = $1;`, [usuarioId]);
            if (query_usuario_menu.length > 0) {
                let row: NavData;
                row = <NavData>{ name: "Escritorio", icon: "icon-speedometer", url: "/dashboard" };
                result.push(row);
                for (let index_usario_menu = 0; index_usario_menu < query_usuario_menu.length; index_usario_menu++) {
                    let query_permissions_roles = await con.query(`SELECT
                            id_permission,
                            opciones_menu_id
                            FROM permissions_roles
                            WHERE opciones_menu_id = ?;`, [query_usuario_menu[index_usario_menu]['opciones_menu_id']]);
                    if (query_permissions_roles.length > 0) {
                        for (let index_permissions_roles = 0; index_permissions_roles < query_permissions_roles.length; index_permissions_roles++) {
                            let query_permissions = await con.query(`SELECT
                                opciones_menu_id,
                                descripcion,
                                url
                                FROM opciones_menu
                                WHERE opciones_menu_id = $1 and opciones_menu_id_padre = -1;`, [query_permissions_roles[index_permissions_roles]['opciones_menu_id']]);
                            if (query_permissions.length > 0) {
                                for (let index_permissions = 0; index_permissions < query_permissions.length; index_permissions++) {
                                    //result = await this.getPermissions(query_permissions[index_permissions], result, op);
                                }
                            }
                        }
                    }
                }
            }
            con.release();
            return result;
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getSubMenu(permissionId: string) {
        try {

            let query_permissions = await this.connection.pool.query(`SELECT
                                opciones_menu_id,
                                descripcion,
                                url
                                FROM opciones_menu
                                WHERE opciones_menu_id_padre = $1;`, [permissionId]);

            return query_permissions;
        } catch (error) {
            throw new Error(error)
        }
    }
}
