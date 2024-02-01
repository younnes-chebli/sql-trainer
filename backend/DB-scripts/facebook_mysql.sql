-- phpMyAdmin SQL Dump
-- version 4.0.6
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Sep 29, 2014 at 10:35 AM
-- Server version: 5.5.33
-- PHP Version: 5.5.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `facebook`
--
DROP DATABASE IF EXISTS `facebook`;
CREATE DATABASE IF NOT EXISTS `facebook` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `facebook`;

-- --------------------------------------------------------

--
-- Table structure for table `Destinataires`
--

DROP TABLE IF EXISTS `Destinataires`;
CREATE TABLE IF NOT EXISTS `Destinataires` (
  `ID_Message` char(4) NOT NULL,
  `Destinataire` char(4) NOT NULL,
  PRIMARY KEY (`ID_Message`,`Destinataire`),
  KEY `fk_Destinataires_Personne` (`Destinataire`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Destinataires`
--

INSERT INTO `Destinataires` (`ID_Message`, `Destinataire`) VALUES
('M2', 'P2'),
('M4', 'P2'),
('M1', 'P3'),
('M3', 'P3'),
('M1', 'P4'),
('M4', 'P5'),
('M6', 'P5'),
('M5', 'P6');

-- --------------------------------------------------------

--
-- Table structure for table `EstAmi`
--

DROP TABLE IF EXISTS `EstAmi`;
CREATE TABLE IF NOT EXISTS `EstAmi` (
  `SSN1` char(4) NOT NULL,
  `SSN2` char(4) NOT NULL,
  PRIMARY KEY (`SSN1`,`SSN2`),
  KEY `fk_EstAmi_2` (`SSN2`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `EstAmi`
--

INSERT INTO `EstAmi` (`SSN1`, `SSN2`) VALUES
('P2', 'P1'),
('P3', 'P1'),
('P4', 'P1'),
('P1', 'P2'),
('P3', 'P2'),
('P4', 'P2'),
('P1', 'P3'),
('P2', 'P3'),
('P1', 'P4'),
('P2', 'P4');

-- --------------------------------------------------------

--
-- Table structure for table `Message`
--

DROP TABLE IF EXISTS `Message`;
CREATE TABLE IF NOT EXISTS `Message` (
  `ID_Message` char(4) NOT NULL,
  `Contenu` char(128) NOT NULL,
  `Date_Expedition` date NOT NULL,
  `Expediteur` char(4) NOT NULL,
  PRIMARY KEY (`ID_Message`),
  KEY `fk_Message_Personne` (`Expediteur`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Message`
--

INSERT INTO `Message` (`ID_Message`, `Contenu`, `Date_Expedition`, `Expediteur`) VALUES
('M1', 'Bonjour', '2013-10-01', 'P1'),
('M2', 'Salut', '2013-10-02', 'P1'),
('M3', 'On va boire un verre ?', '2013-10-03', 'P2'),
('M4', 'Regarde cette vidéo de chat', '2013-10-04', 'P4'),
('M5', 'LOL', '2013-10-05', 'P5'),
('M6', 'Trololololol', '2013-10-06', 'P6');

-- --------------------------------------------------------

--
-- Table structure for table `Personne`
--

DROP TABLE IF EXISTS `Personne`;
CREATE TABLE IF NOT EXISTS `Personne` (
  `SSN` char(4) NOT NULL,
  `Nom` char(20) NOT NULL,
  `Sexe` char(1) NOT NULL,
  `Age` char(2) NOT NULL,
  PRIMARY KEY (`SSN`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Personne`
--

INSERT INTO `Personne` (`SSN`, `Nom`, `Sexe`, `Age`) VALUES
('P1', 'Paul', 'M', '28'),
('P2', 'Julie', 'F', '28'),
('P3', 'David', 'M', '35'),
('P4', 'Xavier', 'M', '40'),
('P5', 'Marie', 'F', '18'),
('P6', 'Remy', 'M', '16');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Destinataires`
--
ALTER TABLE `Destinataires`
  ADD CONSTRAINT `fk_Destinataires_Personne` FOREIGN KEY (`Destinataire`) REFERENCES `Personne` (`SSN`),
  ADD CONSTRAINT `fk_Destinataires_Message` FOREIGN KEY (`ID_Message`) REFERENCES `Message` (`ID_Message`);

--
-- Constraints for table `EstAmi`
--
ALTER TABLE `EstAmi`
  ADD CONSTRAINT `fk_EstAmi_1` FOREIGN KEY (`SSN1`) REFERENCES `Personne` (`SSN`),
  ADD CONSTRAINT `fk_EstAmi_2` FOREIGN KEY (`SSN2`) REFERENCES `Personne` (`SSN`);

--
-- Constraints for table `Message`
--
ALTER TABLE `Message`
  ADD CONSTRAINT `fk_Message_Personne` FOREIGN KEY (`Expediteur`) REFERENCES `Personne` (`SSN`);
