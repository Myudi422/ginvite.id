'use server';

const BANK_API_URL = process.env.USER_MANAGE_API_URL || 'https://ccgnimex.my.id/v2/android/ginvite/index.php';

export interface BankTransferConfirmation {
  nominal: number;
  user_id: number;
  nama_pemberi: string;
}

/**
 * Submit bank transfer confirmation
 */
export async function submitBankTransfer(data: BankTransferConfirmation) {
  const res = await fetch(`${BANK_API_URL}?action=bank`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok || json.status !== 'success') {
    throw new Error(json.message || 'Terjadi kesalahan saat mengirim data.');
  }

  return json;
}
