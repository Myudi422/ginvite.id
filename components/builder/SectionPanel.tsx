'use client';
import React, { useState } from 'react';
import { useBuilder } from './BuilderContext';
import type { BuilderSection, SectionType } from './types';
import {
  EyeIcon, EyeOffIcon, ChevronUpIcon, ChevronDownIcon,
  Trash2Icon, GripVerticalIcon, PlusIcon, ChevronRightIcon,
  LayoutIcon, ClockIcon, UsersIcon, CalendarIcon, ImageIcon,
  BookOpenIcon, CheckSquareIcon, GiftIcon, MapPinIcon, MusicIcon,
  MessageSquareIcon, TypeIcon, MinusIcon, LinkIcon, PaletteIcon,
  SettingsIcon, CopyIcon, ArrowRightIcon, ArrowLeftIcon, PlayCircleIcon
} from 'lucide-react';

const SECTION_META: Record<SectionType, { icon: React.ElementType; color: string }> = {
  opening: { icon: PlayCircleIcon, color: '#f43f5e' },
  hero: { icon: LayoutIcon, color: '#e879a0' },
  countdown: { icon: ClockIcon, color: '#8b5cf6' },
  couple: { icon: UsersIcon, color: '#ec4899' },
  event_details: { icon: CalendarIcon, color: '#f97316' },
  gallery: { icon: ImageIcon, color: '#10b981' },
  our_story: { icon: BookOpenIcon, color: '#06b6d4' },
  rsvp: { icon: CheckSquareIcon, color: '#6366f1' },
  gift: { icon: GiftIcon, color: '#f59e0b' },
  maps: { icon: MapPinIcon, color: '#ef4444' },
  music: { icon: MusicIcon, color: '#14b8a6' },
  quote: { icon: MessageSquareIcon, color: '#a855f7' },
  text_block: { icon: TypeIcon, color: '#64748b' },
  divider: { icon: MinusIcon, color: '#94a3b8' },
  social_links: { icon: LinkIcon, color: '#3b82f6' },
};

const ADD_SECTIONS: Array<{ type: SectionType; label: string }> = [
  { type: 'opening', label: 'Sampul Depan' },
  { type: 'text_block', label: 'Teks Bebas' },
  { type: 'divider', label: 'Pemisah' },
  { type: 'gallery', label: 'Galeri Foto' },
  { type: 'quote', label: 'Kutipan' },
  { type: 'our_story', label: 'Kisah Kami' },
  { type: 'social_links', label: 'Sosial Media' },
  { type: 'music', label: 'Musik Latar' },
  { type: 'rsvp', label: 'RSVP' },
  { type: 'gift', label: 'Hadiah / Gift' },
  { type: 'maps', label: 'Peta Lokasi' },
  { type: 'countdown', label: 'Hitung Mundur' },
];

