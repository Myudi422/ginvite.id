// app/login/page.tsx
import Image from "next/image";
import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "Login – ginvite.id",
};

export default function Page() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left side: gambar + gradient + teks */}
      <div className="relative w-full md:flex-1 h-56 md:h-auto">
        <Image
          src="cincin.jpg"    // ganti dengan path gambarmu
          alt="Wedding rings"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-pink-300/60 to-pink-500/80" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Buat Undangan</h2>
          <p className="text-base md:text-lg">cuman 5 Menit!</p>
        </div>
      </div>

      {/* Right side: logo + form */}
      <div className="w-full md:flex-1 flex flex-col justify-center items-center bg-white px-4 md:px-8 py-8">
        <div className="w-full max-w-xs space-y-6">
          {/* Brand logo */}
          <div className="flex justify-center mb-4">
            <Image
              src="logo.svg"       // ganti dengan path logo-mu
              alt="Papunda"
              width={180}
              height={100}
            />
          </div>
          {/* Heading */}
          <h1 className="text-2xl md:text-3xl font-semibold text-center text-pink-600">
            Yuk, Masuk
          </h1>
          {/* Form */}
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
