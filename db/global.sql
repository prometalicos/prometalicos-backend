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
        nombre_completo varchar(256) not null,
        direccion varchar(256) not null,
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
        VALUES ('1', 00, '123', 'Test 1', 'test', '1');

INSERT INTO adm.rol(rol_id, name) VALUES(00, 'SuperUser');
INSERT INTO adm.rol(rol_id, name) VALUES(11, 'Administrador POS');
INSERT INTO adm.rol(rol_id, name) VALUES(12, 'Empleado POS');
INSERT INTO adm.rol(rol_id, name) VALUES(13, 'Invitado POS');
INSERT INTO adm.rol(rol_id, name) VALUES(21, 'Administrador Parking');
INSERT INTO adm.rol(rol_id, name) VALUES(22, 'Empleado Parking');
INSERT INTO adm.rol(rol_id, name) VALUES(23, 'Invitado Parking');
INSERT INTO adm.rol(rol_id, name) VALUES(31, 'Contador');
INSERT INTO adm.rol(rol_id, name) VALUES(34, 'Auxiliar Contable');

INSERT INTO adm.permiso (permiso_id, father, level, name, icon, url) VALUES(1, -1, 0, 'Principal', 'icon-basket-loaded', '-');
INSERT INTO adm.permiso (permiso_id, father, level, name, icon, url) VALUES(2, -1, 0, 'Administracion', 'icon-settings', '-');
INSERT INTO adm.permiso (permiso_id, father, level, name, icon, url) VALUES(3, -1, 0, 'Parqueadero', 'icon-flag', '-');
INSERT INTO adm.permiso (permiso_id, father, level, name, icon, url) VALUES(4, -1, 0, 'Contabilidad', 'icon-loop', '-');

INSERT INTO adm.permiso (permiso_id, father, level, name, icon, url) VALUES(11, 1, 1, 'Ventas', 'icon-basket', '/sales');
INSERT INTO adm.permiso (permiso_id, father, level, name, icon, url) VALUES(12, 1, 1, 'Pagos de clientes', 'icon-user-follow', '/customer/customer-payments');
INSERT INTO adm.permiso (permiso_id, father, level, name, icon, url) VALUES(13, 1, 1, 'Movimientos de caja', 'icon-handbag', '/close-cash/cash-movement');
INSERT INTO adm.permiso (permiso_id, father, level, name, icon, url) VALUES(14, 1, 1, 'Cierre de caja', 'icon-calculator', '/close-cash');
INSERT INTO adm.permiso (permiso_id, father, level, name, icon, url) VALUES(15, 1, 1, 'Facturas', 'icon-book-open', '/close-cash/receipts');
INSERT INTO adm.permiso (permiso_id, father, level, name, icon, url) VALUES(16, 1, 1, 'Ordenes', 'icon-basket', '/orders');
INSERT INTO adm.permiso (permiso_id, father, level, name, icon, url) VALUES(17, 1, 1, 'Ordenes Listas', 'icon-basket', '/orders/list-ready');

INSERT INTO adm.permiso (permiso_id, father, level, name, icon, url) VALUES(21, 2, 1, 'Proveedores', 'icon-user', '/supplier');
INSERT INTO adm.permiso (permiso_id, father, level, name, icon, url) VALUES(22, 2, 1, 'Clientes', 'icon-user', '/customer');
INSERT INTO adm.permiso (permiso_id, father, level, name, icon, url) VALUES(23, 2, 1, 'Inventario', 'icon-home', '/stock');
INSERT INTO adm.permiso (permiso_id, father, level, name, icon, url) VALUES(24, 2, 1, 'Reportes de Ventas', 'icon-basket', '/sales/menu');
INSERT INTO adm.permiso (permiso_id, father, level, name, icon, url) VALUES(25, 2, 1, 'Mantenimiento', 'icon-wrench', '/maintenance');
INSERT INTO adm.permiso (permiso_id, father, level, name, icon, url) VALUES(26, 2, 1, 'Configuración', 'icon-settings', '/configuration');

INSERT INTO adm.permiso (permiso_id, father, level, name, icon, url) VALUES(31, 3, 1, 'Ingreso', 'icon-arrow-right', '/parking/places/p');
INSERT INTO adm.permiso (permiso_id, father, level, name, icon, url) VALUES(32, 3, 1, 'Vehiculos', 'icon-rocket ', '/parking/vehicle-panel');
INSERT INTO adm.permiso (permiso_id, father, level, name, icon, url) VALUES(33, 3, 1, 'Reportes', 'icon-book-open', '/parking/rep');
INSERT INTO adm.permiso (permiso_id, father, level, name, icon, url) VALUES(34, 3, 1, 'Configuración', 'icon-settings', '/parking/configuration');

INSERT INTO adm.permiso_rol (permiso_id, rol_id) VALUES(1, 00);
INSERT INTO adm.permiso_rol (permiso_id, rol_id) VALUES(2, 00);
INSERT INTO adm.permiso_rol (permiso_id, rol_id) VALUES(3, 00);
INSERT INTO adm.permiso_rol (permiso_id, rol_id) VALUES(4, 00);

INSERT INTO adm.usuario_rol (usuario_id, rol_id) VALUES(1, 0);