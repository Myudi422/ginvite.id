'use client';

import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';

interface ShareUser {
  id: number;
  shared_email: string;
  can_edit: number;
  can_manage: number;
  created_at: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  invitation: {
    id: number;
    title: string;
  };
  userId: number;
}

export default function ManageSharesModal({ isOpen, onClose, invitation, userId }: Props) {
  const [shares, setShares] = useState<ShareUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchShares();
    }
  }, [isOpen]);

  const fetchShares = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://ccgnimex.my.id/v2/android/ginvite/index.php?action=get_invitation_shares&invitation_id=${invitation.id}&user_id=${userId}`
      );
      const json = await res.json();
      if (json.status === 'success') {
        setShares(json.data);
      }
    } catch (error) {
      console.error('Error fetching shares:', error);
    }
    setLoading(false);
  };

  const removeShare = async (shareId: number) => {
    setRemoving(shareId);
    try {
      const res = await fetch(
        `https://ccgnimex.my.id/v2/android/ginvite/index.php?action=remove_invitation_share`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ share_id: shareId, user_id: userId }),
        }
      );
      const json = await res.json();
      if (json.status === 'success') {
        setShares(prev => prev.filter(s => s.id !== shareId));
      }
    } catch (error) {
      console.error('Error removing share:', error);
    }
    setRemoving(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-6 shadow-lg max-w-lg w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-pink-700">Manage Akses</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <p className="text-pink-600 mb-4">
          Orang yang memiliki akses ke undangan <b>{invitation.title}</b>
        </p>

        <div className="overflow-y-auto max-h-60">
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : shares.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              Belum ada yang memiliki akses
            </div>
          ) : (
            <div className="space-y-3">
              {shares.map((share) => (
                <div
                  key={share.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-gray-700">{share.shared_email}</div>
                    <div className="text-xs text-gray-500">
                      {share.can_edit ? 'Edit' : ''} {share.can_edit && share.can_manage ? '& ' : ''} {share.can_manage ? 'Manage' : ''}
                    </div>
                  </div>
                  <button
                    onClick={() => removeShare(share.id)}
                    disabled={removing === share.id}
                    className="text-red-500 hover:text-red-600 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}