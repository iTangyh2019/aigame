'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { PlayCircle, Eye, Tag as TagIcon, Search } from 'lucide-react';
import { searchGames, Game } from '@/lib/gameData';

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (query) {
      setLoading(true);
      const searchResults = searchGames(query);
      setResults(searchResults);
      setLoading(false);
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);
  
  // 高亮匹配文本
  const highlightText = (text: string) => {
    if (!query || !text) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    
    return parts.map((part, i) => {
      return part.toLowerCase() === query.toLowerCase() ? 
        <span key={i} className="bg-yellow-500 bg-opacity-30 text-white">{part}</span> : 
        part;
    });
  };
  
  // 获取匹配位置（标题、描述或标签）
  const getMatchLocation = (game: Game) => {
    const searchTerm = query.toLowerCase();
    
    if (game.title.toLowerCase().includes(searchTerm)) {
      return 'title';
    } else if (game.description.toLowerCase().includes(searchTerm)) {
      return 'description';
    } else {
      return 'tags';
    }
  };
  
  // 获取匹配标签（如果搜索匹配了标签）
  const getMatchingTags = (game: Game) => {
    const searchTerm = query.toLowerCase();
    return game.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.toLowerCase().includes(searchTerm));
  };
  
  if (loading) {
    return <div className="container mx-auto py-8 text-center">Searching...</div>;
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-2xl font-bold">
        {results.length > 0 
          ? `Search Results for "${query}" (${results.length} games found)` 
          : `No results found for "${query}"`}
      </h1>
      
      {results.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {results.map((game) => {
            const matchLocation = getMatchLocation(game);
            const matchingTags = matchLocation === 'tags' ? getMatchingTags(game) : [];
            
            return (
              <div key={game.title} className="flex overflow-hidden rounded-lg bg-gray-800 shadow-md transition-all hover:shadow-lg">
                <div className="relative h-40 min-w-40 overflow-hidden">
                  <Image
                    src={game.cover_image}
                    alt={game.title}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-white">
                      {highlightText(game.title)}
                    </h3>
                    {matchLocation === 'title' && (
                      <span className="rounded bg-primary/20 px-2 py-0.5 text-xs">Matched in title</span>
                    )}
                  </div>
                  
                  <p className="mb-4 flex-1 text-sm text-gray-300">
                    {matchLocation === 'description' 
                      ? highlightText(game.description) 
                      : (game.description.length > 150 ? `${game.description.slice(0, 150)}...` : game.description)}
                  </p>
                  
                  {matchLocation === 'tags' && matchingTags.length > 0 && (
                    <div className="mb-4">
                      <span className="mb-1 text-xs text-gray-400">Matched in tags:</span>
                      <div className="flex flex-wrap gap-2">
                        {matchingTags.map(tag => (
                          <span key={tag} className="inline-flex items-center rounded-full bg-primary/20 px-2 py-0.5 text-xs">
                            <TagIcon size={10} className="mr-1" />
                            {highlightText(tag)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-400">
                      <Eye size={16} className="mr-1" />
                      <span>{game.views || 0} views</span>
                    </div>
                    
                    <Link 
                      href={`/games/play/${encodeURIComponent(game.title)}`}
                      className="flex items-center rounded-md bg-primary px-3 py-1 text-sm font-medium text-white hover:bg-primary/80"
                    >
                      <PlayCircle size={16} className="mr-1" />
                      Play Now
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg bg-gray-800 p-8 text-center">
          <Search size={48} className="mx-auto mb-4 text-gray-500" />
          <p className="text-lg text-gray-300">No games found matching your search criteria.</p>
          <p className="mt-2 text-gray-400">Try a different search term or browse games by category.</p>
          <Link 
            href="/games/all-tags"
            className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/80"
          >
            Browse All Categories
          </Link>
        </div>
      )}
    </div>
  );
} 