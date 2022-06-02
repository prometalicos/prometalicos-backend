import * as io from 'socket.io-client'
import { Manager } from "socket.io-client";
const WebSocket = require('ws');

export class ClientSocketService {

	private static instance: ClientSocketService;

	public constructor(server: any) {

		const URL = server; // "http://localhost:3000";
		const socket = io(URL, { autoConnect: true });

		const deserialize = (xml) => {
			var xml_string = 'your xml string';
			
			var xmlText = new XMLSerializer().serializeToString(xml);
			var xmlTextNode = document.createTextNode(xmlText);
			var parentDiv = document.getElementById('SomeDiv');
			parentDiv.appendChild(xmlTextNode);

			var output = parentDiv

			var array = []; // <----------------------------- array for storing the keys

			// display the output
			console.log(output);
		}

		// const manager = new Manager(URL, {
		// 	autoConnect: true
		// });

		// const socket2 = manager.socket("/");

		// const socket3 = new WebSocket('ws://172.19.150.5:12876');

		// // Listen for messages
		// socket3.addEventListener('data', function (event) {
		// 	console.log('Message from server ', event.data);
		// });

		// manager.open((err) => {
		// 	if (err) {
		// 	  // an error has occurred
		// 	  console.log('Error Connected!', err);
		// 	} else {
		// 	  // the connection was successfully established
		// 	  console.log('Yes!');
		// 	}
		//   });

		console.log('Called!');
		socket.on('connect', function (socket) {
			console.log('Connected!');
		});

		socket.onAny((eventName) => {
			console.log('Evento!', eventName);
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

	}


}

