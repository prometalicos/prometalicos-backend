DROP DATABASE dimensionamiento;

CREATE DATABASE dimensionamiento
  WITH OWNER = postgres
       ENCODING = 'UTF8'
       TABLESPACE = pg_default
       CONNECTION LIMIT = 6;

\c dimensionamiento

CREATE SCHEMA adm;
CREATE SCHEMA lecturas;
CREATE SCHEMA fugas;
CREATE SCHEMA evasion;
CREATE SCHEMA log;

-- En fuga:
-- Estado del semáforo
-- Via o, patio sí
-- Se lee de tarjeta
-- Si se activó la bucla
-- Guardar placa y foto de evidencia
-- Lleva configuración de tarjeta (control de puertos)
-- Controla con Lenguaje C los periféricos

-------------------------------
-- Lectores_sensor_masa (para evasión)
-- velocidad
-- Fecha, si se activo sensor 1 o sensor 2
-- Sentido de operacion
-- Se tiene dos display

-- Lectura a cada paso de un vehículo
CREATE TABLE adm.lectura_sensores_laser(
        lectura_sensores_id serial not null, -- Llave autonumérica
	periferico_id varchar(64) not null, -- El sensor que reporta el dato
        id integer not null,
        lane integer not null,
        lane_id integer not null,
        time_iso varchar(64) not null,
        speed integer,
        height integer not null,
        width integer not null,
        length integer not null,
        refl_pos integer not null,
        gap integer not null, -- Tiempo desde que inicio el previo vehículo en milisegundos
        headway integer not null, -- Todo el tiempo desde que terminó el anterior vehículo hasta la presente lectura
        occupancy integer not null, -- El tiempo que duró el vehículo entre todos los sensores
        class_id varchar(64) not null, -- Tipo vehículo (foreánea) clase_vehiculo_id
        position varchar(1) not null, -- (L) Left (C) Center (R) Rigth
        direction char not null, -- (I) Entrante (A) Esta lejos el sensor (N) No dectada
        wrong_way char not null, -- (0) No activada (1) Activada
        stop_and char, -- Si el vehículo se detuvo o no
        url_file_pds  varchar(128), -- Ruta de archivo con la lectura de todos los puntos del laser
        CONSTRAINT lectura_sensores_pk PRIMARY KEY (lectura_sensores_id)
        )
          WITH (
             OIDS=FALSE
        );

-- 
CREATE TABLE adm.lectura_camara_lpr(
        lectura_camara_lpr_id serial not null, -- Llave autonumérica
	periferico_id varchar(64) not null, -- El sensor que reporta el dato
        fecha_hora time not null,
        placa_identificada varchar(12) not null,
        estadistica varchar (256),
        url_matricula varchar(256) not null,
        url_foto_ampliada varchar(256) not null,
        CONSTRAINT lectura_lectura_camara_lpr_pk PRIMARY KEY (lectura_camara_lpr_id)
        )
          WITH (
             OIDS=FALSE
        );

CREATE TABLE adm.evento_transito(
	evento_transito_id serial, -- Llave autonumérica
        tipo bit, -- 1: lectura normal 2: Lectura por dispositivos de fugados
	fecha_hora time not null,
        lectura_camara_lpr_id bigint not null,
        lectura_sensores_id bigint not null,
        CONSTRAINT evento_transito_pk PRIMARY KEY (evento_transito_id)
        )
          WITH (
             OIDS=FALSE
        );

-- Se llenará de información con base a la comparación de parámetros al momento de hacer la lectura
CREATE TABLE adm.posibles_infracciones(
	posibles_infracciones_id serial not null, -- Llave autonumérica
        evento_transito_id int not null, -- Contiene el dato de la cámara y el sensor
        funcionario_id varchar(16) not null, -- Funcionario responsable
        infracciones_adm_id varchar(64) not null, -- Código de la infracción
        fecha_hora time not null,
        fecha_novedad time, -- ?
        nota text,
        estado bool not null,
        CONSTRAINT posibles_infracciones_pk PRIMARY KEY (posibles_infracciones_id)
        )
          WITH (
             OIDS=FALSE
        );

