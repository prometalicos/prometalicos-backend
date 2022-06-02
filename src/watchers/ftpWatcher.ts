import * as fs from 'fs';
import * as ch from "chokidar";



export class FtpWatcher {

    private static instance: FtpWatcher;

    private constructor(ruta_ftp: string, sub_sistema_id: string) {
        let watchOptions = {
            persistent: true,
            ignoreInitial: true,
            awaitWriteFinish: true,
            //usePolling: false,
            ignorePermissionErrors: false
        };
        ch.watch(ruta_ftp, watchOptions).on('add', (event) => {

            let data = fs.readFileSync(event, { encoding: 'utf8', flag: 'r' });
            if(sub_sistema_id == '1'){

            }
        });

    }

    static start(ruta_ftp: string, sub_sistema_id: string) {
        try {
            FtpWatcher.instance = new FtpWatcher(ruta_ftp, sub_sistema_id);
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

    private dimensionamiento() {
        try {

        } catch (error) {
            console.log('An error occurred on dimesionamiento' + error + ` ${FtpWatcher.name} -> ${this.dimensionamiento.name}`);
        }
    }

    private evasion() {
        try {
            
        } catch (error) {
            console.log('An error occurred on evasion' + error + ` ${FtpWatcher.name} -> ${this.evasion.name}`);
        }
    }
}