import { MetadataRoute } from 'next'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://papunda.com';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/undangan-khitanan`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/undangan-pernikahan`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/undangan-ulang-tahun`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // SEO optimized pages for popular keywords
    {
      url: `${baseUrl}/undangan-digital-gratis`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/undangan-digital-pernikahan`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/undangan-digital-khitanan`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/undangan-digital-ulang-tahun`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/buat-undangan-digital`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/undangan-online`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // Fetch dynamic invitation pages
  let dynamicPages: MetadataRoute.Sitemap = [];
  try {
    const apiUrl = 'https://ccgnimex.my.id/v2/android/ginvite/index.php?action=get_undangan&limit=10000'; // Fetch up to 10k invitations
    const res = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Papunda-Sitemap/1.0',
      },
      cache: 'no-cache'
    });
    
    console.log('Sitemap API Response Status:', res.status);
    
    if (res.ok) {
      const data = await res.json();
      console.log('Sitemap API Data:', data);
      
      if (data.status === 'success' && data.data && Array.isArray(data.data)) {
        // Generate SEO-optimized sitemap entries with rich metadata
        dynamicPages = data.data
          .filter((inv: any) => inv && inv.user_id && inv.title && inv.updated_at && inv.status === 1) // Only include active invitations
          .map((inv: any) => {
            // Parse content to extract invitation details
            let content: any = {};
            try {
              content = JSON.parse(inv.content);
            } catch (e) {
              content = {};
            }
            
            // Extract names from children array for SEO
            const children = content.children || [];
            const names = children
              .map((child: any) => child.name)
              .filter((name: string) => name && name.trim())
              .slice(0, 2); // Max 2 names
            
            // Determine invitation type from title or content
            const title = inv.title.toLowerCase();
            let invitationType = 'undangan';
            if (title.includes('khitan') || title.includes('sunatan')) {
              invitationType = 'khitanan';
            } else if (title.includes('nikah') || title.includes('wedding') || title.includes('pernikahan')) {
              invitationType = 'pernikahan';  
            } else if (title.includes('ulang') || title.includes('birthday')) {
              invitationType = 'ulang tahun';
            }
            
            // Get event date for SEO
            const eventDate = content.event?.resepsi?.date || content.event?.akad?.date || '';
            const location = content.event?.resepsi?.location || content.event?.akad?.location || '';
            
            // Create SEO-friendly title and description
            const nameString = names.length > 0 ? names.join(' & ') : inv.first_name || 'Undangan Digital';
            
            // Determine priority based on views and recency
            let priority = 0.6;
            const viewCount = parseInt(inv.view) || 0;
            const lastUpdate = new Date(inv.updated_at);
            const daysSinceUpdate = Math.floor((Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
            
            // Priority calculation
            if (viewCount > 100) priority = 0.9;
            else if (viewCount > 50) priority = 0.8;
            else if (viewCount > 20) priority = 0.7;
            else if (daysSinceUpdate < 7) priority = 0.8; // Boost new invitations
            
            // Change frequency based on activity
            let changeFreq: 'daily' | 'weekly' | 'monthly' = 'monthly';
            if (daysSinceUpdate < 3) changeFreq = 'daily';
            else if (daysSinceUpdate < 14) changeFreq = 'weekly';
            
            // Extract images for Google Image Search optimization
            const galleryImages = content.gallery?.items || [];
            const childrenProfiles = children
              .map((child: any) => child.profile)
              .filter((profile: string) => profile && profile.startsWith('http'));
            
            // Get user profile picture with Google Photos optimization  
            let userProfilePic = '';
            if (inv.pictures_url) {
              userProfilePic = inv.pictures_url;
              // Optimize Google Photos URLs for better quality
              if (userProfilePic.includes('googleusercontent.com') && userProfilePic.includes('=s96-c')) {
                userProfilePic = userProfilePic.replace('=s96-c', '=s1200-c');
              }
            }
            
            // Collect all valid images with SEO-friendly naming
            const validGalleryImages = galleryImages
              .filter((img: string) => img && img.startsWith('http'))
              .map((img: string, index: number) => ({
                url: img,
                alt: `Foto ${invitationType} ${nameString} - Galeri ${index + 1}`,
                caption: `Dokumentasi ${invitationType} ${nameString}`,
                type: 'gallery'
              }));
              
            const validProfileImages = childrenProfiles
              .map((img: string, index: number) => ({
                url: img,
                alt: `Foto ${names[index] || nameString} - ${invitationType}`,
                caption: `Portrait ${names[index] || nameString}`,
                type: 'profile'
              }));
              
            const userImage = userProfilePic ? [{
              url: userProfilePic,
              alt: `Foto ${nameString} - Pembuat undangan ${invitationType}`,
              caption: `Profile ${nameString}`,
              type: 'user'
            }] : [];
            
            const allImages = [
              ...validGalleryImages,
              ...validProfileImages, 
              ...userImage
            ].slice(0, 15); // Increase limit for better SEO coverage
            
            return {
              url: `${baseUrl}/undang/${inv.user_id}/${encodeURIComponent(inv.title)}`,
              lastModified: new Date(inv.updated_at),
              changeFrequency: changeFreq,
              priority: priority,
              // Additional metadata for rich snippets and image SEO
              _seoData: {
                title: `Undangan Digital ${invitationType.charAt(0).toUpperCase() + invitationType.slice(1)} ${nameString}${eventDate ? ` ${eventDate}` : ''} | Papunda`,
                description: `Undangan digital ${invitationType} ${nameString}${eventDate ? ` - ${new Date(eventDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}` : ''}${location ? ` di ${location}` : ''}. Galeri foto ${invitationType}, info acara, dan RSVP online. Buat undangan digital gratis seperti ini!`,
                type: invitationType,
                names: names,
                eventDate: eventDate,
                location: location,
                views: viewCount,
                images: allImages,
                imageCount: allImages.length,
                primaryImage: allImages[0]?.url || `${baseUrl}/default-invitation-${invitationType.replace(' ', '-')}.jpg`,
                imageAlt: `Foto undangan ${invitationType} ${nameString}`,
                keywords: [
                  `undangan digital ${invitationType}`,
                  `undangan online ${invitationType}`,
                  `foto ${invitationType} ${nameString}`,
                  `galeri ${invitationType}`,
                  `${invitationType} ${nameString}`,
                  'undangan digital gratis',
                  `buat undangan ${invitationType}`,
                  location && `${invitationType} di ${location}`,
                  eventDate && `${invitationType} ${new Date(eventDate).getFullYear()}`
                ].filter(Boolean),
                ogImage: {
                  url: allImages[0]?.url || `${baseUrl}/default-invitation-${invitationType.replace(' ', '-')}.jpg`,
                  width: 1200,
                  height: 630,
                  alt: `Undangan Digital ${invitationType} ${nameString} - Papunda`,
                  type: 'image/jpeg'
                },
                structuredData: {
                  '@type': 'Event',
                  name: `${invitationType.charAt(0).toUpperCase() + invitationType.slice(1)} ${nameString}`,
                  startDate: eventDate || undefined,
                  location: location ? {
                    '@type': 'Place',
                    name: location
                  } : undefined,
                  image: allImages.map(img => img.url),
                  organizer: {
                    '@type': 'Person', 
                    name: nameString
                  },
                  offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'IDR',
                    availability: 'InStock'
                  }
                }
              }
            };
          });
        
        console.log(`Sitemap: Added ${dynamicPages.length} dynamic pages`);
      } else {
        console.warn('Sitemap: Invalid API response structure:', data);
      }
    } else {
      console.error('Sitemap: API request failed with status:', res.status);
    }
  } catch (error) {
    console.error('Failed to fetch invitations for sitemap:', error);
  }

  return [...staticPages, ...dynamicPages];
}
