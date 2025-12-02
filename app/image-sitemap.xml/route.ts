import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch invitations data
    const apiUrl = 'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=get_undangan&limit=10000';
    const res = await fetch(apiUrl, { cache: 'no-cache' });
    
    if (!res.ok) {
      throw new Error('Failed to fetch invitations');
    }

    const data = await res.json();
    const baseUrl = 'https://papunda.com';
    
    // Build image sitemap XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    if (data.status === 'success' && data.data) {
      for (const inv of data.data.filter((i: any) => i.status === 1)) {
        let content: any = {};
        try {
          content = JSON.parse(inv.content);
        } catch (e) {
          continue;
        }

        // Extract names and type
        const children = content.children || [];
        const names = children
          .map((child: any) => child.name)
          .filter((name: string) => name && name.trim())
          .slice(0, 2);
        
        const title = inv.title.toLowerCase();
        let invitationType = 'undangan';
        if (title.includes('khitan') || title.includes('sunatan')) {
          invitationType = 'khitanan';
        } else if (title.includes('nikah') || title.includes('wedding') || title.includes('pernikahan')) {
          invitationType = 'pernikahan';
        } else if (title.includes('ulang') || title.includes('birthday')) {
          invitationType = 'ulang tahun';
        }

        const nameString = names.length > 0 ? names.join(' & ') : inv.first_name || 'Undangan Digital';
        const eventDate = content.event?.resepsi?.date || content.event?.akad?.date || '';
        const location = content.event?.resepsi?.location || content.event?.akad?.location || '';

        // Get all images
        const galleryImages = content.gallery?.items || [];
        const childrenProfiles = children
          .map((child: any) => child.profile)
          .filter((profile: string) => profile && profile.startsWith('http'));
        
        let userProfilePic = '';
        if (inv.pictures_url) {
          userProfilePic = inv.pictures_url;
          if (userProfilePic.includes('googleusercontent.com') && userProfilePic.includes('=s96-c')) {
            userProfilePic = userProfilePic.replace('=s96-c', '=s1200-c');
          }
        }

        const allImages = [
          ...galleryImages.filter((img: string) => img && img.startsWith('http')),
          ...childrenProfiles,
          userProfilePic
        ].filter(Boolean);

        if (allImages.length > 0) {
          xml += `
  <url>
    <loc>${baseUrl}/undang/${inv.user_id}/${encodeURIComponent(inv.title)}</loc>
    <lastmod>${new Date(inv.updated_at).toISOString()}</lastmod>`;

          // Add image entries
          allImages.forEach((imageUrl: string, index: number) => {
            xml += `
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title>Foto ${invitationType} ${nameString} - ${index + 1}</image:title>
      <image:caption>Dokumentasi ${invitationType} ${nameString}${eventDate ? ` - ${eventDate}` : ''}${location ? ` di ${location}` : ''}</image:caption>
    </image:image>`;
          });

          xml += `
  </url>`;
        }
      }
    }

    xml += `
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });

  } catch (error) {
    console.error('Image sitemap generation failed:', error);
    return new NextResponse('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', {
      headers: { 'Content-Type': 'application/xml' },
    });
  }
}