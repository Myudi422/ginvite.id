"use client";

import React, { useState } from 'react';

interface LivePreviewProps {
  previewUrl: string;
}

export default function LivePreview({ previewUrl }: LivePreviewProps) {
  // livePreviewEnabled=true artinya preview tampil
  const [livePreviewEnabled, setLivePreviewEnabled] = useState(true);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const hasLoaded = React.useRef(false);
  
  // Strict single initialization
  React.useLayoutEffect(() => {
    if (hasLoaded.current) return;
    
    const iframe = iframeRef.current;
    if (iframe) {
      console.log('Initial iframe load - should happen once');
      hasLoaded.current = true;
      iframe.src = previewUrl;
    }
  }, []); // Empty deps array - run once only

  return (
    <div className="order-first lg:order-last w-full lg:w-1/2 bg-white shadow-md rounded-lg overflow-hidden flex flex-col lg:sticky lg:top-16 lg:flex-1 lg:h-[calc(100vh-64px)]">
      {livePreviewEnabled && (
        <div className="w-full aspect-[9/16] lg:aspect-auto flex-1">
          <iframe
            ref={iframeRef}
            id="previewFrame"
            className="w-full h-full"
            title="Pratinjau Undangan"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms" // Add sandbox attribute
          />
        </div>
      )}
      {/* Toggle untuk mengaktifkan/mematikan live preview */}
      <div className="p-2">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="form-checkbox"
            checked={!livePreviewEnabled}
            onChange={() => setLivePreviewEnabled(!livePreviewEnabled)}
          />
          <span className="ml-2">Matikan live preview</span>
        </label>
      </div>
    </div>
  );
}