'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Tag as TagIcon, Eye, Star, Loader2 } from 'lucide-react';
import { getAllGames, Game, getGamesByTag, incrementGameViews, getGameViews } from '@/lib/gameData';

export default function GamePlayPage({ params }: { params: { title: string } }) {
  const { title } = params;
  const decodedTitle = decodeURIComponent(title);
  
  const [game, setGame] = useState<Game | null>(null);
  const [relatedGames, setRelatedGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [gameLoaded, setGameLoaded] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  
  useEffect(() => {
    // 查找匹配的游戏
    const games = getAllGames();
    const foundGame = games.find(g => g.title === decodedTitle);
    
    if (foundGame) {
      setGame(foundGame);
      
      // 更新游戏点击次数
      incrementGameViews(foundGame.title);
      setViewCount(getGameViews(foundGame.title));
      
      // 获取相关游戏（同标签的游戏）
      const mainTag = foundGame.tags.split(',')[0].trim();
      if (mainTag) {
        const related = getGamesByTag(mainTag, 4)
          .filter(g => g.title !== foundGame.title);
        setRelatedGames(related);
      }
    }
    
    setLoading(false);
  }, [decodedTitle]);
  
  if (loading) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-gray-400">Loading game...</p>
        </div>
      </div>
    );
  }
  
  if (!game) {
    return (
      <div className="container mx-auto py-8 text-center animate-fadeIn">
        <h1 className="mb-6 text-2xl font-bold">Game not found</h1>
        <p className="mb-4">The game you are looking for doesn't exist or has been removed.</p>
        <Link 
          href="/"
          className="btn-primary"
        >
          Go back to home
        </Link>
      </div>
    );
  }
  
  const tags = game.tags.split(',').map(tag => tag.trim()).filter(Boolean);
  
  return (
    <div className="container mx-auto py-8 animate-fadeIn">
      <Link 
        href="/" 
        className="mb-6 inline-flex items-center text-gray-400 transition-colors hover:text-primary"
      >
        <ArrowLeft size={16} className="mr-2 transition-transform group-hover:-translate-x-1" />
        Back to home
      </Link>
      
      <div className="mb-8 grid gap-8 md:grid-cols-[1fr_350px]">
        {/* 游戏iframe区域 */}
        <div className="game-container h-[600px]">
          {!gameLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10">
              <div className="animate-pulse-custom text-center">
                <div className="animate-spin h-12 w-12 mb-4 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="text-primary">Loading game...</p>
              </div>
            </div>
          )}
          <iframe
            src={game.game_url}
            title={game.title}
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setGameLoaded(true)}
          ></iframe>
        </div>
        
        {/* 游戏信息区域 */}
        <div className="flex flex-col animate-slideInRight">
          <h1 className="mb-2 text-2xl font-bold">{game.title}</h1>
          
          <div className="mb-2 flex items-center text-gray-400">
            <Eye size={16} className="mr-1" />
            <span>{viewCount} views</span>
          </div>
          
          <div className="mb-4 flex flex-wrap gap-2">
            {tags.map(tag => (
              <Link 
                key={tag} 
                href={`/games/tag/${tag}`}
                className="inline-flex items-center rounded-full bg-gray-800 px-3 py-1 text-xs transition-all hover:bg-gray-700 hover:text-primary"
              >
                <TagIcon size={12} className="mr-1" />
                {tag}
              </Link>
            ))}
          </div>
          
          <div className="relative mb-4 h-40 w-full overflow-hidden rounded-lg hover-glow">
            <Image
              src={game.cover_image}
              alt={game.title}
              fill
              sizes="(max-width: 768px) 100vw, 350px"
              className="object-cover transition-transform duration-700 hover:scale-110"
              loading="eager"
              priority
            />
          </div>
          
          <p className="mb-4 text-gray-300">{game.description}</p>
          
          <div className="mt-auto">
            <h3 className="mb-3 flex items-center text-lg font-semibold">
              <Star size={16} className="mr-1 text-yellow-400" />
              Similar Games
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {relatedGames.slice(0, 4).map((relatedGame, index) => (
                <Link 
                  key={relatedGame.title}
                  href={`/games/play/${encodeURIComponent(relatedGame.title)}`}
                  className="overflow-hidden rounded-md bg-gray-800 p-2 transition-all hover:bg-gray-700 hover:shadow-md"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="relative mb-2 h-20 w-full overflow-hidden rounded">
                    <Image
                      src={relatedGame.cover_image}
                      alt={relatedGame.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 150px"
                      className="object-cover transition-transform duration-500 hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <p className="line-clamp-1 text-sm">{relatedGame.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 