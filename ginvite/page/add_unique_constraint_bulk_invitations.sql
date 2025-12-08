-- Jika tabel sudah ada, jalankan query ini untuk menambah UNIQUE constraint
ALTER TABLE bulk_invitations ADD UNIQUE KEY unique_user_invitation (user_id, invitation_title);