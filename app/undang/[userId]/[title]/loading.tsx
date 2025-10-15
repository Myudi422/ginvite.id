import WeddingLoading from "@/components/WeddingLoading";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="text-center">
        <WeddingLoading />
        <p className="mt-4 text-gray-600 animate-pulse">
          Memuat undangan Anda...
        </p>
      </div>
    </div>
  );
}