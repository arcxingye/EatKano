DROP TABLE IF EXISTS `kano_rank`;
CREATE TABLE `kano_rank` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `score` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `time` datetime NOT NULL,
  `system` varchar(255) NOT NULL,
  `area` varchar(255) NOT NULL,
  `message` varchar(255) NOT NULL,
  `attempts` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;