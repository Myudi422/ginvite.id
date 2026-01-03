import React from 'react';
import { NetflixSection, NetflixHeader, NetflixText } from './NetflixComponents';

interface NetflixTurutSectionProps {
  enabled?: boolean;
  list: { name: string }[];
}

export default function NetflixTurutSection({ enabled, list }: NetflixTurutSectionProps) {
  if (!enabled || !list || list.length === 0) return null;

  return (
    <NetflixSection>
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded bg-red-600/20 border border-red-600/50 flex items-center justify-center">
          <span className="text-red-500 text-lg">👥</span>
        </div>
        <div className="flex-1">
          <NetflixHeader>Turut Mengundang</NetflixHeader>
          <NetflixText variant="caption" color="gray">
            Yang turut merasa berbahagia
          </NetflixText>
        </div>
      </div>
      
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <div className="grid grid-cols-1 gap-3">
          {list.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-xs font-bold">
                {item.name.charAt(0).toUpperCase()}
              </div>
              
              {/* Name */}
              <div className="flex-1">
                <NetflixText variant="meta" color="white" className="font-medium">
                  {item.name}
                </NetflixText>
              </div>
              
              {/* Netflix-style indicator */}
              <div className="w-2 h-2 rounded-full bg-red-600"></div>
            </div>
          ))}
        </div>
        
        {/* Summary */}
        <div className="mt-4 pt-3 border-t border-gray-700">
          <NetflixText variant="caption" color="gray" className="text-center">
            {list.length} yang turut berbahagia
          </NetflixText>
        </div>
      </div>
    </NetflixSection>
  );
}