-- Gestión Administrativa  OJO -- deberia ir en Global
CREATE TABLE adm.infracciones_adm(
	infracciones_adm_id varchar(64) not null,
        descripcion varchar(256) not null,
        CONSTRAINT infracciones_adm_pk PRIMARY KEY (infracciones_adm_id)
        )
          WITH (
             OIDS=FALSE
        );

-- Registro de funcionarios OJO -- deberia ir en Global
CREATE TABLE adm.funcionario(
	funcionario_id varchar(64) not null,
        nombre_completo varchar(256) not null,
        documento_identificacion varchar(256) not null,
        CONSTRAINT funcionario_pk PRIMARY KEY (funcionario_id)
        )
          WITH (
             OIDS=FALSE
        );
-- Administrativa para clases de vehiculos según normas OJO -- deberia ir en Global
CREATE TABLE adm.clase_vehiculo(
	clase_vehiculo_id varchar(64) not null,
        descripcion varchar(256) not null,
        url_picture varchar(256) not null,
        max_height integer not null,
        max_width integer not null,
        max_length integer not null,
        CONSTRAINT clase_vehiculo_pk PRIMARY KEY (clase_vehiculo_id)
        )
          WITH (
             OIDS=FALSE
        );  

-- OJO -- deberia ir en fuga
CREATE TABLE adm.registro_fugas(
        registro_fugas_id serial,
	evento_transito_id integer not null, -- Llave foránea
	fecha_hora time not null,
        CONSTRAINT registro_fugas_pk PRIMARY KEY (registro_fugas_id)
        )
          WITH (
             OIDS=FALSE
        );

CREATE TABLE adm.registro_evasion(
        registro_evasion_id serial,
	evento_transito_id integer not null, -- Llave foránea
	fecha_hora time not null,
        CONSTRAINT registro_evasion_pk PRIMARY KEY (registro_evasion_id)
        )
          WITH (
             OIDS=FALSE
        );

--ALTER TABLE adm.lectura_sensores_laser ADD CONSTRAINT FK_lectura_sensores_laser__periferico FOREIGN KEY (periferico_id) REFERENCES adm.periferico (periferico_id);
--ALTER TABLE adm.lectura_camara_lpr ADD CONSTRAINT FK_lectura_camara_lpr__periferico FOREIGN KEY (periferico_id) REFERENCES adm.periferico (periferico_id);
ALTER TABLE adm.lectura_sensores_laser ADD CONSTRAINT FK_lectura_sensores_laser__clase_vehiculo FOREIGN KEY (class_id) REFERENCES adm.clase_vehiculo (clase_vehiculo_id);

ALTER TABLE adm.posibles_infracciones ADD CONSTRAINT FK_infracciones__evento_transito FOREIGN KEY (evento_transito_id) REFERENCES adm.evento_transito (evento_transito_id);
ALTER TABLE adm.posibles_infracciones ADD CONSTRAINT FK_infracciones__infracciones_adm FOREIGN KEY (infracciones_adm_id) REFERENCES adm.infracciones_adm (infracciones_adm_id);
ALTER TABLE adm.posibles_infracciones ADD CONSTRAINT FK_infracciones__funcionario FOREIGN KEY (funcionario_id) REFERENCES adm.funcionario (funcionario_id);

-- ALTER TABLE adm.periferico ADD CONSTRAINT FK_periferico__tipo_periferico FOREIGN KEY (tipo_periferico_id) REFERENCES adm.tipo_periferico (tipo_periferico_id);

