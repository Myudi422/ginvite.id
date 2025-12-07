# Dokumentasi Integrasi WhatsApp Notification via Fonte API

## Overview
Sistem ini mengirim notifikasi WhatsApp otomatis kepada user setelah mereka berhasil membuat undangan. Notifikasi ini bertujuan untuk:
1. Mengucapkan terima kasih
2. Memberikan informasi detail undangan
3. Mendorong user untuk upgrade ke premium

## File Yang Ditambahkan

### 1. `api/wa_notification_helper.php`
Helper functions untuk mengirim notifikasi WhatsApp:
- `sendWhatsAppNotification($phoneNumber, $message)` - Mengirim pesan via Fonte API
- `generateInvitationCreatedMessage($userName, $slug, $category_id)` - Generate template pesan
- `sendInvitationNotification($pdo, $user_id, $slug, $category_id)` - Fungsi utama untuk mengirim notifikasi

### 2. `api/page/send_wa_notification.php`
Endpoint terpisah untuk mengirim notifikasi (jika diperlukan manual testing)

### 3. Modifikasi `api/add_content_user.php`
Ditambahkan pemanggilan fungsi notifikasi setelah undangan berhasil dibuat.

## Konfigurasi Fonte API

### Langkah Setup:
1. **Dapatkan Token Fonte:**
   - Daftar di https://fonnte.com/
   - Dapatkan token API dari dashboard
   - Hubungkan device WhatsApp Anda

2. **Update Token:**
   Ganti `YOUR_FONTE_TOKEN_HERE` di file `wa_notification_helper.php` dengan token asli Anda:
   ```php
   $fonteToken = 'your_actual_fonte_token';
   ```

3. **Test Koneksi:**
   Gunakan endpoint `api/page/send_wa_notification.php` untuk test manual.

## Template Pesan

Template pesan WhatsApp yang dikirim:
```
🎉 *Terima kasih sudah membuat undangan di Papunda.com!*

📋 *Detail Undangan Anda:*
• Kategori: [Pernikahan/Khitanan]
• Nama: [slug]
• Link: https://papunda.com/undang/[slug]

⚠️ *Penting!* Undangan Anda saat ini masih dalam mode *GRATIS* dengan fitur terbatas.

✨ *Upgrade ke Premium untuk mendapatkan:*
• ✅ RSVP & Konfirmasi Kehadiran
• 💰 Fitur Transfer/Amplop Digital
• 📱 QR Code Check-in
• 🎵 Custom Music
• 🖼️ Upload Foto Unlimited
• 🎨 Tema Premium
• 📊 Analytics Lengkap

💳 *Cara Aktivasi Premium:*
1. Login ke dashboard Anda
2. Klik menu "Edit" pada undangan
3. Pilih "Aktifkan Premium"
4. Selesaikan pembayaran

🤝 *Butuh bantuan?* Langsung chat kami di WhatsApp!

Salam hangat,
*Tim Papunda.com* 💖
```

## Format Nomor Telepon
Sistem secara otomatis memformat nomor telepon:
- `08123456789` → `6281123456789`
- `+6281123456789` → `6281123456789`
- `6281123456789` → `6281123456789`

## Error Handling
- Jika nomor WA user kosong, sistem akan skip notifikasi tanpa error
- Jika Fonte API gagal, error akan di-log tapi tidak mengganggu proses create undangan
- Semua error di-log ke error_log PHP

## Testing

### Manual Test:
```bash
curl -X POST https://your-domain.com/api/page/send_wa_notification.php \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 123,
    "slug": "pernikahan-test",
    "category_id": 2
  }'
```

### Test via Create Invitation:
1. Buat undangan baru melalui frontend
2. Check response API akan include `wa_notification` status
3. Check log untuk error jika ada

## Monitoring
- Monitor response `wa_notification` dalam API response
- Check PHP error logs untuk debugging
- Monitor delivery status di dashboard Fonte

## Customization
Untuk mengubah template pesan, edit function `generateInvitationCreatedMessage()` di `wa_notification_helper.php`.

## Troubleshooting

### Common Issues:
1. **Token Invalid:** Update token di `wa_notification_helper.php`
2. **Device Disconnected:** Reconnect WhatsApp device di dashboard Fonte
3. **Format Number Error:** Check format nomor di database users table
4. **Quota Exceeded:** Check quota di dashboard Fonte

### Debug Steps:
1. Check PHP error logs
2. Test manual via endpoint terpisah
3. Verify token dan device status di Fonte dashboard
4. Check database untuk memastikan nomor WA user tersedia