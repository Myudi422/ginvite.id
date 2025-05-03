// components/KhitananForm.tsx

'use client';



import React from 'react';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { z } from 'zod';

import {

 Form,

 FormField,

 FormItem,

 FormLabel,

 FormControl,

 FormMessage,

} from '@/components/ui/form';

import { Input } from '@/components/ui/input';

import { Button } from '@/components/ui/button';



// Skema validasi khusus untuk formulir Khitanan

const khitananSchema = z.object({

 parents: z.object({

  father: z.string().min(2, { message: "Nama ayah minimal 2 karakter." }),

  mother: z.string().min(2, { message: "Nama ibu minimal 2 karakter." }),

 }),

 children: z.array(

  z.object({

   name: z.string().min(2, { message: "Nama anak minimal 2 karakter." }),

   order: z.string().optional(),

   nickname: z.string().optional(),

  })

 ).min(1, { message: "Setidaknya harus ada satu anak." }),

 invitationNote: z.string().optional(),

});



type KhitananFormValues = z.infer<typeof khitananSchema>;



const KhitananForm = () => {

 const form = useForm<KhitananFormValues>({

  resolver: zodResolver(khitananSchema),

  defaultValues: {

   parents: { father: '', mother: '' },

   children: [{ name: '', order: '', nickname: '' }],

   invitationNote: '',

  },

 });



 const onSubmit = (values: KhitananFormValues) => {

  console.log('Data Formulir Khitanan:', JSON.stringify(values, null, 2));

  // Lakukan sesuatu dengan data formulir khitanan di sini

 };



 return (

  <Form {...form}>

   <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

    <div>

     <h3 className="text-lg font-medium">Data Orang Tua</h3>

     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">

      <FormField

       control={form.control}

       name="parents.father"

       render={({ field }) => (

        <FormItem>

         <FormLabel>Nama Ayah</FormLabel>

         <FormControl>

          <Input placeholder="Nama lengkap ayah" {...field} />

         </FormControl>

         <FormMessage />

        </FormItem>

       )}

      />

      <FormField

       control={form.control}

       name="parents.mother"

       render={({ field }) => (

        <FormItem>

         <FormLabel>Nama Ibu</FormLabel>

         <FormControl>

          <Input placeholder="Nama lengkap ibu" {...field} />

         </FormControl>

         <FormMessage />

        </FormItem>

       )}

      />

     </div>

    </div>



    <div>

     <h3 className="text-lg font-medium">Data Anak yang Dikhitan</h3>

     {form.watch('children').map((child, index) => (

      <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 border p-4 rounded-md">

       <h4 className="font-semibold col-span-full">Anak ke-{index + 1}</h4>

       <FormField

        control={form.control}

        name={`children.${index}.name`}

        render={({ field }) => (

         <FormItem>

          <FormLabel>Nama Lengkap</FormLabel>

          <FormControl>

           <Input placeholder="Nama lengkap anak" {...field} />

          </FormControl>

          <FormMessage />

         </FormItem>

        )}

       />

       <FormField

        control={form.control}

        name={`children.${index}.order`}

        render={({ field }) => (

         <FormItem>

          <FormLabel>Urutan Anak</FormLabel>

          <FormControl>

           <Input placeholder="Contoh: Sulung, Bungsu" {...field} />

          </FormControl>

          <FormMessage />

         </FormItem>

        )}

       />

       <FormField

        control={form.control}

        name={`children.${index}.nickname`}

        render={({ field }) => (

         <FormItem>

          <FormLabel>Nama Panggilan</FormLabel>

          <FormControl>

           <Input placeholder="Nama panggilan anak" {...field} />

          </FormControl>

          <FormMessage />

         </FormItem>

        )}

       />

      </div>

     ))}

     {/* Tambahkan tombol untuk menambah anak jika diperlukan */}

    </div>



    <FormField

     control={form.control}

     name="invitationNote"

     render={({ field }) => (

      <FormItem>

       <FormLabel>Catatan Tambahan Undangan</FormLabel>

       <FormControl>

        <Input placeholder="Contoh: Mohon doa restu" {...field} />

       </FormControl>

       <FormMessage />

      </FormItem>

     )}

    />



    <Button type="submit">Generate JSON (Khitanan)</Button>

   </form>

  </Form>

 );

};



export default KhitananForm;