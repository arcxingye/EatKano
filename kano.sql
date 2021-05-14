 SET NAMES utf8 ;
DROP TABLE IF EXISTS `kano1_rank`;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `kano1_rank` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `score` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `time` datetime DEFAULT NULL,
  `systeminfo` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `area` varchar(255) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;
LOCK TABLES `kano1_rank` WRITE;
UNLOCK TABLES;
