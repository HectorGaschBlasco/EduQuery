-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-04-2025 a las 16:07:07
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `eduquery`
--
CREATE DATABASE IF NOT EXISTS `eduquery` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `eduquery`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `students`
--

DROP TABLE IF EXISTS `students`;
CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `fullname` text NOT NULL,
  `dni` text NOT NULL,
  `dir` text DEFAULT NULL,
  `telph` text NOT NULL,
  `birthdate` date NOT NULL,
  `pwd` text NOT NULL,
  `photo` longblob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `students_teachers`
--

DROP TABLE IF EXISTS `students_teachers`;
CREATE TABLE `students_teachers` (
  `id_students` int(11) NOT NULL,
  `id_teachers` int(11) NOT NULL,
  `cooldown` int(11) DEFAULT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `teachers`
--

DROP TABLE IF EXISTS `teachers`;
CREATE TABLE `teachers` (
  `id` int(11) NOT NULL,
  `fullname` text NOT NULL,
  `dni` text NOT NULL,
  `dir` text DEFAULT NULL,
  `telph` int(11) NOT NULL,
  `birthdate` date NOT NULL,
  `pwd` text NOT NULL,
  `photo` longblob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `telf` (`telph`) USING HASH,
  ADD UNIQUE KEY `dni` (`dni`) USING HASH;

--
-- Indices de la tabla `students_teachers`
--
ALTER TABLE `students_teachers`
  ADD PRIMARY KEY (`id_students`,`id_teachers`),
  ADD KEY `id_students` (`id_students`,`id_teachers`),
  ADD KEY `id_teachers` (`id_teachers`);

--
-- Indices de la tabla `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `telf` (`telph`),
  ADD UNIQUE KEY `dni` (`dni`) USING HASH;

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `students`
--
ALTER TABLE `students`
 MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
 AUTO_INCREMENT = 1;

--
-- AUTO_INCREMENT de la tabla `teachers`
--
ALTER TABLE `teachers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `students_teachers`
--
ALTER TABLE `students_teachers`
  ADD CONSTRAINT `students_teachers_ibfk_1` FOREIGN KEY (`id_students`) REFERENCES `students` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `students_teachers_ibfk_2` FOREIGN KEY (`id_teachers`) REFERENCES `teachers` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
