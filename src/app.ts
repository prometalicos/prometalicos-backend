import * as express from "express";
import * as bodyParser from "body-parser";
import { AuthRoutes } from "./util/auth/routes/authRoutes";
import { UsiariosRoutes } from "./global/usuarios/routes/usuariosRoutes";
import { ConcesionRoutes } from "./global/concesion/routes/concesionRoutes";
import { RolRoutes } from "./global/rol/routes/rolRoutes";
import { Watcher } from "./util/watchers/watcher";
import { DataBaseInterface } from "./util/db_connection/services/databaseInterface";


class App {

    public app: express.Application;
    public authRoutes: AuthRoutes = new AuthRoutes()
    public usuariosRoutes: UsiariosRoutes = new UsiariosRoutes()
    public concesionRoutes: ConcesionRoutes = new ConcesionRoutes()
    public rolRoutes: RolRoutes = new RolRoutes()
    private watcher
    private connection;
    private connection2;
    private connection3;
    
    constructor() {
        this.app = express();
        this.config();
        this.authRoutes.routes(this.app)
        this.usuariosRoutes.routes(this.app)
        this.concesionRoutes.routes(this.app)
        this.rolRoutes.routes(this.app)
        this.connection = DataBaseInterface.getInstance('global');
        this.connection2 = DataBaseInterface.getInstance('evasion');
        this.connection3 = DataBaseInterface.getInstance('dimensionamiento');
        this.watcher = Watcher.getInstance();
    }

    private config(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
}

export default new App().app;