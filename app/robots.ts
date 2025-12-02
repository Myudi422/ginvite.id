import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/auth/', '/panel/'],
    },
    sitemap: [
      'https://papunda.com/sitemap.xml',
      'https://papunda.com/image-sitemap.xml'
    ],
  }
}
