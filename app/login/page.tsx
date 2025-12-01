import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "Login – Papunda.com",
};

export default function Page() {
  return (
    <div className="relative min-h-screen flex">
      {/* BG image full di mobile, half di desktop */}
      <div className="absolute inset-0 md:relative md:w-1/2">
        <Image
          src="cincin.jpg"
          alt="Login - Buat Undangan Gratis"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-pink-100/80 via-pink-300/60 to-white/90" />

        {/* top-bar selalu tampil */}
        <div className="absolute top-4 inset-x-4 flex justify-between items-center z-20">
          <Link
            href="/"
            className="bg-white/70 backdrop-blur-md p-2 rounded-full shadow-md hover:bg-white transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <Image
            src="logo.svg"
            alt="Logo Cincin"
            width={150}
            height={100}
          />
        </div>

        {/* teks promosi hanya desktop */}
        <div className="hidden md:flex absolute inset-0 flex-col justify-center items-center text-center text-white px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">
            Buat Undangan
          </h2>
          <p className="text-base md:text-lg drop-shadow-md">
            cuman 5 Menit!
          </p>
        </div>
      </div>

      {/* FORM: full di mobile, half di desktop; selalu center di mobile */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 md:px-8 py-8">
        <div className="w-full max-w-xs bg-white/90 md:bg-white rounded-xl shadow-lg p-6 space-y-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-center text-pink-600">
            Yuk, Masuk
          </h1>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
