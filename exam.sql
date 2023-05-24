-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mer. 24 mai 2023 à 03:06
-- Version du serveur : 8.0.31
-- Version de PHP : 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `exam`
--

-- --------------------------------------------------------

--
-- Structure de la table `category`
--

DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `id_categorie` int NOT NULL AUTO_INCREMENT,
  `title_categorie` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id_categorie`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `category`
--

INSERT INTO `category` (`id_categorie`, `title_categorie`) VALUES
(5, 'Travel'),
(6, 'Study');

-- --------------------------------------------------------

--
-- Structure de la table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `category` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `categorie_id` (`category`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `tasks`
--

INSERT INTO `tasks` (`id`, `title`, `description`, `status`, `category`) VALUES
(8, 'task1', 'new task', 'in progress', 5),
(10, 'task2', 'new task 2', 'completed', 5);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `age` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `tasks_id` int DEFAULT NULL,
  `token` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tasks_id` (`tasks_id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `name`, `age`, `email`, `password`, `tasks_id`, `token`) VALUES
(26, 'ameny', 23, 'ameny@gmail.com', '$2b$10$P3zMLx3nlu5lT2VGW91Kd.2Ch9ayoTf9bDrH8NXGZK4/82SK512G.', 8, ''),
(27, 'amal', 23, 'amal@gmail.com', '$2b$10$hv36nQIouW/61b4KaOpppO0j.UYUvn6nFJHLP8Bra2Hexkr.TK5Iu', 8, ''),
(28, 'test', 12, 'ameny@gmail.com', '$2b$10$qGNkTv77M2dSO8y6hoqj7Oe3LuKBFMgHCJFSXLJB8HNiygs/v1b86', NULL, ''),
(29, 'test', 12, 'ameny@gmail.com', '$2b$10$qGNkTv77M2dSO8y6hoqj7Oe3LuKBFMgHCJFSXLJB8HNiygs/v1b86', NULL, ''),
(30, 'test', 12, 'ameny@gmail.com', '$2b$10$yTcQEESJfC4L.31hF7G1keTwVHz0ktVY4yCMXKAsa9.B3dx5Ndfoq', NULL, ''),
(31, 'test', 12, 'ameny@gmail.com', '$2b$10$PTIuqpwFfPvgPXurnZd9beeG6j5vcdWz.mdn8CPocCZvU95LhNTH.', NULL, ''),
(32, 'test', 12, 'ameny@gmail.com', '$2b$10$1NXpFN.nkYWC4tHOm9FEguQ2qp5IzMcc0D2z4.W6T7MbVOxxlBpgG', NULL, ''),
(33, 'test', 12, 'ameny@gmail.com', '$2b$10$5Zv.gupAHiwxbiOMvBEu4uvekUdgozOcTQWPYCclyS3sjpZ6sCrL2', NULL, ''),
(34, 'test', 12, 'ameny@gmail.com', '$2b$10$5Zv.gupAHiwxbiOMvBEu4uvekUdgozOcTQWPYCclyS3sjpZ6sCrL2', NULL, ''),
(37, 'test', 12, 'ameny@gmail.com', '$2b$10$sfHquVfCs.E0wLdXMC848urKCAvGrXrQqsA2unaf/GozEg2XoNIie', NULL, ''),
(38, 'test', 12, 'ameny@gmail.com', '$2b$10$awHTm.wdLymBYRVxbPHIJenqEKb3dXuT9KCX3OPrH0s8acRfB/M2m', NULL, ''),
(39, 'test', 12, 'ameny@gmail.com', '$2b$10$t8F7Qn.HjO6RCAP/8oH9l.g5lWRDr6zUMu4TojzMQjeTHWHZZ3BnC', 8, ''),
(40, 'test', 12, 'ameny@gmail.com', '$2b$10$C/1HpBk95kBOH13Z13CG9ucols5Ue/jMZPWQWxemHPtpXLzVWX9si', NULL, ''),
(41, 'test', 12, 'ameny@gmail.com', '$2b$10$2a7TY7WsmqqYXsSRip/enOv.o82GaYFl1kgKqJEwo7qilR6b3szmy', NULL, ''),
(42, 'test', 12, 'ameny@gmail.com', '$2b$10$2sBfCt82QUEpAFMWzWiEE.J.rgS48p35Bkcyq8XQF8HSb2jAMvdZ2', NULL, ''),
(43, 'test', 12, 'ameny@gmail.com', '$2b$10$XMqXGPCdFglA5WSwmOBlguLEBmf1Re6QtlhglyYbrLKWug1FBV2b.', NULL, ''),
(44, 'test', 12, 'ameny@gmail.com', '$2b$10$Ph0HZa1.6FL78i8gvtZKpOsPMDlxfbTR4/RR30am4l2LwRd3nzGpe', NULL, ''),
(45, 'test', 12, 'ameny@gmail.com', '$2b$10$iNenoEVaTmI5eh5XPXjreebb06.EK90RPaJfWfWrEGRDElBkrhLHi', NULL, '');

-- --------------------------------------------------------

--
-- Structure de la table `user_tasks`
--

DROP TABLE IF EXISTS `user_tasks`;
CREATE TABLE IF NOT EXISTS `user_tasks` (
  `id_user_task` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `id_tasks` int NOT NULL,
  PRIMARY KEY (`id_user_task`),
  KEY `id_tasks` (`id_tasks`),
  KEY `users_id` (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `user_tasks`
--

INSERT INTO `user_tasks` (`id_user_task`, `id_user`, `id_tasks`) VALUES
(9, 45, 10);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `categorie_id` FOREIGN KEY (`category`) REFERENCES `category` (`id_categorie`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `tasks_id` FOREIGN KEY (`tasks_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `user_tasks`
--
ALTER TABLE `user_tasks`
  ADD CONSTRAINT `id_tasks` FOREIGN KEY (`id_tasks`) REFERENCES `tasks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `users_id` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
