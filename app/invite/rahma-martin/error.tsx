"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-red-50 to-red-100">
      <div className="text-center p-8 max-w-md mx-auto">
        <div className="text-6xl mb-4">😔</div>
        <h2 className="text-2xl font-bold text-red-800 mb-4">
          Oops! Terjadi Kesalahan
        </h2>
        <p className="text-red-600 mb-6">
          Maaf, terjadi kesalahan saat memuat undangan. Silakan coba lagi.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}