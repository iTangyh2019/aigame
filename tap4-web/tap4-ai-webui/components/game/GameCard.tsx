import Image from 'next/image';
import Link from 'next/link';
import { PlayCircle, Eye } from 'lucide-react';
import { Game } from '@/lib/gameData';
import { useState } from 'react';

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // 截取前100个字符的描述，添加省略号
  const truncatedDescription = game.description.length > 100 
    ? `${game.description.slice(0, 100)}...` 
    : game.description;
  
  return (
    <div 
      className="group flex flex-col overflow-hidden rounded-lg bg-gray-800 shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 sm:hover:transform sm:hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setTimeout(() => setIsHovered(false), 500)}
    >
      <div className="relative h-40 w-full overflow-hidden">
        <Image
          src={game.cover_image}
          alt={game.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          loading="lazy"
        />
        <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isHovered ? 'opacity-40' : 'opacity-0'}`}></div>
      </div>
      
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 text-lg font-semibold text-white group-hover:text-primary transition-colors duration-300">{game.title}</h3>
        <p className="mb-4 flex-1 text-sm text-gray-300">{truncatedDescription}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-400">
            <Eye size={16} className="mr-1" />
            <span>{game.views || 0} views</span>
          </div>
          
          <Link 
            href={`/games/play/${encodeURIComponent(game.title)}`}
            className="relative overflow-hidden flex items-center rounded-md bg-gradient-to-r from-purple-600 to-primary px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 group"
          >
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            <PlayCircle size={18} className="mr-2 animate-pulse" />
            <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">PLAY NOW</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 