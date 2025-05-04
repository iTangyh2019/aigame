import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/db/supabase/client';
import { CircleChevronRight, ChevronRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { RevalidateOneHour } from '@/lib/constants';
import Faq from '@/components/Faq';
import GameSearchForm from '@/components/home/GameSearchForm';
import WebNavCardList from '@/components/webNav/WebNavCardList';
import { extractTags } from '@/lib/gameData';
import GameByTagSection from '@/components/game/GameByTagSection';
import PopularGamesSection from '@/components/game/PopularGamesSection';

import { TagList } from './Tag';

const ScrollToTop = dynamic(() => import('@/components/page/ScrollToTop'), { ssr: false });

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({
    locale,
    namespace: 'Metadata.home',
  });

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL as string),
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    alternates: {
      canonical: './',
    },
  };
}

export const revalidate = RevalidateOneHour;

export default async function Page() {
  const supabase = createClient();
  const t = await getTranslations('Home');
  const [{ data: categoryList }, { data: navigationList }] = await Promise.all([
    supabase.from('navigation_category').select(),
    supabase.from('web_navigation').select().order('collection_time', { ascending: false }).limit(12),
  ]);
  
  // 提取游戏标签并获取前10个最热门的标签
  const topTags = extractTags().slice(0, 10);

  return (
    <div className='relative w-full'>
      <div className='relative mx-auto w-full max-w-pc flex-1 px-3 lg:px-0'>
        <div className='my-5 flex flex-col text-center lg:mx-auto lg:my-10 lg:gap-1'>
          <h1 className='text-2xl font-bold text-white lg:text-5xl'>Welcome to Survivor Game Online</h1>
          <h2 className='text-balance text-xs font-bold text-white lg:text-sm'>
            Dive into the ultimate gaming adventure! Explore 500+ thrilling online games, from intense survival challenges to action-packed races, brain-bending puzzles, and epic adventures.
          </h2>
        </div>
        <div className='flex w-full items-center justify-center'>
          <GameSearchForm />
        </div>
        <div className='mb-10 mt-5'>
          <TagList
            data={(categoryList || []).map((item) => ({
              id: String(item.id),
              name: item.name,
              href: `/category/${item.name}`,
            }))}
          />
        </div>
        
        {/* 游戏标签展示区域 */}
        <div className='mb-12'>
          <h2 className='mb-5 text-center text-[18px] lg:text-[32px]'>Game Categories</h2>
          <div className='flex flex-wrap justify-center gap-2'>
            {topTags.map((tag) => (
              <Link 
                key={tag.name}
                href={`/games/tag/${tag.name}`}
                className='rounded-full bg-gray-800 px-4 py-2 text-sm hover:bg-gray-700'
              >
                {tag.name} ({tag.count})
              </Link>
            ))}
          </div>
        </div>
        
        {/* 热门游戏展示区域 */}
        <div className='mb-12'>
          <PopularGamesSection />
        </div>
        
        {/* 游戏展示区域 */}
        <div className='mb-12'>
          <h2 className='mb-5 text-center text-[18px] lg:text-[32px]'>Featured Games</h2>
          {topTags.slice(0, 3).map((tag) => (
            <GameByTagSection key={tag.name} tagName={tag.name} />
          ))}
        </div>
        
        {/* 游戏攻略博客区域 */}
        <div className='mb-12'>
          <h2 className='mb-5 text-center text-[18px] lg:text-[32px]'>Game Guides & Tips</h2>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {[
              {
                title: "10 Tips to Master Survival Games",
                excerpt: "Learn the essential strategies to survive longer in challenging survival games. From resource management to combat tactics...",
                image: "/images/blog/survival-tips.svg",
                slug: "survival-tips"
              },
              {
                title: "Beginner's Guide to Puzzle Games",
                excerpt: "New to puzzle games? This comprehensive guide will help you understand different puzzle types and develop problem-solving skills...",
                image: "/images/blog/puzzle-guide.svg",
                slug: "puzzle-guide"
              },
              {
                title: "Master Strategies for Battle Royale",
                excerpt: "In the competitive world of battle royale games, tactics determine success. Explore the most effective strategies to become the last one standing...",
                image: "/images/blog/battle-royale.svg",
                slug: "battle-royale"
              }
            ].map((post, index) => (
              <div key={index} className='overflow-hidden rounded-lg border border-gray-700 transition-all hover:border-primary hover:shadow-md'>
                <div className='relative aspect-video w-full bg-gray-800'>
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className='p-4'>
                  <h3 className='mb-2 text-lg font-medium'>{post.title}</h3>
                  <p className='mb-4 text-sm text-gray-400'>{post.excerpt}</p>
                  <Link 
                    href={`/blog/${post.slug}`}
                    className='inline-flex items-center text-sm text-primary'
                  >
                    Read More <ChevronRight size={16} className='ml-1' />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className='mt-6 text-center'>
            <Link
              href='/blog'
              className='inline-block rounded-md border border-gray-600 px-4 py-2 text-sm transition-all hover:border-primary hover:bg-gray-700 hover:shadow-sm'
            >
              View All Game Guides
            </Link>
          </div>
        </div>

        <div className='flex flex-col gap-5'>
          <h2 className='text-center text-[18px] lg:text-[32px]'>{t('ai-navigate')}</h2>
          <WebNavCardList dataList={navigationList || []} />
          <Link
            href='/explore'
            className='mx-auto mb-5 flex w-fit items-center justify-center gap-5 rounded-[9px] border border-white p-[10px] text-sm leading-4 hover:opacity-70'
          >
            {t('exploreMore')}
            <CircleChevronRight className='mt-[0.5] h-[20px] w-[20px]' />
          </Link>
        </div>
        <Faq />
        <ScrollToTop />
      </div>
    </div>
  );
}
