import uuid = require("uuid");
import { LecturaCamaraLPRDAO } from "../../lectura_camara_lpr/repository/lectura_camara_lprDAO";
import { LecturaCamaraLpr } from "../../lectura_camara_lpr/models/lectura_camara_lpr.model";
import { EventoTransito } from "../evento_transito/models/evento_transito.model";
import { EventoTransitoDAO } from "../evento_transito/repository/evento_transitoDAO";
import { LecturaSensoresLaserDAO } from "../../dimensionamiento/lectura_sensor_laser/repository/lectura_sensores_laserDAO";
import { SocketService } from "../../util/sockets/socketService";
import { ClaseVehiculoDAO } from "../../dimensionamiento/clase_vehiculo/repository/clase_vehiculoDAO";
import { ClaseVehiculo } from "../../dimensionamiento/clase_vehiculo/models/clase_vehiculo.model";
import { PosibleInfraccionDAO } from "../../dimensionamiento/posible_infraccion/repository/posible_infraccionDAO";
import { PosibleInfraccion } from "../../dimensionamiento/posible_infraccion/models/posible_infraccion.model";
import { SocketServiceBasic } from "../../util/sockets/socketServiceBasic";
import { Transit_end } from "../../util/drivers/comark/models/transit_end";

export class DimensionamientoOrchestrator {

    private static instance: DimensionamientoOrchestrator;
    private queue: Array<any>;
    private socketService: SocketService

    private constructor() {
        this.queue = [];
    }

    static getInstance() {
        try {
            if (!DimensionamientoOrchestrator.instance) {
                DimensionamientoOrchestrator.instance = new DimensionamientoOrchestrator();
            }
            return DimensionamientoOrchestrator.instance;
        } catch (error) {
            console.log('An error occurred while the watcher was started ' + error + ` ${DimensionamientoOrchestrator.name} -> ${this.getInstance.name}`);
        }
    }

    public eventStart() {
        try {
            
            console.log("=====================");
            console.log("Iniciando orquestador");
            console.log("=====================");
            if (this.queue.length > 0) {
                this.insertData();

            }
            this.queue.push({
                id: uuid.v4(),
                laser: null,
                lpr: null
            })

        } catch (error) {
            console.log('An error occurred in the eventStart ' + error + ` ${DimensionamientoOrchestrator.name} -> ${this.eventStart.name}`);
        }
    }

    public lpr(lpr_data) {
        try {
            for (let index = 0; index < this.queue.length; index++) {
                if (this.queue[index]["lpr"] == null) {
                    this.queue[index]["lpr"] = lpr_data
                    break
                }
            }
        } catch (error) {
            console.log('An error occurred in the lpr ' + error + ` ${DimensionamientoOrchestrator.name} -> ${this.lpr.name}`);
        }
    }

    public laser(laser_data) {
        try {
            for (let index = 0; index < this.queue.length; index++) {
                if (this.queue[index]["laser"] == null ) {
                    this.queue[index]["laser"] = laser_data
                    console.log("Integrando laser al orquestador ");
                    break
                }
            }
        } catch (error) {
            console.log('An error occurred in the laser ' + error + ` ${DimensionamientoOrchestrator.name} -> ${this.laser.name}`);
        }
    }

    private async insertData() {
        try {
            let lectura_camara_lpr_obj = this.queue[0]["lpr"];
            let lectura_camara_lprDAO = new LecturaCamaraLPRDAO();
            lectura_camara_lpr_obj = await lectura_camara_lprDAO.insertLecturaCamaraLPR(lectura_camara_lpr_obj, 'dimensionamiento');

            // let lectura_sensor_laser_obj = {
            //     id: 1,
            //     clase_vehiculo_id: "0"
            // }

            let lectura_sensor_laser_obj = new Transit_end();

            let msg = '( sin lectura de laser )';
            if (this.queue[0]['laser'] != null) {
                let lectura_sensor_laser_obj = this.queue[0]["laser"]
                let lectura_sensor_laserDAO = new LecturaSensoresLaserDAO();
                lectura_sensor_laser_obj = await lectura_sensor_laserDAO.insertLecturaSensoresLaser(lectura_sensor_laser_obj, '2'); // Obtener ID
                msg = '( con lectura de laser ' + lectura_sensor_laser_obj.id + ' )';
            }
            else{
                lectura_sensor_laser_obj.init();
            }

            let evento_transito_obj: EventoTransito = new EventoTransito();
            evento_transito_obj.fecha_hora = Date();
            evento_transito_obj.lectura_camara_lpr_id = lectura_camara_lpr_obj.lectura_camara_lpr_id;
            evento_transito_obj.lectura_sensores_id = lectura_sensor_laser_obj.id;
            evento_transito_obj.tipo = 1; // 1: lectura normal 2: Lectura por dispositivos de fugados
            let evento_transitoDAO = new EventoTransitoDAO();
            evento_transito_obj = await evento_transitoDAO.insertEventoTransito(evento_transito_obj);
            
            //Chequea que cumpla con los parametros y
            // emite los datos a traves de sockets
            let clase_vehiculoDAO = new ClaseVehiculoDAO();
            console.log("Obteniendo la clase de vehiculo: ", lectura_sensor_laser_obj.class_id);
            let clase_vehiculo: ClaseVehiculo = await clase_vehiculoDAO.getClaseVehiculoById(lectura_sensor_laser_obj.class_id);
            console.log("Regreso: ", clase_vehiculo["rows"].descripcion);
            let clase_vehiculo_send = {
                descripcion: clase_vehiculo.descripcion,
                url_picture: clase_vehiculo.url_picture,
                max_height: clase_vehiculo.max_height,
                max_width: clase_vehiculo.max_width,
                max_length: clase_vehiculo.max_length
            }
            let esAlerta = false
            if (lectura_sensor_laser_obj.height > clase_vehiculo.max_height || lectura_sensor_laser_obj.length > clase_vehiculo.max_length || lectura_sensor_laser_obj.width > clase_vehiculo.max_width) {
                esAlerta = true;
                let posible_infracionDAO = new PosibleInfraccionDAO()
                let posible_infraccion = new PosibleInfraccion()
                posible_infraccion.evento_transito_id = evento_transito_obj.evento_transito_id
                posible_infraccion.estado = true
                posible_infraccion.infracciones_adm_id = "01" // codigo de dimensionamiento
                posible_infraccion.funcionario_id = "01" // codigo de dimensionamiento
                posible_infraccion.fecha_hora = lectura_camara_lpr_obj.fecha_hora
                await posible_infracionDAO.insertPosibleInfraccion(posible_infraccion)
            }
            let socketService = SocketServiceBasic.getInstance()

            socketService.emit("dimensionamiento-emit", {
                lectura_sensor_laser_obj,
                lectura_camara_lpr_obj,
                clase_vehiculo_send,
                esAlerta
            });

            console.log('Registro vehiculo placa: ', lectura_camara_lpr_obj.placa_identificada + ' ( ' + msg + ' )');
            console.log("--------------------");
            console.log("Cerrando orquestador");
            console.log("--------------------");
            this.queue.shift();
        } catch (error) {
            console.log('An error occurred in the insertData ' + error + ` ${DimensionamientoOrchestrator.name} -> ${this.insertData.name}`);
        }
    }

}