DROP DATABASE dinamica;

CREATE DATABASE dinamica
  WITH OWNER = postgres
       ENCODING = 'UTF8'
       TABLESPACE = pg_default
       CONNECTION LIMIT = 6;

\c dinamica
	
CREATE SCHEMA adm;
CREATE SCHEMA log;

-- Es una tabla de novedades por eventos, por ejemplo, al quedarse un vehículo mas de un minutos se genera una alarma, también al abrir la puerta de gabinete. es un auditor generar por hardware
-- Por periférico tarjeta
CREATE TABLE adm.novedades_alarmas (
    novedades_alarmas_id serial not null,
    descripcion varchar(128) not null,
    fecha_hora time not null,
    CONSTRAINT novedades_alarmas_pk PRIMARY KEY (novedades_alarmas_id)
);

-- La info a fugados (registro pesaje), bufurcación, se indica en el semáforo cruz-fecha para donde va
-- Controla la cola de los vehículos, estión de colas de vehículo, en front debe saber que vehículos están en cola
-- Se debe evaluar toda la tabla, es tempotal, debe ir en LocalStorage
CREATE TABLE adm.bif_colasemaforo (
    bif_colasemaforo_id serial PRIMARY KEY NOT NULL,
    categoria_id character varying(10),
    placa character varying(10),
    sobrepeso character varying(100),
    registro_id integer not null,
    bascula_id character varying(100),
    usuario character varying(50),
    hora_fecha character varying(50),
    fugado boolean
);

CREATE TABLE adm.lectura_camara_plr(
        lectura_camara_lpr_id serial not null, -- Llave autonumérica
	    periferico_id varchar(64) not null, -- El sensor que reporta el dato
        fecha_hora time not null,
        placa_identificada varchar(12) not null,
        estadistica varchar (256),
        url_matricula varchar(256) not null,
        url_foto_ampliada varchar(256) not null,
        CONSTRAINT lectura_camara_plr_pk PRIMARY KEY (lectura_camara_lpr_id)
        )
          WITH (
             OIDS=FALSE
        );

-- Categoría del vehículo, es administativa
CREATE TABLE adm.categoria (
    categoria_id character varying(10) PRIMARY KEY NOT NULL,
    numero_ejes integer,
    grupo_ejes integer,
    peso double precision,
    toleranciapeso double precision,
    ubicacionimagen character varying(200),
    categoria_especial double precision
);

-- Administrativa, es los grupos de los ejes 
CREATE TABLE adm.categoriagrupo (
    categoria_id character varying(10) NOT NULL,
    tipoeje_id integer NOT NULL,
    grupo_eje integer,
    peso_grupo_eje double precision NOT NULL,
    distanciamin double precision NOT NULL,
    distanciamax double precision NOT NULL,
    categoriagrupo_id serial PRIMARY KEY NOT NULL,
    elementos_grupo integer
);

-- Verificar (Controla la congestión)
CREATE TABLE adm.colasemaforo (
    colasemaforo_id serial NOT NULL,
    registro_id integer not null,
    categoria_id character varying(10),
    sobrepeso character varying(5)
);

-- Con lecturas
CREATE TABLE adm.datoejes (
    datoejes_id serial PRIMARY KEY NOT NULL,
    numero_eje integer,
    peso_eje double precision,
    velocidad_eje integer,
    distancia_eje double precision
);

-- La misma de arriba discriminada por eje
CREATE TABLE adm.datosregistro (
    datosregistro_id serial PRIMARY KEY NOT NULL,
    numero_eje integer,
    peso_eje integer,
    velocidad double precision,
    distancia double precision,
    tipo_eje character varying(2),
    grupo_eje integer,
    distancia_grupo double precision,
    hora_fecha character varying(30)
);

-- Verificar (va para fugados)
CREATE TABLE adm.estadoscola (
    estadoscola_id serial NOT NULL,
    categoria_id character varying(10) NOT NULL,
    estado character varying(10),
    fugado character varying(10),
    nofugado character varying(10),
    hora_fecha character varying(30),
    registro_id integer not null,
    PRIMARY KEY (estadoscola_id, categoria_id)
);

-- No debe ir aquí, a fugados (ignorar vehículos) pasa fijo a dinamicas o estática
-- En dinámica se puede forzar para que todos entren a estática, pasa a todos los vehículos
-- En caso de un trancón por ejemplo
CREATE TABLE adm.forzados (
    registro_id character varying(10) PRIMARY KEY NOT NULL,
    categoria_id character varying(10),
    sobrepeso character varying(10),
    hora_fecha character varying(30),
    forzado_por integer
);

-- Log de placas de vehículos
CREATE TABLE adm.log (
    dispositivo_id character varying(100),
    observacion character varying(100),
    hora_fecha character varying(30),
    id serial PRIMARY KEY NOT NULL
);

-- Aquí va las lecturas cuando pasa un vehículo cuando pasa dinámicamente
-- Registro de cada pesaje por eje
CREATE TABLE adm.registros (
    registro_id serial PRIMARY KEY NOT NULL,
    categoria_id character varying(10),
    lectura_camara_lpr_id integer not null, -- Llave foranea
    numero_ejes integer,
    peso double precision,
    velocidad integer,
    sobrepeso character varying(5),
    hora_fecha character varying(30),
    sobrealtura character varying(5),
    sobrevelocidad character varying(5),
    peso_eje character varying(10),
    sgrupoe character varying(10),
    sentido_via character varying(100), -- sobre, ya estará en la báscula
    prueba character varying(10) -- verificar
);

-- Administrativa
CREATE TABLE adm.tipoejes (
    tipoejes_id serial PRIMARY KEY NOT NULL,
    descripcion_tipo character varying(50),
    peso_tipoeje double precision,
    ubicacionimagen character varying
);
-- Evasión la misma de dimensionamient, la diferenta es en eel lector
-- Pensar en dejar normalizada por un tipo de báscula, ésta se puede generar por tipo, dinamica. estática, por ejes, o todos los ejes

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

ALTER TABLE adm.registros ADD CONSTRAINT FK_registros__categoria FOREIGN KEY (categoria_id) REFERENCES adm.categoria (categoria_id);
ALTER TABLE adm.registros ADD CONSTRAINT FK_registros__lectura_camara_lpr FOREIGN KEY (lectura_camara_lpr_id) REFERENCES adm.lectura_camara_plr (lectura_camara_lpr_id);
ALTER TABLE adm.forzados ADD CONSTRAINT FK_forzados__categoria FOREIGN KEY (categoria_id) REFERENCES adm.categoria (categoria_id);

ALTER TABLE adm.estadoscola ADD CONSTRAINT FK_estadoscola__categoria FOREIGN KEY (categoria_id) REFERENCES adm.categoria (categoria_id);

ALTER TABLE adm.categoriagrupo ADD CONSTRAINT FK_categoriagrupo__categoria FOREIGN KEY (categoria_id) REFERENCES adm.categoria (categoria_id);

ALTER TABLE adm.colasemaforo ADD CONSTRAINT FK_colasemaforo__categoria FOREIGN KEY (categoria_id) REFERENCES adm.categoria (categoria_id);
ALTER TABLE adm.colasemaforo ADD CONSTRAINT FK_colasemaforo__registros FOREIGN KEY (registro_id) REFERENCES adm.registros (registro_id);


