// SEO: サイトマップ自動生成
// UI/UX変更なし - sitemap.xmlの生成のみ

import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://keikamotukeijiban.vercel.app';
  const currentDate = new Date();

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'always',
      priority: 1.0,
    },
  ];
}

