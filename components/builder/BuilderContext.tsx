'use client';

import React, { createContext, useContext, useCallback, useReducer } from 'react';
import type { BuilderPage, BuilderSection, SectionType } from './types';
import { makeId, makeDefaultPage } from './defaults';

// ── State ─────────────────────────────────────────────────────────────────────
type BuilderState = {
  page: BuilderPage;
  selectedSectionId: string | null;
  isDirty: boolean;
  saving: boolean;
  saveError: string | null;
  past: BuilderPage[];
  future: BuilderPage[];
};

// ── Actions ───────────────────────────────────────────────────────────────────
type Action =
  | { type: 'SET_PAGE'; payload: BuilderPage }
  | { type: 'SELECT_SECTION'; id: string | null }
  | { type: 'UPDATE_SECTION_PROPS'; id: string; props: Record<string, unknown> }
  | { type: 'TOGGLE_SECTION_VISIBILITY'; id: string }
  | { type: 'MOVE_SECTION'; fromIdx: number; toIdx: number }
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
  | { type: 'IMPORT_PAGE'; payload: any };

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
  addSection: (type: SectionType, label: string, props?: Record<string, unknown>) => void;
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
}

const BuilderContext = createContext<BuilderContextValue | null>(null);

export function BuilderProvider({
  initialPage,
  userId,
  children,
}: {
  initialPage: BuilderPage;
  userId: number;
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
  });

  const selectSection = useCallback((id: string | null) => dispatch({ type: 'SELECT_SECTION', id }), []);
  const updateSectionProps = useCallback((id: string, props: Record<string, unknown>) => dispatch({ type: 'UPDATE_SECTION_PROPS', id, props }), []);
  const toggleSectionVisibility = useCallback((id: string) => dispatch({ type: 'TOGGLE_SECTION_VISIBILITY', id }), []);
  const moveSection = useCallback((fromIdx: number, toIdx: number) => dispatch({ type: 'MOVE_SECTION', fromIdx, toIdx }), []);

  const addSection = useCallback((type: SectionType, label: string, props: Record<string, unknown> = {}) => {
    const section: BuilderSection = {
      id: makeId(),
      type,
      label,
      visible: true,
      order: 0,
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
  const resetPage = useCallback(() => dispatch({ type: 'RESET_PAGE' }), []);
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
      } else {
        dispatch({ type: 'SET_SAVE_ERROR', error: json.message || 'Gagal menyimpan.' });
      }
    } catch {
      dispatch({ type: 'SET_SAVE_ERROR', error: 'Gagal menyimpan, cek koneksi internet.' });
    } finally {
      dispatch({ type: 'SET_SAVING', saving: false });
    }
  }, [state.page, userId]);

  return (
    <BuilderContext.Provider value={{ state, dispatch, selectSection, updateSectionProps, toggleSectionVisibility, moveSection, addSection, removeSection, duplicateSection, updateSectionLabel, updateStyle, updatePageMeta, undo, redo, resetPage, importPage, save }}>
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error('useBuilder must be used inside <BuilderProvider>');
  return ctx;
}
