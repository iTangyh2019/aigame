import { extractTags } from '@/lib/gameData';
import { MetadataRoute } from 'next';

// 博客文章数据
const BLOG_POSTS = [
  {
    slug: "master-survival-games",
    lastModified: new Date("2024-05-10").toISOString(),
  },
  {
    slug: "beginners-puzzle-guide",
    lastModified: new Date("2024-05-08").toISOString(),
  },
  {
    slug: "improve-racing-skills",
    lastModified: new Date("2024-05-05").toISOString(),
  },
  {
    slug: "rpg-character-building",
    lastModified: new Date("2024-05-03").toISOString(),
  },
  {
    slug: "underrated-games",
    lastModified: new Date("2024-04-30").toISOString(),
  },
  {
    slug: "tower-defense-strategies",
    lastModified: new Date("2024-04-28").toISOString(),
  },
  {
    slug: "quick-browser-games",
    lastModified: new Date("2024-04-25").toISOString(),
  },
  {
    slug: "platform-game-techniques",
    lastModified: new Date("2024-04-22").toISOString(),
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // 获取所有游戏标签
  const gameTags = extractTags();
  
  // 基本URL
  const baseUrl = 'https://survivorgame.online';
  
  // 主要页面
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];
  
  // 博客文章页面
  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.lastModified,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));
  
  // 游戏标签页面
  const tagPages: MetadataRoute.Sitemap = gameTags.map(tag => ({
    url: `${baseUrl}/games/tag/${tag.name}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));
  
  // 合并所有页面
  return [...mainPages, ...blogPages, ...tagPages];
}
