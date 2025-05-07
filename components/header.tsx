// app/components/header.tsx
"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";

export function Header() {
  return (
    <div className="sticky top-0 z-30 bg-gradient-to-r from-pink-100/30 to-pink-50/20 
      backdrop-blur-lg border-b border-pink-200/30 h-[70px]">
      <div className="flex items-center justify-end h-full px-4 md:px-6">
        {/* Social Media Links */}
        <div className="flex items-center mr-4 space-x-2">
          <a 
            href="https://wa.me/YOUR_WHATSAPP_NUMBER" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-gradient-to-br from-pink-100 to-pink-50 border border-pink-200/50 
            shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
          >
            <img 
              src="https://img.icons8.com/?size=48&id=16713&format=png&color=FF69B4" 
              alt="WhatsApp" 
              className="h-6 w-6"
            />
          </a>
          <a 
            href="https://instagram.com/YOUR_INSTAGRAM_USERNAME" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-gradient-to-br from-pink-100 to-pink-50 border border-pink-200/50 
            shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
          >
            <img 
              src="https://img.icons8.com/?size=48&id=32323&format=png&color=FF69B4" 
              alt="Instagram" 
              className="h-6 w-6"
            />
          </a>
        </div>

        {/* Profile Avatar */}
        <Avatar className="border-2 border-pink-200/50 shadow-sm hover:shadow-md hover:border-pink-300 
          transition-all duration-300">
          <AvatarImage 
            src="/images/default-profile.png" 
            alt="Profile" 
            className="object-cover"
          />
          <AvatarFallback className="bg-pink-100/50">
            <UserRound className="h-5 w-5 text-pink-600" />
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}