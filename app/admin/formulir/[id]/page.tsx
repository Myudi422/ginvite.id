"use client";

import { useForm, Controller } from "react-hook-form";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type FormValues = {
  category: number;
  date: Date;
  time: string;
  title: string;
  location: string;
  mapsLink: string;
  // tambah sesuai kebutuhan...
};

export default function FormulirPage() {
  const params = useSearchParams();
  const invitationId = params.get("id");
  const router = useRouter();

  const form = useForm<FormValues>({
    defaultValues: {
      category: 1,
      date: new Date(),
      time: "",
      title: "",
      location: "",
      mapsLink: "",
    },
  });

  async function onSubmit(values: FormValues) {
    // convert & kirim payload ke API
    console.log("payload:", {
      ...values,
      iso: values.date.toISOString(),
      date: values.date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
    });
    // router.push(`/admin/preview?id=${invitationId}`);
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Formulir Undangan #{invitationId}</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          {/* Kategori */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategori Undangan</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Pernikahan</SelectItem>
                      <SelectItem value="2">Khitanan</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tanggal */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal Acara</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline">{field.value.toLocaleDateString()}</Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Waktu */}
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Waktu (HH:mm)</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Judul, Lokasi, MapsLink */}
          {["title", "location", "mapsLink"].map((name) => (
            <FormField
              key={name}
              control={form.control}
              name={name as keyof FormValues}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {name === "title"
                      ? "Judul Acara"
                      : name === "location"
                      ? "Lokasi"
                      : "Link Peta"}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button type="submit">Simpan dan Lanjutkan</Button>
        </form>
      </Form>
    </div>
  );
}
