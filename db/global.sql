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
        nombre_concesion varchar(128) not null,
        direccion varchar(128) not null,
        telefono_contacto varchar(64) not null,
        correo_e varchar(128) not null,
        url varchar(256),
        estado bool not null,
        CONSTRAINT concesion_pk PRIMARY KEY (concesion_id)
        )
          WITH (
             OIDS=FALSE
        );

CREATE TABLE adm.sede(
	sede_id varchar(64) not null,
        concesion_id varchar(64) not null,
        nombre_sede varchar(128) not null,
        estado bool not null,
        CONSTRAINT sede_pk PRIMARY KEY (sede_id)
        )
          WITH (
             OIDS=FALSE
        );

CREATE TABLE adm.sub_sistema(
	sub_sistema_id varchar(64) not null,
        sede_id varchar(64) not null,
        nombre_sub_sistema varchar(256) not null,
        estado bool not null,
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
        nombre_periferico varchar(256) not null,
        marca varchar(256) not null,
        serial varchar(256) not null,
        modelo varchar(256) not null,
        voltaje varchar(256) not null,
        numero_puertos varchar(256) not null,
        ip varchar(256) not null,
        puerto varchar(256) not null,
        ruta_ftp varchar(128),
        ruta_ftp_http varchar(128),
        tiempo_espera int,
        estado bool not null,
        CONSTRAINT periferico_pk PRIMARY KEY (periferico_id)
        )
          WITH (
             OIDS=FALSE
        );

CREATE TABLE adm.tipo_periferico(
	tipo_periferico_id varchar(64) not null,
        nombre_tipo_periferico varchar(256) not null,
        estado bool not null,
        CONSTRAINT tipo_periferico_pk PRIMARY KEY (tipo_periferico_id)
        )
          WITH (
             OIDS=FALSE
        );      

-- Tabla de configuración de hardware, van los puertos, cambiar toda la tabla, OJO va para las otras base de datos
CREATE TABLE adm.tarjeta_puertos (
    tarjeta_puertos_id varchar(64) not null, -- Por cada tarjeta PK
    puerto varchar(64) not null, -- una tarjeta tiene varios puertos PK,
    periferico_id varchar(64),
    ip varchar(64) not null, -- de la tarjeta
    nombre_tarjeta_puertos varchar(128) not null, -- por cada puerto
    tipo char(1) not null, -- Entrada / Salida
    estado bool not null, -- Activa, inactiva
    CONSTRAINT tarjeta_puertos_pk PRIMARY KEY (tarjeta_puertos_id, puerto)
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
    permiso_id varchar(64) not null,
    padre varchar(64) not null NOT NULL,
    nivel int NOT NULL,
    nombre_permiso character varying(64),
    icono character varying(64),
    url character varying(128),
    CONSTRAINT permiso_pk PRIMARY KEY (permiso_id)
);

CREATE TABLE adm.rol (
    rol_id varchar(64) not null,
    nombre_rol character varying(64),
    CONSTRAINT rol_pk PRIMARY KEY (rol_id)
);

CREATE TABLE adm.usuario_rol (
    usuario_id varchar(64) not null,
    rol_id varchar(64) not null,
    CONSTRAINT usuario_rol_pk PRIMARY KEY (usuario_id, rol_id)
);

--ALTER TABLE adm.usuario ADD CONSTRAINT FK_usuario__rol FOREIGN KEY (rol_id) REFERENCES adm.rol (rol_id);
ALTER TABLE adm.usuario_rol ADD CONSTRAINT FK_usuario_rol__usuario FOREIGN KEY (usuario_id) REFERENCES adm.usuario (usuario_id);
ALTER TABLE adm.usuario_rol ADD CONSTRAINT FK_usuario_rol__rol FOREIGN KEY (rol_id) REFERENCES adm.rol (rol_id);

CREATE TABLE adm.permiso_rol (
    permiso_id varchar(64) not null,
    rol_id varchar(64) not null,
    CONSTRAINT permiso_rol_pk PRIMARY KEY (permiso_id, rol_id)
);

