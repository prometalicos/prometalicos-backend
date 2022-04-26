DROP DATABASE global;

CREATE DATABASE global
  WITH OWNER = postgres
       ENCODING = 'UTF8'
       TABLESPACE = pg_default
       CONNECTION LIMIT = 6;

\c global

CREATE SCHEMA adm;
CREATE SCHEMA log;

CREATE TABLE adm.concesion(
	concesion_id varchar(64) not null,
        id varchar(256) not null,
        nombre varchar(256) not null,
        direccion varchar(256) not null,
        telefono_contacto varchar(64) not null,
        correo_e varchar(128) not null,
        url varchar(256) not null,
        estado bit not null,
        CONSTRAINT concesion_pk PRIMARY KEY (concesion_id)
        )
          WITH (
             OIDS=FALSE
        );

CREATE TABLE adm.sede(
	sede_id varchar(64) not null,
        concesion_id varchar(64) not null,
        descripcion varchar(256) not null,
        estado bit not null,
        CONSTRAINT sede_pk PRIMARY KEY (sede_id)
        )
          WITH (
             OIDS=FALSE
        );

CREATE TABLE adm.sub_sistema(
	sub_sistema_id varchar(64) not null,
        sede_id varchar(64) not null,
        descripcion varchar(256) not null,
        estado bit not null,
        CONSTRAINT sub_sistema_pk PRIMARY KEY (sub_sistema_id)
        )
          WITH (
             OIDS=FALSE
        );

CREATE TABLE adm.usuario_sub_sistema(
        usuario_id varchar(64) not null,
	sub_sistema_id varchar(64) not null,
        estado bit not null,
        CONSTRAINT usuario_sub_sistema_pk PRIMARY KEY (usuario_id, sub_sistema_id)
        )
          WITH (
             OIDS=FALSE
        );

CREATE TABLE adm.usuario(
	usuario_id varchar(64) not null,
        tipo_usuario_id varchar(32) not null,
        nombre_completo varchar(256) not null,
        direccion varchar(256) not null,
        estado bit not null,
        CONSTRAINT usuario_pk PRIMARY KEY (usuario_id)
        )
          WITH (
             OIDS=FALSE
        );

CREATE TABLE adm.tipo_usuario(
	tipo_usuario_id varchar(32) not null,
        descripcion varchar(256) not null,
        CONSTRAINT tipo_usuario_pk PRIMARY KEY (tipo_usuario_id)
        )
          WITH (
             OIDS=FALSE
        );

CREATE TABLE adm.usuario_menu(
	usuario_id varchar(64) not null,
        opciones_menu_id int not null, -- Solo se debe permitir asignar opciones_menu sin padre
        restricciones varchar(2), -- Primero se indica R (Only read) y W (Only Write) y - vacio, ejemplo: -W
        CONSTRAINT usuario_menu_pk PRIMARY KEY (usuario_id, opciones_menu_id)
        )
          WITH (
             OIDS=FALSE
        );

CREATE TABLE adm.opciones_menu(
	opciones_menu_id int not null,
        opciones_menu_id_padre int not null,
        descripcion varchar(64) not null,
        url varchar(256) not null,
        CONSTRAINT opciones_menu_pk PRIMARY KEY (opciones_menu_id)
        )
          WITH (
             OIDS=FALSE
        );

CREATE TABLE adm.log(
	log_id bigint GENERATED ALWAYS AS IDENTITY not null, -- Llave autonumérica
        fecha_novedad timestamp not null,
        text text not null, -- Funcionario responsable
        CONSTRAINT log_pk PRIMARY KEY (log_id)
        )
          WITH (
             OIDS=FALSE
        );

-- Deberia ir en global ()
CREATE TABLE adm.periferico(
	periferico_id varchar(64) not null,
        sub_sistema_id varchar(64) not null,
        tipo_periferico_id varchar(64) not null,
        descripcion varchar(256) not null,
        marca varchar(256) not null,
        serial varchar(256) not null,
        modelo varchar(256) not null,
        voltaje varchar(256) not null,
        numero_puertos varchar(256) not null,
        ip varchar(256) not null,
        documento_identificacion varchar(256) not null,
        CONSTRAINT periferico_pk PRIMARY KEY (periferico_id)
        )
          WITH (
             OIDS=FALSE
        );

