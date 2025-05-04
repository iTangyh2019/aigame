'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { getGamesByTag, Game } from '@/lib/gameData';
import GameCard from './GameCard';
import { LoadingContainer } from '@/components/ui/LoadingSpinner';

interface GameByTagSectionProps {
  tagName: string;
}

export default function GameByTagSection({ tagName }: GameByTagSectionProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // 获取该标签下的前20个游戏
    const fetchedGames = getGamesByTag(tagName, 20);
    setGames(fetchedGames);
    setLoading(false);
  }, [tagName]);
  
  if (loading) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="mt-2 text-sm text-gray-400">{`Loading ${tagName} games...`}</p>
        </div>
      </div>
    );
  }
  
  if (games.length === 0) {
    return null;
  }
  
  return (
    <section className="mb-10 animate-fadeIn">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold">{tagName} Games</h3>
        <Link 
          href={`/games/tag/${tagName}`}
          className="flex items-center text-sm text-gray-300 transition-colors hover:text-primary"
        >
          View All <ChevronRight size={16} className="transition-transform hover:translate-x-1" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {games.slice(0, 8).map((game, index) => (
          <div 
            key={game.title}
            className="animate-fadeIn opacity-0"
            style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'forwards' }}
          >
            <GameCard game={game} />
          </div>
        ))}
      </div>
      
      {games.length > 8 && (
        <div className="mt-4 text-center">
          <Link
            href={`/games/tag/${tagName}`}
            className="inline-block rounded-md border border-gray-600 px-4 py-2 text-sm transition-all hover:border-primary hover:bg-gray-700 hover:shadow-sm"
          >
            Get More Games
          </Link>
        </div>
      )}
    </section>
  );
} 