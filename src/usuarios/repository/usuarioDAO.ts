

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
