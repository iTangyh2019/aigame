'use client';

import Link from 'next/link';
import { extractTags } from '@/lib/gameData';

export default function AllTagsPage() {
  const allTags = extractTags();
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">All Game Tags</h1>
      
      <div className="flex flex-wrap justify-center gap-3">
        {allTags.map((tag) => (
          <Link
            key={tag.name}
            href={`/games/tag/${tag.name}`}
            className="relative flex items-center justify-center rounded-lg bg-gray-800 p-4 text-center transition-all hover:bg-gray-700"
          >
            <div>
              <div className="mb-1 text-lg font-semibold">{tag.name}</div>
              <div className="text-sm text-gray-400">{tag.count} games</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 