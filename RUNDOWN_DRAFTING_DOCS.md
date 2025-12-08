# Rundown Drafting Implementation

## Overview
Implementasi sistem drafting untuk rundown undangan dengan konsep yang sama seperti bulk undangan. Sistem ini memungkinkan user untuk menyimpan draft rundown yang sedang dikerjakan dan memuat kembali untuk melanjutkan editing.

## Files Created

### 1. SQL Script
**File**: `ginvite/page/create_rundown_drafts_table.sql`
- Membuat tabel `rundown_drafts` dengan struktur:
  - `id`: Primary key
  - `user_id`: ID user
  - `invitation_title`: Judul undangan
  - `rundown_data`: JSON data rundown items
  - `created_at`, `updated_at`: Timestamp
  - Unique constraint pada `(user_id, invitation_title)`

### 2. PHP Endpoint
**File**: `ginvite/page/rundown_drafts.php`
- Handler untuk GET (load draft) dan POST (save draft)
- Validasi parameter `user_id` dan `invitation_title`
- Auto-update existing records atau insert new records
- Error handling dan JSON response

### 3. Next.js Actions
**File**: `app/actions/rundownDrafts.ts`
- `saveRundownDraft()`: Menyimpan draft ke server
- `loadRundownDraft()`: Memuat draft dari server
- `scheduleAutoSaveRundown()`: Auto-save dengan debouncing
- Cache mechanism untuk mencegah duplicate saves
- Timeout handling untuk network requests

## Usage Example

### 1. Di React Component:
```typescript
import { saveRundownDraft, loadRundownDraft } from '@/app/actions/rundownDrafts';

// Save draft
const handleSave = async () => {
  const result = await saveRundownDraft({
    user_id: userId,
    invitation_title: invitationTitle,
    rundown_data: JSON.stringify(rundownItems)
  });
  
  if (result.success) {
    console.log('Draft saved successfully');
  }
};

// Load draft
const handleLoad = async () => {
  try {
    const draft = await loadRundownDraft(userId, invitationTitle);
    if (draft) {
      const rundownItems = JSON.parse(draft.rundown_data);
      setRundownItems(rundownItems);
    }
  } catch (error) {
    console.error('Failed to load draft:', error);
  }
};
```

### 2. Auto-save Implementation:
```typescript
import { scheduleAutoSaveRundown } from '@/app/actions/rundownDrafts';

// Auto-save dengan debouncing
useEffect(() => {
  if (rundownItems.length > 0) {
    scheduleAutoSaveRundown({
      user_id: userId,
      invitation_title: invitationTitle,
      rundown_data: JSON.stringify(rundownItems)
    });
  }
}, [rundownItems, userId, invitationTitle]);
```

## Installation Steps

1. **✅ Jalankan SQL Script:**
   ```sql
   -- Eksekusi di database MySQL/MariaDB
   SOURCE ginvite/page/create_rundown_drafts_table.sql;
   ```

2. **✅ Verify Endpoint:**
   - Test GET: `GET /ginvite/index.php?action=rundown_drafts&user_id=1&invitation_title=test`
   - Test POST: `POST /ginvite/index.php?action=rundown_drafts`

3. **✅ Integration Complete:**
   - ✅ Actions imported di component rundown
   - ✅ Auto-save implemented dengan debouncing
   - ✅ Load draft pada component mount
   - ✅ Manual save button di header
   - ✅ Save status indicators
   - ✅ Loading states

## Features

### Backend Features:
- ✅ **Auto-save**: Menyimpan otomatis dengan debouncing (2 detik)
- ✅ **Cache mechanism**: Mencegah duplicate saves dalam 5 detik
- ✅ **Timeout handling**: Network timeout protection (10 detik)
- ✅ **Error handling**: Comprehensive error handling
- ✅ **Unique constraint**: Satu draft per user per invitation
- ✅ **JSON storage**: Flexible rundown data structure

### UI Features:
- ✅ **Loading indicators**: Memuat draft dan menyimpan
- ✅ **Save status**: Visual feedback (saving, saved, error)
- ✅ **Manual save button**: Tombol simpan manual di header
- ✅ **Last saved time**: Timestamp terakhir disimpan
- ✅ **Auto-load**: Memuat draft otomatis saat buka halaman
- ✅ **Smart save**: Hanya save jika ada content yang diisi

## API Response Format

### Success Response:
```json
{
  "status": "success",
  "message": "Draft rundown berhasil disimpan",
  "data": {
    "rundown_data": "...",
    "updated_at": "2024-12-08 10:30:00"
  }
}
```

### Error Response:
```json
{
  "status": "error",
  "message": "Parameter user_id dan invitation_title diperlukan"
}
```