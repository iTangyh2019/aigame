'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Tag as TagIcon, Loader2 } from 'lucide-react';
import { getGamesByTag, Game } from '@/lib/gameData';
import GameCard from '@/components/game/GameCard';

export default function GameTagPage({ params }: { params: { tagName: string } }) {
  const { tagName } = params;
  const decodedTagName = decodeURIComponent(tagName);
  
  const [games, setGames] = useState<Game[]>([]);
  const [visibleGames, setVisibleGames] = useState<Game[]>([]);
  const [loadMore, setLoadMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const GAMES_PER_PAGE = 20;
  
  useEffect(() => {
    // 获取标签相关的所有游戏
    setLoading(true);
    const tagGames = getGamesByTag(decodedTagName);
    setGames(tagGames);
    
    // 初始显示前20个游戏
    setVisibleGames(tagGames.slice(0, GAMES_PER_PAGE));
    setLoadMore(tagGames.length > GAMES_PER_PAGE);
    setLoading(false);
  }, [decodedTagName]);
  
  const handleLoadMore = () => {
    setLoadingMore(true);
    
    // 模拟加载延迟，增强用户体验
    setTimeout(() => {
      const currentCount = visibleGames.length;
      const nextGames = games.slice(currentCount, currentCount + GAMES_PER_PAGE);
      setVisibleGames([...visibleGames, ...nextGames]);
      
      // 检查是否还有更多游戏可加载
      if (currentCount + GAMES_PER_PAGE >= games.length) {
        setLoadMore(false);
      }
      
      setLoadingMore(false);
    }, 500);
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-400">Loading games for {decodedTagName}...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 animate-fadeIn">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <Link 
            href="/" 
            className="group mr-3 inline-flex items-center text-gray-400 transition-colors hover:text-primary"
          >
            <ArrowLeft size={18} className="mr-1 transition-transform group-hover:-translate-x-1" />
          </Link>
          <div className="flex items-center">
            <TagIcon size={20} className="mr-2 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold">{decodedTagName} Games</h1>
          </div>
        </div>
        <p className="text-gray-400">Found {games.length} games in this category</p>
      </div>
      
      {visibleGames.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {visibleGames.map((game, index) => (
              <div 
                key={game.title}
                className="animate-fadeIn opacity-0"
                style={{ 
                  animationDelay: `${Math.min(index, 15) * 0.05}s`, 
                  animationFillMode: 'forwards' 
                }}
              >
                <GameCard game={game} />
              </div>
            ))}
          </div>
          
          {loadMore && (
            <div className="mt-8 text-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className={`btn-secondary relative ${loadingMore ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Loading more games...</span>
                  </>
                ) : (
                  <span>Get More Games</span>
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-lg bg-gray-800 p-8 text-center shadow-lg animate-scaleIn">
          <p className="text-lg text-gray-300">No games found in this category.</p>
          <p className="mt-2 text-gray-400">Try browsing other categories or return to the homepage.</p>
          <Link 
            href="/games/all-tags"
            className="mt-4 inline-block btn-secondary"
          >
            Browse All Categories
          </Link>
        </div>
      )}
    </div>
  );
} 