ALTER TABLE adm.evento_transito ADD CONSTRAINT FK_evento_transito__lectura_camara_lpr FOREIGN KEY (lectura_camara_lpr_id) REFERENCES adm.lectura_camara_lpr (lectura_camara_lpr_id);
ALTER TABLE adm.evento_transito ADD CONSTRAINT FK_evento_transito__lectura_sensores_laser FOREIGN KEY (lectura_sensores_id) REFERENCES adm.lectura_sensores_laser (lectura_sensores_id);

ALTER TABLE adm.registro_evasion ADD CONSTRAINT FK_registro_evasion__evento_transito FOREIGN KEY (evento_transito_id) REFERENCES adm.evento_transito (evento_transito_id);
ALTER TABLE adm.registro_fugas ADD CONSTRAINT FK_registro_fugas__evento_transito FOREIGN KEY (evento_transito_id) REFERENCES adm.evento_transito (evento_transito_id);

INSERT INTO adm.clase_vehiculo (clase_vehiculo_id, descripcion, url_picture, max_height, max_width, max_length) VALUES ('0', 'No clasificado', 'cil-image', 2000, 2000, 2000);
INSERT INTO adm.clase_vehiculo (clase_vehiculo_id, descripcion, url_picture, max_height, max_width, max_length) VALUES ('9', 'Peaton', 'cil-walk', 2000, 2000, 2000);
INSERT INTO adm.clase_vehiculo (clase_vehiculo_id, descripcion, url_picture, max_height, max_width, max_length) VALUES ('1', 'Motocicleta', 'cil-motorbike', 2000, 2000, 2000);
INSERT INTO adm.clase_vehiculo (clase_vehiculo_id, descripcion, url_picture, max_height, max_width, max_length) VALUES ('2', 'Carro', 'cil-car-alt', 2000, 2000, 2000);
INSERT INTO adm.clase_vehiculo (clase_vehiculo_id, descripcion, url_picture, max_height, max_width, max_length) VALUES ('3', 'Van', 'cil-car-alt', 2000, 2000, 2000);
INSERT INTO adm.clase_vehiculo (clase_vehiculo_id, descripcion, url_picture, max_height, max_width, max_length) VALUES ('4', 'Bus', 'cil-bus-alt', 2000, 2000, 2000);
INSERT INTO adm.clase_vehiculo (clase_vehiculo_id, descripcion, url_picture, max_height, max_width, max_length) VALUES ('5', 'Coach', 'cil-truck', 2000, 2000, 2000);
INSERT INTO adm.clase_vehiculo (clase_vehiculo_id, descripcion, url_picture, max_height, max_width, max_length) VALUES ('6', 'Camión', 'cil-truck', 2000, 2000, 2000);
INSERT INTO adm.clase_vehiculo (clase_vehiculo_id, descripcion, url_picture, max_height, max_width, max_length) VALUES ('7', 'Camión articuldo', 'cil-truck', 2000, 2000, 2000);
INSERT INTO adm.clase_vehiculo (clase_vehiculo_id, descripcion, url_picture, max_height, max_width, max_length) VALUES ('8', 'Semitruck', 'cil-truck', 2000, 2000, 2000);


INSERT INTO adm.lectura_sensores_laser (periferico_id, id, lane, lane_id,
                                        time_iso, speed, height, width,
                                        length, refl_pos, gap, headway,
                                        occupancy, class_id, position, direction,
                                        wrong_way, stop_and, url_file_pds) 
        VALUES ('1', -1 , -1 , -1 ,'4',-1,-1,-1,-1,-1,-1,-1,-1,'0','L','I','0','0','1');

--delete from  adm.lectura_sensores_laser;
--\copy adm.lectura_sensores_laser from 'sensor.csv' csv header;

INSERT INTO adm.funcionario (funcionario_id,nombre_completo,documento_identificacion) VALUES ('01', 'Sistema', '01');
INSERT INTO adm.infracciones_adm (infracciones_adm_id,descripcion) VALUES ('01', 'Dimensionamiento');