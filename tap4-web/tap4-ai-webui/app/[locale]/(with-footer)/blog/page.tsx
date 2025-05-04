'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

// 模拟的博客数据
const blogPosts = [
  {
    id: 1,
    slug: 'survival-tips',
    title: '生存游戏10大技巧',
    excerpt: '想在生存游戏中更加出色？这里有10个关键技巧帮助你延长生存时间，掌握游戏节奏。',
    coverImage: '/images/blog/survival-tips.svg',
    date: '2023-06-15',
    category: '游戏攻略',
    author: '生存大师'
  },
  {
    id: 2,
    slug: 'puzzle-guide',
    title: '解谜游戏入门指南',
    excerpt: '解谜游戏需要独特的思维方式。本指南将带你了解基础概念，培养解谜思维能力。',
    coverImage: '/images/blog/puzzle-guide.svg',
    date: '2023-07-22',
    category: '新手指南',
    author: '谜题爱好者'
  },
  {
    id: 3,
    slug: 'battle-royale',
    title: '大逃杀游戏战术精通',
    excerpt: '在竞争激烈的大逃杀游戏中，战术决定成败。探索最有效的战略，成为最后的胜利者。',
    coverImage: '/images/blog/battle-royale.svg',
    date: '2023-08-05',
    category: '竞技策略',
    author: '战术大师'
  },
  {
    id: 4,
    slug: 'survival-guide',
    title: '荒野生存游戏完全攻略',
    excerpt: '从基础资源收集到高级建造，这份完整指南涵盖了荒野生存游戏的各个方面。',
    coverImage: '/images/blog/survival-guide.svg',
    date: '2023-09-10',
    category: '游戏攻略',
    author: '探险家'
  },
  {
    id: 5,
    slug: 'resource-management',
    title: '资源管理游戏优化策略',
    excerpt: '高效的资源分配能让你在管理类游戏中遥遥领先。学习平衡与优先级设置的核心原则。',
    coverImage: '/images/blog/resource-management.svg',
    date: '2023-10-18',
    category: '游戏策略',
    author: '经济学家'
  },
  {
    id: 6,
    slug: 'battle-strategies',
    title: '即时战略游戏制胜法则',
    excerpt: '掌握单位控制、资源管理和战场视野，成为即时战略游戏中无人能敌的指挥官。',
    coverImage: '/images/blog/battle-strategies.svg',
    date: '2023-11-25',
    category: '游戏策略',
    author: '战争策略家'
  },
  {
    id: 7,
    slug: 'game-balance',
    title: '游戏平衡设计的艺术',
    excerpt: '探索游戏设计师如何在游戏中创造公平而有趣的挑战，平衡各种游戏机制。',
    coverImage: '/images/blog/game-balance.svg',
    date: '2023-12-12',
    category: '游戏设计',
    author: '设计师视角'
  },
  {
    id: 8,
    slug: 'community-events',
    title: '如何组织成功的游戏社区活动',
    excerpt: '游戏社区活动能增强玩家黏性。了解策划、推广和执行精彩社区活动的要素。',
    coverImage: '/images/blog/community-events.svg',
    date: '2024-01-08',
    category: '社区管理',
    author: '社区经理'
  },
  {
    id: 9,
    slug: 'game-mechanics',
    title: '解析流行游戏的核心机制',
    excerpt: '通过分析当下最受欢迎游戏的核心机制，探索是什么让这些游戏如此吸引人。',
    coverImage: '/images/blog/game-mechanics.svg',
    date: '2024-02-20',
    category: '游戏分析',
    author: '游戏分析师'
  },
  {
    id: 10,
    slug: 'dev-diary',
    title: '独立游戏开发者的一周日记',
    excerpt: '跟随一位独立游戏开发者的日常，了解游戏开发过程中的挑战与喜悦。',
    coverImage: '/images/blog/dev-diary.svg',
    date: '2024-03-15',
    category: '游戏开发',
    author: '独立开发者'
  }
];

export default function BlogPage() {
  const t = useTranslations('Blog');

  return (
    <main className="max-w-pc mx-auto px-5 py-8 lg:px-0">
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
        <p className="text-gray-400 max-w-2xl">{t('description')}</p>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.id} className="group">
            <article className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg">
              <div className="relative h-48 w-full">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded">{post.category}</span>
                  <span className="text-xs text-gray-400">{post.date}</span>
                </div>
                <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">{post.title}</h2>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                    <span className="text-xs font-bold">{post.author.charAt(0)}</span>
                  </div>
                  <span className="text-sm text-gray-300">{post.author}</span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </section>
    </main>
  );
} 