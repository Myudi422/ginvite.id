import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Builder Undangan | Papunda',
};

/**
 * This layout uses `fixed inset-0` to visually escape the parent
 * /admin layout (which renders the sidebar + header).
 * The builder needs a clean, fullscreen canvas.
 */
export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return (
    // Portal-like escape: sits on top of the admin sidebar
    <div className="fixed inset-0 z-[9999] bg-gray-50">
      {children}
    </div>
  );
}
