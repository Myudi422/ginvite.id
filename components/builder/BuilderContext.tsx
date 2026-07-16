'use client';

import React, { createContext, useContext, useCallback, useReducer } from 'react';
import type { BuilderPage, BuilderSection, SectionType } from './types';
import { makeId, makeDefaultPage } from './defaults';
import { deleteImageFromBackblaze } from '@/app/actions/backblaze';

// ── State ─────────────────────────────────────────────────────────────────────
type BuilderState = {
  page: BuilderPage;
  selectedSectionId: string | null;
  viewMode: 'all' | 'opening' | 'inner';
  isDirty: boolean;
  saving: boolean;
  saveError: string | null;
  past: BuilderPage[];
  future: BuilderPage[];
  isLoading: boolean;
  connectionError: boolean;
  serverLoadFailed: boolean;
  sessionUploadedImages: string[];
  showQuickForm: boolean;
};

// ── Actions ───────────────────────────────────────────────────────────────────
type Action =
  | { type: 'SET_PAGE'; payload: BuilderPage }
  | { type: 'SELECT_SECTION'; id: string | null }
  | { type: 'SET_VIEW_MODE'; payload: 'all' | 'opening' | 'inner' }
  | { type: 'UPDATE_SECTION_PROPS'; id: string; props: Record<string, unknown> }
  | { type: 'TOGGLE_SECTION_VISIBILITY'; id: string }
  | { type: 'MOVE_SECTION'; fromIdx: number; toIdx: number }
  | { type: 'MOVE_SECTION_UP'; id: string }
  | { type: 'MOVE_SECTION_DOWN'; id: string }
  | { type: 'REORDER_GROUP'; group: 'opening' | 'inner'; ids: string[] }
  | { type: 'CHANGE_SECTION_GROUP'; id: string; group: 'opening' | 'inner' }
  | { type: 'ADD_SECTION'; section: BuilderSection }
  | { type: 'REMOVE_SECTION'; id: string }
  | { type: 'DUPLICATE_SECTION'; id: string }
  | { type: 'UPDATE_SECTION_LABEL'; id: string; label: string }
  | { type: 'UPDATE_STYLE'; style: Partial<BuilderPage['style']> }
  | { type: 'UPDATE_PAGE_META'; meta: Partial<Pick<BuilderPage, 'page_title' | 'event_type'>> }
  | { type: 'SET_SAVING'; saving: boolean }
  | { type: 'SET_SAVE_ERROR'; error: string | null }
  | { type: 'MARK_CLEAN'; payload?: BuilderPage }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET_PAGE' }
  | { type: 'IMPORT_PAGE'; payload: any }
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: BuilderPage }
  | { type: 'FETCH_FAILURE' }
  | { type: 'REGISTER_UPLOADED_IMAGE'; url: string }
  | { type: 'CLEAR_UPLOADED_IMAGES' }
  | { type: 'SET_SHOW_QUICK_FORM'; payload: boolean }
  | { type: 'UPDATE_BATCH'; payload: { sections: BuilderSection[]; style: Partial<BuilderPage['style']>; page_title?: string } };

// ── History Helper ────────────────────────────────────────────────────────────
function updatePageHistory(state: BuilderState, newPage: BuilderPage): BuilderState {
  if (JSON.stringify(state.page) === JSON.stringify(newPage)) {
    return { ...state, page: newPage };
  }
  const maxHistory = 50;
  const newPast = [...state.past, state.page].slice(-maxHistory);
  return {
    ...state,
    page: newPage,
    past: newPast,
    future: [],
    isDirty: true,
  };
}

