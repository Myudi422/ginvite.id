"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, parseISO } from "date-fns";
import { CalendarIcon, ChevronDownIcon, SearchIcon, MoreVertical } from "lucide-react";

interface User {
  id: number;
  user_id: number;
  title: string;
  status: number;
  updated_at: string;
  view: number;
  email: string;
  nomor_wa: string;
  first_name: string;
}

function formatDateYMD(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function ListUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [searchId, setSearchId] = useState("");
  const [visibleUsers, setVisibleUsers] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [type, setType] = useState<"id" | "update">("update");

  const fetchUsers = async () => {
    try {
      let url = `https://ccgnimex.my.id/v2/android/ginvite/index.php?action=get_undangan&page=${page}&limit=50&type=${type}`;
      
      if (filterDate) {
        url += `&date_from=${formatDateYMD(filterDate)}`;
      }
      
      if (searchId) {
        url += `&id=${searchId}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "success") {
        setUsers(data.data);
        setTotalRecords(data.pagination.total_records);
        setHasMore(page < data.pagination.total_pages);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, filterDate, searchId, type]);

  const handleLoadMore = () => {
    setVisibleUsers((prev) => prev + 10);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setFilterDate(date || null);
    setPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleTypeChange = (newType: "id" | "update") => {
    setType(newType);
    setPage(1);
  };

  const generateWhatsAppUrl = (user: User) => {
    const url = `https://papunda.com/undang/${user.user_id}/${user.title}`;
    const message = `Halo Kak,
Kami dari Papunda.com ingin menginformasikan bahwa undangan Anda (${url}) belum aktif.
Untuk mengaktifkan fitur premium (transfer, RSVP, QR Code, dll.), silakan aktivasi di menu edit > aktifkan dan selesaikan pembayaran.
Jika butuh bantuan atau ingin pembayaran via WhatsApp, langsung hubungi kami ya.
Terima kasih.
Tim Papunda.com`;

    // Handle cases where nomor_wa might be null or undefined
    if (!user.nomor_wa) {
      return '#'; // Return a fallback URL if no phone number is available
    }

    const phoneNumber = user.nomor_wa.startsWith('0')
      ? '62' + user.nomor_wa.slice(1)
      : user.nomor_wa.startsWith('+62')
        ? user.nomor_wa.slice(1)
        : user.nomor_wa;

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6 bg-white/30 backdrop-blur-md rounded-2xl shadow-md border border-white/20">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="number"
            placeholder="Search by ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-32"
          />
          <Button type="submit" variant="outline" size="icon">
            <SearchIcon className="h-4 w-4" />
          </Button>
        </form>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-fit">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filterDate ? format(filterDate, "dd MMM yyyy") : "Filter by Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filterDate || undefined}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <div className="flex gap-2">
          <Button 
            variant={type === "update" ? "default" : "outline"}
            onClick={() => handleTypeChange("update")}
          >
            By Update Time
          </Button>
          <Button 
            variant={type === "id" ? "default" : "outline"}
            onClick={() => handleTypeChange("id")}
          >
            By ID
          </Button>
        </div>

        {filterDate && (
          <Button 
            variant="outline" 
            onClick={() => setFilterDate(null)}
            className="text-red-500"
          >
            Clear Date Filter
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead className="w-[200px]">Contact</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[160px]">Last Updated</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.slice(0, visibleUsers).map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>
                  <div className="font-medium truncate max-w-[180px]">{user.email}</div>
                  <div className="text-sm text-gray-500 truncate max-w-[180px]">{user.nomor_wa}</div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.status === 1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.status === 1 ? 'Active' : 'Pending'}
                  </span>
                </TableCell>
                <TableCell>{format(parseISO(user.updated_at), "dd MMM yyyy HH:mm")}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      className={`h-8 w-8 p-0 ${user.nomor_wa 
                        ? 'text-green-600 hover:text-green-700 hover:bg-green-50' 
                        : 'text-gray-400 cursor-not-allowed'}`}
                      asChild
                      disabled={!user.nomor_wa}
                    >
                      <a
                        href={generateWhatsAppUrl(user)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={user.nomor_wa ? "Contact via WhatsApp" : "No WhatsApp number available"}
                        onClick={e => !user.nomor_wa && e.preventDefault()}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-5 w-5"
                          fill="currentColor"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      </a>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[400px] p-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium">Content ID:</span>
                            <p className="text-sm text-gray-500">{user.id}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">User ID:</span>
                            <p className="text-sm text-gray-500">{user.user_id}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Name:</span>
                            <p className="text-sm text-gray-500">{user.first_name}</p>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-sm font-medium">URL:</span>
                          <a 
                            href={`https://papunda.com/undang/${user.user_id}/${user.title}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:text-blue-700 hover:underline break-all block mt-1"
                          >
                            papunda.com/undang/{user.user_id}/{user.title}
                          </a>
                        </div>

                        <div>
                          <span className="text-sm font-medium">Views:</span>
                          <p className="text-sm text-gray-500">{user.view}</p>
                        </div>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4">
        <div className="text-sm text-gray-500">
          Showing {Math.min(visibleUsers, users.length)} of {totalRecords} records
        </div>
        {users.length > visibleUsers && (
          <Button onClick={handleLoadMore} variant="outline">
            Load More <ChevronDownIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