CREATE TABLE adm.tipo_periferico(
	tipo_periferico_id varchar(64) not null,
        descripcion varchar(256) not null,
        estado bit not null,
        CONSTRAINT tipo_periferico_pk PRIMARY KEY (tipo_periferico_id)
        )
          WITH (
             OIDS=FALSE
        );      

-- Tabla de configuración de hardware, van los puertos, cambiar toda la tabla, OJO va para las otras base de datos
CREATE TABLE adm.tarjeta_puertos (
    tarjeta_id int not null, -- Por cada tarjeta PK
    puerto varchar(64), -- una tarjeta tiene varios puertos PK,
    periferico_id varchar(64) not null,
    ip varchar(64), -- de la tarjeta
    descripcion_puerto varchar(128), -- por cada puerto
    estado bit not null, -- Activa, inactiva
    tipo bit not null, -- Entrada / Salida
    CONSTRAINT tarjeta_puertos_pk PRIMARY KEY (tarjeta_id, puerto)
);

-- Es un log, que hizo un usuario en el sistema, va en global
CREATE TABLE adm.eventos_usuario (
    eventos_usuario_id serial NOT NULL,
    usuario_id character varying(30),
    tipo integer,
    detalle character varying(100),
    hora_fecha character varying
);

CREATE OR REPLACE FUNCTION log_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO adm.log (fecha_novedad, text, text) VALUES(current_timestamp, 'Se insertó un usuario en el sistema');
END; $$ LANGUAGE 'plpgsql';

CREATE TRIGGER user_log AFTER INSERT ON adm.log FOR EACH ROW EXECUTE PROCEDURE log_user();

ALTER TABLE adm.usuario ADD CONSTRAINT FK_usuario__tipo_usuario FOREIGN KEY (tipo_usuario_id) REFERENCES adm.tipo_usuario (tipo_usuario_id);
ALTER TABLE adm.usuario_menu ADD CONSTRAINT FK_usuario_menu__usuario FOREIGN KEY (usuario_id) REFERENCES adm.usuario (usuario_id);
ALTER TABLE adm.usuario_menu ADD CONSTRAINT FK_usuario_menu__opciones_menu FOREIGN KEY (opciones_menu_id) REFERENCES adm.opciones_menu (opciones_menu_id);

ALTER TABLE adm.sede ADD CONSTRAINT FK_sede__concesion FOREIGN KEY (concesion_id) REFERENCES adm.concesion (concesion_id);
ALTER TABLE adm.sub_sistema ADD CONSTRAINT FK_sede__sub_sistema FOREIGN KEY (sede_id) REFERENCES adm.sede (sede_id);
ALTER TABLE adm.usuario_sub_sistema ADD CONSTRAINT FK_usuario_sub_sistema__usuario FOREIGN KEY (usuario_id) REFERENCES adm.usuario (usuario_id);
ALTER TABLE adm.usuario_sub_sistema ADD CONSTRAINT FK_usuario_sub_sistema__sub_sistema FOREIGN KEY (sub_sistema_id) REFERENCES adm.sub_sistema (sub_sistema_id);

ALTER TABLE adm.tarjeta_puertos ADD CONSTRAINT FK_tarjeta_puertos__periferico FOREIGN KEY (periferico_id) REFERENCES adm.periferico (periferico_id);

ALTER TABLE adm.periferico ADD CONSTRAINT FK_periferico__tipo_periferico FOREIGN KEY (tipo_periferico_id) REFERENCES adm.tipo_periferico (tipo_periferico_id);

ALTER TABLE adm.eventos_usuario ADD CONSTRAINT FK_eventos_usuario__usuario FOREIGN KEY (usuario_id) REFERENCES adm.usuario (usuario_id);