function reducer(state: BuilderState, action: Action): BuilderState {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, page: action.payload, isDirty: false, past: [], future: [] };

    case 'SET_SHOW_QUICK_FORM':
      return { ...state, showQuickForm: action.payload };

    case 'UPDATE_BATCH': {
      const newPage = {
        ...state.page,
        sections: action.payload.sections,
        style: {
          ...state.page.style,
          ...action.payload.style,
        },
      };
      if (action.payload.page_title !== undefined) {
        newPage.page_title = action.payload.page_title;
      }
      return updatePageHistory(state, newPage);
    }

    case 'FETCH_START':
      return { ...state, isLoading: true, connectionError: false };

    case 'FETCH_SUCCESS':
      return {
        ...state,
        page: action.payload,
        isLoading: false,
        connectionError: false,
        serverLoadFailed: false,
        isDirty: false,
        past: [],
        future: [],
      };

    case 'FETCH_FAILURE':
      return { ...state, isLoading: false, connectionError: true };

    case 'SELECT_SECTION': {
      if (!action.id) {
        return { ...state, selectedSectionId: null };
      }
      const section = state.page.sections.find(s => s.id === action.id);
      let newViewMode = state.viewMode;
      if (section) {
        const group = section.group || (section.type === 'opening' ? 'opening' : 'inner');
        if (state.viewMode !== 'all' && state.viewMode !== group) {
          newViewMode = group as 'opening' | 'inner';
        }
      }
      return { ...state, selectedSectionId: action.id, viewMode: newViewMode };
    }

    case 'UPDATE_SECTION_PROPS': {
      const sections = state.page.sections.map(s =>
        s.id === action.id ? { ...s, props: { ...s.props, ...action.props } } : s
      );
      return updatePageHistory(state, { ...state.page, sections });
    }

    case 'TOGGLE_SECTION_VISIBILITY': {
      const sections = state.page.sections.map(s =>
        s.id === action.id ? { ...s, visible: !s.visible } : s
      );
      return updatePageHistory(state, { ...state.page, sections });
    }

    case 'MOVE_SECTION': {
      const sections = [...state.page.sections];
      const [moved] = sections.splice(action.fromIdx, 1);
      sections.splice(action.toIdx, 0, moved);
      const reordered = sections.map((s, i) => ({ ...s, order: i }));
      return updatePageHistory(state, { ...state.page, sections: reordered });
    }

    case 'MOVE_SECTION_UP': {
      const sections = [...state.page.sections].sort((a, b) => a.order - b.order);
      const idx = sections.findIndex(s => s.id === action.id);
      if (idx === -1) return state;
      const targetGroup = sections[idx].group || 'inner';
      // Cari elemen sebelumnya yang ada di grup yang sama
      let prevIdx = idx - 1;
      while (prevIdx >= 0 && (sections[prevIdx].group || 'inner') !== targetGroup) {
        prevIdx--;
      }
      if (prevIdx >= 0) {
        const temp = sections[idx].order;
        sections[idx].order = sections[prevIdx].order;
        sections[prevIdx].order = temp;
      }
      sections.sort((a, b) => a.order - b.order).forEach((s, i) => s.order = i);
      return updatePageHistory(state, { ...state.page, sections });
    }

    case 'MOVE_SECTION_DOWN': {
      const sections = [...state.page.sections].sort((a, b) => a.order - b.order);
      const idx = sections.findIndex(s => s.id === action.id);
      if (idx === -1) return state;
      const targetGroup = sections[idx].group || 'inner';
      // Cari elemen setelahnya yang ada di grup yang sama
      let nextIdx = idx + 1;
      while (nextIdx < sections.length && (sections[nextIdx].group || 'inner') !== targetGroup) {
        nextIdx++;
      }
      if (nextIdx < sections.length) {
        const temp = sections[idx].order;
        sections[idx].order = sections[nextIdx].order;
        sections[nextIdx].order = temp;
      }
      sections.sort((a, b) => a.order - b.order).forEach((s, i) => s.order = i);
      return updatePageHistory(state, { ...state.page, sections });
    }

    case 'REORDER_GROUP': {
      // Reorder items within the same group based on the provided IDs array.
      // Other groups remain untouched in their relative order.
      const sections = [...state.page.sections].sort((a, b) => a.order - b.order);
      const groupSections = sections.filter(s => (s.group || 'inner') === action.group);
      const otherSections = sections.filter(s => (s.group || 'inner') !== action.group);
      
      // Sort groupSections based on the action.ids order
      groupSections.sort((a, b) => {
        const indexA = action.ids.indexOf(a.id);
        const indexB = action.ids.indexOf(b.id);
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
      });
      
      const newSections = [...otherSections, ...groupSections].sort((a, b) => a.order - b.order);
      // We need to preserve the visual order by just assigning new sequential orders
      // Wait, if we want to preserve inter-group mixing (if any), it's complex.
      // Easiest is to assign orders such that groupSections follow their new relative order.
      const originalGroupOrders = groupSections.map(s => s.order).sort((a, b) => a - b);
      groupSections.forEach((s, i) => {
        s.order = originalGroupOrders[i];
      });
      
      sections.sort((a, b) => a.order - b.order).forEach((s, i) => s.order = i);
      return updatePageHistory(state, { ...state.page, sections });
    }

    case 'CHANGE_SECTION_GROUP': {
      const sections = state.page.sections.map(s =>
        s.id === action.id ? { ...s, group: action.group } : s
      );
      return updatePageHistory(state, { ...state.page, sections });
    }

    case 'ADD_SECTION': {
      const sections = [...state.page.sections, { ...action.section, order: state.page.sections.length }];
      const stateWithHistory = updatePageHistory(state, { ...state.page, sections });
      
      const group = action.section.group || (action.section.type === 'opening' ? 'opening' : 'inner');
      let newViewMode = state.viewMode;
      if (state.viewMode !== 'all' && state.viewMode !== group) {
        newViewMode = group as 'opening' | 'inner';
      }
      return { ...stateWithHistory, selectedSectionId: action.section.id, viewMode: newViewMode };
    }

    case 'DUPLICATE_SECTION': {
      const sortedSections = [...state.page.sections].sort((a, b) => a.order - b.order);
      const idx = sortedSections.findIndex(s => s.id === action.id);
      if (idx === -1) return state;
      
      const original = sortedSections[idx];
      
      // Smart suffixing: avoid "(Salinan) (Salinan)" recursive growth
      let newLabel = original.label;
      const match = original.label.match(/\(Salinan(?:\s+(\d+))?\)$/);
      if (match) {
        const num = match[1] ? parseInt(match[1], 10) + 1 : 2;
        newLabel = original.label.replace(/\s*\(Salinan(?:\s+\d+)?\)$/, ` (Salinan ${num})`);
      } else {
        newLabel = `${original.label} (Salinan)`;
      }

      const copied: BuilderSection = {
        id: makeId(),
        type: original.type,
        label: newLabel,
        visible: original.visible,
        order: original.order + 1,
        group: original.group || 'inner',
        props: JSON.parse(JSON.stringify(original.props || {})),
      };
      
      sortedSections.splice(idx + 1, 0, copied);
      const reordered = sortedSections.map((s, i) => ({ ...s, order: i }));
      
      const stateWithHistory = updatePageHistory(state, { ...state.page, sections: reordered });
      
      const group = copied.group || (copied.type === 'opening' ? 'opening' : 'inner');
      let newViewMode = state.viewMode;
      if (state.viewMode !== 'all' && state.viewMode !== group) {
        newViewMode = group as 'opening' | 'inner';
      }
      return { ...stateWithHistory, selectedSectionId: copied.id, viewMode: newViewMode };
    }

    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };

    case 'UPDATE_SECTION_LABEL': {
      const sections = state.page.sections.map(s =>
        s.id === action.id ? { ...s, label: action.label } : s
      );
      return updatePageHistory(state, { ...state.page, sections });
    }

    case 'REMOVE_SECTION': {
      const sections = state.page.sections
        .filter(s => s.id !== action.id)
        .map((s, i) => ({ ...s, order: i }));
      const selectedSectionId = state.selectedSectionId === action.id ? null : state.selectedSectionId;
      const stateWithHistory = updatePageHistory(state, { ...state.page, sections });
      return { ...stateWithHistory, selectedSectionId };
    }

    case 'UPDATE_STYLE':
      return updatePageHistory(state, { ...state.page, style: { ...state.page.style, ...action.style } });

    case 'UPDATE_PAGE_META':
      return updatePageHistory(state, { ...state.page, ...action.meta });

    case 'SET_SAVING':
      return { ...state, saving: action.saving };

    case 'SET_SAVE_ERROR':
      return { ...state, saveError: action.error };

    case 'MARK_CLEAN': {
      const savedPage = action.payload;
      if (savedPage && JSON.stringify(state.page) !== JSON.stringify(savedPage)) {
        return state;
      }
      return { ...state, isDirty: false };
    }

    case 'UNDO': {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, state.past.length - 1);
      return {
        ...state,
        page: previous,
        past: newPast,
        future: [state.page, ...state.future],
        isDirty: true,
      };
    }

    case 'REDO': {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      return {
        ...state,
        page: next,
        past: [...state.past, state.page],
        future: newFuture,
        isDirty: true,
      };
    }

    case 'RESET_PAGE': {
      const defaultPage = makeDefaultPage({
        slug: state.page.slug,
        user_id: state.page.user_id,
        event_type: state.page.event_type,
        page_title: state.page.page_title,
      });
      return updatePageHistory(state, defaultPage);
    }

    case 'REGISTER_UPLOADED_IMAGE': {
      if (state.sessionUploadedImages.includes(action.url)) return state;
      return {
        ...state,
        sessionUploadedImages: [...state.sessionUploadedImages, action.url]
      };
    }

    case 'CLEAR_UPLOADED_IMAGES': {
      return {
        ...state,
        sessionUploadedImages: []
      };
    }

    case 'IMPORT_PAGE': {
      const data = action.payload;
      if (!data || typeof data !== 'object') return state;

      const importedPage: BuilderPage = {
        ...state.page, // preserve current credentials/slug
        style: {
          ...state.page.style,
          ...(data.style || {}),
        },
        sections: (data.sections || []).map((s: any, i: number) => ({
          id: s.id || makeId(),
          type: s.type,
          label: s.label || s.type,
          visible: s.visible !== false,
          order: i,
          group: s.group || (s.type === 'opening' ? 'opening' : 'inner'),
          props: s.props || {},
        })),
      };

      return updatePageHistory(state, importedPage);
    }

    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────
