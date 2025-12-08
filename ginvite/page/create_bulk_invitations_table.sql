-- Table untuk menyimpan draft bulk undangan
CREATE TABLE bulk_invitations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    invitation_title VARCHAR(255) NOT NULL,
    names_list TEXT,
    template_text TEXT,
    checklist_data TEXT, -- JSON data untuk menyimpan status checklist
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_invitation (user_id, invitation_title)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;