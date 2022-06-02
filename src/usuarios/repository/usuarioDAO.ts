

import * as uuid from "uuid";
import * as bcrypt from 'bcrypt'
import { DataBaseService } from "../../db_connection/services/dataBaseService";
import { Usuario } from "../../usuarios/models/usuario";
import { DataBaseInterface } from "../../db_connection/services/databaseInterface";

export interface NavData {
    name?: string;
    url?: string;
    iconComponent?: any;
    children?: NavData[];
}

export class UsuariosDAO {

    private log
    private connection;
    constructor() {
        this.connection = DataBaseInterface.getInstance('global')
    }

    public async insertUsuario(usuario: Usuario) {
        try {
            let id = uuid.v4();
            usuario.frase = bcrypt.hashSync(usuario.frase, 10)
            usuario.usuario_id = id;
            let query = await this.connection.pool.query(`INSERT INTO adm.usuario (
                usuario_id,
                rol_id,
                nombre_completo,
                nombre_usuario,
                direccion,
                estado,
                frase) VALUES ($1,$2,$3,$4,$5,$6,$7);`, [usuario.usuario_id, usuario.rol_id, usuario.nombre_completo,
                    usuario.nombre_usuario, usuario.direccion, usuario.estado, usuario.frase]);

            return usuario
        } catch (error) {
            throw new Error(error)
        }
    }

    public async getUsuario() {
        try {

            let query = await this.connection.pool.query(`SELECT
                        usuario_id,
                        rol_id,
                        nombre_usuario,
                        nombre_completo,
                        direccion,
                        estado,
                        "*****" as frase
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
                        rol_id,
                        nombre_completo,
                        nombre_usuario,
                        direccion,
                        estado,
                        "*****" as frase
                        FROM adm.usuario
                        WHERE usuario_id = $1;`, [usuarioId.usuario_id]);

            return query;
        } catch (error) {
            return new Error(error);
        }
    }

    public async updateUsuario(usuario: Usuario) {
        try {
            usuario.frase = bcrypt.hashSync(usuario.frase, 10)

            let query = await this.connection.pool.query(`UPDATE adm.usuario SET
                        nombre_completo = $1,
                        frase = $2,
                        direccion = $3,
                        estado = $4,
                        rol_id = $5,
                        nombre_usuario = $6
                        WHERE usuario_id = $7;`,
                [usuario.nombre_completo,
                usuario.frase,
                usuario.direccion,
                usuario.estado,
                usuario.rol_id,
                usuario.nombre_usuario,
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
                        rol_id,
                        nombre_completo,
                        nombre_usuario,
                        direccion,
                        estado,
                        frase
                        FROM adm.usuario
                        WHERE nombre_usuario = $1 ;`, [nombre]);
            if (query.rows.length > 0) {
                if (bcrypt.compareSync(pass, query.rows[0].frase)) {
                    // Passwords match
                    query.rows[0].frase = ''
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

    public async getPermissions(query_permiso, result?: Array<NavData>, op?: any) {
        let sub_menu = new Array();
        if (typeof result !== 'undefined') {
            sub_menu = result;
        }
        let row: NavData;
        let query_permiso_menu = await this.connection.pool.query(`SELECT
                        permiso_id, padre,
                        nombre, url, icono,
                        nivel
                        FROM adm.permiso
                        WHERE padre = $1;`, [query_permiso['permiso_id']]);
        if (query_permiso_menu.rows.length > 0) {
            let children = new Array<NavData>();
            let row_children: NavData;
            for (let index_permiso_menu = 0; index_permiso_menu < query_permiso_menu.rows.length; index_permiso_menu++) {
                if (query_permiso_menu.rows[index_permiso_menu]['nivel'] == -1) {
                    let children_son = <Array<NavData>>await this.getPermissions(query_permiso_menu.rows[index_permiso_menu]);
                    children.push(children_son[0]);
                }
                else {
                    if (query_permiso_menu.rows[index_permiso_menu]['nivel'] == -2) {

                        if (op === "navBar") {
                            let children_son = <Array<NavData>>await this.getPermissions(query_permiso_menu.rows[index_permiso_menu]);
                            children.push(children_son[0]);
                        }
                        else {
                            row_children = <NavData>{ name: query_permiso_menu.rows[index_permiso_menu]['nombre'], url: query_permiso_menu.rows[index_permiso_menu]['url'], iconComponent: { name: query_permiso_menu.rows[index_permiso_menu]['icono']} };
                            children.push(row_children);
                        }
                    }
                    else {
                        row_children = <NavData>{ name: query_permiso_menu.rows[index_permiso_menu]['nombre'], url: query_permiso_menu.rows[index_permiso_menu]['url'], iconComponent: { name: query_permiso_menu.rows[index_permiso_menu]['icono']} };
                        children.push(row_children);
                    }
                }
            }
            row = <NavData>{ name: query_permiso['nombre'], iconComponent: { name: query_permiso['icono'] }, url: query_permiso['url'], children: children }
            sub_menu.push(row);
        }
        return sub_menu;
    }

    public async getMenu(peopleId: string, op?: any) {
        let result = new Array();
        try {
            let query_usario_rol = await this.connection.pool.query(`SELECT
                        usuario_id,
                        rol_id
                        FROM adm.usuario_rol
                        WHERE usuario_id = $1;`, [peopleId]);
            if (query_usario_rol.rows.length > 0) {
                let row: NavData;
                row = <NavData>{ name: "Escritorio", iconComponent: { name: "cil-speedometer"}, url: "/dashboard" };
                result.push(row);
                for (let index_usario_rol = 0; index_usario_rol < query_usario_rol.rows.length; index_usario_rol++) {
                    let query_permiso_rol = await this.connection.pool.query(`SELECT
                            permiso_id,
                            rol_id
                            FROM adm.permiso_rol
                            WHERE rol_id = $1;`, [query_usario_rol.rows[index_usario_rol]['rol_id']]);
                    if (query_permiso_rol.rows.length > 0) {
                        for (let index_permiso_rol = 0; index_permiso_rol < query_permiso_rol.rows.length; index_permiso_rol++) {
                            let query_permiso = await this.connection.pool.query(`SELECT
                                permiso_id,
                                nombre,
                                icono
                                FROM adm.permiso
                                WHERE permiso_id = $1 and padre = -1;`, [query_permiso_rol.rows[index_permiso_rol]['permiso_id']]);
                            if (query_permiso.rows.length > 0) {
                                for (let index_permiso = 0; index_permiso < query_permiso.rows.length; index_permiso++) {
                                    result = await this.getPermissions(query_permiso.rows[index_permiso], result, op);
                                }
                            }
                        }
                    }
                }
            }
            return result;
        } catch (error) {
            console.error(error);
            return new Error(error);
        }
    }

    public async getSubMenu(permissionId: string) {
        try {
            let query_permiso = await this.connection.pool.query(`SELECT
                                permiso_id,
                                nombre,
                                icono,
                                url
                                FROM adm.permiso
                                WHERE padre = $1;`, permissionId);
            return query_permiso;
        } catch (error) {
            console.error(error);
            return new Error(error);
        }
    }
}
