export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mx-auto mb-4"></div>
        <p className="text-amber-800 font-medium">Memuat undangan...</p>
      </div>
    </div>
  );
}