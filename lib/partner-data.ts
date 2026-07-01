export interface WeddingPackage {
  name: string;
  description: string;
  inclusions: string[];
}

export interface Testimonial {
  name: string;
  couplePhoto: string;
  city: string;
  rating: number;
  comment: string;
}

export interface PortfolioItem {
  title: string;
  category: string;
  image: string;
}

export interface Partner {
  cityId: string;
  cityName: string;
  partnerName: string;
  logo: string;
  heroImage: string;
  rating: number;
  reviewsCount: number;
  address: string;
  whatsapp: string;
  about: string;
  services: string[];
  packages: WeddingPackage[];
  portfolio: PortfolioItem[];
  testimonials: Testimonial[];
}

export const partnersData: Record<string, Partner> = {
  bogor: {
    cityId: "bogor",
    cityName: "Bogor",
    partnerName: "Event Papunda Bogor",
    logo: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=200&auto=format&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    rating: 4.9,
    reviewsCount: 148,
    address: "Jl. Pajajaran No. 12, Bogor Tengah, Kota Bogor",
    whatsapp: "6289654728249",
    about: "Event Papunda Bogor hadir sebagai solusi layanan pernikahan satu atap terbaik. Kami berkomitmen untuk menyajikan momen hari bahagia Anda dengan sentuhan modern yang elegan, teratur, dan profesional tanpa kerumitan koordinasi vendor terpisah.",
    services: ["Wedding Organizer", "Catering", "Dekorasi", "Photography", "Videography", "Makeup Artist", "Venue", "MC", "Undangan Digital Papunda"],
    packages: [
      {
        name: "Bronze (Intimate Wedding)",
        description: "Paket pernikahan intim yang sempurna untuk keluarga dan teman terdekat.",
        inclusions: [
          "Wedding Organizer Day of Event (4 Crew)",
          "Dekorasi Pelaminan & Area Pintu Masuk standard",
          "Makeup & Busana Pengantin (1x)",
          "Dokumentasi Foto & Video (1 Hari, Album Digital)",
          "Sound System & MC Profesional",
          "Undangan Digital Papunda Premium"
        ]
      },
      {
        name: "Silver (Elegant Wedding)",
        description: "Paket lengkap dengan katering dan dekorasi semi-premium untuk kenyamanan acara Anda.",
        inclusions: [
          "Full Wedding Planning & Organizing (6 Crew)",
          "Katering Prasmanan untuk 400 Pax",
          "Dekorasi Pelaminan Semi-Premium & Lorong Masuk",
          "Makeup & Busana Pengantin + Orang Tua (Resepsi & Akad)",
          "Dokumentasi Foto & Cinematic Video",
          "Live Music Entertainment & MC Profesional",
          "Undangan Digital Papunda Premium + RSVP & QR Code"
        ]
      },
      {
        name: "Gold (Royal Wedding)",
        description: "Pengalaman pernikahan termewah dengan katering melimpah, dekorasi eksklusif, dan koordinasi penuh.",
        inclusions: [
          "Exclusive Wedding Planning & Day-of Coordination (8 Crew)",
          "Katering Premium untuk 800 Pax + 3 Food Stalls",
          "Dekorasi Pelaminan Mewah Kastil/Rustic Modern",
          "Makeup Artist Premium & Gaun Pengantin Eksklusif",
          "Dokumentasi Foto Album Kolase + Video Cinematic Ultra HD",
          "Full Band Entertainment, MC Nasional & Wedding Singer",
          "Undangan Digital Papunda VIP + Sistem Buku Tamu Digital"
        ]
      }
    ],
    portfolio: [
      { title: "Intimate Outdoor Wedding at Pine Forest", category: "Wedding Outdoor", image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=600&auto=format&fit=crop" },
      { title: "Traditional Sundanese Ceremony", category: "Traditional Wedding", image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop" },
      { title: "Modern Elegant Wedding Hall", category: "Modern Wedding", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600&auto=format&fit=crop" }
    ],
    testimonials: [
      { name: "Rian & Dita", couplePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop", city: "Bogor", rating: 5, comment: "Sangat terbantu dengan tim Papunda Bogor! Semuanya teratur dan kateringnya enak banget." }
    ]
  },
  bandung: {
    cityId: "bandung",
    cityName: "Bandung",
    partnerName: "Event Papunda Bandung",
    logo: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=200&auto=format&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop",
    rating: 4.8,
    reviewsCount: 112,
    address: "Jl. Dago No. 142, Coblong, Kota Bandung",
    whatsapp: "6289654728249",
    about: "Event Papunda Bandung menawarkan konsep pernikahan kreatif dan dekorasi floral aesthetic yang dipandu oleh tim handal khas Kota Kembang.",
    services: ["Wedding Organizer", "Catering", "Dekorasi", "Photography", "Videography", "Makeup Artist", "MC", "Entertainment", "Undangan Digital Papunda"],
    packages: [
      {
        name: "Bronze (Intimate Wedding)",
        description: "Konsep pernikahan minimalis nan aesthetic khas Dago untuk 150 undangan.",
        inclusions: [
          "Wedding Organizer Day of Event (4 Crew)",
          "Aesthetic Floral Decoration",
          "Makeup & Hairdo Pengantin",
          "Dokumentasi Foto & Video",
          "MC Profesional & Acoustic Set",
          "Undangan Digital Papunda Premium"
        ]
      },
      {
        name: "Silver (Elegant Wedding)",
        description: "Paket lengkap dengan dekorasi semi-outdoor premium dan katering lezat.",
        inclusions: [
          "Full Wedding Planning (6 Crew)",
          "Katering Buffet 500 Pax",
          "Premium Rustic/Modern Decor",
          "Busana Akad & Resepsi Pengantin + MUA",
          "Cinematic Wedding Film & Photo Album",
          "Acoustic Band & MC",
          "Undangan Digital Papunda Premium + RSVP & QR"
        ]
      },
      {
        name: "Gold (Royal Wedding)",
        description: "Pernikahan impian megah dengan fasilitas super lengkap dan katering melimpah.",
        inclusions: [
          "Exclusive Wedding Planning & Day-of Coordination (8 Crew)",
          "Katering Premium 900 Pax + 4 Food Stalls",
          "Grand Luxury Wedding Decor",
          "Premium MUA & Couture Wedding Gown",
          "Cinematic Wedding Film Ultra HD & Photo Album",
          "Full Band Entertainment & MC Nasional",
          "Undangan Digital Papunda VIP + Guest Management System"
        ]
      }
    ],
    portfolio: [
      { title: "Garden Party Wedding in Lembang", category: "Garden Party", image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=600&auto=format&fit=crop" },
      { title: "Modern White Wedding in Dago", category: "Modern Wedding", image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop" }
    ],
    testimonials: [
      { name: "Fadel & Sarah", couplePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop", city: "Bandung", rating: 5, comment: "Dekorasi Lembang Garden Party kami sangat indah! Kerja tim Papunda Bandung luar biasa." }
    ]
  },
  jakarta: {
    cityId: "jakarta",
    cityName: "Jakarta",
    partnerName: "Event Papunda Jakarta",
    logo: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=200&auto=format&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop",
    rating: 4.9,
    reviewsCount: 215,
    address: "Sudirman Central Business District (SCBD), Jakarta Selatan",
    whatsapp: "6289654728249",
    about: "Event Papunda Jakarta merupakan spesialis dalam perencanaan dan pelaksanaan pernikahan mewah berskala besar di hotel bintang 5 maupun gedung pertemuan eksklusif di wilayah ibukota.",
    services: ["Wedding Organizer", "Catering", "Dekorasi", "Photography", "Videography", "Makeup Artist", "Venue", "MC", "Entertainment", "Bridal", "Undangan Digital Papunda"],
    packages: [
      {
        name: "Bronze (Intimate Wedding)",
        description: "Pernikahan intim dan elegan untuk kawasan Jakarta.",
        inclusions: [
          "Wedding Organizer Day of Event (4 Crew)",
          "Modern Minimalist Decor",
          "Makeup & Busana Pengantin (1x)",
          "Dokumentasi Foto & Video",
          "MC Profesional & Acoustic Set",
          "Undangan Digital Papunda Premium"
        ]
      },
      {
        name: "Silver (Elegant Wedding)",
        description: "Paket lengkap standar gedung di Jakarta dengan koordinasi profesional.",
        inclusions: [
          "Full Wedding Planning (6 Crew)",
          "Katering Prasmanan 500 Pax",
          "Elegant Floral & Lighting Decoration",
          "Makeup Pengantin Premium & Busana Lengkap",
          "Cinematic Wedding Film & Photo Album",
          "Live Music & MC Profesional",
          "Undangan Digital Papunda Premium + RSVP & QR"
        ]
      },
      {
        name: "Gold (Royal Wedding)",
        description: "Pernikahan super mewah dengan katering kelas hotel bintang dan koordinasi VIP.",
        inclusions: [
          "Exclusive Wedding Planning & Day-of Coordination (10 Crew)",
          "Katering Premium 1000 Pax + 5 Food Stalls",
          "Grand Royal Wedding Decoration",
          "Celebrity MUA & Custom Wedding Gown",
          "Cinematic Wedding Film 4K & Premium Photo Books",
          "Orchestra/Full Band Entertainment & MC Nasional",
          "Undangan Digital Papunda VIP + RSVP & Guest Management System"
        ]
      }
    ],
    portfolio: [
      { title: "Grand Ballroom Wedding", category: "Wedding Indoor", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600&auto=format&fit=crop" },
      { title: "Elegant Glass House Wedding", category: "Modern Wedding", image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=600&auto=format&fit=crop" }
    ],
    testimonials: [
      { name: "Andito & Clarissa", couplePhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop", city: "Jakarta", rating: 5, comment: "Pernikahan di ballroom SCBD berjalan mulus tanpa celah berkat tim Event Papunda Jakarta." }
    ]
  },
  bekasi: {
    cityId: "bekasi",
    cityName: "Bekasi",
    partnerName: "Event Papunda Bekasi",
    logo: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=200&auto=format&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    rating: 4.7,
    reviewsCount: 89,
    address: "Jl. Ahmad Yani No. 8, Bekasi Barat, Kota Bekasi",
    whatsapp: "6289654728249",
    about: "Event Papunda Bekasi melayani penyusunan pesta pernikahan modern dan tradisional secara terpadu demi kelancaran hari bahagia Anda.",
    services: ["Wedding Organizer", "Catering", "Dekorasi", "Photography", "Videography", "Makeup Artist", "MC", "Undangan Digital Papunda"],
    packages: [
      {
        name: "Bronze (Intimate Wedding)",
        description: "Cocok untuk resep akad nikah dan pesta intim keluarga.",
        inclusions: [
          "Wedding Organizer Day of Event (4 Crew)",
          "Standard Elegant Decor",
          "Makeup & Busana Akad Pengantin",
          "Dokumentasi Foto",
          "MC Pernikahan",
          "Undangan Digital Papunda Premium"
        ]
      },
      {
        name: "Silver (Elegant Wedding)",
        description: "Paket lengkap resep gedung dengan katering melimpah.",
        inclusions: [
          "Full Wedding Planning (6 Crew)",
          "Katering Prasmanan 400 Pax",
          "Dekorasi Pelaminan Semi-Mewah",
          "Busana Akad & Resepsi Pengantin + Orang Tua",
          "Cinematic Video & Foto Album",
          "Live Music & MC",
          "Undangan Digital Papunda Premium + RSVP & QR"
        ]
      }
    ],
    portfolio: [
      { title: "Traditional Javanese Bekasi Hall", category: "Traditional Wedding", image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop" }
    ],
    testimonials: [
      { name: "Eko & Rina", couplePhoto: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop", city: "Bekasi", rating: 5, comment: "Sangat puas dengan kateringnya, tim Papunda Bekasi sangat profesional." }
    ]
  },
  depok: {
    cityId: "depok",
    cityName: "Depok",
    partnerName: "Event Papunda Depok",
    logo: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=200&auto=format&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    rating: 4.8,
    reviewsCount: 94,
    address: "Jl. Margonda Raya No. 45, Pancoran Mas, Kota Depok",
    whatsapp: "6289654728249",
    about: "Event Papunda Depok mengusung konsep praktis dan dinamis dengan integrasi digital penuh untuk menyusun pernikahan impian Anda.",
    services: ["Wedding Organizer", "Catering", "Dekorasi", "Photography", "Videography", "Makeup Artist", "MC", "Undangan Digital Papunda"],
    packages: [
      {
        name: "Bronze (Intimate Wedding)",
        description: "Pilihan terbaik untuk pernikahan intim di rumah atau kafe.",
        inclusions: [
          "Wedding Organizer Day of Event (4 Crew)",
          "Aesthetic Backdrop Decor",
          "Makeup & Busana Pengantin (1x)",
          "Dokumentasi Foto",
          "MC & Sound System",
          "Undangan Digital Papunda Premium"
        ]
      },
      {
        name: "Silver (Elegant Wedding)",
        description: "Paket lengkap dengan katering lezat dan dekorasi menawan.",
        inclusions: [
          "Full Wedding Planning (5 Crew)",
          "Katering Prasmanan 450 Pax",
          "Dekorasi Pelaminan Elegan",
          "Busana Akad & Resepsi + MUA",
          "Cinematic Wedding Film & Photo",
          "Live Music & MC",
          "Undangan Digital Papunda Premium + RSVP & QR"
        ]
      }
    ],
    portfolio: [
      { title: "Intimate Garden Wedding", category: "Intimate Wedding", image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=600&auto=format&fit=crop" }
    ],
    testimonials: [
      { name: "Hendra & Siska", couplePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop", city: "Depok", rating: 4, comment: "Responsif sejak awal perencanaan hingga hari H. Event Papunda Depok mantap!" }
    ]
  },
  yogyakarta: {
    cityId: "yogyakarta",
    cityName: "Yogyakarta",
    partnerName: "Event Papunda Yogyakarta",
    logo: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=200&auto=format&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop",
    rating: 4.9,
    reviewsCount: 165,
    address: "Jl. Kaliurang KM 7, Depok, Sleman, Yogyakarta",
    whatsapp: "6289654728249",
    about: "Event Papunda Yogyakarta ahli dalam menyusun upacara adat Jawa tradisional yang luhur (Pakem) maupun kolaborasi modern kontemporer.",
    services: ["Wedding Organizer", "Catering", "Dekorasi", "Photography", "Videography", "Makeup Artist", "Venue", "MC", "Undangan Digital Papunda"],
    packages: [
      {
        name: "Bronze (Traditional Intimate)",
        description: "Resepsi tradisional intim Jogja untuk keluarga dekat.",
        inclusions: [
          "Wedding Organizer Day of Event (4 Crew)",
          "Dekorasi Tradisional Jawa Klasik",
          "Makeup & Busana Adat Paes Ageng / Solo Putri",
          "Dokumentasi Foto Tradisional",
          "MC Adat Jawa & Sound",
          "Undangan Digital Papunda Premium"
        ]
      },
      {
        name: "Silver (Yogyakarta Heritage)",
        description: "Paket lengkap adat jawa dengan katering masakan khas nusantara dan hiburan gamelan/akustik.",
        inclusions: [
          "Full Wedding Planning (6 Crew)",
          "Katering Prasmanan Tradisional 500 Pax",
          "Dekorasi Pelaminan Adat/Rustic Kombinasi",
          "Makeup & Busana Akad/Resepsi Lengkap",
          "Cinematic Wedding Film & Photo Album",
          "MC Adat + Gamelan/Acoustic Music",
          "Undangan Digital Papunda Premium + RSVP & QR"
        ]
      }
    ],
    portfolio: [
      { title: "Royal Javanese Wedding at Pendopo", category: "Traditional Wedding", image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop" }
    ],
    testimonials: [
      { name: "Agung & Sekar", couplePhoto: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop", city: "Yogyakarta", rating: 5, comment: "Pernikahan adat Paes Ageng kami berjalan sakral dan lancar. Terima kasih tim Event Papunda!" }
    ]
  },
  semarang: {
    cityId: "semarang",
    cityName: "Semarang",
    partnerName: "Event Papunda Semarang",
    logo: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=200&auto=format&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    rating: 4.8,
    reviewsCount: 78,
    address: "Jl. Gajahmungkur No. 12, Kota Semarang",
    whatsapp: "6289654728249",
    about: "Event Papunda Semarang menyediakan layanan koordinasi pesta pernikahan profesional yang berorientasi penuh pada detail dan kesuksesan hari besar Anda.",
    services: ["Wedding Organizer", "Catering", "Dekorasi", "Photography", "Videography", "Makeup Artist", "MC", "Undangan Digital Papunda"],
    packages: [
      {
        name: "Bronze (Intimate)",
        description: "Pesta pernikahan sederhana dan sakral untuk keluarga terdekat.",
        inclusions: [
          "Wedding Organizer Day of Event (4 Crew)",
          "Elegant Simple Decor",
          "Makeup & Busana Pengantin Akad",
          "Dokumentasi Foto",
          "MC & Sound System",
          "Undangan Digital Papunda Premium"
        ]
      },
      {
        name: "Silver (Semarang Signature)",
        description: "Paket lengkap dengan pilihan menu katering bervariasi dan dekorasi megah.",
        inclusions: [
          "Full Wedding Planning (6 Crew)",
          "Katering Buffet 450 Pax",
          "Dekorasi Pelaminan Modern/Rustic",
          "Busana Lengkap Akad & Resepsi",
          "Foto & Cinematic Video",
          "Live Music & MC",
          "Undangan Digital Papunda Premium + RSVP & QR"
        ]
      }
    ],
    portfolio: [
      { title: "Modern Garden Wedding Semarang", category: "Garden Party", image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=600&auto=format&fit=crop" }
    ],
    testimonials: [
      { name: "Dimas & Wulan", couplePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop", city: "Semarang", rating: 5, comment: "Kerja tim yang sangat rapi. Kesiapan acara dipantau dengan baik lewat sistem terpadu Papunda." }
    ]
  },
  surabaya: {
    cityId: "surabaya",
    cityName: "Surabaya",
    partnerName: "Event Papunda Surabaya",
    logo: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=200&auto=format&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop",
    rating: 4.9,
    reviewsCount: 156,
    address: "Jl. Basuki Rahmat No. 64, Genteng, Kota Surabaya",
    whatsapp: "6289654728249",
    about: "Event Papunda Surabaya terpercaya dalam menghadirkan resepsi pernikahan kelas premium bergaya modern eropa maupun adat jawa timuran yang meriah dan berkesan.",
    services: ["Wedding Organizer", "Catering", "Dekorasi", "Photography", "Videography", "Makeup Artist", "Venue", "MC", "Entertainment", "Undangan Digital Papunda"],
    packages: [
      {
        name: "Bronze (Intimate Wedding)",
        description: "Pesta pernikahan modern minimalis intim di Kota Surabaya.",
        inclusions: [
          "Wedding Organizer Day of Event (4 Crew)",
          "Modern Minimalist Decor",
          "Makeup & Busana Akad Pengantin",
          "Dokumentasi Foto & Video",
          "MC & Acoustic",
          "Undangan Digital Papunda Premium"
        ]
      },
      {
        name: "Silver (Elegant Wedding)",
        description: "Paket premium dengan dekorasi floral megah dan katering untuk 500 tamu.",
        inclusions: [
          "Full Wedding Planning (6 Crew)",
          "Katering Prasmanan 500 Pax",
          "Premium Floral Decor & Gate",
          "Makeup & Gaun Resepsi + Akad MUA",
          "Cinematic Wedding Film & Foto Album",
          "Entertainment Live Band & MC",
          "Undangan Digital Papunda Premium + RSVP & QR"
        ]
      },
      {
        name: "Gold (Majestic Royal)",
        description: "Kemewahan tiada tanding dengan katering premium dan pelayanan VIP di ballroom ternama.",
        inclusions: [
          "Exclusive Wedding Planning & Coordinator (8 Crew)",
          "Katering Premium 900 Pax + 4 Food Stalls",
          "Grand Luxurious Palace Decoration",
          "Exclusive MUA & Custom Wedding Gown",
          "Cinematic Video 4K, Drone & Premium Album",
          "Full Band, Saxophone & MC Nasional",
          "Undangan Digital VIP & Digital Guestbook System"
        ]
      }
    ],
    portfolio: [
      { title: "Luxurious Ballroom Wedding Surabaya", category: "Wedding Indoor", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600&auto=format&fit=crop" }
    ],
    testimonials: [
      { name: "Tommy & Maria", couplePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop", city: "Surabaya", rating: 5, comment: "Kualitas bintang lima! Seluruh kru Event Papunda bekerja sangat profesional." }
    ]
  },
  malang: {
    cityId: "malang",
    cityName: "Malang",
    partnerName: "Event Papunda Malang",
    logo: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=200&auto=format&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=1200&auto=format&fit=crop",
    rating: 4.8,
    reviewsCount: 82,
    address: "Jl. Ijen No. 10, Klojen, Kota Malang",
    whatsapp: "6289654728249",
    about: "Event Papunda Malang spesialis dalam pernikahan outdoor dengan pemandangan pegunungan yang menakjubkan dan dekorasi rustic natural.",
    services: ["Wedding Organizer", "Catering", "Dekorasi", "Photography", "Videography", "Makeup Artist", "MC", "Undangan Digital Papunda"],
    packages: [
      {
        name: "Bronze (Intimate Outdoor)",
        description: "Cocok untuk pernikahan luar ruangan bergaya intim dan santai.",
        inclusions: [
          "Wedding Organizer Day of Event (4 Crew)",
          "Rustic Outdoor Backdrops",
          "Makeup & Busana Akad Pengantin",
          "Dokumentasi Foto",
          "MC & Acoustic",
          "Undangan Digital Papunda Premium"
        ]
      },
      {
        name: "Silver (Malang Highland)",
        description: "Pesta luar ruangan mewah dengan pemandangan alam indah dan hidangan lengkap.",
        inclusions: [
          "Full Wedding Planning (6 Crew)",
          "Katering Prasmanan 400 Pax",
          "Premium Rustic/Boho Decor & Lighting",
          "Gaun Pengantin Akad + Resepsi & MUA",
          "Cinematic Wedding Film & Photo",
          "Live Acoustic Band & MC",
          "Undangan Digital Papunda Premium + RSVP & QR"
        ]
      }
    ],
    portfolio: [
      { title: "Scenic Outdoor Wedding in Batu", category: "Wedding Outdoor", image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=600&auto=format&fit=crop" }
    ],
    testimonials: [
      { name: "Budi & Maya", couplePhoto: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop", city: "Malang", rating: 5, comment: "Pernikahan outdoor impian kami berjalan sangat lancar. Rapi sekali koordinasinya." }
    ]
  },
  medan: {
    cityId: "medan",
    cityName: "Medan",
    partnerName: "Event Papunda Medan",
    logo: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=200&auto=format&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    rating: 4.8,
    reviewsCount: 91,
    address: "Jl. Sudirman No. 15, Medan Baru, Kota Medan",
    whatsapp: "6289654728249",
    about: "Event Papunda Medan siap mewujudkan pesta pernikahan adat (Batak, Melayu, Karo, Mandailing, Tionghoa) maupun modern internasional dengan megah.",
    services: ["Wedding Organizer", "Catering", "Dekorasi", "Photography", "Videography", "Makeup Artist", "Venue", "MC", "Undangan Digital Papunda"],
    packages: [
      {
        name: "Bronze (Intimate Wedding)",
        description: "Pesta resepsi intim modern untuk 150 undangan.",
        inclusions: [
          "Wedding Organizer Day of Event (4 Crew)",
          "Modern Backdrop Decor",
          "Makeup & Busana Pengantin",
          "Dokumentasi Foto",
          "MC Pernikahan & Sound",
          "Undangan Digital Papunda Premium"
        ]
      },
      {
        name: "Silver (Deli Elegant)",
        description: "Resepsi lengkap dengan dekorasi adat/modern premium dan katering lezat khas Medan.",
        inclusions: [
          "Full Wedding Planning (6 Crew)",
          "Katering Prasmanan 500 Pax",
          "Premium Adat/Modern Decoration",
          "Makeup Artist Premium & Busana Pengantin",
          "Cinematic Wedding Film & Photo Album",
          "Live Music Band & MC Profesional",
          "Undangan Digital Papunda Premium + RSVP & QR"
        ]
      }
    ],
    portfolio: [
      { title: "Traditional Batak Wedding", category: "Traditional Wedding", image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop" }
    ],
    testimonials: [
      { name: "Alvin & Ruth", couplePhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop", city: "Medan", rating: 5, comment: "Pernikahan adat kami sukses besar, manajemen waktu dari tim Papunda Medan luar biasa!" }
    ]
  },
  makassar: {
    cityId: "makassar",
    cityName: "Makassar",
    partnerName: "Event Papunda Makassar",
    logo: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=200&auto=format&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop",
    rating: 4.7,
    reviewsCount: 65,
    address: "Jl. Penghibur No. 10, Ujung Pandang, Kota Makassar",
    whatsapp: "6289654728249",
    about: "Event Papunda Makassar mengkhususkan diri pada pernikahan adat Bugis-Makassar yang kental dengan adat istiadat luhur maupun konsep modern pesisir pantai.",
    services: ["Wedding Organizer", "Catering", "Dekorasi", "Photography", "Videography", "Makeup Artist", "MC", "Undangan Digital Papunda"],
    packages: [
      {
        name: "Bronze (Intimate Wedding)",
        description: "Pilihan hemat untuk pernikahan adat/modern berskala kecil.",
        inclusions: [
          "Wedding Organizer Day of Event (4 Crew)",
          "Aesthetic Backdrop Decor",
          "Makeup & Busana Adat Pengantin (1x)",
          "Dokumentasi Foto",
          "MC Pernikahan",
          "Undangan Digital Papunda Premium"
        ]
      },
      {
        name: "Silver (Bugis-Makassar Heritage)",
        description: "Pesta megah berdekorasi adat Bugis/Modern dengan katering prasmanan lezat.",
        inclusions: [
          "Full Wedding Planning (6 Crew)",
          "Katering Prasmanan 450 Pax",
          "Premium Adat Bugis/Makassar Decor",
          "Busana Adat Pengantin lengkap & MUA",
          "Cinematic Wedding Film & Photo Album",
          "Live Music & MC Profesional",
          "Undangan Digital Papunda Premium + RSVP & QR"
        ]
      }
    ],
    portfolio: [
      { title: "Bugis-Makassar Traditional Wedding", category: "Traditional Wedding", image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop" }
    ],
    testimonials: [
      { name: "Rizal & Indah", couplePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop", city: "Makassar", rating: 5, comment: "Pemberian dekorasi adat Bugis sangat detail dan indah. Seluruh panitia bekerja hebat." }
    ]
  },
  bali: {
    cityId: "bali",
    cityName: "Bali",
    partnerName: "Event Papunda Bali",
    logo: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=200&auto=format&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=1200&auto=format&fit=crop",
    rating: 4.9,
    reviewsCount: 184,
    address: "Jl. Sunset Road No. 88, Kuta, Kabupaten Badung, Bali",
    whatsapp: "6289654728249",
    about: "Event Papunda Bali siap mewujudkan Destination Wedding impian Anda di pantai pasir putih, tebing Uluwatu, maupun villa mewah kawasan Ubud.",
    services: ["Wedding Organizer", "Catering", "Dekorasi", "Photography", "Videography", "Makeup Artist", "Venue", "MC", "Entertainment", "Undangan Digital Papunda"],
    packages: [
      {
        name: "Bronze (Intimate Cliff/Beach)",
        description: "Pernikahan intim elok di pinggir pantai Bali untuk 50 undangan.",
        inclusions: [
          "Wedding Organizer Day of Event (4 Crew)",
          "Tropical Beach Altar Decor",
          "Makeup & Busana Pengantin (1x)",
          "Dokumentasi Foto & Video",
          "Acoustic Singer & MC",
          "Undangan Digital Papunda Premium"
        ]
      },
      {
        name: "Silver (Dewata Signature)",
        description: "Resepsi lengkap dengan latar keindahan Bali dan katering berkelas.",
        inclusions: [
          "Full Wedding Planning (6 Crew)",
          "Katering Prasmanan / Set Menu 150 Pax",
          "Premium Tropical/Boho Floral Decor",
          "Makeup & Busana Pengantin Akad + Resepsi",
          "Cinematic Wedding Film & Photo Album",
          "Live Acoustic Band, MC & Balinese Dance Show",
          "Undangan Digital Papunda Premium + RSVP & QR"
        ]
      },
      {
        name: "Gold (Royal Bali Wedding)",
        description: "Pernikahan termegah di Bali dengan katering premium, tarian tradisional kolosal, dan koordinasi eksklusif.",
        inclusions: [
          "Exclusive Wedding Planning & Day-of Coordination (8 Crew)",
          "Katering Fine Dining Premium 300 Pax + Stalls",
          "Luxurious Tropical Forest / Cliff Altar Decor",
          "Premium MUA & Couture Wedding Dress",
          "Cinematic Film 4K, Drone & Premium Album Books",
          "Full Band, Fire Dance, Kecak Show & MC Nasional",
          "Undangan Digital Papunda VIP + Sistem Buku Tamu & Check-in QR"
        ]
      }
    ],
    portfolio: [
      { title: "Tropical Beach Wedding at Sunset Kuta", category: "Wedding Outdoor", image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=600&auto=format&fit=crop" },
      { title: "Lush Garden Wedding in Ubud", category: "Garden Party", image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=600&auto=format&fit=crop" }
    ],
    testimonials: [
      { name: "Devon & Jessica", couplePhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop", city: "Bali", rating: 5, comment: "Pernikahan impian di pinggir tebing Uluwatu sangat ajaib! Event Papunda Bali sangat andal." }
    ]
  }
};
