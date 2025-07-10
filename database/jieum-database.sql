-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: jieum
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `category_id_UNIQUE` (`category_id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'ITT',1),(2,'IT',0),(3,'Design',1),(4,'마케팅',1),(5,'디자인',0);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `writer_id` int NOT NULL,
  `idea_id` int NOT NULL,
  `content` text NOT NULL,
  PRIMARY KEY (`comment_id`),
  UNIQUE KEY `comment_id_UNIQUE` (`comment_id`),
  KEY `writer_id_idx` (`writer_id`),
  KEY `idea_id_idx` (`idea_id`),
  CONSTRAINT `comment_idea_id` FOREIGN KEY (`idea_id`) REFERENCES `ideas` (`idea_id`),
  CONSTRAINT `comment_writer_id` FOREIGN KEY (`writer_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ideas`
--

DROP TABLE IF EXISTS `ideas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ideas` (
  `idea_id` int NOT NULL AUTO_INCREMENT,
  `writer_id` int NOT NULL,
  `category_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `date` date NOT NULL DEFAULT (curdate()),
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `view_count` int NOT NULL DEFAULT '0',
  `scrap_count` int NOT NULL DEFAULT '0',
  `comment_count` int NOT NULL DEFAULT '0',
  `deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`idea_id`),
  UNIQUE KEY `idea_id_UNIQUE` (`idea_id`),
  KEY `user_id_idx` (`writer_id`),
  KEY `category_id_idx` (`category_id`),
  CONSTRAINT `category_id` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`),
  CONSTRAINT `idea_writer_id` FOREIGN KEY (`writer_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ideas`
--

LOCK TABLES `ideas` WRITE;
/*!40000 ALTER TABLE `ideas` DISABLE KEYS */;
INSERT INTO `ideas` VALUES (1,4,2,'아이디어 공유 플랫폼','서로의 아이디어를 공유할 수 있는 플랫폼을 만드는 중','2025-07-02','2025-07-02 06:37:51',0,0,1,0),(2,4,2,'아이디어 공유 플랫폼','서로의 아이디어를 공유할 수 있는 플랫폼을 만드는 중','2025-07-07','2025-07-07 03:11:14',0,0,0,1),(3,4,2,'아이디어 공유 플랫폼','서로의 아이디어를 공유할 수 있는 플랫폼을 만드는 중','2025-07-07','2025-07-07 03:31:51',0,0,0,1),(4,4,2,'아이디어 공유 플랫폼','서로의 아이디어를 공유할 수 있는 플랫폼을 만드는 중','2025-07-07','2025-07-07 03:39:12',0,0,0,1),(5,4,2,'아이디어 공유 플랫폼','서로의 아이디어를 공유할 수 있는 플랫폼을 만드는 중','2025-07-07','2025-07-07 03:42:05',0,0,0,1),(6,4,2,'아이디어 공유 플랫폼','서로의 아이디어를 공유할 수 있는 플랫폼을 만드는 중','2025-07-07','2025-07-07 03:42:39',0,0,0,1),(7,4,2,'아이디어 공유 플랫폼','서로의 아이디어를 공유할 수 있는 플랫폼을 만드는 중','2025-07-07','2025-07-07 03:44:06',0,0,0,0),(8,4,2,'아이디어 공유 플랫폼','서로의 아이디어를 공유할 수 있는 플랫폼을 만드는 중','2025-07-07','2025-07-07 03:48:17',1,0,0,0),(9,4,2,'아이디어 공유 플랫폼','서로의 아이디어를 공유할 수 있는 플랫폼을 만드는 중','2025-07-10','2025-07-10 10:16:56',0,0,0,1),(10,4,5,'아이디어 공유 플랫폼','서로의 아이디어를 공유할 수 있는 플랫폼을 만드는 중','2025-07-10','2025-07-10 10:46:40',0,0,0,0);
/*!40000 ALTER TABLE `ideas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ideas_tags`
--

DROP TABLE IF EXISTS `ideas_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ideas_tags` (
  `idea_tag_id` int NOT NULL AUTO_INCREMENT,
  `idea_id` int NOT NULL,
  `tag_id` int NOT NULL,
  PRIMARY KEY (`idea_tag_id`),
  UNIQUE KEY `idea_tag_id_UNIQUE` (`idea_tag_id`),
  KEY `idea_id_idx` (`idea_id`),
  KEY `tag_id_idx` (`tag_id`),
  CONSTRAINT `idea_id` FOREIGN KEY (`idea_id`) REFERENCES `ideas` (`idea_id`),
  CONSTRAINT `tag_id` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`tag_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ideas_tags`
--

LOCK TABLES `ideas_tags` WRITE;
/*!40000 ALTER TABLE `ideas_tags` DISABLE KEYS */;
INSERT INTO `ideas_tags` VALUES (2,7,1),(3,7,2),(4,8,1),(5,8,2),(10,10,1);
/*!40000 ALTER TABLE `ideas_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inquiries`
--

DROP TABLE IF EXISTS `inquiries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inquiries` (
  `inquiry_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `status` enum('processing','completed') NOT NULL DEFAULT 'processing',
  `deleted` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`inquiry_id`),
  UNIQUE KEY `inquiry_id_UNIQUE` (`inquiry_id`),
  KEY `user_id_idx` (`user_id`),
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inquiries`
--

LOCK TABLES `inquiries` WRITE;
/*!40000 ALTER TABLE `inquiries` DISABLE KEYS */;
/*!40000 ALTER TABLE `inquiries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scraps`
--

DROP TABLE IF EXISTS `scraps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scraps` (
  `scrap_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `idea_id` int NOT NULL,
  PRIMARY KEY (`scrap_id`),
  UNIQUE KEY `scrap_id_UNIQUE` (`scrap_id`),
  KEY `scrap_user_id_idx` (`user_id`),
  KEY `scarp_idea_id_idx` (`idea_id`),
  CONSTRAINT `scarp_idea_id` FOREIGN KEY (`idea_id`) REFERENCES `ideas` (`idea_id`),
  CONSTRAINT `scrap_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scraps`
--

LOCK TABLES `scraps` WRITE;
/*!40000 ALTER TABLE `scraps` DISABLE KEYS */;
INSERT INTO `scraps` VALUES (2,4,8);
/*!40000 ALTER TABLE `scraps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `tag_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`tag_id`),
  UNIQUE KEY `tag_id_UNIQUE` (`tag_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (1,'컴퓨터'),(2,'아이디어'),(3,'힘들어'),(4,'디자인'),(5,'그림');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `role` enum('member','admin') NOT NULL DEFAULT 'member',
  `nickname` varchar(50) NOT NULL,
  `login_id` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `deleted` tinyint NOT NULL DEFAULT '0',
  `nickname_active` varchar(255) GENERATED ALWAYS AS (if((`deleted` = 0),`nickname`,NULL)) STORED,
  `login_id_active` varchar(255) GENERATED ALWAYS AS (if((`deleted` = 0),`login_id`,NULL)) STORED,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`),
  UNIQUE KEY `unique_nickname_active` (`nickname_active`),
  UNIQUE KEY `unique_login_id_active` (`login_id_active`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`user_id`, `role`, `nickname`, `login_id`, `password`, `deleted`) VALUES (3,'member','테스트','test','$2b$10$HOrAd8mAk1YymzLvprd8De3UV0PmS/gix9ZVV7IvPQKz/EYvZgT.K',1),(4,'admin','미소','miso','$2b$10$hH6HeR/lEsyov8qX38AqYe7i4pH3GGw6tYqp.WkfviXcA4DbPYI8u',0),(5,'member','화영','hwayoung','adminhwayoung',0),(9,'member','테스트','test','$2b$10$CBZPckieq3AEY029fFk4D.qVi39T26PJm1usHz879dYGkFDtBgxxy',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-10 21:12:16
