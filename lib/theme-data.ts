// Global data interfaces untuk semua theme
export interface ThemeData {
  status: string;
  content_user_id: number;
  theme: {
    defaultBgImage1: string;
    defaultBgImage: string;
    accentColor: string;
    textColor: string;
    background: string;
  };
  content: {
    plugin: {
      navbar?: boolean;
      rsvp?: boolean;
      gift?: boolean;
      youtube_link?: string;
    };
    opening: {
      title: string;
      toLabel: string;
      to: string;
      wedding_text?: string;
    };
    quotes: any;
    invitation: any;
    children: Array<{
      name: string;
      nickname?: string;
    }>;
    parents: {
      groom?: any;
      bride?: any;
    };
    gallery: {
      items: string[];
      enabled?: boolean;
    };
    our_story: any[];
    our_story_enabled?: boolean;
    music: {
      url?: string;
      enabled?: boolean;
    };
    closing: any;
    title: string;
    quote: any;
    quote_enabled?: boolean;
    gallery_enabled?: boolean;
    font: {
      special?: string;
      body?: string;
      heading?: string;
    };
    turut?: {
      enabled?: boolean;
      list?: any[];
    };
    bank_transfer?: {
      enabled?: boolean;
    };
  };
  decorations: {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
  };
  event: {
    [key: string]: {
      title?: string;
      date: string;
      time: string;
      location: string;
      mapsLink: string;
      note?: string;
    };
  };
  category_type: {
    id: number;
    name: string;
  };
}

export interface EventData {
  date: string;
  time: string;
  location: string;
  mapsLink: string;
  note?: string;
  title?: string;
}

export interface ThemeEvent {
  key: string;
  title?: string;
  date: string;
  time: string;
  location: string;
  mapsLink: string;
}

// Helper functions
export const processFont = (fontStyle?: string): string => {
  return fontStyle?.replace('font-family:', '').trim().replace(';', '') || 'sans-serif';
};

export const getFirstEvent = (events: { [key: string]: EventData }): ThemeEvent | null => {
  const eventsList: ThemeEvent[] = Object.entries(events ?? {})
    .map(([key, ev]) => {
      const eventData = ev as EventData;
      return eventData ? {
        key: key,
        title: eventData.title || key.charAt(0).toUpperCase() + key.slice(1),
        date: eventData.date || '',
        time: eventData.time || '',
        location: eventData.location || '',
        mapsLink: eventData.mapsLink || '',
      } : null;
    })
    .filter(Boolean) as ThemeEvent[];

  const sortedEvents = [...eventsList].sort((a, b) => {
    try {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    } catch (error) {
      console.error("Error parsing date for countdown:", error, a, b);
      return 0;
    }
  });

  return sortedEvents[0] || null;
};

export const createCalendarUrl = (
  firstEvent: ThemeEvent, 
  sortedEvents: ThemeEvent[], 
  nickname: string,
  category_type?: { name: string }
): string => {
  if (!firstEvent) return '';
  
  try {
    const eventDate = new Date(`${firstEvent.date}T${firstEvent.time}`);
    const start = eventDate.toISOString().replace(/-|:|\.\d+/g, '');
    const endDate = new Date(eventDate.getTime() + 3600000);
    const end = endDate.toISOString().replace(/-|:|\.\d+/g, '');

    const eventDetails = sortedEvents.map(ev =>
      `${ev.title}: ${ev.date} ${ev.time} @ ${ev.location} (${ev.mapsLink})`
    ).join('\n');

    const lowerCategory = (category_type?.name || '').toString().toLowerCase();
    const isKhitan = lowerCategory.includes('khitan');

    let titleText = `Undangan Pernikahan - ${nickname}`;
    let detailsText = `Kami dari papunda.com bermaksud mengundang Anda di acara ini. Merupakan suatu kehormatan dan kebahagiaan bagi pihak mengundang, apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu pada hari :\n${eventDetails}`;

    if (isKhitan) {
      const childName = nickname.split('&')[0].trim();
      titleText = `Undangan Khitanan${childName ? ' - ' + childName : ''}`;
      detailsText = `Kami mengundang Anda untuk menghadiri acara khitanan${childName ? ' ' + childName : ''}. Merupakan suatu kehormatan apabila Bapak/Ibu/Saudara/i berkenan hadir dan mendoakan. \n${eventDetails}`;
    }

    return `https://www.google.com/calendar/render?action=TEMPLATE&dates=${start}/${end}` +
      `&text=${encodeURIComponent(titleText)}` +
      `&details=${encodeURIComponent(detailsText)}` +
      `&location=${encodeURIComponent(firstEvent.location)}`;
  } catch (error) {
    console.error("Error creating calendar URL:", error);
    return '';
  }
};

// Default theme configuration
export const defaultTheme = {
  accentColor: '#E50913',
  textColor: '#FFFFFF',
  background: '#000000',
  defaultBgImage1: '/images/default-bg.jpg',
  defaultBgImage: '/images/default-bg.jpg',
};

// Default content structure
export const defaultContent = {
  plugin: {
    navbar: true,
    rsvp: false,
    gift: false,
    youtube_link: '',
  },
  opening: {
    title: 'The Wedding of',
    toLabel: 'Dear',
    to: 'Bapak/Ibu/Saudara/i',
    wedding_text: 'THE WEDDING OF',
  },
  quotes: null,
  invitation: null,
  children: [
    { name: 'Bride Name', nickname: 'Bride' },
    { name: 'Groom Name', nickname: 'Groom' },
  ],
  parents: {},
  gallery: {
    items: [],
    enabled: false,
  },
  our_story: [],
  our_story_enabled: false,
  music: {
    url: '',
    enabled: false,
  },
  closing: null,
  title: 'Wedding Celebration',
  quote: null,
  quote_enabled: false,
  gallery_enabled: false,
  font: {
    special: 'font-family: "Playfair Display", serif;',
    body: 'font-family: "Inter", sans-serif;',
    heading: 'font-family: "Playfair Display", serif;',
  },
  turut: {
    enabled: false,
    list: [],
  },
  bank_transfer: {
    enabled: false,
  },
};