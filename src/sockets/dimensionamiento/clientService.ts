import * as socketio from "socket.io-client"

export class ClientSocketService {

	private static instance: ClientSocketService;

	private log
	private io

	public constructor(server: any) {

		this.io = socketio(server)
		console.log('Connected!', this.io);
		// Add a connect listener
		this.io.on('connect', (socket) => {
			console.log('Connected!', socket);
			socket.on('connect', function (socket) {
				console.log('Connected!');
			});
	
			socket.on("data", (data) => {
				console.log("Data: ", data);
			});
	
			socket.on('message', function (data) {
				console.log('Received a message from the server!', data);
			});
	
			socket.on('error', function (data) {
				console.log('error on the server!', data);
			});
	
			socket.on('disconnect', () => {
	
				try {
					console.log('disconnect!');
				} catch (error) {
					console.log('An error occurred while the socket disconnect ' + error + ` socketOnDisconnect -> ${error}`);
				}
			});
		});

		
	}
}

