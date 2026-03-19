import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/panel/',
          '/test-gemini/',
          '/test-regenerate/',
        ],
      },
      // Block AI scrapers from heavy crawling
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
    ],
    sitemap: [
      'https://papunda.com/sitemap.xml',
      'https://papunda.com/image-sitemap.xml',
    ],
  }
}
