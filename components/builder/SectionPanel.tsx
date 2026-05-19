'use client';
import React, { useState, useEffect } from 'react';
import { useBuilder } from './BuilderContext';
import type { BuilderSection, SectionType } from './types';
import { getMusicList } from '@/app/actions/musiclist';
import {
  EyeIcon, EyeOffIcon, ChevronUpIcon, ChevronDownIcon,
  Trash2Icon, GripVerticalIcon, PlusIcon, ChevronRightIcon,
  LayoutIcon, ClockIcon, UsersIcon, CalendarIcon, ImageIcon,
  BookOpenIcon, CheckSquareIcon, GiftIcon, MapPinIcon, MusicIcon,
  MessageSquareIcon, TypeIcon, MinusIcon, LinkIcon, PaletteIcon,
  SettingsIcon, CopyIcon, ArrowRightIcon, ArrowLeftIcon, PlayCircleIcon,
  HomeIcon, StarIcon, CameraIcon, CoffeeIcon, InfoIcon
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
  const [activeTab, setActiveTab] = useState<'sections' | 'style' | 'plugins'>('sections');
  
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
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${activeTab === 'sections' ? 'bg-white shadow text-pink-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('sections')}
          >
            <LayoutIcon className="h-3 w-3" /> Seksi
          </button>
          <button
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${activeTab === 'plugins' ? 'bg-white shadow text-pink-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('plugins')}
          >
            <SettingsIcon className="h-3 w-3" /> Plugin
          </button>
          <button
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${activeTab === 'style' ? 'bg-white shadow text-pink-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('style')}
          >
            <PaletteIcon className="h-3 w-3" /> Gaya
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
      ) : activeTab === 'plugins' ? (
        <PluginPanel />
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

// ── Plugin Panel ─────────────────────────────────────────────────────────────
const ICONS_MAP: Record<string, React.ElementType> = {
  Home: HomeIcon, Calendar: CalendarIcon, BookOpen: BookOpenIcon,
  Gift: GiftIcon, Heart: CheckSquareIcon, MapPin: MapPinIcon, Users: UsersIcon,
  Clock: ClockIcon, MessageSquare: MessageSquareIcon, Music: MusicIcon,
  Star: StarIcon, Camera: CameraIcon, Coffee: CoffeeIcon, Info: InfoIcon
};
const AVAILABLE_ICONS = Object.keys(ICONS_MAP);

function getDefaultIconForType(type: string) {
  const map: Record<string, string> = { hero: 'Home', event_details: 'Calendar', gallery: 'BookOpen', gift: 'Gift', rsvp: 'Heart', maps: 'MapPin', couple: 'Users', countdown: 'Clock', our_story: 'BookOpen', quote: 'MessageSquare' };
  return map[type] || 'Star';
}

function PluginPanel() {
  const { state, updateStyle } = useBuilder();
  const { page } = state;
  const [musicList, setMusicList] = useState<{Nama_lagu: string, link_lagu: string, kategori: string}[]>([]);

  useEffect(() => {
    getMusicList(page.event_type || 'pernikahan')
      .then(data => setMusicList(data))
      .catch(console.error);
  }, [page.event_type]);

  const innerSections = page.sections.filter(s => (s.group || (s.type === 'opening' ? 'opening' : 'inner')) !== 'opening' && s.visible);
  
  // Normalize nav_items to objects array
  const rawNavItems = page.style.nav_items;
  const navItems: {id: string, icon: string}[] = Array.isArray(rawNavItems) 
    ? (typeof rawNavItems[0] === 'string' 
        ? (rawNavItems as unknown as string[]).map(id => ({ id, icon: getDefaultIconForType(innerSections.find(s => s.id === id)?.type || '') }))
        : rawNavItems as {id: string, icon: string}[])
    : innerSections.filter(s => ['hero', 'event_details', 'gallery', 'rsvp', 'gift', 'maps'].includes(s.type)).map(s => ({ id: s.id, icon: getDefaultIconForType(s.type) }));

  const toggleNavItem = (id: string, defaultIcon: string) => {
    if (navItems.some(i => i.id === id)) {
      updateStyle({ nav_items: navItems.filter(i => i.id !== id) });
    } else {
      updateStyle({ nav_items: [...navItems, { id, icon: defaultIcon }] });
    }
  };

  const changeNavIcon = (id: string, newIcon: string) => {
    updateStyle({ nav_items: navItems.map(i => i.id === id ? { ...i, icon: newIcon } : i) });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {/* Plugin: Musik Latar */}
      <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-teal-50 flex items-center justify-center">
              <MusicIcon className="w-3.5 h-3.5 text-teal-500" />
            </div>
            <h3 className="text-xs font-semibold text-gray-700">Musik Latar</h3>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={page.style.music_enabled || false} onChange={e => updateStyle({ music_enabled: e.target.checked })} />
            <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-pink-500"></div>
          </label>
        </div>

        {page.style.music_enabled && (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest block mb-1.5">Pilih Lagu</label>
              <select
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-200"
                value={page.style.music_url || ''}
                onChange={e => updateStyle({ music_url: e.target.value })}
              >
                <option value="">-- Pilih Lagu --</option>
                {musicList.map(m => (
                  <option key={m.link_lagu} value={m.link_lagu}>{m.Nama_lagu} {m.kategori ? `(${m.kategori})` : ''}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-semibold text-gray-500 block">Putar Otomatis (Autoplay)</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={page.style.music_autoplay ?? true} onChange={e => updateStyle({ music_autoplay: e.target.checked })} />
                <div className="w-7 h-3.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-teal-500"></div>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Plugin: Navigasi Bawah */}
      <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-50 flex items-center justify-center">
              <LayoutIcon className="w-3.5 h-3.5 text-indigo-500" />
            </div>
            <h3 className="text-xs font-semibold text-gray-700">Navigasi Bawah</h3>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={page.style.nav_enabled ?? true} onChange={e => updateStyle({ nav_enabled: e.target.checked })} />
            <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-pink-500"></div>
          </label>
        </div>
        
        {page.style.nav_enabled !== false && (
          <div className="space-y-4 mt-4 border-t border-gray-100 pt-4">
            
            {/* Group 1: Tampilan & Warna */}
            <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100 space-y-3">
              <h4 className="text-[10px] font-bold text-gray-700 uppercase tracking-widest flex items-center gap-1.5 border-b border-gray-100 pb-2">
                <PaletteIcon className="w-3.5 h-3.5 text-indigo-500" /> Tampilan & Warna Latar
              </h4>
              
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-[9px] font-semibold text-gray-500 block mb-1">Gaya Latar</label>
                  <select 
                    className="w-full px-2 py-1.5 text-[10px] rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-300 bg-white"
                    value={page.style.nav_bg_type || 'solid'}
                    onChange={e => updateStyle({ nav_bg_type: e.target.value as 'solid' | 'gradient' })}
                  >
                    <option value="solid">Warna Solid</option>
                    <option value="gradient">Gradasi</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-[9px] font-semibold text-gray-500 block mb-1">Transparansi ({page.style.nav_bg_opacity ?? 80}%)</label>
                  <input 
                    type="range" min="0" max="100" 
                    value={page.style.nav_bg_opacity ?? 80}
                    onChange={e => updateStyle({ nav_bg_opacity: Number(e.target.value) })}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-1.5 accent-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <label className="text-[9px] font-semibold text-gray-500 block mb-1">Warna Utama</label>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 py-1 bg-white">
                    <input type="color" value={page.style.nav_bg_color || '#000000'} onChange={e => updateStyle({ nav_bg_color: e.target.value })} className="w-4 h-4 rounded cursor-pointer border-0 bg-transparent p-0" />
                    <span className="text-[9px] text-gray-500 font-mono truncate">{page.style.nav_bg_color || '#000000'}</span>
                  </div>
                </div>
                {page.style.nav_bg_type === 'gradient' && (
                  <div>
                    <label className="text-[9px] font-semibold text-gray-500 block mb-1">Warna Gradasi (Ke-2)</label>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 py-1 bg-white">
                      <input type="color" value={page.style.nav_bg_color2 || '#333333'} onChange={e => updateStyle({ nav_bg_color2: e.target.value })} className="w-4 h-4 rounded cursor-pointer border-0 bg-transparent p-0" />
                      <span className="text-[9px] text-gray-500 font-mono truncate">{page.style.nav_bg_color2 || '#333333'}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2 border-t border-gray-100 pt-3">
                <div>
                  <label className="text-[9px] font-semibold text-gray-500 block mb-1">Ikon (Aktif)</label>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 py-1 bg-white">
                    <input type="color" value={page.style.nav_active_color || page.style.accent_color || '#fbbf24'} onChange={e => updateStyle({ nav_active_color: e.target.value })} className="w-4 h-4 rounded cursor-pointer border-0 bg-transparent p-0" />
                    <span className="text-[9px] text-gray-500 font-mono truncate">{page.style.nav_active_color || '#fbbf24'}</span>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-semibold text-gray-500 block mb-1">Ikon (Tidak Aktif)</label>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 py-1 bg-white">
                    <input type="color" value={page.style.nav_inactive_color || '#71717a'} onChange={e => updateStyle({ nav_inactive_color: e.target.value })} className="w-4 h-4 rounded cursor-pointer border-0 bg-transparent p-0" />
                    <span className="text-[9px] text-gray-500 font-mono truncate">{page.style.nav_inactive_color || '#71717a'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Group 2: Menu & Ikon */}
            <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100 space-y-2">
              <h4 className="text-[10px] font-bold text-gray-700 uppercase tracking-widest flex items-center gap-1.5 border-b border-gray-100 pb-2 mb-2">
                <LayoutIcon className="w-3.5 h-3.5 text-indigo-500" /> Pengaturan Menu Navigasi
              </h4>
              
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                {innerSections.map(s => {
                  const navItem = navItems.find(i => i.id === s.id);
                  const isSelected = !!navItem;
                  const defaultIcon = getDefaultIconForType(s.type);
                  return (
                    <div key={s.id} className={`flex flex-col gap-1.5 p-2 rounded-xl transition-all border ${isSelected ? 'bg-indigo-50/50 border-indigo-100 shadow-sm' : 'bg-white border-gray-100 hover:border-indigo-200'}`}>
                      <label className="flex items-center gap-2 cursor-pointer w-full">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => toggleNavItem(s.id, defaultIcon)}
                          className="rounded text-indigo-500 focus:ring-indigo-500 bg-white border-gray-300 w-3.5 h-3.5"
                        />
                        <span className={`text-[11px] truncate flex-1 ${isSelected ? 'font-semibold text-indigo-700' : 'text-gray-600'}`}>{s.label}</span>
                      </label>
                      {isSelected && navItem && (
                        <div className="flex gap-1 overflow-x-auto no-scrollbar py-1 mt-0.5 border-t border-indigo-100/50 pt-1.5">
                          {AVAILABLE_ICONS.map(ic => {
                            const IconCmp = ICONS_MAP[ic];
                            return (
                              <button
                                key={ic}
                                onClick={() => changeNavIcon(s.id, ic)}
                                className={`p-1.5 rounded-lg flex-shrink-0 transition-colors ${navItem.icon === ic ? 'bg-indigo-500 text-white shadow-md' : 'text-indigo-300 hover:bg-indigo-100/50 hover:text-indigo-500'}`}
                                title={ic}
                              >
                                <IconCmp className="w-3.5 h-3.5" />
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
                {innerSections.length === 0 && (
                  <p className="text-xs text-gray-400 italic text-center py-4 bg-white rounded-lg border border-gray-100">Belum ada seksi isi.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
