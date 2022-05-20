import * as ch from "chokidar";



export class FtpWatcher {

    private static instance: FtpWatcher;

    private constructor() {
        ch.watch('/home/ceul/Descargas/ftp').on('all', (event, path) => {
            console.log(event, path);
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