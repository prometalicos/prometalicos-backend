DROP DATABASE evasion;

CREATE DATABASE evasion
  WITH OWNER = postgres
       ENCODING = 'UTF8'
       TABLESPACE = pg_default
       CONNECTION LIMIT = 6;

\c evasion

CREATE SCHEMA adm;
CREATE SCHEMA lecturas;
CREATE SCHEMA fugas;
CREATE SCHEMA evasion;
CREATE SCHEMA log;

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

-- Se llenará de información con base a la comparación de parámetros al momento de hacer la lectura
CREATE TABLE adm.posibles_infracciones(
	posibles_infracciones_id serial not null, -- Llave autonumérica
        evento_transito_id int not null, -- Contiene el dato de la cámara y el sensor
        funcionario_id varchar(16) not null, -- Funcionario responsable
        infracciones_adm_id varchar(64) not null, -- Código de la infracción
        fecha_hora time not null,
        fecha_novedad time, -- ?
        nota text,
        estado bit not null,
        CONSTRAINT posibles_infracciones_pk PRIMARY KEY (posibles_infracciones_id)
        )
          WITH (
             OIDS=FALSE
        );

CREATE TABLE adm.evento_transito(
	evento_transito_id serial, -- Llave autonumérica
	fecha_hora time not null,
        lectura_camara_lpr_id bigint not null,
        clase_vehiculo_id varchar(64) not null,
        CONSTRAINT evento_transito_pk PRIMARY KEY (evento_transito_id)
        )
          WITH (
             OIDS=FALSE
        );

-- Gestión Administrativa
CREATE TABLE adm.infracciones_adm(
	infracciones_adm_id varchar(64) not null,
        descripcion varchar(256) not null,
        CONSTRAINT infracciones_adm_pk PRIMARY KEY (infracciones_adm_id)
        )
          WITH (
             OIDS=FALSE
        );

-- Registro de funcionarios
CREATE TABLE adm.funcionario(
	funcionario_id varchar(64) not null,
        nombre_completo varchar(256) not null,
        documento_identificacion varchar(256) not null,
        CONSTRAINT funcionario_pk PRIMARY KEY (funcionario_id)
        )
          WITH (
             OIDS=FALSE
        );
-- Administrativa para clases de vehiculos según normas
CREATE TABLE adm.clase_vehiculo(
	clase_vehiculo_id varchar(64) not null,
        descripcion varchar(256) not null,
        url_picture varchar(256) not null,
        CONSTRAINT clase_vehiculo_pk PRIMARY KEY (clase_vehiculo_id)
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

ALTER TABLE adm.posibles_infracciones ADD CONSTRAINT FK_infracciones__evento_transito FOREIGN KEY (evento_transito_id) REFERENCES adm.evento_transito (evento_transito_id);
ALTER TABLE adm.posibles_infracciones ADD CONSTRAINT FK_infracciones__infracciones_adm FOREIGN KEY (infracciones_adm_id) REFERENCES adm.infracciones_adm (infracciones_adm_id);
ALTER TABLE adm.posibles_infracciones ADD CONSTRAINT FK_infracciones__funcionario FOREIGN KEY (funcionario_id) REFERENCES adm.funcionario (funcionario_id);

-- ALTER TABLE adm.periferico ADD CONSTRAINT FK_periferico__tipo_periferico FOREIGN KEY (tipo_periferico_id) REFERENCES adm.tipo_periferico (tipo_periferico_id);

ALTER TABLE adm.evento_transito ADD CONSTRAINT FK_evento_transito__lectura_camara_lpr FOREIGN KEY (lectura_camara_lpr_id) REFERENCES adm.lectura_camara_lpr (lectura_camara_lpr_id);
ALTER TABLE adm.evento_transito ADD CONSTRAINT FK_evento_transito__clase_vehiculo FOREIGN KEY (clase_vehiculo_id) REFERENCES adm.clase_vehiculo (clase_vehiculo_id);

ALTER TABLE adm.registro_evasion ADD CONSTRAINT FK_registro_evasion__evento_transito FOREIGN KEY (evento_transito_id) REFERENCES adm.evento_transito (evento_transito_id);
