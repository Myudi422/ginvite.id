'use server';

const BASE_URL = process.env.USER_MANAGE_API_URL || 'https://ccgnimex.my.id/v2/android/ginvite/index.php';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface WpSummary {
    budget_total: number;
    budget_spent: number;
    vendor_count: number;
    vendor_lunas?: number;
    vendor_booking?: number;
    admin_done: number;
    admin_total: number;
    seragam_total_pcs?: number;
    seragam_total_biaya?: number;
    seserahan_total?: number;
    seserahan_bought?: number;
    seserahan_est?: number;
}

export interface BudgetItem {
    id: number;
    category: string;
    item_name: string;
    budget_amount: number;
    actual_amount: number;
    note?: string;
}

export interface SavingsEntry {
    id: number;
    entry_date: string;
    amount: number;
    note?: string;
}

export interface Vendor {
    id: number;
    vendor_name: string;
    category: string;
    price: number;
    contact?: string;
    status: 'survey' | 'booking' | 'dp' | 'lunas';
    note?: string;
}

export interface AdminTask {
    id: number;
    task_name: string;
    is_done: boolean;
    due_date?: string;
}

export interface SeragamItem {
    id: number;
    kelompok: string;
    warna?: string;
    bahan?: string;
    jumlah: number;
    biaya_per_pcs: number;
    note?: string;
}

export interface SeserahanItem {
    id: number;
    item_name: string;
    estimasi_harga: number;
    is_bought: boolean;
    note?: string;
}

// ─── Generic API Helper ───────────────────────────────────────────────────────

async function wpFetch<T>(
    action: string,
    method: 'GET' | 'POST' | 'DELETE' = 'GET',
    body?: Record<string, unknown>,
    params?: Record<string, string>
): Promise<T> {
    const url = new URL(BASE_URL);
    url.searchParams.set('action', 'wedding_planner');
    url.searchParams.set('type', action);
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

    const res = await fetch(url.toString(), {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
        cache: 'no-store',
        signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.status !== 'success') throw new Error(json.message || 'Gagal memproses permintaan');
    return json.data as T;
}

// ─── Summary ─────────────────────────────────────────────────────────────────

export async function getWpSummary(userId: string | number, invitationTitle: string): Promise<WpSummary> {
    return wpFetch<WpSummary>('summary', 'GET', undefined, {
        user_id: String(userId),
        invitation_title: invitationTitle,
    });
}

// ─── Budget Breakdown (auto-aggregated dari semua modul) ──────────────────────

export interface BudgetSection {
    source: string;
    label: string;
    total: number;
    items: Record<string, unknown>[];
}

export interface BudgetBreakdown {
    budget_total: number;
    total_spent: number;
    sections: BudgetSection[];
}

export async function getFullBudgetBreakdown(userId: string | number, invitationTitle: string): Promise<BudgetBreakdown> {
    return wpFetch('budget_breakdown', 'GET', undefined, { user_id: String(userId), invitation_title: invitationTitle });
}

export async function saveBudgetTotal(userId: string | number, invitationTitle: string, budgetTotal: number) {
    return wpFetch('budget_total', 'POST', { user_id: userId, invitation_title: invitationTitle, budget_total: budgetTotal });
}

// misc "Lainnya" items that don't belong to other modules
export async function addMiscBudgetItem(userId: string | number, invitationTitle: string, item: Omit<BudgetItem, 'id'>) {
    return wpFetch('budget', 'POST', { user_id: userId, invitation_title: invitationTitle, ...item });
}

export async function deleteMiscBudgetItem(id: number) {
    return wpFetch('budget', 'DELETE', { id });
}

// ─── Tabungan ─────────────────────────────────────────────────────────────────
// (removed — use budget tracking instead)

// ─── Vendor ───────────────────────────────────────────────────────────────────

export async function getVendors(userId: string | number, invitationTitle: string): Promise<Vendor[]> {
    return wpFetch('vendors', 'GET', undefined, { user_id: String(userId), invitation_title: invitationTitle });
}

export async function addVendor(userId: string | number, invitationTitle: string, vendor: Omit<Vendor, 'id'>) {
    return wpFetch('vendors', 'POST', { user_id: userId, invitation_title: invitationTitle, ...vendor });
}

export async function updateVendor(vendor: Vendor) {
    return wpFetch('vendors_update', 'POST', { ...vendor });
}

export async function deleteVendor(id: number) {
    return wpFetch('vendors', 'DELETE', { id });
}

// ─── Administrasi ─────────────────────────────────────────────────────────────

export async function getAdminTasks(userId: string | number, invitationTitle: string): Promise<AdminTask[]> {
    return wpFetch('admin_tasks', 'GET', undefined, { user_id: String(userId), invitation_title: invitationTitle });
}

export async function addAdminTask(userId: string | number, invitationTitle: string, task: Omit<AdminTask, 'id'>) {
    return wpFetch('admin_tasks', 'POST', { user_id: userId, invitation_title: invitationTitle, ...task });
}

export async function toggleAdminTask(id: number, isDone: boolean) {
    return wpFetch('admin_tasks_toggle', 'POST', { id, is_done: isDone ? 1 : 0 });
}

export async function deleteAdminTask(id: number) {
    return wpFetch('admin_tasks', 'DELETE', { id });
}

// ─── Seragam ──────────────────────────────────────────────────────────────────

export async function getSeragamItems(userId: string | number, invitationTitle: string): Promise<SeragamItem[]> {
    return wpFetch('seragam', 'GET', undefined, { user_id: String(userId), invitation_title: invitationTitle });
}

export async function addSeragamItem(userId: string | number, invitationTitle: string, item: Omit<SeragamItem, 'id'>) {
    return wpFetch('seragam', 'POST', { user_id: userId, invitation_title: invitationTitle, ...item });
}

export async function updateSeragamItem(item: SeragamItem) {
    return wpFetch('seragam_update', 'POST', { ...item });
}

export async function deleteSeragamItem(id: number) {
    return wpFetch('seragam', 'DELETE', { id });
}

// ─── Seserahan ────────────────────────────────────────────────────────────────

export async function getSeserahanItems(userId: string | number, invitationTitle: string): Promise<SeserahanItem[]> {
    return wpFetch('seserahan', 'GET', undefined, { user_id: String(userId), invitation_title: invitationTitle });
}

export async function addSeserahanItem(userId: string | number, invitationTitle: string, item: Omit<SeserahanItem, 'id'>) {
    return wpFetch('seserahan', 'POST', { user_id: userId, invitation_title: invitationTitle, ...item });
}

export async function updateSeserahanItem(item: SeserahanItem) {
    return wpFetch('seserahan_update', 'POST', { ...item });
}

export async function toggleSeserahanItem(id: number, isBought: boolean) {
    return wpFetch('seserahan_toggle', 'POST', { id, is_bought: isBought ? 1 : 0 });
}

export async function deleteSeserahanItem(id: number) {
    return wpFetch('seserahan', 'DELETE', { id });
}
