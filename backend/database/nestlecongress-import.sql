/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
USE `nestlecongress-313539311e`;
DROP TABLE IF EXISTS `agenda_bookmarks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agenda_bookmarks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `agenda_session_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `agenda_bookmarks_user_id_agenda_session_id_unique` (`user_id`,`agenda_session_id`),
  KEY `agenda_bookmarks_agenda_session_id_foreign` (`agenda_session_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `agenda_bookmarks` DISABLE KEYS */;
INSERT INTO `agenda_bookmarks` VALUES (1,1,1),(2,1,2),(3,2,1),(4,2,2);
/*!40000 ALTER TABLE `agenda_bookmarks` ENABLE KEYS */;
DROP TABLE IF EXISTS `agenda_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agenda_sessions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `congress_day_id` bigint unsigned NOT NULL,
  `time` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `period` varchar(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tag` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `meta` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `agenda_sessions_congress_day_id_foreign` (`congress_day_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `agenda_sessions` DISABLE KEYS */;
INSERT INTO `agenda_sessions` VALUES (1,1,'08:30','AM','Keynote','Opening Ceremony','Main Auditorium',1,'2026-11-05 03:36:08','2026-11-05 03:36:08'),(2,1,'09:30','AM','Keynote','Welcome & Introduction','Dr. Hassan Ali',2,'2026-11-05 03:36:08','2026-11-05 03:36:08'),(3,1,'10:30','AM','Nutrition','Future of Pediatric Nutrition','Dr. Sarah Johnson',3,'2026-11-05 03:36:08','2026-11-05 03:36:08'),(4,1,'01:30','PM','Research','Clinical Trials Update','Hall B',4,'2026-11-05 03:36:08','2026-11-05 03:36:08'),(5,2,'09:00','AM','Keynote','Clinical Nutrition Forum','Hall B',5,'2026-11-05 03:36:08','2026-11-05 03:36:08'),(6,2,'11:00','AM','Research','Research Roundtable','Prof. Luis Ortega',6,'2026-11-05 03:36:08','2026-11-05 03:36:08'),(7,2,'02:00','PM','Nutrition','Pediatric Case Discussions','Dr. Mei Chen',7,'2026-11-05 03:36:08','2026-11-05 03:36:08');
/*!40000 ALTER TABLE `agenda_sessions` ENABLE KEYS */;
DROP TABLE IF EXISTS `api_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `api_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `api_tokens_token_unique` (`token`),
  KEY `api_tokens_user_id_foreign` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `api_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_tokens` ENABLE KEYS */;
DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
DROP TABLE IF EXISTS `congress_days`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `congress_days` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_label` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `heading` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtitle` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `congress_days_code_unique` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `congress_days` DISABLE KEYS */;
INSERT INTO `congress_days` VALUES (1,'d1','Day 1','May 22','Day 1 Schedule','Thursday, May 22, 2026',1,'2026-11-05 03:36:08','2026-11-05 03:36:08'),(2,'d2','Day 2','May 23','Day 2 Schedule','Friday, May 23, 2026',2,'2026-11-05 03:36:08','2026-11-05 03:36:08');
/*!40000 ALTER TABLE `congress_days` ENABLE KEYS */;
DROP TABLE IF EXISTS `congress_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `congress_events` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `kicker` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `meta` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_short` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `congress_events` DISABLE KEYS */;
INSERT INTO `congress_events` VALUES (1,'FEATURED EVENT','The Next Era of\nNutrition & Health','May 22 – 23, 2026  ·  Dubai, UAE','22 – 23 May 2026','2026-11-05 03:36:08','2026-11-05 03:36:08');
/*!40000 ALTER TABLE `congress_events` ENABLE KEYS */;
DROP TABLE IF EXISTS `congress_notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `congress_notifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `body` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `congress_notifications` DISABLE KEYS */;
INSERT INTO `congress_notifications` VALUES (1,'Notifications','No new alerts. The congress opens May 22 in Dubai.','2026-11-05 03:36:08','2026-11-05 03:36:08');
/*!40000 ALTER TABLE `congress_notifications` ENABLE KEYS */;
DROP TABLE IF EXISTS `congress_resources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `congress_resources` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `kind` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `detail` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tint` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `congress_resources` DISABLE KEYS */;
INSERT INTO `congress_resources` VALUES (1,'PDF','Congress Scientific Program','Complete schedule and session details','4.2 MB','document-text','#E85D4C',1,'2026-11-05 03:36:09','2026-11-05 03:36:09'),(2,'PDF','Pediatric Nutrition Guide','Clinical reference material','2.8 MB','document-text','#3B82F6',2,'2026-11-05 03:36:09','2026-11-05 03:36:09'),(3,'Slides','Keynote Presentation','The Next Era of Nutrition & Health','6.4 MB','easel','#E2B03A',3,'2026-11-05 03:36:09','2026-11-05 03:36:09'),(4,'Videos','Opening Ceremony Replay','Hall A recording','48 MB','play-circle','#7C5CFC',4,'2026-11-05 03:36:09','2026-11-05 03:36:09');
/*!40000 ALTER TABLE `congress_resources` ENABLE KEYS */;
DROP TABLE IF EXISTS `exhibitor_saves`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exhibitor_saves` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `exhibitor_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `exhibitor_saves_user_id_exhibitor_id_unique` (`user_id`,`exhibitor_id`),
  KEY `exhibitor_saves_exhibitor_id_foreign` (`exhibitor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `exhibitor_saves` DISABLE KEYS */;
INSERT INTO `exhibitor_saves` VALUES (1,1,1),(2,2,1);
/*!40000 ALTER TABLE `exhibitor_saves` ENABLE KEYS */;
DROP TABLE IF EXISTS `exhibitors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exhibitors` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `booth` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `focus` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `exhibitors` DISABLE KEYS */;
INSERT INTO `exhibitors` VALUES (1,'Nestlé Health Science','Booth A12','Clinical nutrition',1,'2026-11-05 03:36:09','2026-11-05 03:36:09'),(2,'Gulf Medical Labs','Booth B04','Diagnostics',2,'2026-11-05 03:36:09','2026-11-05 03:36:09'),(3,'Pediatric Care Co.','Booth C18','Feeding systems',3,'2026-11-05 03:36:09','2026-11-05 03:36:09'),(4,'Metabolic Insights','Booth D02','Research tools',4,'2026-11-05 03:36:09','2026-11-05 03:36:09');
/*!40000 ALTER TABLE `exhibitors` ENABLE KEYS */;
DROP TABLE IF EXISTS `facilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facilities` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `venue_id` bigint unsigned NOT NULL,
  `label` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `facilities_venue_id_foreign` (`venue_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `facilities` DISABLE KEYS */;
INSERT INTO `facilities` VALUES (1,1,'Free Wi-Fi','wifi',1),(2,1,'Parking','car-sport',2),(3,1,'Catering','restaurant',3),(4,1,'Accessible','accessibility',4);
/*!40000 ALTER TABLE `facilities` ENABLE KEYS */;
DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_11_04_120000_create_congress_tables',1),(5,'2026_11_04_130000_create_api_tokens_table',1),(6,'2026_11_04_140000_add_bio_to_speakers',1),(7,'2026_11_04_150000_add_coordinates_to_venues',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
DROP TABLE IF EXISTS `poll_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `poll_options` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `poll_id` bigint unsigned NOT NULL,
  `label` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `votes` int unsigned NOT NULL DEFAULT '0',
  `sort` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `poll_options_poll_id_foreign` (`poll_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `poll_options` DISABLE KEYS */;
INSERT INTO `poll_options` VALUES (1,1,'Excellent',55,1),(2,1,'Very Good',31,2),(3,1,'Good',10,3),(4,2,'Pediatric nutrition',40,1),(5,2,'Clinical practice',28,2),(6,2,'Research methods',18,3);
/*!40000 ALTER TABLE `poll_options` ENABLE KEYS */;
DROP TABLE IF EXISTS `poll_votes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `poll_votes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `poll_id` bigint unsigned NOT NULL,
  `poll_option_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `poll_votes_user_id_poll_id_unique` (`user_id`,`poll_id`),
  KEY `poll_votes_poll_id_foreign` (`poll_id`),
  KEY `poll_votes_poll_option_id_foreign` (`poll_option_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `poll_votes` DISABLE KEYS */;
INSERT INTO `poll_votes` VALUES (1,1,1,2),(2,2,1,2);
/*!40000 ALTER TABLE `poll_votes` ENABLE KEYS */;
DROP TABLE IF EXISTS `polls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `polls` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tag` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `question` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `polls` DISABLE KEYS */;
INSERT INTO `polls` VALUES (1,'Audience Feedback','How would you rate the current session?',1,'2026-11-05 03:36:08','2026-11-05 03:36:08'),(2,'Session Topic','Which topic should the panel go deeper on?',2,'2026-11-05 03:36:08','2026-11-05 03:36:08');
/*!40000 ALTER TABLE `polls` ENABLE KEYS */;
DROP TABLE IF EXISTS `question_upvotes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question_upvotes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `question_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `question_upvotes_user_id_question_id_unique` (`user_id`,`question_id`),
  KEY `question_upvotes_question_id_foreign` (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `question_upvotes` DISABLE KEYS */;
/*!40000 ALTER TABLE `question_upvotes` ENABLE KEYS */;
DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `author_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `topic` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `votes` int unsigned NOT NULL DEFAULT '0',
  `body` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `bucket` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `questions_user_id_foreign` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (1,NULL,'Dr. Ahmed','Nutrition','Answered',24,'How can pediatric nutrition plans be personalized for children with different growth patterns?','Recent',1,'2026-11-05 03:36:09','2026-11-05 03:36:09'),(2,NULL,'Dr. Sarah Johnson','Research','Answered',18,'Which outcome measures should we track in a 12-week feeding study?','Popular',2,'2026-11-05 03:36:09','2026-11-05 03:36:09'),(3,1,'Dr. Testing','General','Open',9,'Will session slides be available the same day?','Popular',3,'2026-11-05 03:36:09','2026-11-05 03:36:09');
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
DROP TABLE IF EXISTS `resource_saves`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resource_saves` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `congress_resource_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `resource_saves_user_id_congress_resource_id_unique` (`user_id`,`congress_resource_id`),
  KEY `resource_saves_congress_resource_id_foreign` (`congress_resource_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `resource_saves` DISABLE KEYS */;
INSERT INTO `resource_saves` VALUES (1,1,1),(2,1,2),(3,2,1),(4,2,2);
/*!40000 ALTER TABLE `resource_saves` ENABLE KEYS */;
DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
DROP TABLE IF EXISTS `speaker_favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `speaker_favorites` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `speaker_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `speaker_favorites_user_id_speaker_id_unique` (`user_id`,`speaker_id`),
  KEY `speaker_favorites_speaker_id_foreign` (`speaker_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `speaker_favorites` DISABLE KEYS */;
/*!40000 ALTER TABLE `speaker_favorites` ENABLE KEYS */;
DROP TABLE IF EXISTS `speakers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `speakers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `place` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `talk` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `field` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `initials` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL,
  `featured` tinyint(1) NOT NULL DEFAULT '0',
  `color_start` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `color_end` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `speakers` DISABLE KEYS */;
INSERT INTO `speakers` VALUES (1,'Dr. Sarah Johnson','Pediatric Nutrition Specialist','United Kingdom','Future of Pediatric Nutrition','Pediatrics','SJ',1,'#7ED0A0','#F2C14E',1,'2026-11-05 03:36:08','2026-11-05 03:36:08','Pediatric nutrition specialist from the United Kingdom. She leads clinic programs on growth, feeding, and early-life nutrition.'),(2,'Dr. Hassan Ali','Clinical Research Director','UAE','Welcome & Introduction','Research','HA',0,'#5B8DEF','#7EB6FF',2,'2026-11-05 03:36:08','2026-11-05 03:36:08','Clinical research director based in the UAE. He opens the congress and connects new studies with everyday medical practice.'),(3,'Dr. Ahmed Khalid','Gastroenterology Consultant','UAE','Nutrition Across Care Settings','Nutrition','AK',0,'#8B7CFF','#B7A6FF',3,'2026-11-05 03:36:08','2026-11-05 03:36:08','Gastroenterology consultant in Dubai. His work covers nutrition across hospital, clinic, and long-term care settings.'),(4,'Dr. Mei Chen','Pediatric Feeding Lead','Singapore','Growth Patterns in Clinic','Pediatrics','MC',0,'#F08AAE','#F6C1D4',4,'2026-11-05 03:36:08','2026-11-05 03:36:08','Pediatric feeding lead from Singapore. She works with families on growth patterns and practical feeding plans.'),(5,'Prof. Luis Ortega','Metabolic Health','Spain','Research Roundtable','Research','LO',0,'#48C2C8','#8FE3E0',5,'2026-11-05 03:36:08','2026-11-05 03:36:08','Metabolic health researcher from Spain. He chairs the research roundtable on clinical trials and metabolic care.');
/*!40000 ALTER TABLE `speakers` ENABLE KEYS */;
DROP TABLE IF EXISTS `tools`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tools` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tools_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `tools` DISABLE KEYS */;
INSERT INTO `tools` VALUES (1,'agenda','Agenda','View full congress schedule','Event','calendar-outline',1,'2026-11-05 03:36:08','2026-11-05 03:36:08'),(2,'speakers','Speakers','Explore global medical experts','Event','people-outline',2,'2026-11-05 03:36:08','2026-11-05 03:36:08'),(3,'nametag','Name Tag','Access your digital badge','Event','id-card-outline',3,'2026-11-05 03:36:08','2026-11-05 03:36:08'),(4,'venue','Venue','Location, facilities and directions','Event','location-outline',4,'2026-11-05 03:36:08','2026-11-05 03:36:08'),(5,'voting','Voting','Cast votes in live sessions','Interactive','stats-chart-outline',5,'2026-11-05 03:36:08','2026-11-05 03:36:08'),(6,'qa','Ask Q&A','Send questions to speakers','Interactive','chatbubble-ellipses-outline',6,'2026-11-05 03:36:08','2026-11-05 03:36:08'),(7,'resources','Resources','Slides, papers and downloads','Tools','folder-outline',7,'2026-11-05 03:36:08','2026-11-05 03:36:08'),(8,'exhibitors','Exhibitors','Browse congress exhibitors','Tools','briefcase-outline',8,'2026-11-05 03:36:08','2026-11-05 03:36:08');
/*!40000 ALTER TABLE `tools` ENABLE KEYS */;
DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `organization` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `badge_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role_title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `badge_role` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `initials` varchar(8) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sessions_count` int unsigned NOT NULL DEFAULT '0',
  `certificates_count` int unsigned NOT NULL DEFAULT '0',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Dr. Testing','dr.testing@congress.com',NULL,'$2y$12$7n0gVZxm7LRGm0XYgSm28eNuw7nbPS5quVpHtewUNy/E1Un2aIq/S','Nestlé Health Science','+971 50 100 2026','Dubai, UAE','NMC-2026-014','Medical Congress Attendee','Attendee','DT',12,3,NULL,'2026-11-05 03:36:08','2026-11-05 03:36:08'),(2,'Huda Latheef','huda@example.com',NULL,'$2y$12$TI9rMgcS7qQzIH41kfWeIeRfoZgifxc5pV6hAsQ/Lqq95zV4mD2Kq','Nestlé Health Science','+971 56 283 4212','Dubai, UAE','NMC-2026-001','Medical Congress Attendee','Flutter Developer · Attendee','HL',12,3,NULL,'2026-11-05 03:36:09','2026-11-05 03:36:09');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
DROP TABLE IF EXISTS `venues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `venues` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_label` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40000 ALTER TABLE `venues` DISABLE KEYS */;
INSERT INTO `venues` VALUES (1,'Dubai International\nConvention & Exhibition\nCenter','22 – 23 May 2026','World Trade Centre, Dubai,\nUnited Arab Emirates','2026-11-05 03:36:08','2026-11-05 03:36:08',25.2233460,55.2869340);
/*!40000 ALTER TABLE `venues` ENABLE KEYS */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

