import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/eclipse-lab', '/eclipse-hidden-gateway', '/eclipse-terminal'],
      },
    ],
    sitemap: 'https://ctf-adventure.vercel.app/sitemap.xml',
  };
}