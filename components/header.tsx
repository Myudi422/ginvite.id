// app/components/header.tsx
"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";

export function Header() {
  return (
    <div className="bg-white border-b sticky top-0 z-30" style={{ height: '70px' }}>
      <div className="flex items-center justify-end h-full px-4 md:px-6">
        {/* Info Admin (WhatsApp & Instagram) */}
        <div className="flex items-center mr-4 space-x-3">
          <a href="https://wa.me/YOUR_WHATSAPP_NUMBER" target="_blank" rel="noopener noreferrer">
            <img src="https://img.icons8.com/?size=48&id=16713&format=png&color=000000" alt="WhatsApp" className="h-10 w-10" />
          </a>
          <a href="https://instagram.com/YOUR_INSTAGRAM_USERNAME" target="_blank" rel="noopener noreferrer">
            <img src="https://img.icons8.com/?size=48&id=32323&format=png&color=000000" alt="Instagram" className="h-10 w-10" />
          </a>
        </div>

        {/* "Foto Profil" di kanan */}
        <Avatar>
          <AvatarImage src="/images/default-profile.png" alt="Profile" /> {/* Ganti dengan path gambar profilmu */}
          <AvatarFallback><UserRound className="h-5 w-5 text-muted-foreground" /></AvatarFallback>
        </Avatar>
        {/* Tambahkan nama pengguna atau elemen lain di sini jika perlu */}
        {/* <span className="ml-2 text-sm font-medium">John Doe</span> */}
      </div>
    </div>
  );
}