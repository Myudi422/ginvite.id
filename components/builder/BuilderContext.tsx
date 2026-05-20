'use client';

import React, { createContext, useContext, useCallback, useReducer } from 'react';
import type { BuilderPage, BuilderSection, SectionType } from './types';
import { makeId, makeDefaultPage } from './defaults';
import { deleteImageFromBackblaze } from '@/app/actions/backblaze';

// ── State ─────────────────────────────────────────────────────────────────────
type BuilderState = {
  page: BuilderPage;
  selectedSectionId: string | null;
  isDirty: boolean;
  saving: boolean;
  saveError: string | null;
  past: BuilderPage[];
  future: BuilderPage[];
  isLoading: boolean;
  connectionError: boolean;
  serverLoadFailed: boolean;
  sessionUploadedImages: string[];
};

// ── Actions ───────────────────────────────────────────────────────────────────
type Action =
  | { type: 'SET_PAGE'; payload: BuilderPage }
  | { type: 'SELECT_SECTION'; id: string | null }
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
  | { type: 'MARK_CLEAN' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET_PAGE' }
  | { type: 'IMPORT_PAGE'; payload: any }
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: BuilderPage }
  | { type: 'FETCH_FAILURE' }
  | { type: 'REGISTER_UPLOADED_IMAGE'; url: string }
  | { type: 'CLEAR_UPLOADED_IMAGES' };

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

    case 'SELECT_SECTION':
      return { ...state, selectedSectionId: action.id };

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
      return { ...stateWithHistory, selectedSectionId: action.section.id };
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
      return { ...stateWithHistory, selectedSectionId: copied.id };
    }

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

    case 'MARK_CLEAN':
      return { ...state, isDirty: false };

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
  // helpers
  selectSection: (id: string | null) => void;
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
}

const BuilderContext = createContext<BuilderContextValue | null>(null);

export function BuilderProvider({
  initialPage,
  userId,
  serverLoadFailed = false,
  children,
}: {
  initialPage: BuilderPage;
  userId: number;
  serverLoadFailed?: boolean;
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, {
    page: initialPage,
    selectedSectionId: null,
    isDirty: false,
    saving: false,
    saveError: null,
    past: [],
    future: [],
    isLoading: false,
    connectionError: serverLoadFailed,
    serverLoadFailed: serverLoadFailed,
    sessionUploadedImages: [],
  });

  const selectSection = useCallback((id: string | null) => dispatch({ type: 'SELECT_SECTION', id }), []);
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

  const importPage = useCallback((data: any) => dispatch({ type: 'IMPORT_PAGE', payload: data }), []);

  const save = useCallback(async () => {
    dispatch({ type: 'SET_SAVING', saving: true });
    dispatch({ type: 'SET_SAVE_ERROR', error: null });
    try {
      const res = await fetch(
        'https://ccgnimex.my.id/v2/android/ginvite/page/builder_save.php',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(state.page),
        }
      );
      const json = await res.json();
      if (json.status === 'success') {
        dispatch({ type: 'MARK_CLEAN' });
        dispatch({ type: 'CLEAR_UPLOADED_IMAGES' });
      } else {
        dispatch({ type: 'SET_SAVE_ERROR', error: json.message || 'Gagal menyimpan.' });
      }
    } catch {
      dispatch({ type: 'SET_SAVE_ERROR', error: 'Gagal menyimpan, cek koneksi internet.' });
    } finally {
      dispatch({ type: 'SET_SAVING', saving: false });
    }
  }, [state.page, userId]);

  const retryLoad = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const res = await fetch(
        `https://ccgnimex.my.id/v2/android/ginvite/page/builder_get.php?user_id=${userId}&slug=${encodeURIComponent(state.page.slug)}`,
        { cache: 'no-store' }
      );
      if (res.ok) {
        const json = await res.json();
        if (json.status === 'success') {
          if (json.data) {
            dispatch({ type: 'FETCH_SUCCESS', payload: json.data as BuilderPage });
          } else {
            // Halaman baru / data belum ada di server, aman pakai state saat ini
            dispatch({ type: 'FETCH_SUCCESS', payload: state.page });
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
  }, [userId, state.page.slug, state.page]);

  React.useEffect(() => {
    if (serverLoadFailed) {
      retryLoad();
    }
  }, [serverLoadFailed, retryLoad]);

  return (
    <BuilderContext.Provider value={{ state, dispatch, selectSection, updateSectionProps, toggleSectionVisibility, moveSection, moveSectionUp, moveSectionDown, reorderGroup, changeSectionGroup, addSection, removeSection, duplicateSection, updateSectionLabel, updateStyle, updatePageMeta, undo, redo, resetPage, importPage, save, retryLoad, registerUploadedImage }}>
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error('useBuilder must be used inside <BuilderProvider>');
  return ctx;
}
