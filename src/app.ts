import * as express from "express";
import * as bodyParser from "body-parser";
import { DataBaseService } from "./db_connection/services/dataBaseService";
import { AuthRoutes } from "./auth/routes/authRoutes";
import { UsiariosRoutes } from "./usuarios/routes/usuariosRoutes";
import { FtpWatcher } from "./ftpWatcher";


class App {

    public app: express.Application;
    public authRoutes: AuthRoutes = new AuthRoutes()
    public usuariosRoutes: UsiariosRoutes = new UsiariosRoutes()
    private ftpWatcher
    private connection;
    
    constructor() {
        this.app = express();
        this.config();
        this.authRoutes.routes(this.app)
        this.usuariosRoutes.routes(this.app)
        this.connection = DataBaseService.getInstance();
        this.ftpWatcher = FtpWatcher.start();
    }

    private config(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
}

export default new App().app;