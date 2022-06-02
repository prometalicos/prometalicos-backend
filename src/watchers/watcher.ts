import * as fs from 'fs';
import * as ch from "chokidar";
import { PerifericoDAO } from '../periferico/repository/perifericoDAO';
import { FtpWatcher } from './ftpWatcher';



export class Watcher {

    private static instance: Watcher;
    private static perifericosDAO: PerifericoDAO;
    private static watcherList: Array<any>;

    private constructor() {



    }

    private static async startWatchers() {
        try {
            this.perifericosDAO = new PerifericoDAO();
            let perifericos = await this.perifericosDAO.getPeriferico();
            if ((perifericos != null || perifericos != undefined) && perifericos.length > 0) {
                perifericos.forEach(periferico => {
                    if(periferico['tipo_periferico_id'] == 1){
                        this.watcherList.push(FtpWatcher.start(periferico['ruta_ftp'], periferico['sub_sistema_id']));
                    }
                });
            }
        } catch (error) {
            console.log('An error occurred while the watchers were started ' + error + ` ${Watcher.name} -> ${this.startWatchers.name}`);
        }
    }

    static getInstance() {
        try {
            if (!Watcher.instance) {
                this.startWatchers();
                Watcher.instance = new Watcher();
            }
            return Watcher.instance;
        } catch (error) {
            console.log('An error occurred while the watcher was started ' + error + ` ${Watcher.name} -> ${this.getInstance.name}`);
        }
    }

}