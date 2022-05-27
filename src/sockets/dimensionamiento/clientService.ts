import { io } from "socket.io-client"



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
		const socket = io();


		this.io.origins('*:*')

		this.io.on('connection', (socket) => {

			socket.on("connect", () => {
				const engine = socket.io.engine;
				console.log(engine.transport.name); // in most cases, prints "polling"

				engine.once("upgrade", () => {
					// called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
					console.log(engine.transport.name); // in most cases, prints "websocket"
				});

				engine.on("packet", ({ type, data }) => {
					// called for each packet received
				});

				engine.on("packetCreate", ({ type, data }) => {
					// called for each packet sent
				});

				engine.on("drain", () => {
					// called when the write buffer is drained
				});

				engine.on("close", (reason) => {
					// called when the underlying connection is closed
				});
			});

			socket.on("data", () => { /* ... */ });

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

