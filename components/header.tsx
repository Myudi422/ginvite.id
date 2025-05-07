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