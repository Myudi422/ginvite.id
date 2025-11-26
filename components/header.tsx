// app/components/header.tsx
"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserRound, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    // Tutup dropdown
    setIsDropdownOpen(false);

    try {
      // Panggil API route untuk logout
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        // Redirect ke halaman utama setelah logout berhasil
        router.push("/");
      } else {
        console.error("Logout failed");
        // Handle error logout jika perlu
      }
    } catch (error) {
      console.error("Error during logout:", error);
      // Handle error logout jika perlu
    }
  };

  // Tutup dropdown saat klik di luar elemen
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, setIsDropdownOpen]);

  return (
    <div className="sticky top-0 z-30 bg-gradient-to-r from-pink-100/30 to-pink-50/20
      backdrop-blur-lg border-b border-pink-200/30 h-[70px]">
      <div className="flex items-center justify-end h-full px-4 md:px-6">
        {/* Social Media Links */}
        <a
          href="https://wa.me/6289654728249"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 bg-pink-500 text-white px-3 py-1 rounded-md hover:bg-pink-600 transition-colors mr-4 text-sm"
          aria-label="Butuh Bantuan via WhatsApp"
        >
          <img src="/wa.svg" alt="WhatsApp" width={16} height={16} />
          <span>Butuh Bantuan??</span>
        </a>

        {/* Profile Avatar */}
        <div className="relative">
          <Avatar
            className="border-2 border-pink-200/50 shadow-sm hover:shadow-md hover:border-pink-300
              transition-all duration-300 cursor-pointer"
            onClick={toggleDropdown}
          >
            <AvatarImage
              src="/images/default-profile.png"
              alt="Profile"
              className="object-cover"
            />
            <AvatarFallback className="bg-pink-100/50">
              <UserRound className="h-5 w-5 text-pink-600" />
            </AvatarFallback>
          </Avatar>

          {/* Dropdown Logout */}
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-full right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-md"
            >
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}