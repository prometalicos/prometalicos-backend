import * as io from 'socket.io-client'
import { Manager } from "socket.io-client";
const WebSocket = require('ws');

export class ClientSocketService {

	private static instance: ClientSocketService;

	public constructor(host: any, port: any) {


		const deserialize = (xmlNode) => {
			try {
				var XMLSerializer = require('xmlserializer');
				// Gecko- and Webkit-based browsers (Firefox, Chrome), Opera.
				return (new XMLSerializer()).serializeToString(xmlNode);
			}
			catch (e) {
			   try {
				  // Internet Explorer.
				  return xmlNode.xml;
			   }
			   catch (e) {  
				  //Other browsers without XML Serializer
				  console.log('Xmlserializer not supported');
			   }
			 }
			 return false;
			
		}

		const Net = require('net');
		// The port number and hostname of the server.

		// Create a new TCP client.
		const client = new Net.Socket();
		// Send a connection request to the server.
		client.connect({ port: port, host: host }, function () {
			// If there is no error, the server has accepted the request and created a new 
			// socket dedicated to us.
			console.log('TCP connection established with the server.', { port: port, host: host });
		});

		// The client can also receive data from the server by reading from its socket.
		client.on('data', function (data) {
			
			console.log(`Data received from the server: ${data.toString()}.`);

			let obj = deserialize(data.toString()) ;
			console.log(`Data received from the server: ${obj}.`);
			
			// Request an end to the connection after the data has been received.
			client.end();
		});

		client.on('end', function () {
			console.log('Requested an end to the TCP connection');
		});

	}


}

