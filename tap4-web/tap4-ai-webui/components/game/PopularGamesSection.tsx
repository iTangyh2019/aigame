'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, TrendingUp } from 'lucide-react';
import { getAllGames, Game } from '@/lib/gameData';
import GameCard from './GameCard';

export default function PopularGamesSection() {
  const [popularGames, setPopularGames] = useState<Game[]>([]);
  
  useEffect(() => {
    // 获取所有游戏并按浏览量排序
    const games = getAllGames();
    const sorted = [...games]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 8);
    
    setPopularGames(sorted);
  }, []);
  
  if (popularGames.length === 0) {
    return null;
  }
  
  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center text-xl font-semibold">
          <TrendingUp size={20} className="mr-2 text-primary" />
          Popular Games
        </h3>
        <Link 
          href="/games/popular"
          className="flex items-center text-sm text-gray-300 hover:text-white"
        >
          View All <ChevronRight size={16} />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {popularGames.map((game) => (
          <GameCard key={game.title} game={game} />
        ))}
      </div>
    </section>
  );
} 