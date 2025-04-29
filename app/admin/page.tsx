// app/admin/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import InvitationDashboard from "@/components/InvitationDashboard";
import jwt from "jsonwebtoken";

const SECRET = "very-secret-key"; // Harus sama dengan PHP

export default async function Page() {
  // ✅ cookies() harus di-await
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  let payload: any;
  try {
    payload = jwt.verify(token, SECRET);
  } catch (err) {
    redirect("/login");
  }

  return <InvitationDashboard user={payload.data} />;
}