ALTER TABLE adm.permiso_rol ADD CONSTRAINT FK_permiso_rol__permiso FOREIGN KEY (permiso_id) REFERENCES adm.permiso (permiso_id);
ALTER TABLE adm.permiso_rol ADD CONSTRAINT FK_permiso_rol FOREIGN KEY (rol_id) REFERENCES adm.rol (rol_id);

INSERT INTO adm.usuario (usuario_id, rol_id, frase, nombre_usuario, nombre_completo, direccion, estado)
        VALUES ('1', 00, '$2a$12$qYjkbhIHnaJSsebbHmidkuPwQxsnzXstfMm2sB0yyDJIGycO6/qEy', 'adm', 'test', 'test', '1');

INSERT INTO adm.rol(rol_id, nombre_rol) VALUES(00, 'SuperUser');
INSERT INTO adm.rol(rol_id, nombre_rol) VALUES(11, 'Administrador POS');
INSERT INTO adm.rol(rol_id, nombre_rol) VALUES(12, 'Empleado POS');
INSERT INTO adm.rol(rol_id, nombre_rol) VALUES(13, 'Invitado POS');
INSERT INTO adm.rol(rol_id, nombre_rol) VALUES(21, 'Administrador Parking');
INSERT INTO adm.rol(rol_id, nombre_rol) VALUES(22, 'Empleado Parking');
INSERT INTO adm.rol(rol_id, nombre_rol) VALUES(23, 'Invitado Parking');
INSERT INTO adm.rol(rol_id, nombre_rol) VALUES(31, 'Contador');
INSERT INTO adm.rol(rol_id, nombre_rol) VALUES(34, 'Auxiliar Contable');

INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre_permiso, icono, url) VALUES(1, -1, 0, 'Dashboard', 'cil-speedometer', '-');
INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre_permiso, icono, url) VALUES(2, -1, 0, 'Administrar', 'cil-settings', '-');
INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre_permiso, icono, url) VALUES(3, -1, 0, 'Subsistemas', 'cil-square', '-');
INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre_permiso, icono, url) VALUES(4, -1, 0, 'Estadísticas', 'cil-puzzle', '-');

INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre_permiso, icono, url) VALUES(6, 2, 1, 'Concesión', 'icono-arrow-right', '/manage/concession');
INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre_permiso, icono, url) VALUES(7, 2, 1, 'Sede', 'icono-rocket ', '/manage/campus');
INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre_permiso, icono, url) VALUES(8, 2, 1, 'Subsistema', 'icono-book-open', '/manage/subsystem');
INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre_permiso, icono, url) VALUES(9, 2, 1, 'Usuarios', 'icono-settings', '/manage/users');

INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre_permiso, icono, url) VALUES(11, 3, 1, 'Dimensionamiento', 'cil-puzzle', '/subsystems/sizing');
INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre_permiso, icono, url) VALUES(12, 3, 1, 'Evasión', 'cil-bell-exclamation', '/manage');
INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre_permiso, icono, url) VALUES(13, 3, 1, 'Fuga', 'cil-warning', '/manage');
INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre_permiso, icono, url) VALUES(14, 3, 1, 'Estática', 'cil-square', '/manage');

INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre_permiso, icono, url) VALUES(16, 4, 1, 'Vista global', 'cil-settings', '/manage');
INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre_permiso, icono, url) VALUES(17, 4, 1, 'Estática', 'cil-settings', '/manage');
INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre_permiso, icono, url) VALUES(18, 4, 1, 'Dinámica', 'cil-settings', '/manage');
INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre_permiso, icono, url) VALUES(19, 4, 1, 'Infractores', 'cil-settings', '/manage');
INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre_permiso, icono, url) VALUES(20, 4, 1, 'Periféricos', 'cil-settings', '/manage');
INSERT INTO adm.permiso (permiso_id, padre, nivel, nombre_permiso, icono, url) VALUES(21, 4, 1, 'Soporte', 'cil-settings', '/manage');

INSERT INTO adm.permiso_rol (permiso_id, rol_id) VALUES(1, 00);
INSERT INTO adm.permiso_rol (permiso_id, rol_id) VALUES(2, 00);
INSERT INTO adm.permiso_rol (permiso_id, rol_id) VALUES(3, 00);
INSERT INTO adm.permiso_rol (permiso_id, rol_id) VALUES(4, 00);