interface BuilderContextValue {
  state: BuilderState;
  dispatch: React.Dispatch<Action>;
  isTemplate?: boolean;
  // helpers
  selectSection: (id: string | null) => void;
  setViewMode: (viewMode: 'all' | 'opening' | 'inner') => void;
  updateSectionProps: (id: string, props: Record<string, unknown>) => void;
  toggleSectionVisibility: (id: string) => void;
  moveSection: (fromIdx: number, toIdx: number) => void;
  moveSectionUp: (id: string) => void;
  moveSectionDown: (id: string) => void;
  reorderGroup: (group: 'opening' | 'inner', newOrderedIds: string[]) => void;
  changeSectionGroup: (id: string, group: 'opening' | 'inner') => void;
  addSection: (type: SectionType, label: string, props?: Record<string, unknown>, group?: 'opening' | 'inner') => void;
  removeSection: (id: string) => void;
  duplicateSection: (id: string) => void;
  updateSectionLabel: (id: string, label: string) => void;
  updateStyle: (style: Partial<BuilderPage['style']>) => void;
  updatePageMeta: (meta: Partial<Pick<BuilderPage, 'page_title' | 'event_type'>>) => void;
  undo: () => void;
  redo: () => void;
  resetPage: () => void;
  importPage: (data: any) => void;
  save: () => Promise<void>;
  retryLoad: () => Promise<void>;
  registerUploadedImage: (url: string) => void;
  setShowQuickForm: (show: boolean) => void;
  updateBatch: (payload: { sections: BuilderSection[]; style: Partial<BuilderPage['style']>; page_title?: string }) => void;
}

