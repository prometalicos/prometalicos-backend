import * as express from "express";
import * as bodyParser from "body-parser";

import { Watcher } from "./util/watchers/watcher";
import { DataBaseInterface } from "./util/db_connection/services/databaseInterface";
import { LecturaSensoresLaserRoutes } from "./dimensionamiento/lectura_sensor_laser/routes/lectura_sensores_laserRoutes";
import { DimensionamientoOrchestrator } from "./dimensionamiento/orchestrator/dimensionamientoOrchestrator";
import { SedeRoutes } from "./global/sede/routes/sedeRoutes";
import { VekRoutes } from "./evasion/vek/routes/vekRoutes";
import { EvasionOrchestrator } from "./evasion/orchestrator/evasionOrchestrator";

import { AuthRoutes } from "./util/auth/routes/authRoutes";
import { UsiariosRoutes } from "./global/usuarios/routes/usuariosRoutes";
import { ConcesionRoutes } from "./global/concesion/routes/concesionRoutes";
import { SubSistemaRoutes } from "./global/subSistema/routes/subSistemaRoutes";
import { DimensionamientoRoutes } from "./dimensionamiento/routes/dimensionamientoRoutes";
import { RolRoutes } from "./global/rol/routes/rolRoutes";
import { ClaseVehiculoRoutes } from "./dimensionamiento/clase_vehiculo/routes/clase_vehiculoRoutes";
import { PosibleInfraccionRoutes } from "./dimensionamiento/posible_infraccion/routes/posible_infraccionRoutes";

class App {
    public app: express.Application;

    public SubSistemaRoutes: SubSistemaRoutes = new SubSistemaRoutes();
    public authRoutes: AuthRoutes = new AuthRoutes()
    public usuariosRoutes: UsiariosRoutes = new UsiariosRoutes()
    public concesionRoutes: ConcesionRoutes = new ConcesionRoutes()
    public sedeRoutes: SedeRoutes = new SedeRoutes();
    public rolRoutes: RolRoutes = new RolRoutes();
    public dimensionamientoRoutes: DimensionamientoRoutes = new DimensionamientoRoutes();

    public vekRoutes: VekRoutes = new VekRoutes();
    public clasVehiculoRoutes: ClaseVehiculoRoutes = new ClaseVehiculoRoutes();
    public lecturaSensoresLaser: LecturaSensoresLaserRoutes = new LecturaSensoresLaserRoutes()
    public posibleInfraccion: PosibleInfraccionRoutes = new PosibleInfraccionRoutes()
    private watcher;
    private dimensionamientoOrchestrator;
    private evasionOrchestrator;
    private connection;
    private connection2;
    private connection3;
    
    constructor() {
        this.app = express();
        this.config();
        this.authRoutes.routes(this.app);
        this.usuariosRoutes.routes(this.app);
        this.concesionRoutes.routes(this.app);
        this.SubSistemaRoutes.routes(this.app);
        this.rolRoutes.routes(this.app);
        this.sedeRoutes.routes(this.app);
        this.posibleInfraccion.routes(this.app);
        this.lecturaSensoresLaser.routes(this.app);
        this.dimensionamientoRoutes.routes(this.app);
        this.clasVehiculoRoutes.routes(this.app);
        this.vekRoutes.routes(this.app);
        this.connection = DataBaseInterface.getInstance('global');
        this.connection2 = DataBaseInterface.getInstance('evasion');
        this.connection3 = DataBaseInterface.getInstance('dimensionamiento');
        this.watcher = Watcher.getInstance();
        this.dimensionamientoOrchestrator = DimensionamientoOrchestrator.getInstance();
        //this.evasionOrchestrator = EvasionOrchestrator.getInstance();
    }

    private config(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
}

export default new App().app;