/*
SQLyog Ultimate v13.1.1 (32 bit)
MySQL - 5.6.40-84.0 : Database - db187150_winebe_app
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`db187150_winebe_app` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `db187150_winebe_app`;

/*Table structure for table `_gift_cards` */

DROP TABLE IF EXISTS `_gift_cards`;

CREATE TABLE `_gift_cards` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `dni` varchar(15) DEFAULT NULL,
  `aquien` varchar(90) DEFAULT NULL,
  `habilitado` int(1) DEFAULT '0',
  `estilo` int(20) DEFAULT '0',
  `fondo` varchar(200) DEFAULT NULL,
  `id_codigo` int(255) DEFAULT NULL COMMENT 'id de la tablal codigos_descuentos',
  `pagado` int(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `_gift_cards` */

/*Table structure for table `_winebe_empresas` */

DROP TABLE IF EXISTS `_winebe_empresas`;

CREATE TABLE `_winebe_empresas` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(250) DEFAULT NULL,
  `direccion_completa` varchar(400) DEFAULT NULL,
  `direccion_calle` varchar(200) DEFAULT NULL,
  `direccion_altura` varchar(100) DEFAULT NULL,
  `lat` varchar(500) DEFAULT NULL,
  `lng` varchar(500) DEFAULT NULL,
  `provincia_id` varchar(11) DEFAULT NULL,
  `provincia_nombre` varchar(500) DEFAULT NULL,
  `departamento_id` varchar(30) DEFAULT NULL,
  `departamento_nombre` varchar(500) DEFAULT NULL,
  `localidad_censal_id` varchar(20) DEFAULT NULL,
  `localidad_censal_nombre` varchar(500) DEFAULT NULL,
  `nomenclatura_completa` varchar(500) DEFAULT NULL,
  `direccion_calle_paralela_uno` varchar(200) DEFAULT NULL,
  `direccion_calle_paralela_dos` varchar(200) DEFAULT NULL,
  `barrio` varchar(200) DEFAULT NULL,
  `foto` varchar(500) DEFAULT NULL,
  `descripcion` text,
  `telefono_uno` varchar(150) DEFAULT NULL,
  `telefono_dos` varchar(150) DEFAULT NULL,
  `sitio_web` varchar(500) DEFAULT NULL,
  `costo_envio` varchar(100) DEFAULT NULL,
  `valoracion_prom_dinamico` int(11) DEFAULT NULL,
  `reservas_disponibles` int(11) DEFAULT NULL,
  `capacidad` int(200) DEFAULT NULL,
  `delivery` int(1) DEFAULT NULL,
  `fecha_alta` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Y-m-d',
  `hora_alta` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'H:i:s',
  `habilitado` int(1) DEFAULT NULL,
  `tipo_empresa` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `_winebe_empresas` */

insert  into `_winebe_empresas`(`id`,`nombre`,`direccion_completa`,`direccion_calle`,`direccion_altura`,`lat`,`lng`,`provincia_id`,`provincia_nombre`,`departamento_id`,`departamento_nombre`,`localidad_censal_id`,`localidad_censal_nombre`,`nomenclatura_completa`,`direccion_calle_paralela_uno`,`direccion_calle_paralela_dos`,`barrio`,`foto`,`descripcion`,`telefono_uno`,`telefono_dos`,`sitio_web`,`costo_envio`,`valoracion_prom_dinamico`,`reservas_disponibles`,`capacidad`,`delivery`,`fecha_alta`,`hora_alta`,`habilitado`,`tipo_empresa`) values 
(1,'Distribuidora ZM','Nueva York 1300, Devoto','Nueva York','1300',NULL,NULL,'1','Buenos Aires','1','Devoto','1','Devoto',NULL,NULL,NULL,'Devoto','assets/internos/banner.jpg',NULL,NULL,NULL,'distribuidorazm.com.ar',NULL,NULL,NULL,NULL,NULL,'2020-11-22 13:56:39','2020-11-22 13:56:39',1,'Distribuidora');

/*Table structure for table `_winebe_empresas_recomendadas` */

DROP TABLE IF EXISTS `_winebe_empresas_recomendadas`;

CREATE TABLE `_winebe_empresas_recomendadas` (
  `id` int(200) NOT NULL AUTO_INCREMENT,
  `id_empresa` int(200) DEFAULT NULL,
  `orden` int(20) DEFAULT NULL,
  `habilitado` int(1) DEFAULT '1',
  `fecha_inicio_destacada` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_fin_destacada` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `_winebe_empresas_recomendadas` */

insert  into `_winebe_empresas_recomendadas`(`id`,`id_empresa`,`orden`,`habilitado`,`fecha_inicio_destacada`,`fecha_fin_destacada`) values 
(1,1,1,1,'2020-11-22 15:58:29',NULL);

/*Table structure for table `_winebe_formas_pagos` */

DROP TABLE IF EXISTS `_winebe_formas_pagos`;

CREATE TABLE `_winebe_formas_pagos` (
  `id` int(200) NOT NULL AUTO_INCREMENT,
  `tipo` int(8) DEFAULT NULL COMMENT '1 efectivo - 2 mercadopago - 3 transferencia',
  `credenciales` text COMMENT 'objeto json de credenciales base64',
  `id_empresa` int(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `_winebe_formas_pagos` */

insert  into `_winebe_formas_pagos`(`id`,`tipo`,`credenciales`,`id_empresa`) values 
(1,1,'eyJlZmVjdGl2byI6MX0',1),
(2,2,'eyJwdWJsaWMiOiJhc2Rhc2Rhc2Rhc2Rhc2QifQ',1),
(3,3,'eyJjYnUiOiIwNzIwMDIwNTg4MDAwMDE3NzQ1MjY4IiwiYWxpYXMiOiJDRUxVTEEuR1JBTkpBLlBBUkFOQSJ9',1);

/*Table structure for table `_winebe_notificaciones` */

DROP TABLE IF EXISTS `_winebe_notificaciones`;

CREATE TABLE `_winebe_notificaciones` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(1200) DEFAULT NULL,
  `texto` varchar(1200) DEFAULT NULL,
  `line_icon` varchar(400) DEFAULT NULL,
  `visto` int(1) DEFAULT NULL,
  `link` varchar(600) DEFAULT NULL,
  `param` varchar(600) DEFAULT NULL,
  `dni_usuario` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

/*Data for the table `_winebe_notificaciones` */

insert  into `_winebe_notificaciones`(`id`,`titulo`,`texto`,`line_icon`,`visto`,`link`,`param`,`dni_usuario`) values 
(1,'titulo','texto','las la-list-alt',0,'pendientes.html',NULL,'33435007'),
(2,'Pedido reservado','El id de su pedido es: MjAyMDEyMDgyMDE2MTcwMDAwMDA=','las la-list-alt',0,'pedidos.html','MjAyMDEyMDgyMDE2MTcwMDAwMDA=','33435002'),
(3,'Pedido reservado','El cÃ³digo de su pedido es: 20201209064223000000','las la-list-alt',0,'pedidos.html','MjAyMDEyMDkwNjQyMjMwMDAwMDA=','33435002'),
(4,'Compra realizada','El cÃ³digo de MercadoPago para su compra es: 1231782671','las la-list-alt',0,'pedidos.html','','33435002'),
(5,'Compra realizada','El cÃ³digo de MercadoPago para su compra es: 1231816561','las la-list-alt',0,'pedidos.html','','33435002'),
(6,'Pedido reservado','El cÃ³digo de su pedido es: ','las la-list-alt',0,'pedidos.html','','33435002'),
(7,'Pedido reservado','El cÃ³digo de su pedido es: 20201210104146000000','las la-list-alt',0,'pedidos.html','MjAyMDEyMTAxMDQxNDYwMDAwMDA=','33435008'),
(8,'Pedido reservado','El cÃ³digo de su pedido es: 20201210121105000000','las la-list-alt',0,'pedidos.html','MjAyMDEyMTAxMjExMDUwMDAwMDA=','35985820'),
(9,'Pedido reservado','El cÃ³digo de su pedido es: ','las la-list-alt',0,'pedidos.html','','35985820'),
(10,'Pedido reservado','El cÃ³digo de su pedido es: 20201210190830000000','las la-list-alt',0,'pedidos.html','MjAyMDEyMTAxOTA4MzAwMDAwMDA=','35985823'),
(11,'Pedido reservado','El cÃ³digo de su pedido es: 20201211071207000000','las la-list-alt',0,'pedidos.html','MjAyMDEyMTEwNzEyMDcwMDAwMDA=','3598690'),
(12,'Pedido reservado','El cÃ³digo de su pedido es: 20201218114916000000','las la-list-alt',0,'pedidos.html','MjAyMDEyMTgxMTQ5MTYwMDAwMDA=','33435008'),
(13,'Pedido reservado','El cÃ³digo de su pedido es: 20201227122925000000','las la-list-alt',0,'pedidos.html','MjAyMDEyMjcxMjI5MjUwMDAwMDA=','33435008'),
(14,'Pedido reservado','El cÃ³digo de su pedido es: 20201227131933000000','las la-list-alt',0,'pedidos.html','MjAyMDEyMjcxMzE5MzMwMDAwMDA=','35985823');

/*Table structure for table `_winebe_productos` */

DROP TABLE IF EXISTS `_winebe_productos`;

CREATE TABLE `_winebe_productos` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `id_tipo` int(11) DEFAULT NULL,
  `id_empresa` int(255) DEFAULT NULL COMMENT '// empresa - bodega - distribuidora que contiene el vino',
  `nombre` varchar(300) DEFAULT NULL COMMENT '// nombre del vino',
  `tipo` varchar(300) DEFAULT NULL COMMENT '// tipo de envase',
  `id_envase` varchar(20) DEFAULT NULL COMMENT '// detalle del envase',
  `bodega` varchar(500) DEFAULT NULL COMMENT 'campo detalle para los vinos de la "bodega" winebe',
  `foto` varchar(500) DEFAULT NULL,
  `variedad` varchar(250) DEFAULT NULL COMMENT '// campo no usado por el momento',
  `categoria` varchar(200) DEFAULT NULL,
  `productor` varchar(500) DEFAULT NULL,
  `corte` varchar(500) DEFAULT NULL,
  `lugar_elaboracion` varchar(500) DEFAULT NULL,
  `altura` varchar(100) DEFAULT NULL,
  `crianza` varchar(500) DEFAULT NULL,
  `elaboracion` text,
  `enologo` varchar(250) DEFAULT NULL,
  `pais` varchar(150) DEFAULT NULL,
  `temperatura` varchar(250) DEFAULT NULL,
  `fecha_alta` varchar(20) DEFAULT NULL,
  `hora_alta` varchar(20) DEFAULT NULL,
  `habilitado` int(1) DEFAULT '1',
  `stock` bigint(20) DEFAULT '100',
  `precio` varchar(200) DEFAULT NULL,
  `descripcion` text,
  `es_combo` int(1) DEFAULT '0',
  `es_oferta` int(1) DEFAULT '0',
  `porcentaje_descuento` varchar(50) DEFAULT NULL COMMENT '// numero que se calcula al oficial para generar descuento.',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;

/*Data for the table `_winebe_productos` */

insert  into `_winebe_productos`(`id`,`id_tipo`,`id_empresa`,`nombre`,`tipo`,`id_envase`,`bodega`,`foto`,`variedad`,`categoria`,`productor`,`corte`,`lugar_elaboracion`,`altura`,`crianza`,`elaboracion`,`enologo`,`pais`,`temperatura`,`fecha_alta`,`hora_alta`,`habilitado`,`stock`,`precio`,`descripcion`,`es_combo`,`es_oferta`,`porcentaje_descuento`) values 
(1,2,1,'Estrellado Malbec','Tinto','14.0','1','http://winebe.com.ar/uploads/productos/13_giuffrida.jpg','Malbec','Malbec','Familia Giuffrida','100% Malbec','Valle de Uco - Mendoza','900','2018',NULL,'-','Argentina','16','2020-12-10','19:30',1,5,'1800','Color rojo violÃ¡ceo intenso. De complejos aromas a frutas rojas, con delicados toques de madera. Suave en boca, equilibrado, con notas de ciruelas y guindas. Criado 8 meses en barricas de roble francÃ©s y americano, y madurado a fin de Marzo 2020. Ideal para acompaÃ±ar carnes rojas, pastas o pescados y carnes blancas con salsas especiadas.',0,1,'3'),
(2,1,1,'Estrellado Cabernet Sauvignon','Tinto\r\n','14.5','1','http://winebe.com.ar/uploads/productos/10_giuffrida.jpg','Cabernet Sauvignon','Cabernet Sauvignon','Familia Giuffrida','100% Cabernet','Valle de Uco - Mendoza','900','2018',NULL,'-','Argentina','16','2020-12-10','19:30',1,6,'1800','Color rojo rubÃ­ intenso. Aromas de cerezas con sutiles notas de pimienta y suaves aportes de la madera. Suave en boca, balanceado, con aromas a cerezas y cassis. Criado 8 meses en barricas de roble francÃ©s y americano, y madurado en la primer quincena de Abril. Ideal para acompaÃ±ar carnes rojas, pastas o pescados y carnes blancas con salsas espaciadas.',1,0,NULL),
(3,3,1,'Estrellado Espumante Extra Bruto','Espumante','15.5','1','http://winebe.com.ar/uploads/productos/13_giuffrida.jpg','Charmat','Charmat','Familia Giuffrida','50% Chardonnay - 30% Viognier - 20% Pinot Noir','Valle de Uco - Mendoza','900','2018',NULL,'-','Argentina','16','2020-12-10','19:30',1,0,'1800','Amarillo pÃ¡lido con reflejos verdes, aromas a frutos cÃ­tricos con notas de durazno y ananÃ¡. Predominio de fruta con sutiles notas de levadura, perlage persistente y delicado. En boca aparece una delicada presencia de frutas frescas, manzana verde, durazno. Ideal para acompaÃ±ar aperitivos, carnes blancas, mariscos y ensaladas frescas!',0,0,''),
(4,2,1,'Mujercitas Malbec RosÃ©','Tinto\r\n','12.5','1','http://winebe.com.ar/uploads/productos/21_mujercitasrose.jpg','Malbec','Malbec','Familia Giuffrida','100 % Malbec de Agrelo','LujÃ¡n de Cuyo','900','2019',NULL,'-','Argentina','16','2020-12-10','19:30',1,6,'1800','A la vista de color rosa tenue, muy atractivo y brillante. En nariz aromÃ¡tico, fresco y agradable. Con presencia de notas florales y frutos rojos. En boca tiene una entrada agradable y con buen volumen. Provoca cierta sensaciÃ³n cÃ­trica debido a su equilibrada acidez. TambiÃ©n se destacan notas de cereza, guinda y frutilla.',0,0,NULL),
(5,4,1,'Mujercitas Sauvignon Blanc ','Blanco','13','1','http://winebe.com.ar/uploads/productos/20_mujercitas.jpg','Sauvignon Blanc','Sauvignon Blanc','Familia Giuffrida','100 % Sauvignon Blanc','Valle de Uco - Mendoza','900','2018',NULL,'-','Argentina','16','2020-12-10','19:30',1,6,'1800','Color amarillo verdoso, intensos aromas de fruto de la pasiÃ³n, mango, pomelo rosado, con sutiles notas minerales. En boca buen ataque, acidez bien balanceada, con final prolongado, remarcando las notas de frutos tropicales. Ideal como aperitivo o para acompaÃ±ar frutos de mar, pescados y ensaladas.',0,0,NULL),
(6,5,1,'Las Giuffrida Malbec Reserva','Tinto\r\n','14','1','http://winebe.com.ar/uploads/productos/14_giuffrida.jpg','Blend','Blend','Familia Giuffrida','Malbec 70% - Syrah 11% - Bonarda 10% - Merlot 9%','Valle de Uco - Mendoza','900','2017',NULL,'-','Argentina','16','2020-12-10','19:30',1,4,'2100','Color rojo profundo, con trazos violetas. Intensos aromas de frutas rojas, con matices de pimienta, especias, violeta y ciruela seca, conjugados con notas de tabaco, chocolate y vainilla. En boca, buen ataque, suave, redondo; estructura bien balanceada con taninos maduros, donde se combinan las notas de fruta, con los aportes de la madera en una explosiÃ³n interminable de sabor, propio de vinos de gran raza y estirpe. Excelente compaÃ±ero para platos de caza mayor, carnes braseadas y guisos como la carbonada.',0,0,NULL),
(10,6,1,'Nieto Senetiner Extra Brut','Espumante','14%','1','http://winebe.com.ar/uploads/productos/64d33999d1322906845739e2a166d71e.jpg','Extra Brut','Extra Brut','Bodega Nieto Senetiner','Pinot Noir, Malbec','','-','2018','Lujan de Cuyo, Provincia de Mendoza, Argentina','-','Argentina','16','2020-12-15','14:23',1,2,'2100','De color salmÃ³n Ã¡mbar. De nariz cautivante por su perfecta combinaciÃ³n entre los aromas a levaduras, pan tostado y flores blancas, manzanas y acrÃ­licas. En boca, elegante y sensual que invita a ser bebido.',0,0,''),
(11,2,1,'El Enemigo Malbec','Tinto','13.5','1','http://winebe.com.ar/uploads/productos/d5b1fc0d8730aa34a290f3e20fd978f7.jpg','Malbec','Malbec','Aleanna','89% Malbec 11 % Petit Verdot','Gualtallary. Provincia de Mendoza, Argentina.','-','2017','','-','Argentina','16','2020-12-15','17:16',1,6,'1200','En vista un rojo rubÃ­ de alta intensidad y destellos violÃ¡ceos. En nariz mucha madera. TardÃ³ en abrirse en copa y luego del agite aparece fruta roja madura. En boca, un ataque brutal al paladar. Algo dulce y carnoso de muy buen equilibrio y acidez con taninos muy marcados.',0,0,''),
(12,7,1,'Angelica Zapata Cabernet Franc','Tinto','13.7','1','http://winebe.com.ar/uploads/productos/85790ed8fb57a34844a16c09e5a555ff.jpg','Cabernet Franc','Cabernet Franc','Catena Zapata','100 % Cabernet Franc','','-','2016','','-','Argentina','16','2020-12-15','17:21',1,6,'6995','El AngÃ©lica Zapata Cabernet Franc Alta, presenta un color rojo rubÃ­ con suaves tonalidades violÃ¡ceas. Posee aroma intenso y concentrado con notas de cassis, grosellas maduras, y toques de vainilla y especias dulces como pimienta negra y clavo de olor. De impacto dulce y excelente estructura en boca, muestra frutos rojos maduros con marcados dejos a eucalipto y pimienta negra. Este vino, de excelente balance y elegancia, posee ahora un final bien estructurado y persistente y se prevÃ© que evolucionarÃ¡ favorablemente en botella hasta por lo menos el aÃ±o 2021.',0,0,''),
(13,5,1,'Catena Zapata Nicolas','Tinto','13.5','1','http://winebe.com.ar/uploads/productos/b9bdeddcb5fc91166e0cf56fa2d46816.jpg','Blend','Blend','Catena Zapata','78% Cabernet Sauvignon, 22% Malbec','Provincia de Mendoza, Argentina.','-','2017','','-','Argentina','16','2020-12-15','17:25',1,6,'8519','De gran concentraciÃ³n y elegancia a la vez, su sabor remite a dulces notas de cassis, frutos negros y ciruelas.\nSe perciben taninos maduros, finamente integrados y una acidez fresca y balanceada que resalta sus intensos sabores frutales y minerales.',0,0,''),
(14,2,1,'Bramare Rebon Estate Malbec','Tinto','14.7','1','http://winebe.com.ar/uploads/productos/f48528f85485e6d660fa8f43712dd4fc.jpg','Malbec','Malbec','Bodega ViÃ±a Cobos','100 % Malbec','14.7','-','2017','','-','Argentina','16','2020-12-15','17:30',1,6,'8519','Este malbec nos ofrece un muy buen color rojo con tonos violetas. Es un vino elegante e intenso. En nariz se expresa con gran complejidad, destacÃ¡ndose su mineralidad. Grafito, tabaco, chocolate, fruta roja, especias como clavo de olor y pimienta. En boca es untuoso, agradable, largo y persistente. Presenta taninos dulces, una grata sensaciÃ³n de fruta agridulce, caramelo y cera de abejas. Muy atractivo por su textura sedosa y su largo final.',0,0,''),
(15,1,1,'Bramare Cabernet Lujan de Cuyo','Tinto','14','1','http://winebe.com.ar/uploads/productos/f9a04c75c2edf5a72fad00f261e814c5.jpg','Cabernet Sauvignon','Cabernet Sauvignon','Bodega ViÃ±a Cobos','100% Cabernet Sauvignon','LujÃ¡n de Cuyo. Provincia de Mendoza, Argentina.','-','2017','','-','Argentina','16','2020-12-15','17:32',1,6,'2794','Precioso rojo de tono rubÃ­ y exquisitos aromas a grosellas, notas de cedro y grafito. Especiado con clavo de olor y pimienta negra nos muestra en boca deliciosas moras e higos, notas de cafÃ© y tabaco. Su final es muy agradable con taninos refinados y sedosa persistencia.',0,0,''),
(16,1,1,'Bramare Cabernet Lujan de Cuyo ','Tinto','14 ','1','http://winebe.com.ar/uploads/productos/f75ae004ac74fece823391d5ba1572dd.jpg','Cabernet Sauvignon','Cabernet Sauvignon','Bodega ViÃ±a Cobos','100 % Cabernet Sauvignon','LujÃ¡n de Cuyo, Mendoza','920 a 1078','2017','','-','Argentina','16Â°','2020-12-27','17:26',1,6,'2794','Precioso rojo de tono rubÃ­ y exquisitos aromas a grosellas, notas de cedro y grafito. Especiado con clavo de olor y pimienta negra nos muestra en boca deliciosas moras e higos, notas de cafÃ© y tabaco. Su final es muy agradable con taninos refinados y sedosa persistencia.',0,0,''),
(17,2,1,'Susana Balbo Nosotros Malbec','Malbec','13.6','1','http://winebe.com.ar/uploads/productos/36d6a6a6af813e24a4efae4a13be7dad.jpg','Malbec','Malbec','Bodega Humami','100 % Malbec','Los Chacayes, Valle de Uco, Mendoza','-','2016','','-','Argentina','16Â°','2020-12-27','17:32',1,6,'6498','Notas de frutos de frutas azules como arÃ¡ndanos, cassis y mora, y notas florales debido al aÃ±o frÃ­o. Las sutiles notas calcÃ¡reas aportan complejidad. Las bajas temperaturas de la temporada aportaron muy buena acidez natural y excelente balance con el alcohol. Con caudalÃ­a de taninos. Vino compacto e intenso.',0,0,''),
(18,1,1,'Susana Balbo Signature RosÃ© ','RosÃ©','13.2','1','http://winebe.com.ar/uploads/productos/3d33273df51e2fee4f114c6a10a940ff.jpg','Blend','RosÃ©','Bodega Humami','60% Malbec | 40% Pinot Noir','Chacayes y Gualtallary, Valle de Uco, Mendoza.','-','2019','','-','Argentina','16Â°','2020-12-27','17:36',1,6,'1724','',0,0,''),
(19,2,1,'Susana Balbo Signature Malbec','Malbec','14.6','1','http://winebe.com.ar/uploads/productos/e348257fc2fade112c6db4ffe3b51fdc.jpg','Malbec','Malbec','Bodega Humami','92 % Malbec, 8 % Cabernet Franc','Valle de Uco - Mendoza','-','2018','','-','Argentina','16Â°','2020-12-27','17:38',1,6,'1137','Se trata de un vino que expresa todo el poder, la elegancia y el placer que el Malbec Argentino te puede ofrecer. ',0,0,''),
(20,5,1,'Sapo de Otro Pozo ','Blend','13.7','1','http://winebe.com.ar/uploads/productos/ded4b61baae1013b2f50a6edb04cf5e5.jpg','Blend de Tintas','Blend','Mosquita Muerta','60% Malbec | 20% Syrah | 20% Cabernet Franc','Vista Flores - Gualtallary - Los Chacayes - La Consulta, Mendoza.','-','2018','','-','Argentina','16Â°','2020-12-27','17:41',1,0,'781','Su presencia es imponente caiga donde caiga. Aunque no sea bienvenido, no podrÃ¡ pasar desapercibido. Su adrenalina es el riesgo, es la clave. Sapo de otro pozo, que le gusta jugar de visitante. Este blend de tintas representa la sinergia entre los diferentes terroir y variedades. Los Malbec de altura nos dan gran expresiÃ³n aromÃ¡tica, acompaÃ±ado por un toque caracterÃ­stico de Cabernet Franc y los taninos bien marcados del Syrah.',0,0,''),
(21,5,1,'Pispi','Blend','13.7','1','http://winebe.com.ar/uploads/productos/25ddb96f7255bf7110cb388299348ed1.jpg','Blend de Tintas','Blend','Mosquita Muerta','40% Malbec | 20% Petit Verdot | 20% Bonarda | 10% Cabernet Franc | 10% Merlo','Perdriel - Altamira - Medrano - La Consulta - Tupungato, Mendoza','-','2018','','-','Argentina','16Â°','2020-12-27','17:43',1,0,'661','Este blend de tintas representa la sinergia de los diferentes terroir y variedades. Aromas a mentolados, moras, ciruelas, grosellas, abariguay, pimiento rojo, pimientas y mermeladas. Notas tostadas, caramelo, vainilla.',0,0,''),
(22,1,1,'Luigi Bosca Finca los Nobles Cabernet Bouchet','Cabernet Bouchet','14.4','1','http://winebe.com.ar/uploads/productos/9744868420cc90b615fc0fa6c9fdf3d8.jpg','Cabernet Sauvignon y Bouchet','Cabernet Sauvignon','Luigi Bosca','100% cabernet y bouchet','Finca Los Nobles, Las Compuertas, LujÃƒÂ¡n de Cuyo, Mendoza.','-','2015','','-','Argentina','16Â°','2020-12-27','17:45',1,4,' $ 2,421 ','De color rojo rubÃ­ profundo con reflejos caoba. Sus aromas son equilibrados y elegantes, con notas de frutos maduros, especias, moca y suaves ahumados de la crianza. En boca es imponente, de frescura equilibrada y carÃ¡cter especiado intenso. De buen cuerpo, maduro, con taninos finos y firmes, y un final persistente en el que se aprecia su complejidad. Es un tinto de terroir, con gran potencial de guarda.',0,0,''),
(23,2,1,'Luigi Bosca Finca los Nobles Malbec Verdot','Malbec','15','1','http://winebe.com.ar/uploads/productos/6e1c3c795bd891ba148f23f03aa79869.jpg','Malbec y Petit Verdot','Malbec','Luigi Bosca','Malbec Predominante y Petit Verdot','Lujan de Cuyo, Mendoza','-','2018','','-','Argentina','16Â°','2020-12-27','17:47',1,3,'2421','De color rojo violaceo profundo con reflejos rubÃ­Â­, sus aromas son expresivos e intensos, con notas de frutos rojos y negros, especias dulces, flores y suaves ahumados de la crianza. En boca es franco y voluptuoso, con una frescura vivaz que habla de la aÃ±ada, apoyada en su caracter frutal. De paladar amplio y profundo, con taninos finos y un final persistente en el que se puede apreciar su complejidad. Es un tinto de terroir, con sentido de pertenencia y muy representativo de la familia.',0,0,''),
(24,2,1,'Rutini Malbec','Malbec','13.9','1','http://winebe.com.ar/uploads/productos/007409571688c6352de5545f45872496.jpg','Malbec','Malbec','La Rural','100 % Malbec ','Gualtallary, Tupungato, Mendoza','-','2018','','-','Argentina','16Â°','2020-12-27','17:48',1,6,'2081','De color rojo violaceo muy intenso. En nariz presenta aroma a frutas rojas y especias, con notas de vainilla y tabaco que le confiere el roble nuevo. En la boca es un vino de gran cuerpo y concentracion, algo frutado, con taninos bien dulces. ',0,0,''),
(25,1,1,'Pulenta Estate Malbec','Malbec','14.5','1','http://winebe.com.ar/uploads/productos/97f779b89ec627a2bb1cb4f70749e876.jpg','Malbec','Malbec','Pulenta ','100 % Malbec','Alto Agrelo, LujÃ¡n de Cuyo, Mendoza','-','2018','','-','Argentina','16Â°','2020-12-27','17:50',1,6,'1222','Color intenso y profundo, sus aromas delicados traen fruta roja al recuerdo, moras y ciruela principalmente, este carÃ¡cter revela un intenso trabajo en viÃ±edo. en boca es muy complejo resaltando los frutos rojos y notas provenientes del roble durante 12 meses y una guarda en botella prolongada. Todo esto hace de este malbec un gran exponente de nuestra variedad emblema.',0,0,''),
(26,2,1,'Vicentin Colosso Malbec','Malbec','14.9','1','http://winebe.com.ar/uploads/productos/f19fb674e6a4f3606a5d615cd8b252e5.jpg','Malbec','Malbec','Vicentin Family Wines','100 % Malbec','Charcas de Coria, Las Compuertas, Tupungato, San Carlos La Consulta, LujÃ¡n de Cuyo, Mendoza','-','2018','','-','Argentina','16Â°','2020-12-27','17:51',1,6,'1961','Rojo profundo de gran intensidad con tintes violÃ¡ceos. Muy perfumado de cassis, regaliz, frutas negras, violetas, rosas, especiado y grafito. Entrada de boca dulce, de gran concentraciÃ³n, taninos redondos aterciopelados y elegantes, robusto, frutas negras madura, muy especiado. Colosal persistencia.',0,0,''),
(27,2,1,'Achaval Ferrer Bella Vista Malbec','Malbec','14.5','1','http://winebe.com.ar/uploads/productos/090ef8c62ae30f3c25ee223af37574b0.jpg','Malbec','Malbec','Achaval Ferrer ','100 % Malbec','Finca Bella Vista, Lujan de Cuyo, Mendoza','-','2015','','-','Argentina','16Â°','2020-12-27','17:54',1,6,'9539','El Malbec es el cepaje tinto emblemÃ¡tico de la Argentina que ha encontrado en Mendoza un clima y suelo ideales. Altamira, en La Consulta, tiene el potencial para ser un verdadero \'grand cru\'. Nuestra filosofÃ­a es trabajar duro lo necesario durante los 11 meses en el viÃ±edo, para obtener uvas que necesitarÃ¡n muy poca intervenciÃ³n durante el proceso de elaboraciÃ³n del vino. La ubicaciÃ³n del viÃ±edo, la edad de las plantas, el programa de trabajo y el manejo hÃ­drico al que estÃ¡n sometidas las cepas son elementos esenciales que trabajan a favor del objetivo de elaborar un vino que sea verdadera expresiÃ³n de su terruÃ±o. Su personalidad se destaca a travÃ©s del vino, cosecha a cosecha, con un carÃ¡cter Ãºnico, reconocible y repetitivo.',0,0,'');

/*Table structure for table `_winebe_tipos_vinos` */

DROP TABLE IF EXISTS `_winebe_tipos_vinos`;

CREATE TABLE `_winebe_tipos_vinos` (
  `id` int(200) NOT NULL AUTO_INCREMENT,
  `tipo` varchar(100) DEFAULT NULL,
  `habilitado` int(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

/*Data for the table `_winebe_tipos_vinos` */

insert  into `_winebe_tipos_vinos`(`id`,`tipo`,`habilitado`) values 
(1,'Cabernet Sauvignon',1),
(2,'Malbec',1),
(3,'Charmat',1),
(4,'Sauvignon Blanc',1),
(5,'Blend',1),
(6,'Espumante',1),
(7,'Cabernet Franc',1);

/*Table structure for table `_winebe_transacciones` */

DROP TABLE IF EXISTS `_winebe_transacciones`;

CREATE TABLE `_winebe_transacciones` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `nombre_completo` varchar(90) DEFAULT NULL,
  `fecha_nacimiento` varchar(40) DEFAULT NULL,
  `dni` varchar(10) DEFAULT NULL,
  `calle` varchar(90) DEFAULT NULL,
  `altura` varchar(10) DEFAULT NULL,
  `codigo_postal` varchar(10) DEFAULT NULL,
  `piso_nro` varchar(10) DEFAULT NULL,
  `tipo_transaccion` int(1) DEFAULT NULL COMMENT '1 efectivo 2 mp 3 transferencia',
  `nro_transaccion` varchar(90) DEFAULT NULL,
  `fecha_transaccion` varchar(40) DEFAULT NULL,
  `hora_transaccion` varchar(8) DEFAULT NULL,
  `email` varchar(90) DEFAULT NULL,
  `telefono` varchar(90) DEFAULT NULL,
  `fecha_sistema_creado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` int(10) DEFAULT '0' COMMENT '0 pendiente . 1 pago confirmado . 2 pedido en proceso . 3 pedido enviado . 4 pedido entregado . 5 pedido no entregado . 6 pedido roto . 7 pedido facturado a bodega y pendiente de pago . 8 pedido pago por bodega . 9 pedido cancelado por bodega . 11 pago confirmado mp',
  `id_usuario_login` varchar(255) DEFAULT NULL,
  `pedido` text,
  `desde` varchar(20) DEFAULT 'app',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8;

/*Data for the table `_winebe_transacciones` */

insert  into `_winebe_transacciones`(`id`,`nombre_completo`,`fecha_nacimiento`,`dni`,`calle`,`altura`,`codigo_postal`,`piso_nro`,`tipo_transaccion`,`nro_transaccion`,`fecha_transaccion`,`hora_transaccion`,`email`,`telefono`,`fecha_sistema_creado`,`estado`,`id_usuario_login`,`pedido`,`desde`) values 
(82,'Leandro','2002-01-01','33435008','Artigas 5255','5255','1419','',1,'MjAyMDEyMjcxMjI5MjUwMDAwMDA=','2020-12-27','12:29:25','Leandro@reiatsu.com.ar','1137762637','2020-12-27 15:29:25',0,'33435008','[{\"precio\":6995,\"nombre\":\"Angelica Zapata Cabernet Franc\",\"id\":\"12\",\"productor\":\"Catena Zapata\",\"empresa\":\"1\",\"cantidad\":1,\"foto\":\"http:\\/\\/winebe.com.ar\\/uploads\\/productos\\/85790ed8fb57a34844a16c09e5a555ff.jpg\",\"total\":6995,\"descuento\":{\"id\":\"1\",\"creador\":\"Leandro\",\"codigo\":\"LS00001\",\"descuento\":\"50\",\"cantidad_usos\":\"1\",\"disponible\":\"1\",\"fecha_creado\":\"2020-12-26 14:08:09\",\"fecha_utilizado\":\"2020-12-26 19:15:46\",\"tipo\":\"1\"}},{\"precio\":2794,\"nombre\":\"Bramare Cabernet Lujan de Cuyo\",\"id\":\"15\",\"productor\":\"Bodega Vi\\u00f1a Cobos\",\"empresa\":\"1\",\"cantidad\":2,\"foto\":\"http:\\/\\/winebe.com.ar\\/uploads\\/productos\\/f9a04c75c2edf5a72fad00f261e814c5.jpg\",\"total\":5588}]','app'),
(83,'Monki el que lee','2002-01-01','35985823','Cjhjki','346','1209','',1,'MjAyMDEyMjcxMzE5MzMwMDAwMDA=','2020-12-27','13:19:33','Monki@reiatsu.com.ar','545788','2020-12-27 16:19:33',0,'35985823','[{\"precio\":1800,\"nombre\":\"Estrellado Malbec\",\"id\":\"1\",\"productor\":\"Familia Giuffrida\",\"empresa\":\"1\",\"cantidad\":3,\"foto\":\"http://winebe.com.ar/uploads/productos/13_giuffrida.jpg\",\"total\":5400}]','app');

/*Table structure for table `_winebe_usuario` */

DROP TABLE IF EXISTS `_winebe_usuario`;

CREATE TABLE `_winebe_usuario` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `id_login` varchar(70) DEFAULT NULL,
  `via_logueo` int(1) DEFAULT NULL COMMENT '1 manual, 2 facebook, 3 google',
  `foto` varchar(500) DEFAULT NULL,
  `nombre` varchar(200) DEFAULT NULL,
  `apellido` varchar(200) DEFAULT NULL,
  `fecha_nacimiento` varchar(50) DEFAULT NULL COMMENT 'Y-m-d',
  `documento` int(10) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefono` varchar(100) DEFAULT NULL,
  `wsp` varchar(100) DEFAULT NULL,
  `id_device` varchar(500) DEFAULT NULL,
  `habilitado` int(1) DEFAULT NULL,
  `mayor_18` int(1) DEFAULT '0',
  `b` varchar(250) DEFAULT NULL,
  `c` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

/*Data for the table `_winebe_usuario` */

insert  into `_winebe_usuario`(`id`,`id_login`,`via_logueo`,`foto`,`nombre`,`apellido`,`fecha_nacimiento`,`documento`,`email`,`telefono`,`wsp`,`id_device`,`habilitado`,`mayor_18`,`b`,`c`) values 
(1,'1',1,'foto','nombre','apellido','fecha_nacimiento',0,'email','telefono','wsp','1',1,1,'-','-'),
(2,'0',1,'-','Lean',' ','1987-12-16',33445566,'leandro@reiatsu.com.ar','personal_celular','-','mobile',1,1,'-','-'),
(3,'0',1,'-','Lean',' ','1987-01-01',33435008,'leandro@reiatsu.com.ar','personal_celular','-','mobile',1,1,'-','-'),
(4,'0',1,'-','APRO',' ','2020-00-00',33435667,'nestor.reiatsu@gmail.com','000','-','mobile',1,1,'-','-'),
(5,'46000000',1,'-','Leandro Salar',' ','1987-12-16',33435002,'leandro.salar@gmail.com','0','-','mobile',1,1,'-','-'),
(6,'25000000',1,'-','belen mor',' ','1989-02-07',34654153,'belen.reiatsu@gmail.com','0','-','mobile',1,1,'2020-12-10 11:38:25','-'),
(7,'1000000',1,'-','NÃ©stor Bertagni',' ','1989-06-23',34551871,'nestor.reiatsu@gmail.com','0','-','mobile',1,1,'2020-12-10 11:41:01','-'),
(8,'2000000',1,'-','Prueba 2',' ','1990-10-17',35985820,'daiana@reiatsu.com.ar','0','-','mobile',1,1,'2020-12-10 12:04:02','-'),
(9,'43000000',1,'-','dai',' ','1992-12-05',35985867,'daiana@reiatsu.com.ar','0','-','mobile',1,1,'2020-12-10 14:55:43','-'),
(10,'12000000',1,'-','Monki el que lee',' ','1983-12-15',35985823,'Monki@reiatsu.com.ar','0','-','mobile',1,1,'2020-12-10 19:03:12','-'),
(11,'55000000',1,'-','Prueba 3',' ','1990-04-04',3598690,'prueba3@gmail.com','0','-','mobile',1,1,'2020-12-11 07:09:55','-'),
(12,'50000000',1,'-','prueba3',' ','1987-12-16',2147483647,'prueba@reiatsu.com.ar','0','-','mobile',1,1,'2020-12-28 06:27:50','-');

/*Table structure for table `_winebe_vinos_destacados` */

DROP TABLE IF EXISTS `_winebe_vinos_destacados`;

CREATE TABLE `_winebe_vinos_destacados` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `id_empresa` int(255) DEFAULT NULL,
  `id_vino_empresa` int(255) DEFAULT NULL,
  `fecha_inicio_destacado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_fin_destacado` varchar(30) DEFAULT NULL,
  `habilitado` int(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `_winebe_vinos_destacados` */

insert  into `_winebe_vinos_destacados`(`id`,`id_empresa`,`id_vino_empresa`,`fecha_inicio_destacado`,`fecha_fin_destacado`,`habilitado`) values 
(1,1,1,'2020-11-22 14:22:49',NULL,1),
(2,1,2,'2020-11-23 15:26:20',NULL,1),
(3,1,3,'2020-11-23 15:26:24',NULL,1);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