export default function SectionPanel() {
  const { 
    state, selectSection, toggleSectionVisibility, 
    moveSectionUp, moveSectionDown, reorderGroup, changeSectionGroup,
    removeSection, addSection, duplicateSection 
  } = useBuilder();
  const { page, selectedSectionId } = state;
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<'sections' | 'style'>('sections');
  
  // Drag state using IDs
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const sections = [...page.sections].sort((a, b) => a.order - b.order);
  const openingSections = sections.filter(s => (s.group || (s.type === 'opening' ? 'opening' : 'inner')) === 'opening');
  const innerSections = sections.filter(s => (s.group || (s.type === 'opening' ? 'opening' : 'inner')) !== 'opening');

  function handleAdd(type: SectionType, label: string) {
    const targetGroup = type === 'opening' ? 'opening' : 'inner';
    addSection(type, label, {}, targetGroup);
    setShowAddMenu(false);
  }

  function handleDrop(targetId: string, group: 'opening' | 'inner') {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }
    const groupList = group === 'opening' ? openingSections : innerSections;
    const oldIndex = groupList.findIndex(s => s.id === draggedId);
    const newIndex = groupList.findIndex(s => s.id === targetId);
    
    if (oldIndex !== -1 && newIndex !== -1) {
      // Reorder within the same group
      const newIds = groupList.map(s => s.id);
      newIds.splice(oldIndex, 1);
      newIds.splice(newIndex, 0, draggedId);
      reorderGroup(group, newIds);
    }
    setDraggedId(null);
    setDragOverId(null);
  }

  const renderSectionItem = (section: BuilderSection, isOpeningGroup: boolean) => {
    const meta = SECTION_META[section.type] || { icon: LayoutIcon, color: '#000' };
    const Icon = meta.icon;
    const isSelected = section.id === selectedSectionId;
    const isDragging = section.id === draggedId;
    const isDragOver = section.id === dragOverId;

    return (
      <div
        key={section.id}
        draggable
        onDragStart={(e) => {
          setDraggedId(section.id);
          e.dataTransfer.effectAllowed = 'move';
        }}
        onDragEnd={() => {
          setDraggedId(null);
          setDragOverId(null);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (draggedId !== section.id && (isOpeningGroup ? openingSections : innerSections).some(s => s.id === draggedId)) {
            setDragOverId(section.id);
          }
        }}
        onDragLeave={() => {
          if (dragOverId === section.id) {
            setDragOverId(null);
          }
        }}
        onDrop={(e) => {
          e.preventDefault();
          handleDrop(section.id, isOpeningGroup ? 'opening' : 'inner');
        }}
        className={`group flex flex-col gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all border ${
          isSelected
            ? 'border-pink-200 bg-pink-50 shadow-sm'
            : isDragOver
            ? 'border-dashed border-pink-400 bg-pink-50/30 scale-[1.02]'
            : 'border-transparent hover:border-gray-200 hover:bg-gray-50'
        } ${isDragging ? 'opacity-40 scale-95 border-dashed border-pink-300' : ''}`}
        onClick={() => selectSection(section.id)}
      >
        <div className="flex items-center gap-2 w-full">
          {/* Drag handle */}
          <GripVerticalIcon className="h-3.5 w-3.5 text-gray-300 flex-shrink-0 cursor-grab active:cursor-grabbing" />

          {/* Icon */}
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: meta.color + '18' }}>
            <Icon className="h-3.5 w-3.5" style={{ color: meta.color }} />
          </div>

          {/* Label */}
          <span className={`flex-1 text-xs font-medium truncate ${isSelected ? 'text-pink-700' : 'text-gray-700'} ${!section.visible ? 'opacity-40 line-through' : ''}`}>
            {section.label}
          </span>

          {/* Core Actions */}
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="p-1 rounded-lg hover:bg-white transition-colors"
              onClick={(e) => { e.stopPropagation(); moveSectionUp(section.id); }}
              title="Naik"
            >
              <ChevronUpIcon className="h-3 w-3 text-gray-400" />
            </button>
            <button
              className="p-1 rounded-lg hover:bg-white transition-colors"
              onClick={(e) => { e.stopPropagation(); moveSectionDown(section.id); }}
              title="Turun"
            >
              <ChevronDownIcon className="h-3 w-3 text-gray-400" />
            </button>
            <button
              className="p-1 rounded-lg hover:bg-white transition-colors"
              onClick={(e) => { e.stopPropagation(); toggleSectionVisibility(section.id); }}
              title={section.visible ? 'Sembunyikan' : 'Tampilkan'}
            >
              {section.visible
                ? <EyeIcon className="h-3 w-3 text-gray-400" />
                : <EyeOffIcon className="h-3 w-3 text-gray-300" />}
            </button>
            <button
              className="p-1 rounded-lg hover:bg-red-50 transition-colors"
              onClick={(e) => { e.stopPropagation(); if (confirm(`Hapus seksi "${section.label}"?`)) removeSection(section.id); }}
              title="Hapus"
            >
              <Trash2Icon className="h-3 w-3 text-red-400" />
            </button>
          </div>
        </div>

        {/* Extended Actions (Show only when selected to avoid clutter) */}
        {isSelected && (
          <div className="flex items-center justify-between border-t border-pink-100 pt-2 mt-1">
            <button
              className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium text-pink-600 hover:bg-pink-100 transition-colors"
              onClick={(e) => { e.stopPropagation(); duplicateSection(section.id); }}
            >
              <CopyIcon className="h-3 w-3" /> Salin
            </button>
            
            {isOpeningGroup ? (
              section.type !== 'opening' && (
                <button
                  className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium text-gray-500 hover:bg-gray-200 transition-colors"
                  onClick={(e) => { e.stopPropagation(); changeSectionGroup(section.id, 'inner'); }}
                >
                  Ke Halaman Dalam <ArrowRightIcon className="h-3 w-3" />
                </button>
              )
            ) : (
              <button
                className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium text-gray-500 hover:bg-gray-200 transition-colors"
                onClick={(e) => { e.stopPropagation(); changeSectionGroup(section.id, 'opening'); }}
              >
                <ArrowLeftIcon className="h-3 w-3" /> Ke Halaman Opening
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full min-h-0 flex flex-col bg-white border-r border-gray-100 w-full md:w-72 md:min-w-[260px] select-none">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          <button
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'sections' ? 'bg-white shadow text-pink-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('sections')}
          >
            <LayoutIcon className="h-3.5 w-3.5" /> Seksi
          </button>
          <button
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === 'style' ? 'bg-white shadow text-pink-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('style')}
          >
            <PaletteIcon className="h-3.5 w-3.5" /> Gaya
          </button>
        </div>
      </div>

      {activeTab === 'sections' ? (
        <>
          {/* Section List (Grouped) */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            
            {/* GROUP: OPENING */}
            <div>
              <div className="flex items-center gap-2 mb-2 px-1">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Halaman Opening (Sampul)</h3>
              </div>
              <div className="space-y-1.5">
                {openingSections.length === 0 && (
                  <p className="text-xs text-gray-400 italic px-2 py-1">Belum ada seksi.</p>
                )}
                {openingSections.map(section => renderSectionItem(section, true))}
              </div>
            </div>

            <div className="h-px bg-gray-100 w-full my-2"></div>

            {/* GROUP: DALAM */}
            <div>
              <div className="flex items-center gap-2 mb-2 px-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Halaman Dalam (Isi)</h3>
              </div>
              <div className="space-y-1.5">
                {innerSections.length === 0 && (
                  <p className="text-xs text-gray-400 italic px-2 py-1">Belum ada seksi.</p>
                )}
                {innerSections.map(section => renderSectionItem(section, false))}
              </div>
            </div>

          </div>

          {/* Add Section */}
          <div className="p-3 border-t border-gray-100 relative bg-white">
            <button
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-pink-50 hover:bg-pink-100 border border-pink-100 text-pink-600 font-semibold text-xs transition-all"
              onClick={() => setShowAddMenu(!showAddMenu)}
            >
              <PlusIcon className="h-3.5 w-3.5" />
              Tambah Seksi Baru
            </button>
            {showAddMenu && (
              <div className="absolute bottom-full left-3 right-3 mb-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                <div className="p-2 border-b border-gray-100">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2">Pilih Tipe Seksi</p>
                </div>
                <div className="max-h-64 overflow-y-auto p-1.5 space-y-0.5">
                  {ADD_SECTIONS.map(s => {
                    const meta = SECTION_META[s.type];
                    const Icon = meta.icon;
                    return (
                      <button
                        key={s.type}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 text-left transition-colors"
                        onClick={() => handleAdd(s.type, s.label)}
                      >
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: meta.color + '18' }}>
                          <Icon className="h-3.5 w-3.5" style={{ color: meta.color }} />
                        </div>
                        <span className="text-xs font-medium text-gray-700">{s.label}</span>
                        <ChevronRightIcon className="h-3 w-3 text-gray-300 ml-auto" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <StylePanel />
      )}
    </div>
  );
}

// ── Style Panel (mini) ───────────────────────────────────────────────────────
function StylePanel() {
  const { state, updateStyle, updatePageMeta } = useBuilder();
  const { page } = state;

  const fonts = ['Montserrat', 'Playfair Display', 'Great Vibes', 'Lato', 'Poppins', 'Raleway', 'Cormorant Garamond', 'Dancing Script'];

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-5">
      {/* Page Title */}
      <div>
        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block mb-1.5">Judul Halaman</label>
        <input
          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-200"
          value={page.page_title}
          onChange={e => updatePageMeta({ page_title: e.target.value })}
        />
      </div>

      {/* Colors */}
      <div>
        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block mb-2">Warna</label>
        <div className="space-y-2">
          {([
            { key: 'bg_color' as const, label: 'Background' },
            { key: 'text_color' as const, label: 'Teks' },
            { key: 'accent_color' as const, label: 'Aksen' },
          ]).map(item => (
            <div key={item.key} className="flex items-center gap-2">
              <input
                type="color"
                value={page.style[item.key] as string}
                onChange={e => updateStyle({ [item.key]: e.target.value })}
                className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer"
              />
              <span className="text-xs text-gray-600 flex-1">{item.label}</span>
              <span className="text-[10px] text-gray-400 font-mono">{page.style[item.key]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fonts */}
      <div>
        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block mb-2">Font</label>
        <div className="space-y-2">
          <div>
            <p className="text-[11px] text-gray-500 mb-1">Body</p>
            <select
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-200"
              value={page.style.font_body}
              onChange={e => updateStyle({ font_body: e.target.value })}
            >
              {fonts.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <p className="text-[11px] text-gray-500 mb-1">Heading</p>
            <select
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-200"
              value={page.style.font_heading}
              onChange={e => updateStyle({ font_heading: e.target.value })}
            >
              {fonts.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Page width (locked at 700) */}
      <div>
        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block mb-1.5">Lebar Halaman</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-200"
            value={page.style.page_width}
            onChange={e => updateStyle({ page_width: Number(e.target.value) })}
            min={360} max={900} step={10}
          />
          <span className="text-xs text-gray-400">px</span>
        </div>
        <p className="text-[10px] text-gray-400 mt-1">Disarankan: 700px</p>
      </div>
    </div>
  );
}
