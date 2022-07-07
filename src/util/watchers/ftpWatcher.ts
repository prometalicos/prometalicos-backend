import * as fs from 'fs';
import * as ch from "chokidar";
import { LecturaCamaraLPRDAO } from '../../lectura_camara_lpr/repository/lectura_camara_lprDAO';
import { LecturaCamaraLpr } from '../../lectura_camara_lpr/models/lectura_camara_lpr.model';
import { EventoTransitoDAO } from '../../dimensionamiento/evento_transito/repository/evento_transitoDAO';
import { EventoTransito } from '../../dimensionamiento/evento_transito/models/evento_transito.model';
import { DimensionamientoOrchestrator } from '../../dimensionamiento/orchestrator/dimensionamientoOrchestrator';



export class FtpWatcher {

    private static instance: FtpWatcher;
    private dimensionamientoOrchestrator: DimensionamientoOrchestrator;

    private constructor(ruta_ftp: string, sub_sistema_id: string, periferico_id: string) {
        try {

            // const getSortedFiles = (files) => {
            //     files = files.map(function (fileName) {
            //         return {
            //             name: fileName,
            //             time: fs.statSync(ruta_ftp + '/' + fileName).mtime.getTime()
            //         };
            //     })
            //         .sort(function (a, b) {
            //             return a.time - b.time;
            //         })
            //         .map(function (v) {
            //             return v.name;
            //         });
            // }

            // let watchOptions = {
            //     persistent: true,
            //     ignoreInitial: true,
            //     awaitWriteFinish: true,
            //     //usePolling: false,
            //     ignorePermissionErrors: false
            // };
            // this.dimensionamientoOrchestrator = DimensionamientoOrchestrator.getInstance();
            // console.log("Iniciando watcher ", ruta_ftp);

            // const fs = require('fs');
            // let cont: number;
            // cont = -1;
            // const countFiles = () => {
            //     var files = fs.readdirSync(ruta_ftp)
            //         .map(function (v) {
            //             return {
            //                 name: v,
            //                 time: fs.statSync(ruta_ftp + '/' + v).mtime.getTime()
            //             };
            //         })
            //         .sort(function (a, b) { return a.time - b.time; })
            //         .map(function (v) { return v.name; });
            //     //console.log(files.length);
            //     //process.stdout.write(""+files.length+">");
            //     if (files.length > cont) {
            //         console.log(files[files.length - 1], files.length);
            //         cont = files.length;

            //         let data = fs.readFileSync(ruta_ftp + '/' + files[files.length - 1], { encoding: 'utf8', flag: 'r' });
            //         let properties = this.getMetadata(data);
            //         if (sub_sistema_id == '1') {
            //             this.evasion(properties, periferico_id, ruta_ftp + '/' + files[files.length - 1]);
            //         } else if (sub_sistema_id == '2') {
            //             this.dimensionamiento(properties, periferico_id, ruta_ftp + '/' + files[files.length - 1]);
            //         }
            //     }
            // }
            // setInterval(countFiles, 1000);

            // ----------- Version 1  ------------------

            // fs.readdir(ruta_ftp, (err, files) => {
            //     try {

            //         files = files.map(function (fileName) {
            //             return {
            //                 name: fileName,
            //                 time: fs.statSync(ruta_ftp + '/' + fileName).mtime.getTime()
            //             };
            //         })
            //             .sort(function (a, b) {
            //                 return a.time - b.time;
            //             })
            //             .map(function (v) {
            //                 return v.name;
            //             });
            //         console.log(files.length);
            //         if (files.length > cont) {
            //             console.log(files[files.length - 2], files.length);
            //             cont = files.length;

            //             let data = fs.readFileSync(ruta_ftp + '/' + files[files.length - 2], { encoding: 'utf8', flag: 'r' });
            //             let properties = this.getMetadata(data);
            //             if (sub_sistema_id == '1') {
            //                 this.evasion(properties, periferico_id, ruta_ftp + '/' + files[files.length - 2]);
            //             } else if (sub_sistema_id == '2') {
            //                 this.dimensionamiento(properties, periferico_id, ruta_ftp + '/' + files[files.length - 2]);
            //             }
            //         }
            //     } catch (error) {
            //         console.log('Recuperando archivos de la camara', error);
            //     }

            // });

            // -----------------------------------------

            let watchOptions = {
                persistent: true,
                ignoreInitial: true,
                awaitWriteFinish: true,
                //usePolling: false,
                ignorePermissionErrors: false
            };
            this.dimensionamientoOrchestrator = DimensionamientoOrchestrator.getInstance();
            console.log("Iniciando watcher ", ruta_ftp);
            let cont = 1;
            ch.watch(ruta_ftp, watchOptions).on('add', (path) => {
                let data = fs.readFileSync(path, { encoding: 'utf8', flag: 'r' });
                const { birthtime } = fs.statSync(path);
                let properties = this.getMetadata(data);
                console.log(cont+' Watch: '+path+' '+birthtime);
                cont++;
                if (sub_sistema_id == '1') {
                    this.evasion(properties, periferico_id, path);
                } else if (sub_sistema_id == '2') {
                    this.dimensionamiento(properties, periferico_id, path);
                    //console.log('Registrando laser');
                }
            });
        } catch (error) {
            console.log('An error occurred while the ftp watcher was init ' + error + ` ${FtpWatcher.name} -> constructor`);
        }
        finally {

        }

    }

    static start(ruta_ftp: string, sub_sistema_id: string, periferico_id: string) {
        try {
            FtpWatcher.instance = new FtpWatcher(ruta_ftp, sub_sistema_id, periferico_id);
            let now= new Date();
            console.log('La fecha actual es',now);
            console.log('Iniciando watcher periferico: ', now, { sub_sistema_id: sub_sistema_id, periferico_id: periferico_id });
        } catch (error) {
            console.log('An error occurred while the ftp watcher was started ' + error + ` ${FtpWatcher.name} -> ${this.start.name}`);
        }
    }


    private getMetadata(data) {
        try {
            let test = data.split('/n')
            data = null
            let re = /DataComp?(.*)/g
            let x = re.exec(test[test.length - 1])
            test = null
            let result = x[0].split(';')
            let properties: any = {}
            for (let i = 0; i < result.length - 1; i++) {
                let b = result[i].split('=');
                properties[b[0]] = b[1];
            }
            return properties
        } catch (error) {
            console.log('An error occurred getting the meta data' + error + ` ${FtpWatcher.name} -> ${this.getMetadata.name}`);
        }
    }

    private async dimensionamiento(properties: any, periferico_id: string, path: string) {
        try {
            this.dimensionamientoOrchestrator.eventStart();
            let lectura_camara_lpr_obj: LecturaCamaraLpr = new LecturaCamaraLpr()
            lectura_camara_lpr_obj.periferico_id = periferico_id,
                lectura_camara_lpr_obj.placa_identificada = properties["Placa"],
                lectura_camara_lpr_obj.estadistica = properties["Cc0"] + ", " + properties["Cc1"] + ", " + properties["Cc2"] + ", " + properties["Cc3"] + ", " + properties["Cc4"] + ", " + properties["Cc5"],
                lectura_camara_lpr_obj.url_matricula = "",
                lectura_camara_lpr_obj.url_foto_ampliada = path,
                lectura_camara_lpr_obj.fecha_hora = Date()
            this.dimensionamientoOrchestrator.lpr(lectura_camara_lpr_obj)
        } catch (error) {
            console.log('An error occurred on dimesionamiento' + error + ` ${FtpWatcher.name} -> ${this.dimensionamiento.name}`);
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