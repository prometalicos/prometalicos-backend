import * as socketio from "socket.io"
let utils = require('../../utils')


export class SocketService {

    private static instance: SocketService;

    private log
    private io
    private connections: {
        user: string,
        type: string
        socket: any
    }[]

    private constructor(server: any) {
        this.connections = []
        this.io = socketio(server)
        this.io.origins('*:*')

        this.io.on('connection', (socket) => {

            this.connections.push({ socket, user: null, type: null })
            socket.on('authUser', async (token) => {
                try {
                    let user = await utils.isAuth(token)
                    if (user !== null && user !== undefined) {
                        let userConnection = this.connections.findIndex(connection => connection.socket.id === socket.id)
                        this.connections[userConnection].user = user.id
                        this.connections[userConnection].type = user.tipo
                    }
                } catch (error) {
                    console.log('An error occurred while the socket auth ' + error + ` socketOnAuthUser -> ${error}`);

                }
            });

            socket.on('disconnect', () => {
                try {
                    let index = this.connections.findIndex(item => item.socket.id === socket.id)
                    this.connections.splice(index, 1)
                } catch (error) {
                    console.log('An error occurred while the socket disconnect ' + error + ` socketOnDisconnect -> ${error}`);
                }
            });

        });

        //this.log = new LogModel()
    }

    static getInstance() {
        try {
            return SocketService.instance;
        } catch (error) {
            console.log('An error occurred while the instance was returned ' + error + ` ${SocketService.name} -> ${this.getInstance.name}`);
        }
    }

    static start(server) {
        try {
            SocketService.instance = new SocketService(server);
        } catch (error) {
            console.log('An error occurred while the socket service was started ' + error + ` ${SocketService.name} -> ${this.start.name}`);
        }
    }

    public emit(eventName: string, data: any, usersId = [], toAdm = false) {
        try {
            if (usersId.length === 0) {
                this.io.emit(eventName, data)
            } else {
                for (let index = 0; index < usersId.length; index++) {
                    let userConnection = this.connections.find(connection => connection.user === usersId[index])
                    if (userConnection !== undefined) {
                        this.io.to(userConnection.socket.id).emit(eventName, data)
                    }
                }
                if (toAdm) {
                    let admConections = this.connections.filter(connection => connection.type === '4')
                    for (let index = 0; index < admConections.length; index++) {
                        this.io.to(admConections[index].socket.id).emit(eventName, data)
                    }

                }
            }
        } catch (error) {
            console.log('An error occurred while the socket service was emitted ' + error + ` ${this.emit.name} -> ${error}`);

        }
    }

}

