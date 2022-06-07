
import app from './app';
import * as http from "http"
import * as dotenv from "dotenv"
import {SocketService} from "./util/sockets/socketService"

dotenv.config();
const PORT = `${process.env.PORT}`;
const HOST = `${process.env.HOST}`
const server = http.createServer(app);
const sockets = SocketService.start(server)

server.listen(PORT, () => {
    console.log('Prometalicos-backend server listening on port ' + PORT);
})