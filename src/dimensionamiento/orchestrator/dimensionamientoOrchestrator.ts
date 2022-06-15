import uuid = require("uuid");
import { LecturaCamaraLPRDAO } from "../../lectura_camara_lpr/repository/lectura_camara_lprDAO";
import { LecturaCamaraLpr } from "../../lectura_camara_lpr/models/lectura_camara_lpr.model";
import { EventoTransito } from "../evento_transito/models/evento_transito.model";
import { EventoTransitoDAO } from "../evento_transito/repository/evento_transitoDAO";
import { LecturaSensoresLaserDAO } from "../../dimensionamiento/lectura_sensor_laser/repository/lectura_sensores_laserDAO";

export class DimensionamientoOrchestrator {

    private static instance: DimensionamientoOrchestrator;
    private queue: Array<any>;

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
            console.log("Iniciando orquestador");
            if (this.queue.length > 0) {
                this.insertData();
                console.log("Cerrando orquestador");
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
                if (this.queue[index]["laser"] == null) {
                    this.queue[index]["laser"] = laser_data
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

            let lectura_sensor_laser_obj = {
                id: 1,
                clase_vehiculo_id: "0"
            }

            if (this.queue[0]['laser'] != null) {
                //let obj = new LecturaSensoresLaserDAO();
				//obj.insertLecturaSensoresLaser(obj_transit_end, '2');
                let lectura_sensor_laser_obj = this.queue[0]["laser"]
                let lectura_sensor_laserDAO = new LecturaSensoresLaserDAO();
                lectura_sensor_laser_obj = await lectura_sensor_laserDAO.insertLecturaSensoresLaser(lectura_sensor_laser_obj, '2'); // Obtener ID
            }

            let evento_transito_obj: EventoTransito = new EventoTransito();
            evento_transito_obj.fecha_hora = Date();
            evento_transito_obj.lectura_camara_lpr_id = lectura_camara_lpr_obj.lectura_camara_lpr_id;
            evento_transito_obj.lectura_sensores_id = lectura_sensor_laser_obj.id;
            evento_transito_obj.clase_vehiculo_id = lectura_sensor_laser_obj.clase_vehiculo_id;
            evento_transito_obj.tipo = 1;
            let evento_transitoDAO = new EventoTransitoDAO();
            //console.log(evento_transito_obj);
            evento_transitoDAO.insertEventoTransito(evento_transito_obj);
            console.log('Registro vehiculo desde el orquestador', lectura_camara_lpr_obj.placa_identificada );
            this.queue.shift();
        } catch (error) {
            console.log('An error occurred in the insertData ' + error + ` ${DimensionamientoOrchestrator.name} -> ${this.insertData.name}`);
        }
    }

}