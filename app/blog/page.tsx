// app/blog/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Tag, ArrowRight, Phone, BadgeCheck, LogIn, BookOpen } from 'lucide-react';
import FooterSection from '@/components/sections/FooterSection';

const API = 'https://ccgnimex.my.id/v2/android/ginvite/page/blog_public.php';

interface Blog {
    id: number;
    title: string;
    slug: string;
    image_url: string;
    category: string;
    created_at: string;
    updated_at: string;
    excerpt: string;
}

interface BlogListResponse {
    status: string;
    data: Blog[];
    meta: { total: number; page: number; limit: number; total_pages: number };
    categories: string[];
}

export const metadata: Metadata = {
    title: 'Blog Papunda – Tips & Inspirasi Undangan Digital',
    description:
        'Temukan tips, inspirasi desain undangan digital, panduan pernikahan, khitanan, ulang tahun, dan info seputar undangan online di blog Papunda.',
    keywords: [
        'blog undangan digital',
        'tips undangan pernikahan',
        'inspirasi undangan digital',
        'panduan undangan online',
        'Papunda blog',
    ],
    metadataBase: new URL('https://papunda.com'),
    openGraph: {
        type: 'website',
        locale: 'id_ID',
        url: 'https://papunda.com/blog',
        title: 'Blog Papunda – Tips & Inspirasi Undangan Digital',
        description:
            'Tips, inspirasi desain, dan panduan seputar undangan digital pernikahan, khitanan, dan ulang tahun.',
        siteName: 'Papunda',
        images: [{ url: 'https://papunda.com/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Blog Papunda – Tips & Inspirasi Undangan Digital',
        description: 'Tips & inspirasi desain undangan digital pernikahan, khitanan, ulang tahun.',
        images: ['https://papunda.com/og-image.png'],
    },
    alternates: { canonical: 'https://papunda.com/blog' },
};

async function fetchBlogs(category?: string): Promise<BlogListResponse | null> {
    try {
        const url = category
            ? `${API}?action=list&limit=12&category=${encodeURIComponent(category)}`
            : `${API}?action=list&limit=12`;
        const res = await fetch(url, { next: { revalidate: 60 } });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function BlogCard({ blog }: { blog: Blog }) {
    return (
        <Link
            href={`/blog/${blog.slug}`}
            className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-pink-50 hover:border-pink-200 hover:-translate-y-1"
        >
            {/* Thumbnail */}
            <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-pink-100 to-rose-100 overflow-hidden flex-shrink-0">
                {blog.image_url ? (
                    <Image
                        src={blog.image_url}
                        alt={blog.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-pink-300" />
                    </div>
                )}
                {/* Category badge */}
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-pink-600 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {blog.category}
                </span>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-5">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(blog.created_at)}</span>
                </div>
                <h2 className="text-base md:text-lg font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors leading-snug">
                    {blog.title}
                </h2>
                <p className="text-sm text-slate-500 line-clamp-3 flex-1 leading-relaxed">{blog.excerpt}</p>
                <div className="mt-4 flex items-center gap-1 text-pink-500 text-sm font-semibold">
                    Baca selengkapnya <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    );
}

export default async function BlogListPage({
    searchParams,
}: {
    searchParams: { category?: string };
}) {
    const category = searchParams.category ?? '';
    const data = await fetchBlogs(category || undefined);

    const blogs = data?.data ?? [];
    const categories = data?.categories ?? [];

    // JSON-LD structured data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Blog Papunda',
        description: 'Tips, inspirasi, dan panduan seputar undangan digital pernikahan, khitanan, ulang tahun.',
        url: 'https://papunda.com/blog',
        publisher: {
            '@type': 'Organization',
            name: 'Papunda',
            url: 'https://papunda.com',
            logo: { '@type': 'ImageObject', url: 'https://papunda.com/logo.svg' },
        },
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-white">
            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* ── HEADER ── */}
            <header
                className="sticky top-0 z-50 shadow-sm"
                style={{ background: 'rgba(255,246,247,0.85)', backdropFilter: 'blur(12px)' }}
            >
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/logo.svg" alt="Papunda Logo" width={120} height={40} className="h-9 w-auto" />
                    </Link>
                    <nav className="hidden md:flex items-center gap-4">
                        <Link
                            href="/katalog"
                            className="text-sm text-slate-600 hover:text-pink-600 transition-colors font-medium"
                        >
                            Katalog
                        </Link>
                        <Link
                            href="https://wa.me/6289654728249"
                            target="_blank"
                            className="border-2 border-pink-500 text-pink-500 rounded-full px-4 py-2 text-sm font-semibold hover:bg-pink-50 transition-all inline-flex items-center gap-2"
                        >
                            <Phone className="w-4 h-4" /> Hubungi Admin
                        </Link>
                        <Link
                            href="/admin"
                            className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-4 py-2 text-sm font-semibold transition-all inline-flex items-center gap-2"
                        >
                            <BadgeCheck className="w-4 h-4" /> Buat Undangan
                        </Link>
                    </nav>
                    <div className="md:hidden flex items-center gap-2">
                        <Link
                            href="https://wa.me/6289654728249"
                            className="border-2 border-pink-500 text-pink-500 rounded-full p-2 hover:bg-pink-50 transition-all"
                            aria-label="Hubungi Admin"
                        >
                            <Phone className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/admin"
                            className="bg-pink-500 text-white rounded-full p-2 hover:bg-pink-600 transition-all"
                            aria-label="Buat Undangan"
                        >
                            <LogIn className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-10 md:py-16">
                {/* ── HERO ── */}
                <div className="text-center mb-10 md:mb-14">
                    <span className="inline-block bg-pink-100 text-pink-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                        Blog Papunda
                    </span>
                    <h1 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4 leading-tight">
                        Tips & Inspirasi{' '}
                        <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                            Undangan Digital
                        </span>
                    </h1>
                    <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        Panduan lengkap seputar undangan pernikahan, khitanan, ulang tahun, dan tips membuat
                        undangan online yang berkesan.
                    </p>
                </div>

                {/* ── FILTER KATEGORI ── */}
                {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center mb-10">
                        <Link
                            href="/blog"
                            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${!category
                                ? 'bg-pink-500 text-white shadow-md'
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-pink-300 hover:text-pink-600'
                                }`}
                        >
                            Semua
                        </Link>
                        {categories.map((cat) => (
                            <Link
                                key={cat}
                                href={`/blog?category=${encodeURIComponent(cat)}`}
                                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${category === cat
                                    ? 'bg-pink-500 text-white shadow-md'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:border-pink-300 hover:text-pink-600'
                                    }`}
                            >
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </Link>
                        ))}
                    </div>
                )}

                {/* ── GRID BLOG ── */}
                {blogs.length === 0 ? (
                    <div className="text-center py-24 text-slate-400">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 text-pink-200" />
                        <p className="text-lg font-medium">Belum ada artikel yang dipublish.</p>
                        <p className="text-sm mt-1">Nantikan artikel terbaru dari kami!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {blogs.map((blog) => (
                            <BlogCard key={blog.id} blog={blog} />
                        ))}
                    </div>
                )}

                {/* ── CTA ── */}
                <div className="mt-16 md:mt-20 text-center bg-gradient-to-br from-pink-500 to-rose-500 rounded-3xl p-10 md:p-14 shadow-2xl shadow-pink-200 relative overflow-hidden">
                    <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute -bottom-10 -left-10 w-52 h-52 bg-white/10 rounded-full blur-2xl" />
                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                            Siap Buat Undangan Digital?
                        </h2>
                        <p className="text-pink-100 mb-7 max-w-xl mx-auto">
                            Gratis uji coba, admin bantu sampai selesai. Bayar setelah puas dengan hasilnya!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href="/admin"
                                className="bg-white text-pink-600 hover:bg-pink-50 font-bold px-7 py-3 rounded-full shadow-lg transition-all hover:scale-105 inline-flex items-center gap-2 justify-center"
                            >
                                <BadgeCheck className="w-5 h-5" /> Coba Gratis Sekarang
                            </Link>
                            <Link
                                href="https://wa.me/6289654728249"
                                target="_blank"
                                className="border-2 border-white text-white hover:bg-white/10 font-semibold px-7 py-3 rounded-full transition-all hover:scale-105 inline-flex items-center gap-2 justify-center"
                            >
                                <Phone className="w-5 h-5" /> Hubungi Admin
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <FooterSection />
        </div>
    );
}
