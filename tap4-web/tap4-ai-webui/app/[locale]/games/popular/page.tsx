'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { getAllGames, Game } from '@/lib/gameData';
import GameCard from '@/components/game/GameCard';

export default function PopularGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [visibleGames, setVisibleGames] = useState<Game[]>([]);
  const [loadMore, setLoadMore] = useState(true);
  
  const GAMES_PER_PAGE = 20;
  
  useEffect(() => {
    // 获取所有游戏并按浏览量排序
    const allGames = getAllGames();
    const sortedGames = [...allGames].sort((a, b) => (b.views || 0) - (a.views || 0));
    
    setGames(sortedGames);
    setVisibleGames(sortedGames.slice(0, GAMES_PER_PAGE));
    setLoadMore(sortedGames.length > GAMES_PER_PAGE);
  }, []);
  
  const handleLoadMore = () => {
    const currentCount = visibleGames.length;
    const nextGames = games.slice(currentCount, currentCount + GAMES_PER_PAGE);
    setVisibleGames([...visibleGames, ...nextGames]);
    
    // 检查是否还有更多游戏可加载
    if (currentCount + GAMES_PER_PAGE >= games.length) {
      setLoadMore(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <Link 
        href="/" 
        className="mb-6 inline-flex items-center text-gray-400 hover:text-white"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to home
      </Link>
      
      <div className="mb-6 flex items-center">
        <TrendingUp size={24} className="mr-2 text-primary" />
        <h1 className="text-3xl font-bold">Popular Games</h1>
      </div>
      
      <p className="mb-8 text-gray-400">
        Discover the most played games on our platform, ranked by popularity and player engagement.
      </p>
      
      {visibleGames.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {visibleGames.map((game) => (
              <GameCard key={game.title} game={game} />
            ))}
          </div>
          
          {loadMore && (
            <div className="mt-8 text-center">
              <button
                onClick={handleLoadMore}
                className="rounded-md bg-gray-800 px-6 py-2 text-white hover:bg-gray-700"
              >
                Get More Games
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-lg bg-gray-800 p-8 text-center">
          <p className="text-lg text-gray-300">No games found.</p>
        </div>
      )}
    </div>
  );
} 