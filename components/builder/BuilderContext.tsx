'use client';

import React, { createContext, useContext, useCallback, useReducer } from 'react';
import type { BuilderPage, BuilderSection, SectionType } from './types';
import { makeId } from './defaults';

// ── State ─────────────────────────────────────────────────────────────────────
type BuilderState = {
  page: BuilderPage;
  selectedSectionId: string | null;
  isDirty: boolean;
  saving: boolean;
  saveError: string | null;
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
  | { type: 'UPDATE_STYLE'; style: Partial<BuilderPage['style']> }
  | { type: 'UPDATE_PAGE_META'; meta: Partial<Pick<BuilderPage, 'page_title' | 'event_type'>> }
  | { type: 'SET_SAVING'; saving: boolean }
  | { type: 'SET_SAVE_ERROR'; error: string | null }
  | { type: 'MARK_CLEAN' };

function reducer(state: BuilderState, action: Action): BuilderState {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, page: action.payload, isDirty: false };

    case 'SELECT_SECTION':
      return { ...state, selectedSectionId: action.id };

    case 'UPDATE_SECTION_PROPS': {
      const sections = state.page.sections.map(s =>
        s.id === action.id ? { ...s, props: { ...s.props, ...action.props } } : s
      );
      return { ...state, page: { ...state.page, sections }, isDirty: true };
    }

    case 'TOGGLE_SECTION_VISIBILITY': {
      const sections = state.page.sections.map(s =>
        s.id === action.id ? { ...s, visible: !s.visible } : s
      );
      return { ...state, page: { ...state.page, sections }, isDirty: true };
    }

    case 'MOVE_SECTION': {
      const sections = [...state.page.sections];
      const [moved] = sections.splice(action.fromIdx, 1);
      sections.splice(action.toIdx, 0, moved);
      const reordered = sections.map((s, i) => ({ ...s, order: i }));
      return { ...state, page: { ...state.page, sections: reordered }, isDirty: true };
    }

    case 'ADD_SECTION': {
      const sections = [...state.page.sections, { ...action.section, order: state.page.sections.length }];
      return { ...state, page: { ...state.page, sections }, isDirty: true, selectedSectionId: action.section.id };
    }

    case 'REMOVE_SECTION': {
      const sections = state.page.sections
        .filter(s => s.id !== action.id)
        .map((s, i) => ({ ...s, order: i }));
      const selectedSectionId = state.selectedSectionId === action.id ? null : state.selectedSectionId;
      return { ...state, page: { ...state.page, sections }, isDirty: true, selectedSectionId };
    }

    case 'UPDATE_STYLE':
      return { ...state, page: { ...state.page, style: { ...state.page.style, ...action.style } }, isDirty: true };

    case 'UPDATE_PAGE_META':
      return { ...state, page: { ...state.page, ...action.meta }, isDirty: true };

    case 'SET_SAVING':
      return { ...state, saving: action.saving };

    case 'SET_SAVE_ERROR':
      return { ...state, saveError: action.error };

    case 'MARK_CLEAN':
      return { ...state, isDirty: false };

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
  updateStyle: (style: Partial<BuilderPage['style']>) => void;
  updatePageMeta: (meta: Partial<Pick<BuilderPage, 'page_title' | 'event_type'>>) => void;
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
  const updateStyle = useCallback((style: Partial<BuilderPage['style']>) => dispatch({ type: 'UPDATE_STYLE', style }), []);
  const updatePageMeta = useCallback((meta: Partial<Pick<BuilderPage, 'page_title' | 'event_type'>>) => dispatch({ type: 'UPDATE_PAGE_META', meta }), []);

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
    <BuilderContext.Provider value={{ state, dispatch, selectSection, updateSectionProps, toggleSectionVisibility, moveSection, addSection, removeSection, updateStyle, updatePageMeta, save }}>
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error('useBuilder must be used inside <BuilderProvider>');
  return ctx;
}
