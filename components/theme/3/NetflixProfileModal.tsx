"use client";

import { useState } from "react";

interface NetflixProfileModalProps {
  onClose: (guestName: string) => void;
  selectedProfile: string;
}

export default function NetflixProfileModal({ onClose, selectedProfile }: NetflixProfileModalProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  // Profile configuration
  const profileConfig: { [key: string]: { color: string; initial: string } } = {
    "Bapak/Ibu/Saudara/i": { color: "from-purple-600 to-purple-700", initial: "B" },
    "Saudara/i": { color: "from-blue-600 to-blue-700", initial: "S" },
    "Teman": { color: "from-pink-600 to-pink-700", initial: "T" },
    "Lainnya": { color: "from-green-600 to-green-700", initial: "L" },
  };

  const profile = profileConfig[selectedProfile] || profileConfig["Bapak/Ibu/Saudara/i"];

  const handleContinue = () => {
    setIsConfirming(true);
    setTimeout(() => {
      onClose(selectedProfile);
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-sm text-center transition-all duration-300 ${isConfirming ? "scale-95 opacity-0" : "scale-100 opacity-100 animate-in fade-in zoom-in-95"}`}>
        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-8">
          Who's Invited?
        </h1>

        {/* Single Profile */}
        <div className="flex flex-col items-center gap-4 mb-8">
          {/* Profile Avatar */}
          <div
            className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${profile.color} shadow-2xl flex items-center justify-center overflow-hidden`}
          >
            <img 
              src="/GuestIcon.webp" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Profile Name */}
          <p className="text-2xl font-bold text-white">
            {selectedProfile}
          </p>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors text-lg w-full"
        >
          Lanjutkan
        </button>
      </div>
    </div>
  );
}
