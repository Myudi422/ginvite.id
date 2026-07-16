'use client';

import React, { useEffect, useState } from 'react';
import { useBuilder } from '../BuilderContext';
import { getMusicList } from '@/app/actions/musiclist';
import {
  X as XIcon,
  Sparkles as SparklesIcon,
  Heart as HeartIcon,
  Calendar as CalendarIcon,
  Gift as GiftIcon,
  Info as InfoIcon,
  Music as MusicIcon,
  MapPin as MapIcon,
  Plus as PlusIcon,
  Trash2 as TrashIcon,
  Check as CheckIcon,
  AlertCircle as AlertIcon,
  Loader2 as LoaderIcon
} from 'lucide-react';
import { Input, Textarea, ImageUploadField, Toggle, AddButton, ItemCard } from './EditorFields';
import type { BuilderSection, BuilderPage } from '../types';

interface Props {
  onClose: () => void;
}

interface EventSession {
  id: string;
  name: string;
  date: string;
  time: string;
  timezone?: string;
  location: string;
  maps_link: string;
  note: string;
}

interface BankAccount {
  id: string;
  bank_name: string;
  account_name: string;
  account_number: string;
}

export default function QuickFormModal({ onClose }: Props) {
  const { state, updateBatch, setShowQuickForm, save } = useBuilder();
  const { page, saving, saveError } = state;

  // Active Tab
  const [activeTab, setActiveTab] = useState<'general' | 'persons' | 'schedule' | 'gift'>('general');

  // Music Selection Options
  const [musicList, setMusicList] = useState<Array<{ Nama_lagu: string; link_lagu: string; kategori: string }>>([]);

  const [pendingSave, setPendingSave] = useState(false);
  const [wasSaving, setWasSaving] = useState(false);

  useEffect(() => {
    if (pendingSave) {
      setPendingSave(false);
      save();
    }
  }, [page, pendingSave, save]);

  useEffect(() => {
    if (saving) {
      setWasSaving(true);
    } else if (wasSaving && !saving) {
      setWasSaving(false);
      if (!saveError) {
        onClose();
      }
    }
  }, [saving, saveError, wasSaving, onClose]);

  // --- STATE FOR FORM FIELDS ---
  // General
  const [pageTitle, setPageTitle] = useState('');
  const [openingTitle, setOpeningTitle] = useState('');
  const [openingGreeting, setOpeningGreeting] = useState('');
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [musicUrl, setMusicUrl] = useState('');

  // Persons (Wedding)
  const [groomFullName, setGroomFullName] = useState('');
  const [groomNickname, setGroomNickname] = useState('');
  const [groomFather, setGroomFather] = useState('');
  const [groomMother, setGroomMother] = useState('');
  const [groomInstagram, setGroomInstagram] = useState('');
  const [groomPhoto, setGroomPhoto] = useState('');

  const [brideFullName, setBrideFullName] = useState('');
  const [brideNickname, setBrideNickname] = useState('');
  const [brideFather, setBrideFather] = useState('');
  const [brideMother, setBrideMother] = useState('');
  const [brideInstagram, setBrideInstagram] = useState('');
  const [bridePhoto, setBridePhoto] = useState('');

  // Person (Non-wedding: Khitanan, Ulang Tahun, Custom)
  const [mainPersonName, setMainPersonName] = useState('');
  const [mainPersonNickname, setMainPersonNickname] = useState(''); // Optional / extra context
  const [mainPhoto, setMainPhoto] = useState('');

  // Schedule & Location
  const [countdownDate, setCountdownDate] = useState('');
  const [countdownTime, setCountdownTime] = useState('');
  const [sessions, setSessions] = useState<EventSession[]>([]);
  const [mapsUrl, setMapsUrl] = useState('');
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');

  // Gift / Kado
  const [giftEnabled, setGiftEnabled] = useState(false);
  const [giftBanks, setGiftBanks] = useState<BankAccount[]>([]);
  const [addressEnabled, setAddressEnabled] = useState(false);
  const [addressRecipient, setAddressRecipient] = useState('');
  const [addressText, setAddressText] = useState('');
  const [addressPhone, setAddressPhone] = useState('');

  // Load current builder page state into form fields
  useEffect(() => {
    if (!page) return;

    // Load Music list
    getMusicList(page.event_type || 'pernikahan')
      .then(data => setMusicList(data))
      .catch(err => console.error("Error fetching music list in QuickForm:", err));

    // Page Title
    setPageTitle(page.page_title || '');

    // Music from global style
    setMusicEnabled(!!page.style?.music_enabled);
    setMusicUrl(page.style?.music_url || '');

    // opening & hero sections
    const opening = page.sections.find(s => s.type === 'opening');
    const hero = page.sections.find(s => s.type === 'hero');
    if (opening) {
      setOpeningTitle(opening.props.title as string || hero?.props?.greeting as string || '');
      setOpeningGreeting(opening.props.greeting_text as string || '');
      if (page.event_type !== 'pernikahan') {
        setMainPersonName(opening.props.name_primary as string || hero?.props?.name_primary as string || '');
      }
    } else if (hero) {
      setOpeningTitle(hero.props.greeting as string || '');
      if (page.event_type !== 'pernikahan') {
        setMainPersonName(hero.props.name_primary as string || '');
      }
    }

    // hero section (for non-wedding main photo, or wedding confirmation)
    if (hero && page.event_type !== 'pernikahan') {
      setMainPhoto(hero.props.couple_photo as string || '');
    }

    // couple section (if wedding)
    if (page.event_type === 'pernikahan') {
      const couple = page.sections.find(s => s.type === 'couple');
      
      const initialGroomNickname = couple?.props?.person_a?.nickname || opening?.props?.name_primary || hero?.props?.name_primary || '';
      const initialBrideNickname = couple?.props?.person_b?.nickname || opening?.props?.name_secondary || hero?.props?.name_secondary || '';
      
      setGroomNickname(initialGroomNickname);
      setBrideNickname(initialBrideNickname);

      if (couple) {
        const pA = (couple.props.person_a as any) || {};
        const pB = (couple.props.person_b as any) || {};

        setGroomFullName(pA.name || '');
        setGroomFather(pA.parent_father || '');
        setGroomMother(pA.parent_mother || '');
        setGroomInstagram(pA.instagram || '');
        setGroomPhoto(pA.photo || '');

        setBrideFullName(pB.name || '');
        setBrideFather(pB.parent_father || '');
        setBrideMother(pB.parent_mother || '');
        setBrideInstagram(pB.instagram || '');
        setBridePhoto(pB.photo || '');
      }
    }

    // countdown section
    const countdown = page.sections.find(s => s.type === 'countdown');
    if (countdown) {
      setCountdownDate(countdown.props.event_date as string || '');
      setCountdownTime(countdown.props.event_time as string || '');
    }

    // event_details section
    const eventDetails = page.sections.find(s => s.type === 'event_details');
    if (eventDetails && Array.isArray(eventDetails.props.events)) {
      setSessions(eventDetails.props.events as EventSession[]);
    } else {
      // Pre-populate with a default session if empty
      const defaultName = page.event_type === 'pernikahan' ? 'Akad Nikah' : 'Acara Utama';
      setSessions([{
        id: Math.random().toString(36).substring(7),
        name: defaultName,
        date: '',
        time: '09:00',
        location: '',
        maps_link: '',
        note: ''
      }]);
    }

    // maps section
    const maps = page.sections.find(s => s.type === 'maps');
    if (maps) {
      setMapsUrl(maps.props.maps_url as string || maps.props.locations?.[0]?.maps_url || '');
      setVenueName(maps.props.venue_name as string || maps.props.locations?.[0]?.venue_name || '');
      setVenueAddress(maps.props.venue_address as string || maps.props.locations?.[0]?.venue_address || '');
    }

    // gift section
    const gift = page.sections.find(s => s.type === 'gift');
    if (gift) {
      setGiftEnabled(!!gift.props.enabled);
      setGiftBanks((gift.props.banks as BankAccount[]) || []);
      setAddressEnabled(!!gift.props.address_enabled);
      setAddressRecipient(gift.props.address_recipient as string || '');
      setAddressText(gift.props.address_text as string || '');
      setAddressPhone(gift.props.address_phone as string || '');
    }
  }, [page]);

  // Handle Event Session management
  const addSession = () => {
    setSessions([
      ...sessions,
      {
        id: Math.random().toString(36).substring(7),
        name: `Sesi Tambahan ${sessions.length + 1}`,
        date: countdownDate,
        time: '10:00 - Selesai',
        location: '',
        maps_link: '',
        note: ''
      }
    ]);
  };

  const removeSession = (id: string) => {
    if (sessions.length <= 1) {
      alert("Minimal harus memiliki 1 sesi acara.");
      return;
    }
    setSessions(sessions.filter(s => s.id !== id));
  };

  const updateSession = (id: string, fields: Partial<EventSession>) => {
    setSessions(sessions.map(s => (s.id === id ? { ...s, ...fields } : s)));
  };

  // Handle Bank Accounts management
  const addBank = () => {
    setGiftBanks([
      ...giftBanks,
      {
        id: Math.random().toString(36).substring(7),
        bank_name: 'BCA',
        account_name: page.event_type === 'pernikahan' ? groomNickname || brideNickname || '' : mainPersonName || '',
        account_number: ''
      }
    ]);
  };

  const removeBank = (id: string) => {
    setGiftBanks(giftBanks.filter(b => b.id !== id));
  };

  const updateBank = (id: string, fields: Partial<BankAccount>) => {
    setGiftBanks(giftBanks.map(b => (b.id === id ? { ...b, ...fields } : b)));
  };

  // Apply all values to the main builder state
  const handleApply = (shouldSave: boolean = false) => {
    if (!page) return;

    // Deep clone the sections
    const updatedSections = JSON.parse(JSON.stringify(page.sections)) as BuilderSection[];
    const updatedStyle = { ...page.style };

    // 1. Style / Global music
    updatedStyle.music_enabled = musicEnabled;
    updatedStyle.music_url = musicUrl;

    // 2. Opening section
    const opening = updatedSections.find(s => s.type === 'opening');
    if (opening) {
      opening.props.title = openingTitle;
      opening.props.greeting_text = openingGreeting;
      if (page.event_type === 'pernikahan') {
        opening.props.name_primary = groomNickname || 'Pengantin Pria';
        opening.props.name_secondary = brideNickname || 'Pengantin Wanita';
      } else {
        opening.props.name_primary = mainPersonName || 'Nama Acara';
      }
    }

    // 3. Hero section
    const hero = updatedSections.find(s => s.type === 'hero');
    if (hero) {
      hero.props.greeting = openingTitle;
      if (page.event_type === 'pernikahan') {
        hero.props.name_primary = groomNickname || 'Pengantin Pria';
        hero.props.name_secondary = brideNickname || 'Pengantin Wanita';
      } else {
        hero.props.name_primary = mainPersonName || 'Nama Acara';
        hero.props.couple_photo = mainPhoto;
      }
    }

    // 4. Couple section (if wedding)
    if (page.event_type === 'pernikahan') {
      const couple = updatedSections.find(s => s.type === 'couple');
      if (couple) {
        couple.props.person_a = {
          ...((couple.props.person_a as any) || {}),
          name: groomFullName,
          nickname: groomNickname,
          parent_father: groomFather,
          parent_mother: groomMother,
          instagram: groomInstagram,
          photo: groomPhoto,
        };
        couple.props.person_b = {
          ...((couple.props.person_b as any) || {}),
          name: brideFullName,
          nickname: brideNickname,
          parent_father: brideFather,
          parent_mother: brideMother,
          instagram: brideInstagram,
          photo: bridePhoto,
        };
      }
    }

    // 5. Countdown
    const countdown = updatedSections.find(s => s.type === 'countdown');
    if (countdown) {
      countdown.props.event_date = countdownDate;
      countdown.props.event_time = countdownTime;
    }

    // 6. Event details
    const eventDetails = updatedSections.find(s => s.type === 'event_details');
    if (eventDetails) {
      eventDetails.props.events = sessions;
    }

    // 7. Maps location
    const maps = updatedSections.find(s => s.type === 'maps');
    if (maps) {
      maps.props.maps_url = mapsUrl;
      maps.props.venue_name = venueName;
      maps.props.venue_address = venueAddress;

      // Also mirror to locations array if present
      if (Array.isArray(maps.props.locations) && maps.props.locations.length > 0) {
        maps.props.locations[0] = {
          ...maps.props.locations[0],
          maps_url: mapsUrl,
          venue_name: venueName,
          venue_address: venueAddress,
        };
      }
    }

    // 8. Gift
    const gift = updatedSections.find(s => s.type === 'gift');
    if (gift) {
      gift.props.enabled = giftEnabled;
      gift.props.banks = giftBanks;
      gift.props.address_enabled = addressEnabled;
      gift.props.address_recipient = addressRecipient;
      gift.props.address_text = addressText;
      gift.props.address_phone = addressPhone;
    }

    // Apply via Context Action
    updateBatch({
      sections: updatedSections,
      style: updatedStyle,
      page_title: pageTitle,
    });

    if (shouldSave) {
      setPendingSave(true);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[95vh] sm:h-[88vh] flex flex-col overflow-hidden border border-gray-100 animate-zoom-in">
        
        {/* Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-pink-50/50 via-rose-50/30 to-purple-50/50 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-md">
              <SparklesIcon className="h-4.5 w-4.5 sm:h-5 sm:w-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-gray-800">Isi Formulir Kilat Undangan</h2>
              <p className="text-[9px] sm:text-[10px] text-gray-400 font-semibold line-clamp-1 sm:line-clamp-none">Tulis semua data utama dalam satu formulir untuk menyederhanakan pembuatan undangan.</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 sm:p-2 rounded-full border border-gray-100 text-gray-400 hover:text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
          >
            <XIcon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-gray-100 bg-gray-50/50 p-1.5 sm:p-2 gap-1 sm:gap-1.5 flex-shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'general' 
                ? 'bg-pink-500 text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-850'
            }`}
          >
            <InfoIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Informasi Umum
          </button>
          
          <button
            onClick={() => setActiveTab('persons')}
            className={`flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'persons' 
                ? 'bg-pink-500 text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-850'
            }`}
          >
            <HeartIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {page.event_type === 'pernikahan' ? 'Mempelai Pengantin' : 'Tokoh Utama'}
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'schedule' 
                ? 'bg-pink-500 text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-850'
            }`}
          >
            <CalendarIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Jadwal & Lokasi
          </button>

          <button
            onClick={() => setActiveTab('gift')}
            className={`flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'gift' 
                ? 'bg-pink-500 text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-850'
            }`}
          >
            <GiftIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Kirim Kado / Rekening
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0 bg-gray-50/20 custom-scrollbar text-gray-700">
          
          {/* TAB 1: GENERAL */}
          {activeTab === 'general' && (
            <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
              <div className="p-3 sm:p-4 bg-pink-50/30 border border-pink-100 rounded-xl sm:rounded-2xl flex gap-2.5 sm:gap-3">
                <SparklesIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-pink-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-pink-800">Isi Info Dasar Undangan Anda</h4>
                  <p className="text-[10px] text-pink-700/80 mt-0.5 leading-relaxed">
                    Tentukan judul halaman web undangan, tulisan pembuka di sampul depan, serta pilih lagu latar background.
                  </p>
                </div>
              </div>

              <div className="space-y-4 bg-white p-4 sm:p-6 border border-gray-100 rounded-xl sm:rounded-2xl shadow-sm">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Judul Halaman (Browser Title)</label>
                  <Input 
                    value={pageTitle} 
                    onChange={setPageTitle} 
                    placeholder="Contoh: The Wedding of Yudi & Ani" 
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Nama ini akan muncul pada tab browser.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Judul Sampul Depan</label>
                    <Input 
                      value={openingTitle} 
                      onChange={setOpeningTitle} 
                      placeholder={page.event_type === 'pernikahan' ? 'The Wedding Of' : 'Walimatul Khitan / You Are Invited'} 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Teks Salam Pembuka</label>
                    <Input 
                      value={openingGreeting} 
                      onChange={setOpeningGreeting} 
                      placeholder="Tanpa Mengurangi Rasa Hormat, Kami Mengundang..." 
                    />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MusicIcon className="w-4 h-4 text-pink-500" />
                      <span className="text-xs font-bold text-gray-700">Aktifkan Musik Latar</span>
                    </div>
                    <Toggle checked={musicEnabled} onChange={setMusicEnabled} />
                  </div>

                  {musicEnabled && (
                    <div className="space-y-3 p-3 bg-gray-50 rounded-xl border border-gray-100 animate-slide-down">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Pilih Lagu Populer</label>
                        <select
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-200 bg-white"
                          value={musicUrl}
                          onChange={e => setMusicUrl(e.target.value)}
                        >
                          <option value="">-- Pilih Lagu Latar --</option>
                          {musicList.map(m => (
                            <option key={m.link_lagu} value={m.link_lagu}>
                              {m.Nama_lagu} {m.kategori ? `(${m.kategori})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Atau Masukkan URL Lagu Kustom</label>
                        <Input 
                          value={musicUrl} 
                          onChange={setMusicUrl} 
                          placeholder="https://example.com/song.mp3" 
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PERSONS */}
          {activeTab === 'persons' && (
            <div className="max-w-3xl mx-auto space-y-6">
              {page.event_type === 'pernikahan' ? (
                /* Wedding: Groom & Bride */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Groom Form */}
                  <div className="bg-white p-4 sm:p-6 border border-gray-100 rounded-xl sm:rounded-2xl shadow-sm space-y-4 relative">
                    <div className="pb-3 border-b border-gray-100 flex items-center gap-2">
                      <span className="text-lg">👨‍💼</span>
                      <h3 className="text-sm font-extrabold text-gray-800">Mempelai Pria (Groom)</h3>
                    </div>
                    
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Nama Lengkap</label>
                      <Input value={groomFullName} onChange={setGroomFullName} placeholder="Nama Lengkap Mempelai Pria" />
                    </div>
                    
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Nama Panggilan</label>
                      <Input value={groomNickname} onChange={setGroomNickname} placeholder="Nama Panggilan" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Nama Ayah</label>
                        <Input value={groomFather} onChange={setGroomFather} placeholder="Nama Ayah" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Nama Ibu</label>
                        <Input value={groomMother} onChange={setGroomMother} placeholder="Nama Ibu" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Username Instagram</label>
                      <Input value={groomInstagram} onChange={setGroomInstagram} placeholder="@username" />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Foto Mempelai Pria</label>
                      <ImageUploadField value={groomPhoto} onChange={setGroomPhoto} placeholder="Masukkan URL atau unggah foto" />
                    </div>
                  </div>

                  {/* Bride Form */}
                  <div className="bg-white p-4 sm:p-6 border border-gray-100 rounded-xl sm:rounded-2xl shadow-sm space-y-4 relative">
                    <div className="pb-3 border-b border-gray-100 flex items-center gap-2">
                      <span className="text-lg">👰‍♀️</span>
                      <h3 className="text-sm font-extrabold text-gray-800">Mempelai Wanita (Bride)</h3>
                    </div>
                    
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Nama Lengkap</label>
                      <Input value={brideFullName} onChange={setBrideFullName} placeholder="Nama Lengkap Mempelai Wanita" />
                    </div>
                    
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Nama Panggilan</label>
                      <Input value={brideNickname} onChange={setBrideNickname} placeholder="Nama Panggilan" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Nama Ayah</label>
                        <Input value={brideFather} onChange={setBrideFather} placeholder="Nama Ayah" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Nama Ibu</label>
                        <Input value={brideMother} onChange={setBrideMother} placeholder="Nama Ibu" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Username Instagram</label>
                      <Input value={brideInstagram} onChange={setBrideInstagram} placeholder="@username" />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Foto Mempelai Wanita</label>
                      <ImageUploadField value={bridePhoto} onChange={setBridePhoto} placeholder="Masukkan URL atau unggah foto" />
                    </div>
                  </div>

                </div>
              ) : (
                /* Non-wedding: Single Host */
                <div className="bg-white p-4 sm:p-6 border border-gray-100 rounded-xl sm:rounded-2xl shadow-sm space-y-4 max-w-2xl mx-auto">
                  <div className="pb-3 border-b border-gray-100 flex items-center gap-2">
                    <span className="text-lg">👤</span>
                    <h3 className="text-sm font-extrabold text-gray-800">Profil Tokoh Utama</h3>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Nama Tokoh Utama / Nama Anak</label>
                    <Input 
                      value={mainPersonName} 
                      onChange={setMainPersonName} 
                      placeholder="Masukkan nama lengkap atau judul subjek" 
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Foto Utama</label>
                    <ImageUploadField 
                      value={mainPhoto} 
                      onChange={setMainPhoto} 
                      placeholder="Masukkan URL atau unggah foto utama" 
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SCHEDULE & VENUE */}
          {activeTab === 'schedule' && (
            <div className="max-w-3xl mx-auto space-y-6">
              
              {/* Main Countdown Date */}
              <div className="bg-white p-4 sm:p-6 border border-gray-100 rounded-xl sm:rounded-2xl shadow-sm space-y-4">
                <h3 className="text-xs font-extrabold text-gray-800 border-b border-gray-100 pb-2">📅 Tanggal Utama & Hitung Mundur</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Tanggal Acara Utama (YYYY-MM-DD)</label>
                    <Input 
                      type="date" 
                      value={countdownDate} 
                      onChange={setCountdownDate} 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Waktu Mulai (HH:MM)</label>
                    <Input 
                      type="time" 
                      value={countdownTime} 
                      onChange={setCountdownTime} 
                    />
                  </div>
                </div>
              </div>

              {/* Sessions Details (event_details) */}
              <div className="bg-white p-4 sm:p-6 border border-gray-100 rounded-xl sm:rounded-2xl shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h3 className="text-xs font-extrabold text-gray-800">⏱️ Detail Sesi Acara</h3>
                  <button
                    onClick={addSession}
                    className="flex items-center gap-1 text-[10px] font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 px-2.5 py-1.5 rounded-lg transition-all"
                  >
                    <PlusIcon className="w-3 h-3" /> Tambah Sesi
                  </button>
                </div>

                <div className="space-y-4">
                  {sessions.map((session, index) => (
                    <ItemCard
                      key={session.id}
                      title={`Sesi ${index + 1}: ${session.name || 'Belum dinamai'}`}
                      onRemove={() => removeSession(session.id)}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 block mb-1">Nama Sesi</label>
                          <Input 
                            value={session.name} 
                            onChange={v => updateSession(session.id, { name: v })} 
                            placeholder="Contoh: Akad Nikah / Resepsi / Pesta"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 block mb-1">Tanggal Acara</label>
                          <Input 
                            type="date"
                            value={session.date} 
                            onChange={v => updateSession(session.id, { date: v })} 
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 block mb-1">Waktu Sesi</label>
                          <Input 
                            value={session.time} 
                            onChange={v => updateSession(session.id, { time: v })} 
                            placeholder="Contoh: 08:00 - Selesai"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 block mb-1">Zona Waktu</label>
                          <Input 
                            value={session.timezone || 'WIB'} 
                            onChange={v => updateSession(session.id, { timezone: v })} 
                            placeholder="WIB / WITA / WIT"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 mt-3">
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 block mb-1">Tempat & Alamat Acara</label>
                          <Input 
                            value={session.location} 
                            onChange={v => updateSession(session.id, { location: v })} 
                            placeholder="Gedung Serbaguna Papunda, Jl. Kenanga No.12"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 block mb-1">Link Google Maps</label>
                          <Input 
                            value={session.maps_link} 
                            onChange={v => updateSession(session.id, { maps_link: v })} 
                            placeholder="https://maps.google.com/..."
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 block mb-1">Catatan Tambahan (Opsional)</label>
                          <Input 
                            value={session.note} 
                            onChange={v => updateSession(session.id, { note: v })} 
                            placeholder="Contoh: Wajib mengenakan masker / Khusus keluarga inti"
                          />
                        </div>
                      </div>
                    </ItemCard>
                  ))}
                </div>
              </div>

              {/* Maps Section Props */}
              <div className="bg-white p-4 sm:p-6 border border-gray-100 rounded-xl sm:rounded-2xl shadow-sm space-y-4">
                <h3 className="text-xs font-extrabold text-gray-800 border-b border-gray-100 pb-2">📍 Peta Utama Google Maps</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Tempat Utama (Venue Name)</label>
                    <Input 
                      value={venueName} 
                      onChange={setVenueName} 
                      placeholder="Nama Gedung / Rumah / Rumah Ibadah" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Alamat Utama Lengkap</label>
                    <Textarea 
                      value={venueAddress} 
                      onChange={setVenueAddress} 
                      placeholder="Tuliskan nama jalan, kelurahan, kecamatan, kabupaten secara lengkap."
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Link Google Maps Peta</label>
                    <Input 
                      value={mapsUrl} 
                      onChange={setMapsUrl} 
                      placeholder="https://maps.app.goo.gl/... atau https://maps.google.com/..." 
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: GIFT / REKENING */}
          {activeTab === 'gift' && (
            <div className="max-w-2xl mx-auto space-y-6">
              
              <div className="bg-white p-4 sm:p-6 border border-gray-100 rounded-xl sm:rounded-2xl shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div className="flex items-center gap-2">
                    <GiftIcon className="w-4 h-4 text-pink-500" />
                    <span className="text-xs font-bold text-gray-700">Aktifkan Hadiah Digital (Kado/Amplop)</span>
                  </div>
                  <Toggle checked={giftEnabled} onChange={setGiftEnabled} />
                </div>

                {giftEnabled && (
                  <div className="space-y-4 animate-slide-down pt-2">
                    
                    {/* Bank list */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-gray-600 block">Daftar Rekening / E-Wallet</label>
                        <button
                          onClick={addBank}
                          className="text-[10px] font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 px-2 py-1 rounded-lg transition-all"
                        >
                          + Tambah Rekening
                        </button>
                      </div>

                      <div className="space-y-2">
                        {giftBanks.map((bank, index) => (
                          <ItemCard
                            key={bank.id}
                            title={`Rekening #${index + 1}: ${bank.bank_name || ''}`}
                            onRemove={() => removeBank(bank.id)}
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                              <div>
                                <label className="text-[9px] font-bold text-gray-500 block mb-1">Bank / E-Wallet</label>
                                <Input 
                                  value={bank.bank_name} 
                                  onChange={v => updateBank(bank.id, { bank_name: v })} 
                                  placeholder="BCA / Mandiri / GoPay"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="text-[9px] font-bold text-gray-500 block mb-1">Nomor Rekening</label>
                                <Input 
                                  value={bank.account_number} 
                                  onChange={v => updateBank(bank.id, { account_number: v })} 
                                  placeholder="Masukkan nomor rekening"
                                />
                              </div>
                            </div>
                            <div className="mt-2">
                              <label className="text-[9px] font-bold text-gray-500 block mb-1">Nama Pemilik Rekening</label>
                              <Input 
                                value={bank.account_name} 
                                onChange={v => updateBank(bank.id, { account_name: v })} 
                                placeholder="Masukkan nama pemilik rekening"
                              />
                            </div>
                          </ItemCard>
                        ))}
                        {giftBanks.length === 0 && (
                          <p className="text-[11px] text-gray-400 italic text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            Belum ada rekening ditambahkan. Klik "+ Tambah Rekening" di atas.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Gift physical address */}
                    <div className="border-t border-gray-150 pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-gray-650 block">Kirim Kado Fisik (Alamat Pengiriman)</label>
                        <Toggle checked={addressEnabled} onChange={setAddressEnabled} />
                      </div>

                      {addressEnabled && (
                        <div className="p-4 bg-gray-50 border border-gray-150 rounded-xl space-y-3 animate-slide-down">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-gray-500 block mb-1">Nama Penerima</label>
                              <Input 
                                value={addressRecipient} 
                                onChange={setAddressRecipient} 
                                placeholder="Nama Lengkap Penerima Paket" 
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-gray-500 block mb-1">No. Telepon / HP</label>
                              <Input 
                                value={addressPhone} 
                                onChange={setAddressPhone} 
                                placeholder="Contoh: 08123456789" 
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-gray-500 block mb-1">Alamat Lengkap Rumah / Kantor</label>
                            <Textarea 
                              value={addressText} 
                              onChange={setAddressText} 
                              placeholder="Masukkan nama jalan, nomor rumah, RT/RW, kecamatan, kota/kabupaten, dan kode pos secara rinci." 
                            />
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-4 py-3.5 sm:px-6 sm:py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50 flex-shrink-0">
          {saveError ? (
            <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 max-w-full sm:max-w-[50%] truncate" title={saveError}>
              <AlertIcon className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
              {saveError}
            </p>
          ) : (
            <p className="text-[10px] text-gray-400 font-semibold flex items-center justify-center sm:justify-start gap-1 w-full sm:w-auto">
              <AlertIcon className="w-3.5 h-3.5 text-pink-500 flex-shrink-0" />
              Terapkan data ke editor atau langsung simpan ke server.
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {/* Terapkan & Simpan - Full width at the top on mobile */}
            <button
              onClick={() => handleApply(true)}
              disabled={saving}
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-xs font-extrabold text-white rounded-xl shadow-md active:scale-[0.98] sm:active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 order-1 sm:order-3"
            >
              {saving ? (
                <>
                  <LoaderIcon className="w-3.5 h-3.5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4" />
                  Terapkan & Simpan
                </>
              )}
            </button>

            {/* Other actions grouped together and side-by-side on mobile below it */}
            <div className="flex gap-2 w-full sm:w-auto order-2">
              <button
                onClick={() => handleApply(false)}
                disabled={saving}
                className="flex-1 sm:flex-none px-4 py-2.5 border border-pink-200 bg-pink-50 hover:bg-pink-100/50 text-xs font-bold text-pink-700 rounded-xl transition-colors text-center active:scale-95 disabled:opacity-50"
              >
                Terapkan
              </button>
              <button
                onClick={onClose}
                disabled={saving}
                className="flex-1 sm:flex-none px-4 py-2.5 border border-gray-200 text-xs font-bold text-gray-600 rounded-xl hover:bg-gray-100 transition-colors text-center active:scale-95 disabled:opacity-50"
              >
                Batal
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
