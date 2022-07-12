import { text } from 'body-parser';
import { Transit_end } from '../drivers/comark/models/transit_end';
import * as io from 'socket.io-client'
import { Sensor_status } from '../drivers/comark/models/sensor_status';
import { LecturaSensoresLaserDAO } from '../../dimensionamiento/lectura_sensor_laser/repository/lectura_sensores_laserDAO';
import { DimensionamientoOrchestrator } from '../../dimensionamiento/orchestrator/dimensionamientoOrchestrator';



export class LaserWatcher {

	private dimensionamientoOrchestrator: DimensionamientoOrchestrator;
	private static instance: LaserWatcher;

	static start(host: string, port: number, sub_sistema_id: string, periferico_id: string) {
		try {
			LaserWatcher.instance = new LaserWatcher(host, port, sub_sistema_id, periferico_id);
		} catch (error) {
			console.log('An error occurred while the laser watcher was started ' + error + ` ${LaserWatcher.name} -> ${this.start.name}`);
		}
	}

	public constructor(host: string, port: number, sub_sistema_id: string, periferico_id: string) {

		var XMLMapping = require('xml-mapping');
		var contador_conexiones: number;
		this.dimensionamientoOrchestrator = DimensionamientoOrchestrator.getInstance();

		const deserialize = (xml__) => {
			try {
				var json = XMLMapping.load(xml__);
				var xml = XMLMapping.dump(json);

				const obj = JSON.parse(JSON.stringify(json));
				if (obj.sensor.transit_end !== undefined) {
					console.log('---------- [transit_end] ---------- [', obj.sensor.transit_end.id, obj.sensor.transit_end.time_iso, ']');
					let obj_transit_end = new Transit_end();
					obj_transit_end = obj.sensor.transit_end; // Enviar a persistencia
					//console.log(obj_transit_end);
					if (this.dimensionamientoOrchestrator === undefined) {
						this.dimensionamientoOrchestrator = DimensionamientoOrchestrator.getInstance();
						console.log(`\n\ Orquestador de Laser sin instancia (se recupera) : ${obj_transit_end}.`, '\n');
					}
					this.dimensionamientoOrchestrator.laser(obj_transit_end);
				}
				else if(obj.sensor.sensor_status !== undefined){
					console.log('---------- [sensor_status] ---------- [', obj.sensor.sensor_status.status,  obj.sensor.sensor_status.time_iso, ']');
				}
				else{
					if (obj.sensor.length !== undefined && obj.sensor.length > 0){
						if (obj.sensor[0].transit_end !== undefined){
							console.log('('+obj.sensor.length+')  ----------transit_end---------- [', obj.sensor[0].transit_end.id, obj.sensor[0].transit_end.time_iso, ']');
						} else if (obj.sensor[0].sensor_status !== undefined){
							console.log('('+obj.sensor.length+') ----------sensor_status---------- [', obj.sensor[0].sensor_status.status, obj.sensor[0].sensor_status.time_iso, ']');
						}
						
					}
				}

				return XMLMapping.load(xml__);


				// Object.entries(json).forEach(obj_json => {

				// 	Object.entries(obj_json).forEach(([key, sensor]) => {

				// 		Object.entries(sensor).forEach(([key2, value]) => {
				// 			//console.log('\n >>>> item por item de value --> ', value);
				// 			if (value.transit_end !== undefined) {
				// 				//console.log('----------transit_end---------- [', value.transit_end.id, value.transit_end.time_iso, ']');
				// 				let obj_transit_end = new Transit_end();
				// 				obj_transit_end = value.transit_end; // Enviar a persistencia
				// 				//console.log(obj_transit_end);
				// 				if (this.dimensionamientoOrchestrator === undefined) {
				// 					this.dimensionamientoOrchestrator = DimensionamientoOrchestrator.getInstance();
				// 					console.log(`\n\nDeserialize undefined: ${obj_transit_end}.`, '\n');
				// 				}
				// 				this.dimensionamientoOrchestrator.laser(obj_transit_end);

				// 				//let obj = new LecturaSensoresLaserDAO();
				// 				//obj.insertLecturaSensoresLaser(obj_transit_end, '2');

				// 				//Object.entries(value.transit_end).forEach(([key3, transit_end]) => {
				// 					//console.log(`${key3} ${transit_end}`);
				// 				//});
				// 			} else if (value.sensor_status !== undefined) {
				// 				//console.log('----------sensor_status---------- [', value.sensor_status.status, ']');
				// 				let obj_sensor_status = new Sensor_status();
				// 				obj_sensor_status = value.sensor_status; // Validar si no es 8 de ready
				// 				//Object.entries(value.sensor_status).forEach(([key3, sensor_status]) => {
				// 					//console.log(`${key3} ${sensor_status}`);
				// 				//});
				// 			}
				// 			//console.log(`${key2} ${value.transit_end}`);
				// 		});
				// 	});
				// 	//console.log('-------------------');
				// });

				
			}
			catch (e) {
				//Other browsers without XML Serializer
				console.log('Xmlserializer not supported ', e);
			}
			return false;
		}

		//const xml__ = '<sensor id="1" type="LaserStereoMaster"><transit_end id="16" lane="1" lane_id="15" time_iso="2022-06-04T22:56:55" speed="0" height="3900" width="2930" length="18500" refl_pos="100" gap="164969" headway="168914" occupancy="6476" class_id="7" position="C" direction="I" wrong_way="0" stop_and_go="0"/></sensor><sensor id="1" type="LaserStereoMaster"><sensor_status status="8" time_iso="2022-06-04T22:54:47" tailgate_mode="0" photocell_status="0"/></sensor><sensor id="1" type="LaserStereoMaster"><sensor_status status="8" time_iso="2022-06-04T22:55:17" tailgate_mode="0" photocell_status="0"/></sensor><sensor id="1" type="LaserStereoMaster"><sensor_status status="8" time_iso="2022-06-04T22:55:47" tailgate_mode="0" photocell_status="0"/></sensor><sensor id="1" type="LaserStereoMaster"><sensor_status status="8" time_iso="2022-06-04T22:56:17" tailgate_mode="0" photocell_status="0"/></sensor><sensor id="1" type="LaserStereoMaster"><sensor_status status="8" time_iso="2022-06-04T22:56:47" tailgate_mode="0" photocell_status="0"/></sensor>';
		
		
		//const xml__ = '<sensor id="1" type="LaserStereoMaster"><transit_end id="55" lane="1" lane_id="31" time_iso="2022-07-11T22:59:15" speed="5" height="3280" width="2830" length="11000" refl_pos="100" gap="87926" headway="94271" occupancy="1980" class_id="4" position="C" direction="I" wrong_way="0" stop_and_go="0"/></sensor>';
		//const xml__ = '<sensor id="1" type="LaserStereoMaster"><sensor_status status="8" time_iso="2022-07-11T22:59:10" tailgate_mode="0" photocell_status="0"/></sensor>';
		//const xml__ = '<sensor id="1" type="LaserStereoMaster"><sensor_status status="8" time_iso="2022-07-11T23:36:13" tailgate_mode="0" photocell_status="0"/></sensor><sensor id="1" type="LaserStereoMaster"><sensor_status status="8" time_iso="2022-07-11T23:36:43" tailgate_mode="0" photocell_status="0"/></sensor><sensor id="1" type="LaserStereoMaster"><sensor_status status="8" time_iso="2022-07-11T23:37:13" tailgate_mode="0" photocell_status="0"/></sensor>';

		//deserialize(xml__);

		const net = require('net');
		const client = new net.Socket();
		contador_conexiones = 1;
		let conexion_end = false;
		let conexion_close = false;

		const sleep = (ms) => {
			return new Promise((resolve) => {
				setTimeout(resolve, ms);
			});
		}

		const conectar = () => {
			client.connect({ port: port, host: host }, function () {
				console.log('Iniciando watcher periferico: ', {
					// port: port, host: host, sub_sistema_id: sub_sistema_id,
					// periferico_id: periferico_id
					port: port, host: host
				});
			});
		};

		const reconectar = (e, evt) => {
			console.log('connection ', evt, ' -> ' + e);
			client.destroy();
			client.removeAllListeners(); // the important line that enables you to reopen a connection
			setTimeout(() => {
				console.log('trying to reconnect');
				conectar();
			}, 1000);
		}

		client.on('data', function (data) {
			client.write(data);
			let obj = deserialize(data.toString());
		});

		client.on('error', function (err) {
			console.log('Connection error ', err);
		});

		client.on('close', function (e) {
			if (conexion_end === true) {
				conexion_end = false;
			}
			else {
				conexion_close = true;
				reconectar(contador_conexiones, 'closed');
				contador_conexiones++;
			}
		});

		client.on('end', function () {
			if (conexion_close === true) {
				conexion_close = false;
			} else {
				conexion_end = true;
				reconectar(contador_conexiones, 'end');
				contador_conexiones++;
			}
		});

		conectar();
	}
}

