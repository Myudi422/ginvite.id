"use client";

import { PlasmicCanvasHost } from "@plasmicapp/loader-nextjs";
import { PLASMIC } from "@/plasmic-init";

/**
 * Route khusus untuk Plasmic Studio.
 * Buka di browser: http://localhost:3000/plasmic-host
 * Kemudian di Plasmic Studio > Configure project > App host,
 * masukkan URL ini agar Plasmic bisa preview komponen kamu secara live.
 *
 * PENTING: Route ini hanya untuk Plasmic Studio, bukan untuk user biasa.
 */
export default function PlasmicHostPage() {
  return <PlasmicCanvasHost />;
}
