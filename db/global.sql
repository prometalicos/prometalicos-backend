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
        rol_id int not null,
        frase varchar (128) not null,
        nombre_usuario varchar(32) not null,
        nombre_completo varchar(128) not null,
        direccion varchar(128) not null,
        estado bit not null,
        CONSTRAINT usuario_pk PRIMARY KEY (usuario_id)
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
        ruta_ftp varchar(128) not null,
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

ALTER TABLE adm.sede ADD CONSTRAINT FK_sede__concesion FOREIGN KEY (concesion_id) REFERENCES adm.concesion (concesion_id);
ALTER TABLE adm.sub_sistema ADD CONSTRAINT FK_sede__sub_sistema FOREIGN KEY (sede_id) REFERENCES adm.sede (sede_id);
ALTER TABLE adm.usuario_sub_sistema ADD CONSTRAINT FK_usuario_sub_sistema__usuario FOREIGN KEY (usuario_id) REFERENCES adm.usuario (usuario_id);
ALTER TABLE adm.usuario_sub_sistema ADD CONSTRAINT FK_usuario_sub_sistema__sub_sistema FOREIGN KEY (sub_sistema_id) REFERENCES adm.sub_sistema (sub_sistema_id);

ALTER TABLE adm.tarjeta_puertos ADD CONSTRAINT FK_tarjeta_puertos__periferico FOREIGN KEY (periferico_id) REFERENCES adm.periferico (periferico_id);

ALTER TABLE adm.periferico ADD CONSTRAINT FK_periferico__tipo_periferico FOREIGN KEY (tipo_periferico_id) REFERENCES adm.tipo_periferico (tipo_periferico_id);
ALTER TABLE adm.periferico ADD CONSTRAINT FK_periferico__sub_sistema FOREIGN KEY (sub_sistema_id) REFERENCES adm.sub_sistema (sub_sistema_id);

ALTER TABLE adm.eventos_usuario ADD CONSTRAINT FK_eventos_usuario__usuario FOREIGN KEY (usuario_id) REFERENCES adm.usuario (usuario_id);

CREATE TABLE adm.permiso (
    permiso_id int NOT NULL,
    padre int NOT NULL,
    nivel int NOT NULL,
    nombre character varying(64),
    icono character varying(64),
    url character varying(128),
    CONSTRAINT permiso_pk PRIMARY KEY (permiso_id)
);

CREATE TABLE adm.rol (
    rol_id int NOT NULL,
    nombre character varying(64),
    CONSTRAINT rol_pk PRIMARY KEY (rol_id)
);

CREATE TABLE adm.usuario_rol (
    usuario_id varchar(64) not null,
    rol_id int NOT NULL,
    CONSTRAINT usuario_rol_pk PRIMARY KEY (usuario_id, rol_id)
);

--ALTER TABLE adm.usuario ADD CONSTRAINT FK_usuario__rol FOREIGN KEY (rol_id) REFERENCES adm.rol (rol_id);
ALTER TABLE adm.usuario_rol ADD CONSTRAINT FK_usuario_rol__usuario FOREIGN KEY (usuario_id) REFERENCES adm.usuario (usuario_id);
ALTER TABLE adm.usuario_rol ADD CONSTRAINT FK_usuario_rol__rol FOREIGN KEY (rol_id) REFERENCES adm.rol (rol_id);

CREATE TABLE adm.permiso_rol (
    permiso_id int NOT NULL,
    rol_id int NOT NULL,
    CONSTRAINT permiso_rol_pk PRIMARY KEY (permiso_id, rol_id)
);

ALTER TABLE adm.permiso_rol ADD CONSTRAINT FK_permiso_rol__permiso FOREIGN KEY (permiso_id) REFERENCES adm.permiso (permiso_id);
ALTER TABLE adm.permiso_rol ADD CONSTRAINT FK_permiso_rol FOREIGN KEY (rol_id) REFERENCES adm.rol (rol_id);

INSERT INTO adm.usuario (usuario_id, rol_id, frase, nombre_completo, direccion, estado)
        VALUES ('1', 00, '123', 'test', 'test', '1');

INSERT INTO adm.rol(rol_id, nombre) VALUES(00, 'SuperUser');
INSERT INTO adm.rol(rol_id, nombre) VALUES(11, 'Administrador POS');
INSERT INTO adm.rol(rol_id, nombre) VALUES(12, 'Empleado POS');
INSERT INTO adm.rol(rol_id, nombre) VALUES(13, 'Invitado POS');
INSERT INTO adm.rol(rol_id, nombre) VALUES(21, 'Administrador Parking');
INSERT INTO adm.rol(rol_id, nombre) VALUES(22, 'Empleado Parking');
INSERT INTO adm.rol(rol_id, nombre) VALUES(23, 'Invitado Parking');
INSERT INTO adm.rol(rol_id, nombre) VALUES(31, 'Contador');
INSERT INTO adm.rol(rol_id, nombre) VALUES(34, 'Auxiliar Contable');

INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre, icono, url) VALUES(1, -1, 0, 'Dashboard', 'cil-speedometer', '-');
INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre, icono, url) VALUES(2, -1, 0, 'Principal', 'icono-settings', '-');
INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre, icono, url) VALUES(3, -1, 0, 'Reportes', 'icono-flag', '-');
INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre, icono, url) VALUES(4, -1, 0, 'Contabilidad', 'icono-loop', '-');

INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre, icono, url) VALUES(5, 2, 1, 'Administrar', 'cil-settings', '/manage');

INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre, icono, url) VALUES(6, 5, 2, 'Concesión', 'icono-arrow-right', '/manage/concession');
INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre, icono, url) VALUES(7, 5, 2, 'Sede', 'icono-rocket ', '/manage/campus');
INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre, icono, url) VALUES(8, 5, 2, 'Subsistema', 'icono-book-open', '/manage/subsystem');
INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre, icono, url) VALUES(9, 5, 2, 'Usuarios', 'icono-settings', '/manage/users');

INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre, icono, url) VALUES(10, 2, 1, 'Subsistemas', 'cil-settings', '/manage');

INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre, icono, url) VALUES(11, 10, 2, 'Dimensionamiento', 'cil-settings', '/manage');
INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre, icono, url) VALUES(12, 10, 2, 'Evasión', 'cil-settings', '/manage');
INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre, icono, url) VALUES(13, 10, 2, 'Fuga', 'cil-settings', '/manage');
INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre, icono, url) VALUES(14, 10, 2, 'Estática', 'cil-settings', '/manage');

INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre, icono, url) VALUES(15, 3, 1, 'Estadísticas', 'cil-settings', '/manage');

INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre, icono, url) VALUES(16, 15, 2, 'Vista global', 'cil-settings', '/manage');
INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre, icono, url) VALUES(17, 15, 2, 'Estática', 'cil-settings', '/manage');
INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre, icono, url) VALUES(18, 15, 2, 'Dinámica', 'cil-settings', '/manage');
INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre, icono, url) VALUES(19, 15, 2, 'Infractores', 'cil-settings', '/manage');
INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre, icono, url) VALUES(20, 15, 2, 'Periféricos', 'cil-settings', '/manage');
INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre, icono, url) VALUES(21, 15, 2, 'Soporte', 'cil-settings', '/manage');


INSERT INTO adm.permiso_rol (permiso_id, rol_id) VALUES(1, 00);
INSERT INTO adm.permiso_rol (permiso_id, rol_id) VALUES(2, 00);
INSERT INTO adm.permiso_rol (permiso_id, rol_id) VALUES(3, 00);
INSERT INTO adm.permiso_rol (permiso_id, rol_id) VALUES(4, 00);

INSERT INTO adm.usuario_rol (usuario_id, rol_id) VALUES(1, 0);

INSERT INTO adm.concesion(concesion_id,id,nombre,direccion,telefono_contacto,correo_e,url,estado) VALUES ('1','1','Prueba','cra 1 # 1 - 1','54656546456','concesion@prueba.com','concesion.prueba.com',CAST(1 AS bit));
INSERT INTO adm.sede(sede_id,concesion_id,descripcion,estado) VALUES ('1','1','prueba',CAST(1 AS bit));
INSERT INTO adm.sub_sistema(sub_sistema_id,sede_id,descripcion,estado) VALUES ('1','1','dimensionamiento',CAST(1 AS bit));
INSERT INTO adm.tipo_periferico(tipo_periferico_id,descripcion,estado) VALUES ('1','Camara LPR',CAST(1 AS bit));
INSERT INTO adm.periferico(periferico_id,sub_sistema_id,tipo_periferico_id,descripcion,marca,serial,modelo,
voltaje,numero_puertos,ip,documento_identificacion,ruta_ftp) VALUES ('1','1','1','Cam1','PUMATRONIX','654654','5fs5','12','2424','127.0.0.1','2424242','/home/ceul/Descargas/ftp');

INSERT INTO adm.tarjeta_puertos(tarjeta_id,puerto,periferico_id,ip,descripcion_puerto, estado,tipo) VALUES (1,'561','1','127.0.0.1','pureba',CAST(1 AS bit),CAST(1 AS bit));
