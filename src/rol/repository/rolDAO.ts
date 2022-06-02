

import { ClientSocketService } from "./../../sockets/dimensionamiento/clientService";
import * as uuid from "uuid";
import { DataBaseService } from "../../db_connection/services/dataBaseService";
import { Rol } from "../../rol/models/rol";

export class RolDAO {

    private log
    private connection;
    constructor() {
        this.connection = DataBaseService.getInstance('global');
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


            //let clientSocketService = new ClientSocketService('http://172.19.150.5:12876'); // Laser principal
            let clientSocketService = new ClientSocketService('http://172.19.150.5:12876'); // Laser principal

            return "";
            
/*       var net = require('net');
            function getConnection(connName) {
                var client = net.connect({ port: 12876, host: '172.19.150.5' }, function () {
                    console.log(connName + ' Connected:');
                    console.log('  local=%s:%s', this.localAddress, this.localPort);
                    console.log('  remote = %s:%s', this.remoteAddress, this.remotePort);
                    this.setTimeout(500);
                    this.setEncoding('utf8');


                    let received = ""
                    client.on("data", data => {
                        received += data
                        const messages = received.split("\n") // remember this
                        if (messages.length > 1) {
                            for (let message of messages) {
                                if (message !== "") {
                                    console.log(JSON.parse(message))
                                    received = ""
                                }
                            }
                        }
                        console.log("RRRRR-"+received)
                    })
                    this.on('end', function () {
                        console.log(connName + 'Client disconnected');
                    });
                    this.on('error', function (err) {
                        console.log('Socket Error: ', JSON.stringify(err));
                    });
                    this.on('timeout', function () {
                        console.log('Socket Timed Out');
                    });
                    this.on('close', function () {
                        console.log('Socket Closed');
                    });
                });
                return client;
            }

            

            var Dwarves = getConnection("Dwarves");

            */

            /*
            let query = await this.connection.pool.query(`SELECT
                        rol_id,
                        nombre
                        FROM adm.rol;`);

            return query
            */
        } catch (error) {
            throw new Error(error)
        }
    }

    public sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
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
