// app/undangan/[userId]/[theme]/[title]/edit/page.tsx
import EditInvitationForm from "./EditInvitationForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Undangan",
  description: "Formulir untuk mengedit undangan digital",
};

interface Props {
  params: {
    userId: string;
    theme: string;
    title: string;
  };
}

export default async function EditPage({ params }: Props) {
  const { userId, theme, title } = params; // Sudah benar, tidak perlu await di sini untuk route params

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Edit Undangan: {title}</h1>
      <EditInvitationForm
        userId={userId}
        theme={theme}
        title={title}
      />
    </div>
  );
}