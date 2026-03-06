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
import ListUser from "./listuser";
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 p-4 md:p-8">
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
        <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-4 space-y-4 sm:space-y-0 w-full md:w-auto bg-white/60 p-4 rounded-2xl shadow-sm border border-pink-100">
          {/* Start Date Picker */}
          <div className="flex flex-col w-full sm:w-auto">
            <label htmlFor="startDatePicker" className="text-pink-700 text-xs font-semibold mb-1 uppercase tracking-wider">
              Tanggal Mulai
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="startDatePicker"
                  variant="outline"
                  className="w-full sm:w-40 justify-between px-4 py-2 text-left text-pink-700 border-pink-200 bg-white hover:bg-pink-50 rounded-xl focus:ring-2 focus:ring-pink-300 transition-colors"
                >
                  {formatDisplayDate(startDate)}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0 w-auto rounded-xl">
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
            <label htmlFor="endDatePicker" className="text-pink-700 text-xs font-semibold mb-1 uppercase tracking-wider">
              Tanggal Akhir
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="endDatePicker"
                  variant="outline"
                  className="w-full sm:w-40 justify-between px-4 py-2 text-left text-pink-700 border-pink-200 bg-white hover:bg-pink-50 rounded-xl focus:ring-2 focus:ring-pink-300 transition-colors"
                >
                  {formatDisplayDate(endDate)}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0 w-auto rounded-xl">
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
            <label htmlFor="category" className="text-pink-700 text-xs font-semibold mb-1 uppercase tracking-wider">
              Kategori
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full sm:w-40 px-4 py-2 border border-pink-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 text-pink-700 transition-colors appearance-none"
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {/* Total User */}
        <div className="rounded-2xl p-4 text-white bg-gradient-to-br from-pink-500 to-rose-500 shadow-md transform transition duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="bg-white/20 rounded-xl p-3 w-fit mb-3">
            <UserIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-3xl font-bold">{totals.users}</p>
            <p className="text-sm font-medium text-white/80 mt-1">Total User</p>
          </div>
        </div>

        {/* Pendapatan */}
        <div className="rounded-2xl p-4 text-white bg-gradient-to-br from-violet-500 to-purple-500 shadow-md transform transition duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="bg-white/20 rounded-xl p-3 w-fit mb-3">
            <CreditCardIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-3xl font-bold">
              Rp {totals.revenue.toLocaleString("id-ID")}
            </p>
            <p className="text-sm font-medium text-white/80 mt-1">Pendapatan</p>
          </div>
        </div>

        {/* Undangan */}
        <div className="rounded-2xl p-4 text-white bg-gradient-to-br from-emerald-400 to-teal-500 shadow-md transform transition duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="bg-white/20 rounded-xl p-3 w-fit mb-3">
            <MailIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-3xl font-bold">{totals.invitations}</p>
            <p className="text-sm font-medium text-white/80 mt-1">Total Undangan</p>
          </div>
        </div>
      </div>

      {/* ============================
          CHART (Recharts)
         ============================ */}
      <div className="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-pink-100 mb-8 w-full overflow-hidden">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex flex-col md:flex-row md:items-center gap-3">
          {category === "users"
            ? "Grafik Pertumbuhan User"
            : category === "revenue"
              ? "Grafik Tren Pendapatan"
              : "Grafik Pembuatan Undangan"}{" "}
          <span className="text-sm font-normal text-gray-500 md:ml-auto bg-gray-50 px-3 py-1 rounded-full w-fit">
            {formatDisplayDate(startDate)} – {formatDisplayDate(endDate)}
          </span>
        </h2>
        <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
          <div style={{ minWidth: "600px", height: 350 }}>
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fbcfe8" />
                <XAxis
                  dataKey="name"
                  stroke="#9D174D"
                  tick={{ fill: '#be185d', fontSize: 12 }}
                  tickMargin={10}
                  axisLine={{ stroke: '#fbcfe8' }}
                />
                <YAxis
                  stroke="#9D174D"
                  tick={{ fill: '#be185d', fontSize: 12 }}
                  tickFormatter={(val) =>
                    category === "revenue" ? `Rp ${val.toLocaleString("id-ID")}` : val
                  }
                  axisLine={{ stroke: '#fbcfe8' }}
                  tickLine={{ stroke: '#fbcfe8' }}
                />
                <Tooltip
                  formatter={(value: number) =>
                    category === "revenue"
                      ? `Rp ${value.toLocaleString("id-ID")}`
                      : value
                  }
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#be185d', fontWeight: 600 }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#ec4899"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#fff', stroke: '#ec4899', strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: '#db2777', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* List User Component */}
      <div className="mt-8 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-pink-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 to-purple-500"></div>
        <h2 className="text-xl font-bold text-gray-800 mb-6">Daftar Pengguna</h2>
        <ListUser />
      </div>
    </div>
  );
}
