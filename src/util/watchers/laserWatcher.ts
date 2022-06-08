import { text } from 'body-parser';
import { Transit_end } from '../drivers/comark/models/transit_end';
import * as io from 'socket.io-client'
import { Sensor_status } from '../drivers/comark/models/sensor_status';
import { LecturaSensoresLaserDAO } from '../../dimensionamiento/repository/lectura_sensores_laserDAO';

export class LaserWatcher {

	private static instance: LaserWatcher;
	
	static start(host: string, port: number, sub_sistema_id: string, periferico_id: string) {
        try {
            LaserWatcher.instance = new LaserWatcher(host, port, sub_sistema_id, periferico_id);
        } catch (error) {
            console.log('An error occurred while the laser watcher was started ' + error + ` ${LaserWatcher.name} -> ${this.start.name}`);
        }
    }

	public constructor(host: string, port: number, sub_sistema_id: string, periferico_id: string ) {

		var XMLMapping = require('xml-mapping');
		var contador_conexiones: number;

		const deserialize = (xml__) => {
			try {
				var json = XMLMapping.load(xml__);
				var xml = XMLMapping.dump(json);

				//console.log('\n\n Lo recibido', json);
				//console.log('\n\n Los atributos',);

				Object.entries(json).forEach(obj_json => {
					Object.entries(obj_json).forEach(([key, sensor]) => {
						//console.log(`${key} ${sensor}`);
						Object.entries(sensor).forEach(([key2, value]) => {
							if (value.transit_end !== undefined) {
								console.log('---------transit_end----------');
								let obj_transit_end = new Transit_end();
								obj_transit_end = value.transit_end; // Enviar a persistencia
								let obj = new LecturaSensoresLaserDAO();
								obj.insertLecturaSensoresLaser(obj_transit_end, '2');
								Object.entries(value.transit_end).forEach(([key3, transit_end]) => {
									console.log(`${key3} ${transit_end}`);
								});
							} else if (value.sensor_status !== undefined) {
								//console.log('----------sensor_status---------');
								let obj_sensor_status = new Sensor_status();
								obj_sensor_status = value.sensor_status; // Validar si no es 8 de ready
								Object.entries(value.sensor_status).forEach(([key3, sensor_status]) => {
									//console.log(`${key3} ${sensor_status}`);
								});
							}
							//console.log(`${key2} ${value.transit_end}`);
						});
					});
					//console.log('-------------------');
				});

				return XMLMapping.load(xml__);
			}
			catch (e) {
				//Other browsers without XML Serializer
				console.log('Xmlserializer not supported ', e);
			}
			return false;
		}

		//const xml__ = '<sensor id="1" type="LaserStereoMaster"><transit_end id="16" lane="1" lane_id="15" time_iso="2022-06-04T22:56:55" speed="0" height="3900" width="2930" length="18500" refl_pos="100" gap="164969" headway="168914" occupancy="6476" class_id="7" position="C" direction="I" wrong_way="0" stop_and_go="0"/></sensor><sensor id="1" type="LaserStereoMaster"><sensor_status status="8" time_iso="2022-06-04T22:54:47" tailgate_mode="0" photocell_status="0"/></sensor><sensor id="1" type="LaserStereoMaster"><sensor_status status="8" time_iso="2022-06-04T22:55:17" tailgate_mode="0" photocell_status="0"/></sensor><sensor id="1" type="LaserStereoMaster"><sensor_status status="8" time_iso="2022-06-04T22:55:47" tailgate_mode="0" photocell_status="0"/></sensor><sensor id="1" type="LaserStereoMaster"><sensor_status status="8" time_iso="2022-06-04T22:56:17" tailgate_mode="0" photocell_status="0"/></sensor><sensor id="1" type="LaserStereoMaster"><sensor_status status="8" time_iso="2022-06-04T22:56:47" tailgate_mode="0" photocell_status="0"/></sensor>';
		//console.log(deserialize(xml__));

		const net = require('net');
		const client = new net.Socket();
		contador_conexiones = 0;

		const sleep = (ms) => {
			return new Promise((resolve) => {
				setTimeout(resolve, ms);
			});
		}

		// client.on('close', function() {
		// 	console.log('Connection closed');
		// 	client.destroy();
		// 	contador_conexiones++;
		// 	sleep(5000);
		// 	client.connect({ port: port, host: host }, function () {
		// 		console.log('TCP reconnect (close) connection established with the server.', { port: port, host: host }, '\n');
		// 	});
		// });

		client.on('data', function (data) {
			//console.log(`\nData received from the server: ${data.toString()}.`, '\n');
			let obj = deserialize(data.toString());
			//console.log(`\n\nDeserialize: ${obj}.`, '\n');
		});

		client.on('error', function(err) {
			console.log('Connection error ', err);
		});

		client.on('end', function () {
			console.log('\nRequested an end to the TCP connection ', contador_conexiones);
			//client.destroy();
			contador_conexiones++;
			sleep(10000);
			client.connect({ port: port, host: host }, function () {
				console.log('TCP reconnection (end) established with the server.', { port: port, host: host, sub_sistema_id: sub_sistema_id, 
					periferico_id: periferico_id }, '\n');
			});
		});

		client.connect({ port: port, host: host }, function () {
			console.log('TCP connection established with the server.', { port: port, host: host, sub_sistema_id: sub_sistema_id, 
				periferico_id: periferico_id }, '\n');
		});
	}
}

