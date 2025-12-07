-- Step 1: Tambahkan kolom email ke tabel content_user jika belum ada
ALTER TABLE content_user 
ADD COLUMN email VARCHAR(255) NULL AFTER user_id;

-- Step 2: Tabel untuk sharing undangan by email
CREATE TABLE IF NOT EXISTS invitation_shares (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invitation_id INT NOT NULL,
    owner_user_id INT NOT NULL,
    shared_email VARCHAR(255) NOT NULL,
    can_edit TINYINT(1) DEFAULT 1,
    can_manage TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_invitation_id (invitation_id),
    INDEX idx_owner_user_id (owner_user_id),
    INDEX idx_shared_email (shared_email),
    UNIQUE KEY unique_share (invitation_id, shared_email)
);