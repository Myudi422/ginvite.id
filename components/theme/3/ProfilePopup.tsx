import { useState, useEffect } from 'react';
import { ProfileIcon } from './icon';

interface ProfilePopupProps {
  toName: string;
}

export default function ProfilePopup({ toName }: ProfilePopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true); // Langsung muncul
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // Hilang setelah 3 detik
    return () => {
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="relative">
      {/* Profile Icon */}
      <div className="p-2 rounded-full bg-gray-800/50">
        <ProfileIcon className="w-6 h-6 text-white" />
      </div>

      {/* Auto Popup */}
      {isVisible && (
        <div 
          className="absolute top-0 right-full mr-3 bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-xl border border-gray-600 z-50 transition-all duration-500 ease-in-out"
          style={{
            animation: 'fadeInSlide 0.5s ease-out forwards'
          }}
        >
          <div className="px-4 py-3">
            <p className="text-red-400 font-semibold text-sm whitespace-nowrap">
              Hai, {toName}!
            </p>
          </div>
          
          {/* Arrow pointer */}
          <div className="absolute top-3 -right-2 w-0 h-0 border-l-8 border-l-gray-900/90 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
        </div>
      )}
    </div>
  );
}