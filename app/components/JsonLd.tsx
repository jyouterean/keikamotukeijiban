// SEO用：構造化データ（JSON-LD）コンポーネント
// UI/UXは変更なし - headにscriptタグを追加するのみ

export function WebsiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '軽貨物掲示板',
    description: '軽貨物ドライバーと荷主・元請けをつなぐ無料掲示板',
    url: 'https://keikamotukeijiban.vercel.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://keikamotukeijiban.vercel.app/?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '軽貨物掲示板',
    description: '軽貨物の案件情報を共有する掲示板サイト',
    url: 'https://keikamotukeijiban.vercel.app',
    logo: 'https://keikamotukeijiban.vercel.app/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'Japanese',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function DiscussionForumJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DiscussionForumPosting',
    headline: '軽貨物掲示板 - 案件・雑談コミュニティ',
    description: '軽貨物ドライバーと荷主のための情報交換掲示板',
    author: {
      '@type': 'Organization',
      name: '軽貨物掲示板',
    },
    publisher: {
      '@type': 'Organization',
      name: '軽貨物掲示板',
    },
    discussionUrl: 'https://keikamotukeijiban.vercel.app',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function BreadcrumbJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'ホーム',
        item: 'https://keikamotukeijiban.vercel.app',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

