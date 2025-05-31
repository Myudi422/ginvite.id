// app/admin/panel/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { UserIcon, CreditCardIcon, MailIcon } from "lucide-react";

// shadcn/ui imports
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

// date‐fns
import { format, parseISO } from "date-fns";

// ==========================================
// UTILITY: Format Date → "YYYY-MM-DD"
function formatDateYMD(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// ==========================================
// 1. PanelPage Component
export default function PanelPage() {
  // a) Kita akan men‐fetch daftar tanggal dari server nanti, tapi untuk default,
//    gunakan tanggal hari ini dan 7 hari yang lalu (atau bisa diset manual).
  //    Namun, supaya konsisten dengan requirement “harus men‐adaptasi rentang tanggal”
  //    kita ambil default berdasarkan “today - 11 hari sampai today” supaya user dapat
  //    langsung melihat data.
  const today = new Date();
  const elevenDaysAgo = new Date();
  elevenDaysAgo.setDate(today.getDate() - 10); // 10 hari lalu = total 11 hari rentang

  const defaultStart = formatDateYMD(elevenDaysAgo);
  const defaultEnd = formatDateYMD(today);

  // b) State untuk tanggal (string "YYYY-MM-DD")
  const [startDate, setStartDate] = useState<string>(defaultStart);
  const [endDate, setEndDate] = useState<string>(defaultEnd);

  // c) State untuk kategori grafik
  type Category = "users" | "revenue" | "invitations";
  const [category, setCategory] = useState<Category>("users");

  // d) State untuk data yang di‐fetch: per‐tanggal objek { users, invitations, revenue }
  const [fetchedRecords, setFetchedRecords] = useState<
    Record<string, { users: number; revenue: number; invitations: number }>
  >({});

  // e) State untuk totals & chartData (hanya ter‐set setelah data berhasil di‐fetch)
  const [totals, setTotals] = useState<{ users: number; revenue: number; invitations: number }>({
    users: 0,
    revenue: 0,
    invitations: 0,
  });
  const [chartData, setChartData] = useState<Array<{ name: string; value: number }>>([]);

  // =========================================================================
  // 2. useEffect → Fetch data dari analis.php setiap kali startDate atau endDate berubah
  // =========================================================================
  useEffect(() => {
    async function fetchData() {
      // URL endpoint PHP -- sesuaikan domain/path jika perlu
      const FETCH_URL = `https://ccgnimex.my.id/v2/android/ginvite/index.php?action=analis&start_date=${startDate}&end_date=${endDate}`;

      try {
        const res = await fetch(FETCH_URL);
        if (!res.ok) {
          console.error("Error fetching data:", res.statusText);
          return;
        }
        const data: Record<string, { users: number; invitations: number; revenue: number }> =
          await res.json();
        setFetchedRecords(data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }

    fetchData();
  }, [startDate, endDate]);

  // =========================================================================
  // 3. Gunakan fetchedRecords untuk menghitung totals dan chartData
  //    Kedua hal ini harus di‐update setiap kali fetchedRecords berubah
  //    atau category berubah.
  // =========================================================================
  useEffect(() => {
    // Jika belum ada data, skip
    if (!fetchedRecords || Object.keys(fetchedRecords).length === 0) {
      // Reset totals dan chartData ke nol/array kosong
      setTotals({ users: 0, revenue: 0, invitations: 0 });
      setChartData([]);
      return;
    }

    // a) Konversi string tanggal start/end ke Date
    const sdObj = parseISO(startDate);
    const edObj = parseISO(endDate);
    let start = sdObj,
      end = edObj;
    if (sdObj > edObj) {
      start = edObj;
      end = sdObj;
    }

    // b) Buat array string "YYYY-MM-DD" dari start..end (inklusif)
    const datesInRange: string[] = [];
    const cursor = new Date(start);
    while (cursor <= end) {
      datesInRange.push(formatDateYMD(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }

    // c) Hitung totals
    let sumUsers = 0;
    let sumRevenue = 0;
    let sumInv = 0;
    datesInRange.forEach((d) => {
      const rec = fetchedRecords[d];
      if (rec) {
        sumUsers += rec.users;
        sumRevenue += rec.revenue;
        sumInv += rec.invitations;
      }
    });
    setTotals({ users: sumUsers, revenue: sumRevenue, invitations: sumInv });

    // d) Buat chartData: satu titik per tanggal dalam rentang
    const newChartData = datesInRange.map((d) => {
      const rec = fetchedRecords[d] || { users: 0, revenue: 0, invitations: 0 };
      const [yyyy, mm, dd] = d.split("-");
      const label = `${dd}-${mm}`; // misal "24-05"
      return {
        name: label,
        value: rec[category],
      };
    });
    setChartData(newChartData);
  }, [fetchedRecords, category, startDate, endDate]);

  // =========================================================================
  // 4. Format tampilan tombol (ISO → "dd MMM yyyy")
  // =========================================================================
  function formatDisplayDate(isoStr: string) {
    try {
      const d = parseISO(isoStr);
      return format(d, "dd MMM yyyy"); // contoh: "31 Mei 2025"
    } catch {
      return isoStr;
    }
  }

  // =========================================================================
  // 5. Render komponen
  // =========================================================================
  // Untuk _Calendar_, kita hanya membatasi pilihan antara minimum dan maksimum:
  const minDateObj = parseISO(startDate); // kalau mau hardcode, bisa parseISO(defaultStart)
  const maxDateObj = parseISO(endDate);   // sama untuk defaultEnd

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-white p-4 md:p-8">
      {/* ============================
          HEADER + CONTROLS
         ============================ */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 space-y-4 md:space-y-0">
        {/* Judul */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-sm text-pink-600 mt-1">
            Pilih rentang tanggal dan kategori
          </p>
        </div>

        {/* Controls: Start Date, End Date, dan Category */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 space-y-4 sm:space-y-0 w-full md:w-auto">
          {/* Start Date Picker */}
          <div className="flex flex-col w-full sm:w-auto">
            <label htmlFor="startDatePicker" className="text-pink-700 text-sm mb-1">
              Tanggal Mulai
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="startDatePicker"
                  variant="outline"
                  className="w-full sm:w-40 justify-between px-3 py-2 text-left text-pink-700 border-pink-300 focus:ring-2 focus:ring-pink-300"
                >
                  {formatDisplayDate(startDate)}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0 w-auto">
                <Calendar
                  mode="single"
                  selected={parseISO(startDate)}
                  onSelect={(date) => {
                    if (!date) return;
                    const iso = formatDateYMD(date);
                    setStartDate(iso);
                  }}
                  initialFocus
                  // Kita bisa membatasi minimal/maksimal, tapi di sini sifatnya fleksibel
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date Picker */}
          <div className="flex flex-col w-full sm:w-auto">
            <label htmlFor="endDatePicker" className="text-pink-700 text-sm mb-1">
              Tanggal Akhir
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="endDatePicker"
                  variant="outline"
                  className="w-full sm:w-40 justify-between px-3 py-2 text-left text-pink-700 border-pink-300 focus:ring-2 focus:ring-pink-300"
                >
                  {formatDisplayDate(endDate)}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0 w-auto">
                <Calendar
                  mode="single"
                  selected={parseISO(endDate)}
                  onSelect={(date) => {
                    if (!date) return;
                    const iso = formatDateYMD(date);
                    setEndDate(iso);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Category Select */}
          <div className="flex flex-col w-full sm:w-auto">
            <label htmlFor="category" className="text-pink-700 text-sm mb-1">
              Kategori
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full sm:w-40 px-3 py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              <option value="users">Total User</option>
              <option value="revenue">Pendapatan</option>
              <option value="invitations">Undangan</option>
            </select>
          </div>
        </div>
      </div>

      {/* ============================
          KPI CARDS
         ============================ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {/* Total User */}
        <div className="flex items-center bg-white/30 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-md border border-white/20">
          <div className="p-3 bg-pink-500 rounded-full text-white mr-4">
            <UserIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-pink-700">Total User</p>
            <p className="text-2xl font-bold text-pink-900">{totals.users}</p>
          </div>
        </div>

        {/* Pendapatan */}
        <div className="flex items-center bg-white/30 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-md border border-white/20">
          <div className="p-3 bg-pink-500 rounded-full text-white mr-4">
            <CreditCardIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-pink-700">Pendapatan (Rp)</p>
            <p className="text-2xl font-bold text-pink-900">
              {totals.revenue.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {/* Undangan */}
        <div className="flex items-center bg-white/30 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-md border border-white/20">
          <div className="p-3 bg-pink-500 rounded-full text-white mr-4">
            <MailIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-pink-700">Undangan</p>
            <p className="text-2xl font-bold text-pink-900">{totals.invitations}</p>
          </div>
        </div>
      </div>

      {/* ============================
          CHART (Recharts)
         ============================ */}
      <div className="bg-white/30 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-md border border-white/20">
        <h2 className="text-lg font-semibold text-pink-800 mb-4">
          {category === "users"
            ? "Grafik Total User"
            : category === "revenue"
            ? "Grafik Pendapatan"
            : "Grafik Undangan"}{" "}
          ({formatDisplayDate(startDate)} – {formatDisplayDate(endDate)})
        </h2>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#9D174D" />
              <YAxis
                stroke="#9D174D"
                tickFormatter={(val) =>
                  category === "revenue" ? `Rp ${val.toLocaleString("id-ID")}` : val
                }
              />
              <Tooltip
                formatter={(value: number) =>
                  category === "revenue"
                    ? `Rp ${value.toLocaleString("id-ID")}`
                    : value
                }
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#D946EF"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
