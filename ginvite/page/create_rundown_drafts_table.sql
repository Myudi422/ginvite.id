-- Table untuk menyimpan draft rundown undangan
CREATE TABLE rundown_drafts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    invitation_title VARCHAR(255) NOT NULL,
    rundown_data TEXT, -- JSON data untuk menyimpan rundown items
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_invitation_rundown (user_id, invitation_title)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;