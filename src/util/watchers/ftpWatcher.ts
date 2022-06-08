import * as fs from 'fs';
import * as ch from "chokidar";
import { LecturaCamaraLPRDAO } from '../../lectura_camara_lpr/repository/lectura_camara_lprDAO';
import { LecturaCamaraLpr } from '../../lectura_camara_lpr/models/lectura_camara_lpr.model';
import { EventoTransitoDAO } from '../../dimensionamiento/evento_transito/repository/evento_transitoDAO';
import { EventoTransito } from '../../dimensionamiento/evento_transito/models/evento_transito.model';



export class FtpWatcher {

    private static instance: FtpWatcher;

    private constructor(ruta_ftp: string, sub_sistema_id: string, periferico_id: string) {
        let watchOptions = {
            persistent: true,
            ignoreInitial: true,
            awaitWriteFinish: true,
            //usePolling: false,
            ignorePermissionErrors: false
        };
        ch.watch(ruta_ftp, watchOptions).on('add', (path) => {

            let data = fs.readFileSync(path, { encoding: 'utf8', flag: 'r' });
            let properties = this.getMetadata(data);
            if (sub_sistema_id == '1') {
                this.evasion(properties, periferico_id, path);
            } else if (sub_sistema_id == '2') {
                this.dimensionamiento(properties, periferico_id, path);
            }
        });
    }

    static start(ruta_ftp: string, sub_sistema_id: string, periferico_id: string) {
        try {
            FtpWatcher.instance = new FtpWatcher(ruta_ftp, sub_sistema_id, periferico_id);
        } catch (error) {
            console.log('An error occurred while the ftp watcher was started ' + error + ` ${FtpWatcher.name} -> ${this.start.name}`);
        }
    }


    private getMetadata(data) {
        try {

            let test = data.split('/n')
            data = null
            let re = /FwV?(.*)/g
            let x = re.exec(test[test.length - 1])
            test = null
            let result = x[0].split(';')
            let properties: any = {}
            for (let i = 0; i < result.length - 1; i++) {
                let b = result[i].split('=')
                properties[b[0]] = b[1]
            }
            console.log(properties)
            return properties
        } catch (error) {
            console.log('An error occurred getting the meta data' + error + ` ${FtpWatcher.name} -> ${this.getMetadata.name}`);
        }
    }

    private async dimensionamiento(properties: any, periferico_id: string, path: string) {
        try {
            let lectura_camara_lpr_obj: LecturaCamaraLpr = new LecturaCamaraLpr()
            lectura_camara_lpr_obj.periferico_id = periferico_id,
            lectura_camara_lpr_obj.placa_identificada = properties["Placa"],
            lectura_camara_lpr_obj.estadistica = properties["Cc0"] + ", " + properties["Cc1"] + ", " + properties["Cc2"] + ", " + properties["Cc3"] + ", " + properties["Cc4"] + ", " + properties["Cc5"],
            lectura_camara_lpr_obj.url_matricula = "",
            lectura_camara_lpr_obj.url_foto_ampliada = path,
            lectura_camara_lpr_obj.fecha_hora = Date()
            let lectura_camara_lprDAO = new LecturaCamaraLPRDAO();
            lectura_camara_lpr_obj = await lectura_camara_lprDAO.insertLecturaCamaraLPR(lectura_camara_lpr_obj, 'dimensionamiento');


            let evento_transito_obj: EventoTransito = new EventoTransito();
            evento_transito_obj.fecha_hora = Date();
            evento_transito_obj.lectura_camara_lpr_id = lectura_camara_lpr_obj.lectura_camara_lpr_id;
            evento_transito_obj.lectura_sensores_id = 1;
            evento_transito_obj.clase_vehiculo_id = "0";
            evento_transito_obj.tipo = 1;
            let evento_transitoDAO = new EventoTransitoDAO(); 
            evento_transitoDAO.insertEventoTransito(evento_transito_obj)
        } catch (error) {
            console.log('An error occurred on dimesionamiento' + error + ` ${FtpWatcher.name} -> ${this.evasion.name}`);
        }
    }

    private evasion(properties: any, periferico_id: string, path: string) {
        try {
            let lectura_camara_lpr_obj: LecturaCamaraLpr = new LecturaCamaraLpr()

            lectura_camara_lpr_obj.periferico_id = periferico_id,
                lectura_camara_lpr_obj.placa_identificada = properties["Placa"],
                lectura_camara_lpr_obj.estadistica = properties["Cc0"] + ", " + properties["Cc1"] + ", " + properties["Cc2"] + ", " + properties["Cc3"] + ", " + properties["Cc4"] + ", " + properties["Cc5"],
                lectura_camara_lpr_obj.url_matricula = "",
                lectura_camara_lpr_obj.url_foto_ampliada = path,
                lectura_camara_lpr_obj.fecha_hora = Date()

            let lectura_camara_lprDAO = new LecturaCamaraLPRDAO();
            lectura_camara_lprDAO.insertLecturaCamaraLPR(lectura_camara_lpr_obj, 'evasion');
        } catch (error) {
            console.log('An error occurred on evasion' + error + ` ${FtpWatcher.name} -> ${this.evasion.name}`);
        }
    }
}