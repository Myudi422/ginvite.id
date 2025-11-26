"use client";

import React, { useState, useEffect, useRef } from 'react';

interface LivePreviewProps {
  previewUrl: string;
}

export default function LivePreview({ previewUrl }: LivePreviewProps) {
  const [livePreviewEnabled, setLivePreviewEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoRefreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const maxRetries = 2;
  const loadingTimeout = 8000; // 8 seconds max loading time
  const autoRefreshDelay = 1500; // 1.5 seconds delay for auto refresh

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
  };

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      setIsLoading(true);
      setHasError(false);
      
      // Force iframe reload by changing src
      if (iframeRef.current) {
        const separator = previewUrl.includes('?') ? '&' : '?';
        iframeRef.current.src = `${previewUrl}${separator}_retry=${retryCount + 1}&_t=${Date.now()}`;
      }
    }
  };

  const refreshPreview = () => {
    setRetryCount(0);
    setIsLoading(true);
    setHasError(false);
    
    if (iframeRef.current) {
      const separator = previewUrl.includes('?') ? '&' : '?';
      iframeRef.current.src = `${previewUrl}${separator}_refresh=${Date.now()}`;
    }
  };

  useEffect(() => {
    if (isLoading && livePreviewEnabled) {
      // Set timeout untuk loading maksimal
      loadingTimeoutRef.current = setTimeout(() => {
        setIsLoading(false);
        setHasError(true);
      }, loadingTimeout);
    }

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [isLoading, livePreviewEnabled]);

  // Auto refresh listener
  useEffect(() => {
    const handleFormChange = (event: CustomEvent) => {
      if (autoRefreshEnabled && livePreviewEnabled && !isLoading) {
        // Debounce auto refresh
        if (autoRefreshTimeoutRef.current) {
          clearTimeout(autoRefreshTimeoutRef.current);
        }
        
        autoRefreshTimeoutRef.current = setTimeout(() => {
          refreshPreview();
        }, autoRefreshDelay);
      }
    };

    // Listen for form changes
    window.addEventListener('formDataChanged', handleFormChange as EventListener);
    
    // Listen for manual refresh trigger
    window.addEventListener('refreshPreview', () => {
      refreshPreview();
    });

    return () => {
      window.removeEventListener('formDataChanged', handleFormChange as EventListener);
      window.removeEventListener('refreshPreview', () => {
        refreshPreview();
      });
      if (autoRefreshTimeoutRef.current) {
        clearTimeout(autoRefreshTimeoutRef.current);
      }
    };
  }, [autoRefreshEnabled, livePreviewEnabled, isLoading]);

  return (
    <div className="order-first lg:order-last w-full lg:w-1/2 bg-white shadow-md rounded-lg overflow-hidden flex flex-col lg:sticky lg:top-16 lg:flex-1 lg:h-[calc(100vh-64px)]">
      {livePreviewEnabled && (
        <div className="w-full aspect-[9/16] lg:aspect-auto flex-1 relative">
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white flex flex-col items-center justify-center z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mb-2"></div>
              <p className="text-gray-600 text-sm">Memuat pratinjau...</p>
            </div>
          )}

          {/* Error Overlay */}
          {hasError && !isLoading && (
            <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center z-10 p-4">
              <div className="text-red-500 mb-2">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-600 text-sm text-center mb-3">
                Gagal memuat pratinjau undangan
              </p>
              <div className="flex gap-2">
                {retryCount < maxRetries && (
                  <button
                    onClick={handleRetry}
                    className="px-3 py-1 bg-pink-500 text-white text-xs rounded hover:bg-pink-600"
                  >
                    Coba Lagi ({retryCount + 1}/{maxRetries + 1})
                  </button>
                )}
                <button
                  onClick={refreshPreview}
                  className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                >
                  Refresh
                </button>
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                >
                  Buka di Tab Baru
                </a>
              </div>
            </div>
          )}

          <iframe
            ref={iframeRef}
            src={previewUrl}
            className="w-full h-full"
            title="Pratinjau Undangan"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        </div>
      )}
      
      {!livePreviewEnabled && (
        <div className="w-full aspect-[9/16] lg:aspect-auto flex-1 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-2">Live preview dimatikan</p>
            <button
              onClick={() => setLivePreviewEnabled(true)}
              className="px-4 py-2 bg-pink-500 text-white text-sm rounded hover:bg-pink-600"
            >
              Aktifkan Preview
            </button>
          </div>
        </div>
      )}

      {/* Control Panel */}
      <div className="p-3 border-t bg-gray-50">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex flex-col gap-1">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox text-pink-500"
                checked={!livePreviewEnabled}
                onChange={() => setLivePreviewEnabled(!livePreviewEnabled)}
              />
              <span className="ml-2 text-sm">Matikan live preview</span>
            </label>
            
            {livePreviewEnabled && (
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox text-pink-500"
                  checked={autoRefreshEnabled}
                  onChange={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
                />
                <span className="ml-2 text-xs text-gray-600">Auto refresh saat edit form</span>
              </label>
            )}
          </div>
          
          {livePreviewEnabled && (
            <div className="flex gap-2">
              {autoRefreshEnabled && (
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                  Auto refresh: ON
                </span>
              )}
              <button
                onClick={refreshPreview}
                className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
                title="Refresh preview manual"
              >
                ↻ Refresh
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}