INSERT INTO adm.usuario_rol (usuario_id, rol_id) VALUES(1, 0);

INSERT INTO adm.concesion(concesion_id,nombre_concesion,direccion,telefono_contacto,correo_e,url,estado) VALUES ('1','Corredores Viales','cra 1 # 1 - 1','54656546456','concesion@prueba.com','concesion.prueba.com',true);

INSERT INTO adm.sede(sede_id,concesion_id,nombre_sede,estado) VALUES ('1','1','Sede A',true);
INSERT INTO adm.sede(sede_id,concesion_id,nombre_sede,estado) VALUES ('2','1','Sede B',true);
INSERT INTO adm.sede(sede_id,concesion_id,nombre_sede,estado) VALUES ('3','1','Sede C',true);

INSERT INTO adm.sub_sistema(sub_sistema_id,sede_id,nombre_sub_sistema,estado) VALUES ('1','1','Evasión',true);
INSERT INTO adm.sub_sistema(sub_sistema_id,sede_id,nombre_sub_sistema,estado) VALUES ('2','1','Dimensionamiento',true);
INSERT INTO adm.sub_sistema(sub_sistema_id,sede_id,nombre_sub_sistema,estado) VALUES ('3','1','Fuga',true);

INSERT INTO adm.tipo_periferico (tipo_periferico_id, nombre_tipo_periferico, estado) VALUES('0', 'CPU', true);
INSERT INTO adm.tipo_periferico (tipo_periferico_id, nombre_tipo_periferico, estado) VALUES('1', 'Camara LPR', true);
INSERT INTO adm.tipo_periferico (tipo_periferico_id, nombre_tipo_periferico, estado) VALUES('2', 'Laser principal', true);
INSERT INTO adm.tipo_periferico (tipo_periferico_id, nombre_tipo_periferico, estado) VALUES('3', 'Laser secundario', true);
INSERT INTO adm.tipo_periferico (tipo_periferico_id, nombre_tipo_periferico, estado) VALUES('4', 'CCTV', true);
INSERT INTO adm.tipo_periferico (tipo_periferico_id, nombre_tipo_periferico, estado) VALUES('5', 'Placa', true);
INSERT INTO adm.tipo_periferico (tipo_periferico_id, nombre_tipo_periferico, estado) VALUES('6', 'Panel', true);

INSERT INTO adm.periferico (periferico_id, sub_sistema_id, tipo_periferico_id, nombre_periferico, marca, serial, modelo, voltaje, numero_puertos, ip, puerto, ruta_ftp, ruta_ftp_http, tiempo_espera, estado)
 VALUES ('1','1','4','Placa supervisora perfilador','Electro Tax','654654','5fs5','12','2424','127.0.0.1','2424242', '/home/ftppromet/lpr_15011', 'ftp://172.19.150.9//lpr_15011', 0, true);

INSERT INTO adm.periferico (periferico_id, sub_sistema_id, tipo_periferico_id, nombre_periferico, marca, serial, modelo, voltaje, numero_puertos, ip, puerto, ruta_ftp, ruta_ftp_http, tiempo_espera, estado)
 VALUES ('2','1','2','Laser Principal','Comark','654654','5fs5','12','2424','172.19.150.5','12876', '/home/ftppromet/lpr_15011', 'ftp://172.19.150.9//lpr_15011', 0, true);

INSERT INTO adm.periferico (periferico_id, sub_sistema_id, tipo_periferico_id, nombre_periferico, marca, serial, modelo, voltaje, numero_puertos, ip, puerto, ruta_ftp, ruta_ftp_http, tiempo_espera, estado)
 VALUES ('3','1','3','Laser Secundario','Comark','654654','5fs5','12','2424','172.19.150.6','2424242', '/home/ftppromet/lpr_15011', 'ftp://172.19.150.9//lpr_15011', 0, true);

