import uuid = require("uuid");
import { LecturaCamaraLPRDAO } from "../../lectura_camara_lpr/repository/lectura_camara_lprDAO";
import { LecturaCamaraLpr } from "../../lectura_camara_lpr/models/lectura_camara_lpr.model";
import { EventoTransito } from "../evento_transito/models/evento_transito.model";
import { EventoTransitoDAO } from "../evento_transito/repository/evento_transitoDAO";
import { VekDAO } from "evasion/vek/repository/vekDAO";

export class EvasionOrchestrator {

    private static instance: EvasionOrchestrator;
    private queue: Array<any>;

    private constructor() {
        this.queue = [];
    }

    static getInstance() {
        try {
            if (!EvasionOrchestrator.instance) {
                EvasionOrchestrator.instance = new EvasionOrchestrator();
            }
            return EvasionOrchestrator.instance;
        } catch (error) {
            console.log('An error occurred while the watcher was started ' + error + ` ${EvasionOrchestrator.name} -> ${this.getInstance.name}`);
        }
    }

    public eventStart() {
        try {
            console.log("Iniciando evasion orquestador");
            if (this.queue.length > 0) {
                this.insertData();
                
            }
            this.queue.push({
                id: uuid.v4(),
                vek: null,
                lpr: null
            })

        } catch (error) {
            console.log('An error occurred in the eventStart ' + error + ` ${EvasionOrchestrator.name} -> ${this.eventStart.name}`);
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
            console.log('An error occurred in the lpr ' + error + ` ${EvasionOrchestrator.name} -> ${this.lpr.name}`);
        }
    }

    public vek(vek_data) {
        try {
            for (let index = 0; index < this.queue.length; index++) {
                if (this.queue[index]["vek"] == null) {
                    this.queue[index]["vek"] = vek_data
                    break
                }
            }
        } catch (error) {
            console.log('An error occurred in the vek ' + error + ` ${EvasionOrchestrator.name} -> ${this.vek.name}`);
        }
    }

    private async insertData() {
        try {
            let lectura_camara_lpr_obj = this.queue[0]["lpr"];
            let lectura_camara_lprDAO = new LecturaCamaraLPRDAO();
            lectura_camara_lpr_obj = await lectura_camara_lprDAO.insertLecturaCamaraLPR(lectura_camara_lpr_obj, 'evasion');

            let vek_obj = {
                id: 1,
                clase_vehiculo_id: "0"
            }

            if (this.queue[0]['vek'] != null) {
                //let obj = new VekDAO();
				//obj.insertVek(obj_transit_end, '2');
                let vek_obj = this.queue[0]["vek"]
                let lectura_sensor_laserDAO = new VekDAO();
                vek_obj = await lectura_sensor_laserDAO.insertVek(vek_obj, '2'); // Obtener ID
            }

            let evento_transito_obj: EventoTransito = new EventoTransito();
            evento_transito_obj.fecha_hora = Date();
            evento_transito_obj.lectura_camara_lpr_id = lectura_camara_lpr_obj.lectura_camara_lpr_id;
            evento_transito_obj.lectura_sensores_id = vek_obj.id;
            evento_transito_obj.clase_vehiculo_id = vek_obj.clase_vehiculo_id;
            evento_transito_obj.tipo = 1;
            let evento_transitoDAO = new EventoTransitoDAO();
            //console.log(evento_transito_obj);
            evento_transitoDAO.insertEventoTransito(evento_transito_obj);
            console.log('Registro vehiculo placa: ', lectura_camara_lpr_obj.placa_identificada );
            console.log("Cerrando evasion orquestador");
            this.queue.shift();
        } catch (error) {
            console.log('An error occurred in the insertData ' + error + ` ${EvasionOrchestrator.name} -> ${this.insertData.name}`);
        }
    }

}