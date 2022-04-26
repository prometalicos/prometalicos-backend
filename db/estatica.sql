DROP DATABASE estatica;

CREATE DATABASE estatica
  WITH OWNER = postgres
       ENCODING = 'UTF8'
       TABLESPACE = pg_default
       CONNECTION LIMIT = 6;

\c estatica

CREATE SCHEMA adm;
CREATE SCHEMA lecturas;
CREATE SCHEMA log;

-- Log de eventos
create table adm.bitacora(
	bitacora_id int not null,
	fecha_hora date null,
	usuario_id varchar(50) null,
	evento varchar(250) null,
	tiempo varchar(20) null,
	programa nchar(20) null,
        CONSTRAINT bitacora_pk PRIMARY KEY (id_bitacora)
)
WITH (
  OIDS=FALSE
);

-- Tabla de configuración, sirve como base para hacer comparaciones
create table adm.datoejes(
	datoejes_id int not null,
	numero_eje int null,
	peso_eje real null,
	velocidad_eje int null,
	distancia_eje int null,
        CONSTRAINT datoejes_pk PRIMARY KEY (datoejes_id)
        )
          WITH (
             OIDS=FALSE
        );

-- Lectura por cada paso de vehículo, una lectura por eje y también agrupado, depende de la báscula
create table adm.datosregistro(
        datosregistro_id serial not null,
		numero_eje int null,
		peso_eje float null,
		velocidad int null,
		distancia float null,
		tipo_eje int null,
		grupo_eje int null,
		distancia_grupo float null,
		hora_fecha timestamp null,
        CONSTRAINT datosregistro_pk PRIMARY KEY (datosregistro_id)
        )
          WITH (
             OIDS=FALSE
        );

-- Tabla base para comparar en caso de infracción, es la configuración delos ejes, por ejemplo triden, permite armar grupos de ejes y comparativos por tipo de ejes
create table adm.ejes(
	ejes_id int not null,
	referencia_eje varchar(50) null,
	peso_maximo_eje real null,
	peso_referencia_eje real null,
        CONSTRAINT ejes_pk PRIMARY KEY (ejes_id)
        )
          WITH (
             OIDS=FALSE
        );

-- Lectura
create table adm.registros_pesaje(
	registros_pesaje_id serial not null,
	numero_tiquete varchar(20) not null, -- puede o no tener impreso el tiquete
	id_bascula int NOT NULL, -- referencia foránea a la báscula, podría tener dos básculas, cual tomó el peso
	fecha_hora date null,
	placa varchar(15) null, -- automática o manual
	codigo_vehiculo varchar(20) null, -- clasificación del vehículo, lo entrega el sistema
	servicio decimal(1, 0) null, -- Publico o privado

	comparendo varchar(40) null, -- Si se generó código infracción, es foránera de posible infracción OJO
	observaciones varchar(150) null, -- Anotar alguna novedad

	peso_total float null, -- peso numérico entregado por los sensores
	sobrepeso float null, -- Dato calculado con base a los pesado contra los parámetros de referencia (histórico)

	factor float null, -- Es un cálculo del factor de daño que tiene la vía
	login_usuario varchar(15) null, -- Log del usuario que efectuó el registro

        CONSTRAINT registros_pesaje_pk PRIMARY KEY (registros_pesaje_id)
        )
          WITH (
             OIDS=FALSE
        );

-- Se debe crear la tabla noveddad de la tabla anterior

-- Varios registros de ejes en la tabla de arriba, son los pesos independientes del peso total, 
create table adm.registros_pesaje_ejes(
	registros_pesaje_ejes_id serial not null,
	registros_pesaje_id int not null, -- foránea
	
	orden int not null, -- serial para generar la vista
	codigo_eje int null, -- foránea con el tipo de eje (contiene peso_referencia)

	peso_bascula float null, -- el peso entregado por la báscula del eje individual
	sobrepeso float null, -- SE guarda como histórico y evitar cambios de norma
	factor_dano float null, -- al tomar el peso lee una fórmula matemática
	CONSTRAINT registros_pesaje_ejes_pk PRIMARY KEY (id_registros_pesaje_ejes, id_registros_pesaje)
        )
          WITH (
             OIDS=FALSE
        );
