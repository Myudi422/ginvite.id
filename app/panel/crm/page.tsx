// app/panel/crm/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  UsersIcon, MessageCircleIcon, ZapIcon,
  PhoneIcon, TrendingUpIcon,
} from "lucide-react";
import ContactsTab from "./contacts";
import RsvpTab from "./rsvp";
import BroadcastTab from "./broadcast";

type Tab = "contacts" | "rsvp" | "broadcast";

interface StatsData {
  totalContacts: number;
  totalRsvp: number;
  hadirCount: number;
}

export default function CrmPage() {
  const [activeTab, setActiveTab] = useState<Tab>("contacts");
  const [stats, setStats] = useState<StatsData>({ totalContacts: 0, totalRsvp: 0, hadirCount: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [contactsRes, rsvpRes] = await Promise.allSettled([
          fetch(`https://ccgnimex.my.id/v2/android/ginvite/index.php?action=get_undangan&page=1&limit=500&type=update`),
          fetch(`https://ccgnimex.my.id/v2/android/ginvite/index.php?action=get_rsvp&limit=1`),
        ]);

        let contacts = 0;
        let rsvp = 0;
        let hadir = 0;

        if (contactsRes.status === "fulfilled" && contactsRes.value.ok) {
          const data = await contactsRes.value.json();
          if (data.status === "success") {
            contacts = (data.data as { nomor_wa: string }[]).filter((u) => u.nomor_wa).length;
          }
        }

        if (rsvpRes.status === "fulfilled" && rsvpRes.value.ok) {
          const data = await rsvpRes.value.json();
          if (data.status === "success") {
            rsvp  = Number(data.stats?.total_rsvp ?? data.data.length);
            hadir = Number(data.stats?.hadir ?? 0);
          }
        }

        setStats({ totalContacts: contacts, totalRsvp: rsvp, hadirCount: hadir });
      } catch {
        // silently fail
      } finally {
        setLoadingStats(false);
      }
    }
    fetchStats();
  }, []);

  const tabs: { key: Tab; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      key: "contacts",
      label: "Kontak Customer",
      icon: <UsersIcon className="h-4 w-4" />,
      desc: "User yang buat undangan",
    },
    {
      key: "rsvp",
      label: "Tamu RSVP",
      icon: <PhoneIcon className="h-4 w-4" />,
      desc: "Yang konfirmasi via WA",
    },
    {
      key: "broadcast",
      label: "Broadcast & Template",
      icon: <ZapIcon className="h-4 w-4" />,
      desc: "Kirim pesan massal",
    },
  ];

  const statCards = [
    {
      label: "Kontak WA",
      value: loadingStats ? "..." : stats.totalContacts,
      icon: <PhoneIcon className="h-5 w-5" />,
      gradient: "from-pink-500 to-rose-500",
    },
    {
      label: "Total RSVP",
      value: loadingStats ? "..." : stats.totalRsvp,
      icon: <UsersIcon className="h-5 w-5" />,
      gradient: "from-violet-500 to-purple-600",
    },
    {
      label: "Tamu Hadir",
      value: loadingStats ? "..." : stats.hadirCount,
      icon: <TrendingUpIcon className="h-5 w-5" />,
      gradient: "from-emerald-400 to-teal-500",
    },
    {
      label: "Fitur Aktif",
      value: "Fonnte API",
      icon: <MessageCircleIcon className="h-5 w-5" />,
      gradient: "from-amber-400 to-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg">
            <MessageCircleIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              CRM & WhatsApp
            </h1>
            <p className="text-sm text-pink-500 mt-0.5">
              Kelola kontak, RSVP, dan kirim pesan broadcast via Fonnte API
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-4 text-white shadow-md transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
          >
            <div className="bg-white/20 rounded-xl p-2.5 w-fit mb-3">
              {stat.icon}
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-white/80 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-3xl shadow-sm border border-pink-100 overflow-hidden">
        {/* Tab Header */}
        <div className="flex border-b border-pink-100 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2.5 px-6 py-4 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab.key
                  ? "border-pink-500 text-pink-600 bg-pink-50/50"
                  : "border-transparent text-gray-500 hover:text-pink-500 hover:bg-pink-50/30"
              }`}
            >
              <span
                className={`p-1.5 rounded-lg ${
                  activeTab === tab.key
                    ? "bg-pink-100 text-pink-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "contacts" && <ContactsTab />}
          {activeTab === "rsvp" && <RsvpTab />}
          {activeTab === "broadcast" && <BroadcastTab />}
        </div>
      </div>
    </div>
  );
}
