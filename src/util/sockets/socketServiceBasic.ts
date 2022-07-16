import { Server } from "socket.io";

export class SocketServiceBasic {

    private static instance: SocketServiceBasic;
    private io;

    private servidor = (s) => {
        this.io = new Server(s, {
            cors: {
              origin: '*',
            }
        });

        this.io.on("connection", socket => {
            socket.join(socket.id, () => console.log(`Socket ${socket.id}`));
        });
    };

    private constructor(s: any) {
        try {
            this.servidor(s);
        } catch (error) {
            console.log('An error ocurred in the socket constructor ', error)
        }
    }

    static getInstance() {
        try {
            return SocketServiceBasic.instance;
        } catch (error) {
            console.log('An error occurred while the instance was returned ' + error + ` ${SocketServiceBasic.name} -> ${this.getInstance.name}`);
        }
    }

    static start(server) {
        try {
            console.log("start");
            SocketServiceBasic.instance = new SocketServiceBasic(server);
        } catch (error) {
            console.log('An error occurred while the socket service was started ' + error + ` ${SocketServiceBasic.name} -> ${this.start.name}`);
        }
    }

    public emit(eventName: string, data: any, usersId = [], toAdm = false) {
        try {
            this.io.emit(eventName, data);
            console.log(`Se emite: ${data}`);
        } catch (error) {
            console.log('An error occurred while the socket service was emitted ' + error + ` ${this.emit.name} -> ${error}`);

        }
    }
}

