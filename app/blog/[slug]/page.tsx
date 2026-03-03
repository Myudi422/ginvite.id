// app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    Calendar,
    Tag,
    ArrowLeft,
    Phone,
    BadgeCheck,
    LogIn,
    ChevronRight,
    BookOpen,
} from 'lucide-react';
import FooterSection from '@/components/sections/FooterSection';

const API = 'https://ccgnimex.my.id/v2/android/ginvite/page/blog_public.php';

interface Blog {
    id: number;
    title: string;
    slug: string;
    content: string;
    image_url: string;
    category: string;
    created_at: string;
    updated_at: string;
}

interface RelatedBlog {
    id: number;
    title: string;
    slug: string;
    image_url: string;
    category: string;
    created_at: string;
    excerpt: string;
}

async function fetchBlog(slug: string): Promise<Blog | null> {
    try {
        const res = await fetch(`${API}?action=get&slug=${encodeURIComponent(slug)}`, {
            next: { revalidate: 600 },
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.status === 'success' ? data.data : null;
    } catch {
        return null;
    }
}

async function fetchRelated(category: string, excludeId: number): Promise<RelatedBlog[]> {
    try {
        const res = await fetch(
            `${API}?action=related&category=${encodeURIComponent(category)}&exclude_id=${excludeId}&limit=3`,
            { next: { revalidate: 600 } }
        );
        if (!res.ok) return [];
        const data = await res.json();
        return data.status === 'success' ? data.data : [];
    } catch {
        return [];
    }
}

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const blog = await fetchBlog(params.slug);
    if (!blog) {
        return { title: 'Artikel Tidak Ditemukan | Blog Papunda' };
    }

    const excerpt = blog.content.replace(/<[^>]*>/g, '').slice(0, 160).trim();
    const canonical = `https://papunda.com/blog/${blog.slug}`;

    return {
        title: `${blog.title} | Blog Papunda`,
        description: excerpt,
        keywords: [
            blog.category,
            'undangan digital',
            'Papunda',
            blog.title,
            'tips undangan',
            'inspirasi undangan',
        ],
        metadataBase: new URL('https://papunda.com'),
        alternates: { canonical },
        openGraph: {
            type: 'article',
            locale: 'id_ID',
            url: canonical,
            title: `${blog.title} | Blog Papunda`,
            description: excerpt,
            siteName: 'Papunda',
            publishedTime: blog.created_at,
            modifiedTime: blog.updated_at,
            section: blog.category,
            images: blog.image_url
                ? [{ url: blog.image_url, width: 1200, height: 630, alt: blog.title }]
                : [{ url: 'https://papunda.com/og-image.png', width: 1200, height: 630 }],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${blog.title} | Blog Papunda`,
            description: excerpt,
            images: blog.image_url ? [blog.image_url] : ['https://papunda.com/og-image.png'],
        },
    };
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
    const blog = await fetchBlog(params.slug);
    if (!blog) notFound();

    const related = await fetchRelated(blog.category, blog.id);
    const excerpt = blog.content.replace(/<[^>]*>/g, '').slice(0, 160).trim();

    // JSON-LD for BlogPosting
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: blog.title,
        description: excerpt,
        image: blog.image_url || 'https://papunda.com/og-image.png',
        datePublished: blog.created_at,
        dateModified: blog.updated_at,
        articleSection: blog.category,
        url: `https://papunda.com/blog/${blog.slug}`,
        inLanguage: 'id-ID',
        author: {
            '@type': 'Organization',
            name: 'Papunda',
            url: 'https://papunda.com',
        },
        publisher: {
            '@type': 'Organization',
            name: 'Papunda',
            url: 'https://papunda.com',
            logo: { '@type': 'ImageObject', url: 'https://papunda.com/logo.svg' },
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `https://papunda.com/blog/${blog.slug}` },
        breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Beranda', item: 'https://papunda.com' },
                { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://papunda.com/blog' },
                { '@type': 'ListItem', position: 3, name: blog.title, item: `https://papunda.com/blog/${blog.slug}` },
            ],
        },
    };

    return (
        <div className="min-h-screen bg-white">
            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* ── HEADER ── */}
            <header
                className="sticky top-0 z-50 shadow-sm"
                style={{ background: 'rgba(255,246,247,0.9)', backdropFilter: 'blur(12px)' }}
            >
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/logo.svg" alt="Papunda Logo" width={120} height={40} className="h-9 w-auto" />
                    </Link>
                    <nav className="hidden md:flex items-center gap-4">
                        <Link
                            href="/blog"
                            className="text-sm text-slate-600 hover:text-pink-600 transition-colors font-medium"
                        >
                            Blog
                        </Link>
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
                            className="border-2 border-pink-500 text-pink-500 rounded-full p-2 hover:bg-pink-50"
                            aria-label="Hubungi Admin"
                        >
                            <Phone className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/admin"
                            className="bg-pink-500 text-white rounded-full p-2 hover:bg-pink-600"
                            aria-label="Buat Undangan"
                        >
                            <LogIn className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
                {/* ── BREADCRUMB ── */}
                <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6" aria-label="Breadcrumb">
                    <Link href="/" className="hover:text-pink-500 transition-colors">Beranda</Link>
                    <ChevronRight className="w-3 h-3" />
                    <Link href="/blog" className="hover:text-pink-500 transition-colors">Blog</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-slate-600 line-clamp-1">{blog.title}</span>
                </nav>

                {/* ── HERO IMAGE ── */}
                {blog.image_url && (
                    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-8 shadow-lg">
                        <Image
                            src={blog.image_url}
                            alt={blog.title}
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 896px"
                            className="object-cover"
                        />
                    </div>
                )}

                {/* ── META ── */}
                <div className="flex flex-wrap items-center gap-3 mb-5">
                    <span className="bg-pink-100 text-pink-600 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                        <Tag className="w-3 h-3" />
                        {blog.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(blog.created_at)}
                    </span>
                </div>

                {/* ── TITLE ── */}
                <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-8 leading-tight">
                    {blog.title}
                </h1>

                {/* ── CONTENT ── */}
                <article
                    className="prose prose-slate max-w-none
            prose-headings:font-bold prose-headings:text-slate-800
            prose-h2:text-2xl prose-h3:text-xl
            prose-p:text-slate-600 prose-p:leading-relaxed
            prose-a:text-pink-500 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:shadow-md
            prose-blockquote:border-l-pink-400 prose-blockquote:bg-pink-50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg
            prose-code:text-pink-600 prose-code:bg-pink-50 prose-code:px-1 prose-code:rounded
            prose-strong:text-slate-800
            prose-ul:my-4 prose-li:text-slate-600"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {/* ── DIVIDER ── */}
                <div className="my-12 h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent" />

                {/* ── CTA BANNER ── */}
                <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-8 md:p-10 text-center shadow-xl shadow-pink-200 mb-14 relative overflow-hidden">
                    <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full blur-xl" />
                    <div className="relative z-10">
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                            Siap Buat Undangan Digital?
                        </h2>
                        <p className="text-pink-100 text-sm mb-6">
                            Gratis uji coba. Admin bantu sampai selesai. Bayar setelah puas!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href="/admin"
                                className="bg-white text-pink-600 hover:bg-pink-50 font-bold px-6 py-2.5 rounded-full shadow-lg transition-all hover:scale-105 inline-flex items-center gap-2 justify-center text-sm"
                            >
                                <BadgeCheck className="w-4 h-4" /> Coba Gratis Sekarang
                            </Link>
                            <Link
                                href="https://wa.me/6289654728249"
                                target="_blank"
                                className="border-2 border-white text-white hover:bg-white/10 font-semibold px-6 py-2.5 rounded-full transition-all hover:scale-105 inline-flex items-center gap-2 justify-center text-sm"
                            >
                                <Phone className="w-4 h-4" /> Hubungi Admin
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ── ARTIKEL TERKAIT ── */}
                {related.length > 0 && (
                    <section>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6">Artikel Terkait</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            {related.map((rel) => (
                                <Link
                                    key={rel.id}
                                    href={`/blog/${rel.slug}`}
                                    className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-slate-100 hover:border-pink-200 hover:-translate-y-0.5"
                                >
                                    <div className="relative aspect-video bg-pink-50 overflow-hidden">
                                        {rel.image_url ? (
                                            <Image
                                                src={rel.image_url}
                                                alt={rel.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 300px"
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <BookOpen className="w-8 h-8 text-pink-200" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 flex flex-col flex-1">
                                        <span className="text-xs text-pink-500 font-bold mb-1">{rel.category}</span>
                                        <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 group-hover:text-pink-600 transition-colors flex-1">
                                            {rel.title}
                                        </h3>
                                        <span className="text-xs text-slate-400 mt-2">{formatDate(rel.created_at)}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── BACK LINK ── */}
                <div className="mt-10 pt-8 border-t border-slate-100">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-pink-600 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Blog
                    </Link>
                </div>
            </main>

            <FooterSection />
        </div>
    );
}
