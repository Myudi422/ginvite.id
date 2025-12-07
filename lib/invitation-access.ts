// lib/invitation-access.ts
export interface AccessInfo {
  access: boolean;
  access_type: 'owner' | 'shared' | 'none';
  can_edit: boolean;
  can_manage: boolean;
}

export async function checkInvitationAccess(
  invitationId: number, 
  userEmail: string, 
  accessType: 'edit' | 'manage' = 'edit'
): Promise<AccessInfo> {
  try {
    const res = await fetch(
      `https://ccgnimex.my.id/v2/android/ginvite/index.php?action=check_invitation_access&invitation_id=${invitationId}&user_email=${encodeURIComponent(userEmail)}&access_type=${accessType}`
    );
    
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    
    const json = await res.json();
    
    if (json.status === 'success') {
      return {
        access: json.access,
        access_type: json.access_type,
        can_edit: json.can_edit,
        can_manage: json.can_manage
      };
    } else {
      throw new Error(json.message || 'Failed to check access');
    }
  } catch (error) {
    console.error('Error checking invitation access:', error);
    return {
      access: false,
      access_type: 'none',
      can_edit: false,
      can_manage: false
    };
  }
}