const BuilderContext = createContext<BuilderContextValue | null>(null);

export function BuilderProvider({
  initialPage,
  userId,
  serverLoadFailed = false,
  isTemplate = false,
  children,
}: {
  initialPage: BuilderPage;
  userId: number;
  serverLoadFailed?: boolean;
  isTemplate?: boolean;
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, {
    page: initialPage,
    selectedSectionId: null,
    viewMode: 'all',
    isDirty: false,
    saving: false,
    saveError: null,
    past: [],
    future: [],
    isLoading: false,
    connectionError: serverLoadFailed,
    serverLoadFailed: serverLoadFailed,
    sessionUploadedImages: [],
    showQuickForm: false,
  });

  const selectSection = useCallback((id: string | null) => dispatch({ type: 'SELECT_SECTION', id }), []);
  const setViewMode = useCallback((viewMode: 'all' | 'opening' | 'inner') => dispatch({ type: 'SET_VIEW_MODE', payload: viewMode }), []);
  const updateSectionProps = useCallback((id: string, props: Record<string, unknown>) => dispatch({ type: 'UPDATE_SECTION_PROPS', id, props }), []);
  const toggleSectionVisibility = useCallback((id: string) => dispatch({ type: 'TOGGLE_SECTION_VISIBILITY', id }), []);
  const moveSection = useCallback((fromIdx: number, toIdx: number) => dispatch({ type: 'MOVE_SECTION', fromIdx, toIdx }), []);
  const moveSectionUp = useCallback((id: string) => dispatch({ type: 'MOVE_SECTION_UP', id }), []);
  const moveSectionDown = useCallback((id: string) => dispatch({ type: 'MOVE_SECTION_DOWN', id }), []);
  const reorderGroup = useCallback((group: 'opening' | 'inner', ids: string[]) => dispatch({ type: 'REORDER_GROUP', group, ids }), []);
  const changeSectionGroup = useCallback((id: string, group: 'opening' | 'inner') => dispatch({ type: 'CHANGE_SECTION_GROUP', id, group }), []);

  const addSection = useCallback((type: SectionType, label: string, props: Record<string, unknown> = {}, group?: 'opening' | 'inner') => {
    const section: BuilderSection = {
      id: makeId(),
      type,
      label,
      visible: true,
      order: 0,
      group: group || (type === 'opening' ? 'opening' : 'inner'),
      props,
    };
    dispatch({ type: 'ADD_SECTION', section });
  }, []);

  const removeSection = useCallback((id: string) => dispatch({ type: 'REMOVE_SECTION', id }), []);
  const duplicateSection = useCallback((id: string) => dispatch({ type: 'DUPLICATE_SECTION', id }), []);
  const updateSectionLabel = useCallback((id: string, label: string) => dispatch({ type: 'UPDATE_SECTION_LABEL', id, label }), []);
  const updateStyle = useCallback((style: Partial<BuilderPage['style']>) => dispatch({ type: 'UPDATE_STYLE', style }), []);
  const updatePageMeta = useCallback((meta: Partial<Pick<BuilderPage, 'page_title' | 'event_type'>>) => dispatch({ type: 'UPDATE_PAGE_META', meta }), []);
  
  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const redo = useCallback(() => dispatch({ type: 'REDO' }), []);
  
  const resetPage = useCallback(async () => {
    const imagesToDelete = [...state.sessionUploadedImages];
    if (imagesToDelete.length > 0) {
      Promise.all(
        imagesToDelete.map(async (url) => {
          try {
            await deleteImageFromBackblaze(url);
            console.log("Successfully deleted uploaded image on page reset:", url);
          } catch (err) {
            console.warn("Failed to delete image on page reset:", url, err);
          }
        })
      );
    }
    dispatch({ type: 'RESET_PAGE' });
    dispatch({ type: 'CLEAR_UPLOADED_IMAGES' });
  }, [state.sessionUploadedImages]);

  const registerUploadedImage = useCallback((url: string) => dispatch({ type: 'REGISTER_UPLOADED_IMAGE', url }), []);

  const setShowQuickForm = useCallback((show: boolean) => dispatch({ type: 'SET_SHOW_QUICK_FORM', payload: show }), []);
  const updateBatch = useCallback((payload: { sections: BuilderSection[]; style: Partial<BuilderPage['style']>; page_title?: string }) => dispatch({ type: 'UPDATE_BATCH', payload }), []);

  const importPage = useCallback((data: any) => dispatch({ type: 'IMPORT_PAGE', payload: data }), []);

  const save = useCallback(async () => {
    const pageToSave = state.page;
    dispatch({ type: 'SET_SAVING', saving: true });
    dispatch({ type: 'SET_SAVE_ERROR', error: null });

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    let attempt = 0;

    while (true) {
      attempt++;
      try {
        if (attempt > 1) {
          dispatch({
            type: 'SET_SAVE_ERROR',
            error: `Koneksi lambat/terputus. Mencoba menghubungkan kembali (Percobaan ke-${attempt})...`,
          });
        }

        // Gunakan AbortController untuk mendeteksi API yang gantung / tidak merespon dalam 8 detik
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const url = isTemplate
          ? 'https://dev.legalpilar.id/v2/android/ginvite/page/template_save.php'
          : 'https://dev.legalpilar.id/v2/android/ginvite/page/builder_save.php';

        const body = isTemplate
          ? JSON.stringify({
              id: pageToSave.id || 0,
              name: pageToSave.page_title || pageToSave.slug || 'Template Baru',
              event_type: pageToSave.event_type || 'pernikahan',
              text_color: pageToSave.style?.text_color || '#000000',
              accent_color: pageToSave.style?.accent_color || '#ec4899',
              image_theme: pageToSave.image_theme || '',
              page_data: pageToSave
            })
          : JSON.stringify(pageToSave);

        const res = await fetch(
          url,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        if (json.status === 'success') {
          dispatch({ type: 'MARK_CLEAN', payload: pageToSave });
          dispatch({ type: 'CLEAR_UPLOADED_IMAGES' });
          dispatch({ type: 'SET_SAVE_ERROR', error: null });
          dispatch({ type: 'SET_SAVING', saving: false });
          break; // Berhasil menyimpan, keluar dari loop!
        } else {
          throw new Error(json.message || 'Gagal menyimpan.');
        }
      } catch (err: any) {
        console.warn(`Percobaan simpan ke-${attempt} gagal:`, err);
        
        let errorMessage = 'Gagal menyimpan, cek koneksi internet.';
        if (err.name === 'AbortError') {
          errorMessage = 'API tidak merespon (Timeout).';
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        
        dispatch({
          type: 'SET_SAVE_ERROR',
          error: `${errorMessage} Mencoba menghubungkan kembali (Percobaan ke-${attempt})...`,
        });

        // Tunggu 3 detik sebelum mencoba lagi
        await delay(3000);
      }
    }
  }, [state.page, userId, isTemplate]);

  const initialSlug = initialPage.slug;
  const initialId = initialPage.id;

  const retryLoad = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const url = isTemplate
        ? `https://dev.legalpilar.id/v2/android/ginvite/page/template_get.php?id=${initialId || 0}`
        : `https://dev.legalpilar.id/v2/android/ginvite/page/builder_get.php?user_id=${userId}&slug=${encodeURIComponent(initialSlug)}`;
      const res = await fetch(
        url,
        { cache: 'no-store' }
      );
      if (res.ok) {
        const json = await res.json();
        if (json.status === 'success') {
          if (json.data) {
            dispatch({ type: 'FETCH_SUCCESS', payload: json.data as BuilderPage });
          } else {
            // Halaman baru / data belum ada di server, aman pakai data awal
            dispatch({ type: 'FETCH_SUCCESS', payload: initialPage });
          }
        } else {
          dispatch({ type: 'FETCH_FAILURE' });
        }
      } else {
        dispatch({ type: 'FETCH_FAILURE' });
      }
    } catch {
      dispatch({ type: 'FETCH_FAILURE' });
    }
  }, [userId, initialId, initialSlug, initialPage, isTemplate]);

  const hasAttemptedRetry = React.useRef(false);

  React.useEffect(() => {
    if (serverLoadFailed && !hasAttemptedRetry.current) {
      hasAttemptedRetry.current = true;
      retryLoad();
    }
  }, [serverLoadFailed, retryLoad]);

  return (
    <BuilderContext.Provider value={{ state, dispatch, isTemplate, selectSection, setViewMode, updateSectionProps, toggleSectionVisibility, moveSection, moveSectionUp, moveSectionDown, reorderGroup, changeSectionGroup, addSection, removeSection, duplicateSection, updateSectionLabel, updateStyle, updatePageMeta, undo, redo, resetPage, importPage, save, retryLoad, registerUploadedImage, setShowQuickForm, updateBatch }}>
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error('useBuilder must be used inside <BuilderProvider>');
  return ctx;
}
