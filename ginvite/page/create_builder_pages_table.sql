-- Migration: create builder_pages table
-- Run this on the MySQL server where ginvite lives

CREATE TABLE IF NOT EXISTS `builder_pages` (
    `id`          INT UNSIGNED     NOT NULL AUTO_INCREMENT,
    `user_id`     INT UNSIGNED     NOT NULL,
    `slug`        VARCHAR(120)     NOT NULL,
    `event_type`  VARCHAR(30)      NOT NULL DEFAULT 'custom'
                      COMMENT 'pernikahan | ulang_tahun | khitanan | custom',
    `page_title`  VARCHAR(255)     NOT NULL DEFAULT '',
    `page_data`   LONGTEXT         NOT NULL
                      COMMENT 'Full BuilderPage JSON',
    `status`      TINYINT(1)       NOT NULL DEFAULT 0
                      COMMENT '0=draft, 1=active',
    `expired`     DATETIME         NULL,
    `created_at`  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP
                                   ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    UNIQUE  KEY `uk_user_slug` (`user_id`, `slug`),
    INDEX   `idx_user_id`   (`user_id`),
    INDEX   `idx_slug`      (`slug`),
    INDEX   `idx_event_type`(`event_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
