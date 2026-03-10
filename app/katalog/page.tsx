import { Metadata } from "next";
import CatalogClient from "./CatalogClient";

export const metadata: Metadata = {
    title: "Katalog Tema Undangan | Papunda",
    description: "Pilih tema undangan digital terbaik untuk hari spesialmu.",
};

interface Theme {
    id: number;
    localId: number;
    name: string;
    category: string;
    image: string;
    usage_count: number;
}

export default async function CatalogPage() {
    let initialThemes: Theme[] = [];
    try {
        // ISR is applied here to protect the backend from traffic overload. 
        // We cache the results on Vercel Edge for 1 hour (3600 seconds).
        const res = await fetch("https://ccgnimex.my.id/v2/android/ginvite/index.php?action=theme", {
            next: { revalidate: 3600 },
        });

        if (res.ok) {
            const data = await res.json();
            if (data.status === "success" && Array.isArray(data.data)) {
                const sortedById = [...data.data].sort((a: any, b: any) => a.id - b.id);
                const mappedThemes = sortedById.map((item: any, index: number) => ({
                    id: item.id,
                    localId: index + 1,
                    name: item.name,
                    category: item.kategory_theme_nama || "Umum",
                    image: item.image_theme,
                    usage_count: item.usage_count || 0,
                }));
                mappedThemes.sort((a, b) => b.usage_count - a.usage_count);

                // Auto-inject Theme 6 if missing from API
                if (!mappedThemes.some((t: any) => t.localId === 6)) {
                    mappedThemes.push({
                        id: 9999,
                        localId: 6,
                        name: "Mildness",
                        category: "Premium",
                        image: "https://www.wevitation.com/themes/mildness/img/cover-1.jpg",
                        usage_count: 5
                    });
                }

                initialThemes = mappedThemes;
            }
        } else {
            console.error("Failed to fetch themes. Status:", res.status);
        }
    } catch (error) {
        console.error("Failed to fetch themes in server component:", error);
    }

    return <CatalogClient initialThemes={initialThemes} />;
}
