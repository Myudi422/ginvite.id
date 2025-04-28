// app/login/page.tsx
import LoginForm from "@/components/LoginForm"

export const metadata = {
  title: "Login – ginvite.id",
}

export default function Page() {
  return (
    <div className="flex h-screen">
      <main className="flex-1 flex flex-col justify-center items-center bg-gray-50">
        <LoginForm />
      </main>
    </div>
  )
}
