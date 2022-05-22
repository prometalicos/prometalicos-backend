import * as fs from 'fs';
import * as ch from "chokidar";



export class FtpWatcher {

    private static instance: FtpWatcher;

    private constructor() {
        let watchOptions = {
            persistent: true,
            ignoreInitial: true,
            awaitWriteFinish: true,
            //usePolling: false,
            ignorePermissionErrors: false
        };
        ch.watch('/home/ceul/Descargas/ftp', watchOptions).on('add', (event) => {

            let data = fs.readFileSync(event,
                { encoding: 'utf8', flag: 'r' });

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

        });

    }

    static start() {
        try {
            FtpWatcher.instance = new FtpWatcher();
        } catch (error) {
            console.log('An error occurred while the ftp watcher was started ' + error + ` ${FtpWatcher.name} -> ${this.start.name}`);
        }
    }
}