INSERT INTO adm.periferico (periferico_id, sub_sistema_id, tipo_periferico_id, nombre_periferico, marca, serial, modelo, voltaje, numero_puertos, ip, puerto, ruta_ftp, ruta_ftp_http, tiempo_espera, estado)
 VALUES ('4','1','3','Laser Frontal','Comark','654654','5fs5','12','2424','172.19.150.7','2424242', '/home/ftppromet/lpr_15011', 'ftp://172.19.150.9//lpr_15011', 0, true);

INSERT INTO adm.periferico (periferico_id, sub_sistema_id, tipo_periferico_id, nombre_periferico, marca, serial, modelo, voltaje, numero_puertos, ip, puerto, ruta_ftp, ruta_ftp_http, tiempo_espera, estado)
 VALUES ('5','1','4','CCTV Perfilador','Comark','654654','5fs5','12','2424','172.19.150.8','2424242', '/home/ftppromet/lpr_15011', 'ftp://172.19.150.9//lpr_15011', 0, true);

INSERT INTO adm.periferico (periferico_id, sub_sistema_id, tipo_periferico_id, nombre_periferico, marca, serial, modelo, voltaje, numero_puertos, ip, puerto, ruta_ftp, ruta_ftp_http, tiempo_espera, estado)
 VALUES ('6','1','0','CPU','Comark','654654','5fs5','12','2424','172.19.150.9','2424242', '/home/ftppromet/lpr_15011', 'ftp://172.19.150.9//lpr_15011', 0, true);

INSERT INTO adm.periferico (periferico_id, sub_sistema_id, tipo_periferico_id, nombre_periferico, marca, serial, modelo, voltaje, numero_puertos, ip, puerto, ruta_ftp, ruta_ftp_http, tiempo_espera, estado)
 VALUES ('7','2','1','LPR Dimensionamiento','Pumatronic','654654','5fs5','12','2424','172.19.150.9','21', '/home/ftppromet/lpr_15011', 'ftp://172.19.150.9//lpr_15011', 1800, true);

INSERT INTO adm.periferico (periferico_id, sub_sistema_id, tipo_periferico_id, nombre_periferico, marca, serial, modelo, voltaje, numero_puertos, ip, puerto, ruta_ftp, ruta_ftp_http, tiempo_espera, estado)
 VALUES ('8','1','5','Placa supervisora FUGA','Comark','654654','5fs5','12','2424','172.19.150.20','2424242', '/home/ftppromet/lpr_15011', 'ftp://172.19.150.9//lpr_15011', 0, true);

INSERT INTO adm.periferico (periferico_id, sub_sistema_id, tipo_periferico_id, nombre_periferico, marca, serial, modelo, voltaje, numero_puertos, ip, puerto, ruta_ftp, ruta_ftp_http, tiempo_espera, estado)
 VALUES ('9','1','6','LPR FUGA','Comark','654654','5fs5','12','2424','172.19.150.21','2424242', '/home/ftppromet/lpr_15011', 'ftp://172.19.150.9//lpr_15011', 0, true);

INSERT INTO adm.periferico (periferico_id, sub_sistema_id, tipo_periferico_id, nombre_periferico, marca, serial, modelo, voltaje, numero_puertos, ip, puerto, ruta_ftp, ruta_ftp_http, tiempo_espera, estado)
 VALUES ('10','1','6','PAN FUGA','Comark','654654','5fs5','12','2424','172.19.150.22','2424242', '/home/ftppromet/lpr_15011', 'ftp://172.19.150.9//lpr_15011', 0, true);

INSERT INTO adm.periferico (periferico_id, sub_sistema_id, tipo_periferico_id, nombre_periferico, marca, serial, modelo, voltaje, numero_puertos, ip, puerto, ruta_ftp, ruta_ftp_http, tiempo_espera, estado)
 VALUES ('11','1','4','CCTV FUGA','Comark','654654','5fs5','12','2424','172.19.150.23','2424242', '/home/ftppromet/lpr_15011', 'ftp://172.19.150.9//lpr_15011', 0, true);

INSERT INTO adm.tarjeta_puertos(tarjeta_puertos_id,puerto,periferico_id,ip,nombre_tarjeta_puertos, tipo, estado) VALUES (1,'561','1','127.0.0.1','pureba', 'E', true);

