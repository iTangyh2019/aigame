'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

// 模拟博客文章数据
const BLOG_POSTS = [
  {
    id: 1,
    title: "10 Tips to Master Survival Games",
    content: `
      <h2>Introduction to Survival Games</h2>
      <p>Survival games challenge players to stay alive in hostile environments with limited resources. Whether you're playing a battle royale, a wilderness survival simulator, or a zombie apocalypse game, the core principles remain similar.</p>
      
      <h2>1. Prioritize Resources</h2>
      <p>In any survival game, knowing which resources to gather first is crucial. Focus on immediate needs like water, food, and basic weapons before pursuing luxury items or base-building materials.</p>
      
      <h2>2. Learn the Map</h2>
      <p>Familiarize yourself with the game world as quickly as possible. Knowing where to find resources, safe zones, and dangerous areas gives you a significant advantage over other players.</p>
      
      <h2>3. Master the Crafting System</h2>
      <p>Most survival games feature crafting mechanics. Study the crafting tree and prioritize items that offer the best survival value for the resources invested.</p>
      
      <h2>4. Travel Light When Necessary</h2>
      <p>While it's tempting to hoard everything, carrying too much slows you down. Learn what's essential and what can be left behind or stored at your base.</p>
      
      <h2>5. Always Have an Escape Plan</h2>
      <p>Whether you're exploring, looting, or engaging enemies, always know your exit routes. Never put yourself in a position where retreat is impossible.</p>
      
      <h2>6. Conserve Energy and Resources</h2>
      <p>Don't sprint unnecessarily, don't waste ammunition, and don't eat when your hunger meter isn't low. Conservation is key to long-term survival.</p>
      
      <h2>7. Learn Enemy Patterns</h2>
      <p>Whether facing AI enemies or other players, study their behavior. Most AI enemies have predictable patterns, while human players often follow certain meta strategies.</p>
      
      <h2>8. Balance Risk and Reward</h2>
      <p>Every decision in a survival game involves weighing potential benefits against dangers. High-value loot zones are usually the most dangerous – decide if the risk is worth it.</p>
      
      <h2>9. Build Strategically</h2>
      <p>When establishing a base, consider factors like proximity to resources, defensibility, and concealment from enemies. The perfect location balances all these needs.</p>
      
      <h2>10. Adapt Your Playstyle</h2>
      <p>Be flexible enough to change tactics based on your current situation. Sometimes aggression is needed; other times stealth is preferable. The best survivors adapt constantly.</p>
      
      <h2>Conclusion</h2>
      <p>Mastering survival games takes practice, but following these principles will dramatically improve your chances. Remember that each game has its unique mechanics, so take time to learn the specific strategies that work best for your favorite titles.</p>
    `,
    image: "/images/blog/survival-tips.jpg",
    slug: "master-survival-games",
    date: "2024-05-10",
    category: "Survival",
    author: "Alex Survivor"
  },
  {
    id: 2,
    title: "Beginner's Guide to Puzzle Games",
    content: `
      <h2>Understanding Puzzle Games</h2>
      <p>Puzzle games challenge your problem-solving abilities and critical thinking skills. They come in many varieties, from matching puzzles to physics-based challenges, logic puzzles, and escape rooms.</p>
      
      <h2>Types of Puzzle Games</h2>
      <p>Before diving into strategies, it's helpful to understand the main types of puzzle games you'll encounter:</p>
      <ul>
        <li><strong>Matching Puzzles:</strong> Games like Bejeweled or Candy Crush where you match similar items</li>
        <li><strong>Physics Puzzles:</strong> Games that simulate physical properties like Cut the Rope or Angry Birds</li>
        <li><strong>Logic Puzzles:</strong> Games requiring deductive reasoning like Sudoku or Picross</li>
        <li><strong>Word Puzzles:</strong> Games centered around word formation or discovery</li>
        <li><strong>Escape Room Puzzles:</strong> Games where you solve interconnected puzzles to progress or escape</li>
      </ul>
      
      <h2>General Tips for All Puzzle Games</h2>
      <p>While each puzzle type has specific strategies, these general tips will help you approach any puzzle game:</p>
      
      <h3>1. Observe Before Acting</h3>
      <p>Take time to understand all elements on screen before making your first move. Many puzzles reveal patterns or clues through careful observation.</p>
      
      <h3>2. Start Simple</h3>
      <p>Identify the easiest parts of the puzzle to solve first. This creates momentum and often reveals information needed for the more complex elements.</p>
      
      <h3>3. Look for Patterns</h3>
      <p>Most puzzle games rely on pattern recognition. Train yourself to identify repeating elements, sequences, or relationships.</p>
      
      <h3>4. Take Breaks</h3>
      <p>If you're stuck, stepping away often helps. Your subconscious mind continues working on the problem, and solutions frequently come when you return with fresh eyes.</p>
      
      <h3>5. Learn from Failures</h3>
      <p>When you make a mistake, analyze what went wrong. Each failure provides information that brings you closer to the solution.</p>
      
      <h2>Specific Strategies for Different Puzzle Types</h2>
      
      <h3>For Matching Puzzles:</h3>
      <p>Focus on creating special pieces through specific patterns rather than making basic matches. Plan several moves ahead rather than making the first match you see.</p>
      
      <h3>For Physics Puzzles:</h3>
      <p>Understand the core physics principles at play. Experiment to see how objects interact, and use minimal force/actions to achieve goals efficiently.</p>
      
      <h3>For Logic Puzzles:</h3>
      <p>Use process of elimination. Mark definite information and then derive conclusions from what must logically follow. Many logic puzzles benefit from using pencil and paper to track possibilities.</p>
      
      <h3>For Word Puzzles:</h3>
      <p>Start with letter frequency analysis. Common letters like E, T, A, O, I, N appear most frequently in English. Look for common prefixes and suffixes.</p>
      
      <h2>Conclusion</h2>
      <p>Puzzle games offer not just entertainment but exercise for your brain. With practice, your pattern recognition and problem-solving skills will improve rapidly. Remember that the journey of figuring out a solution is often more rewarding than simply completing the puzzle.</p>
    `,
    image: "/images/blog/puzzle-guide.jpg",
    slug: "beginners-puzzle-guide",
    date: "2024-05-08",
    category: "Puzzle",
    author: "Emily Puzzler"
  },
  {
    id: 3,
    title: "How to Improve Your Racing Game Skills",
    content: `
      <h2>Introduction</h2>
      <p>Whether you're playing arcade racers, realistic simulators, or something in between, improving your racing game skills requires practice, knowledge, and technique. This guide will help you master the fundamentals and advanced tricks that separate casual players from racing champions.</p>
      
      <h2>Understanding Racing Fundamentals</h2>
      
      <h3>The Racing Line</h3>
      <p>The most crucial concept in racing is the racing line - the optimal path through a corner that minimizes time lost. The basic racing line involves:</p>
      <ul>
        <li>Starting wide before the corner (outside)</li>
        <li>Cutting to the inside at the apex (middle of the corner)</li>
        <li>Drifting back to the outside on exit</li>
      </ul>
      <p>This creates a gentle arc that allows you to carry more speed through corners than taking them at sharp angles.</p>
      
      <h3>Braking Technique</h3>
      <p>Proper braking is often what separates good racers from great ones:</p>
      <ul>
        <li>Brake in a straight line before entering the corner</li>
        <li>Brake hard initially, then gradually release (trail braking)</li>
        <li>Never brake while turning at high speeds (causes understeer)</li>
        <li>Learn each track's braking points using visual markers</li>
      </ul>
      
      <h3>Acceleration Control</h3>
      <p>Smoothness is key to fast racing:</p>
      <ul>
        <li>Apply throttle gradually as you exit corners</li>
        <li>Wait until your wheels are straight before full acceleration</li>
        <li>Avoid wheelspin by not applying too much throttle too quickly</li>
      </ul>
      
      <h2>Advanced Techniques</h2>
      
      <h3>Drifting</h3>
      <p>In arcade racers, drifting is often faster than conventional cornering:</p>
      <ul>
        <li>Initiate drift with a quick brake tap while turning</li>
        <li>Counter-steer to control the drift angle</li>
        <li>Maintain throttle through the drift</li>
        <li>Straighten out as you exit the corner</li>
      </ul>
      
      <h3>Slipstreaming/Drafting</h3>
      <p>Following closely behind another vehicle reduces air resistance:</p>
      <ul>
        <li>Position your car directly behind a competitor</li>
        <li>Use the speed advantage to overtake on straights</li>
        <li>Pull out of the slipstream only when ready to pass</li>
      </ul>
      
      <h3>Handling Different Surfaces</h3>
      <p>Adjust your driving style based on the surface:</p>
      <ul>
        <li>Asphalt: Maximum grip, aggressive cornering possible</li>
        <li>Dirt: Controlled slides and earlier braking required</li>
        <li>Snow/Ice: Gentle inputs and anticipation of low grip</li>
        <li>Wet conditions: Brake earlier, accelerate more gradually</li>
      </ul>
      
      <h2>Mental Aspects of Racing</h2>
      
      <h3>Track Memorization</h3>
      <p>Top racers know every corner intimately:</p>
      <ul>
        <li>Practice each track section by section</li>
        <li>Identify visual braking markers</li>
        <li>Understand elevation changes and how they affect grip</li>
      </ul>
      
      <h3>Consistency Over Speed</h3>
      <p>Being consistently good is better than occasionally brilliant:</p>
      <ul>
        <li>Focus on clean laps rather than pushing beyond your control</li>
        <li>Learn to drive at 90% of your maximum to reduce mistakes</li>
        <li>Build speed gradually as your consistency improves</li>
      </ul>
      
      <h2>Equipment Considerations</h2>
      <p>For serious racing game enthusiasts:</p>
      <ul>
        <li>Consider a racing wheel for more precise control</li>
        <li>Use a controller with analog triggers for better throttle/brake modulation</li>
        <li>Adjust in-game settings (steering sensitivity, assists) to match your skill level</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Becoming skilled at racing games takes time and deliberate practice. Focus on mastering one technique at a time, and don't be discouraged by initial difficulties. Racing at the highest levels requires both technical skill and strategic thinking, but the satisfaction of a perfectly executed lap makes the learning process worthwhile.</p>
    `,
    image: "/images/blog/racing-skills.jpg",
    slug: "improve-racing-skills",
    date: "2024-05-05",
    category: "Racing",
    author: "Michael Speedster"
  },
  // 其他文章数据省略...
];

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  // 查找对应的博客文章
  const post = BLOG_POSTS.find(post => post.slug === slug);
  
  // 如果找不到文章，显示未找到信息
  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold">Article Not Found</h1>
          <p className="mb-8 text-gray-400">The article you're looking for doesn't exist or has been removed.</p>
          <Link 
            href="/blog"
            className="inline-flex items-center rounded-md border border-gray-600 px-4 py-2 text-sm transition-all hover:border-primary hover:bg-gray-700"
          >
            <ChevronLeft size={16} className="mr-2" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }
  
  // 结构化数据 (JSON-LD) 用于SEO优化
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'datePublished': post.date,
    'dateModified': post.date,
    'author': {
      '@type': 'Person',
      'name': post.author
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Survivor Game Online',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://survivorgame.online/logo.png' // 替换为实际logo URL
      }
    },
    'description': post.content.substring(0, 160).replace(/<[^>]*>/g, '').trim() + '...',
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://survivorgame.online/blog/${post.slug}` // 替换为实际网站域名
    }
  };
  
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      {/* 添加结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* 博客导航 */}
      <div className="mb-8">
        <Link 
          href="/blog"
          className="inline-flex items-center text-sm text-gray-400 transition-colors hover:text-primary"
        >
          <ChevronLeft size={16} className="mr-1" /> Back to Blog
        </Link>
      </div>
      
      {/* 文章头部 */}
      <header className="mb-8">
        <h1 className="mb-4 text-3xl font-bold sm:text-4xl">{post.title}</h1>
        <div className="flex items-center text-sm text-gray-400">
          <span>{post.date}</span>
          <span className="mx-2">•</span>
          <span>{post.category}</span>
          <span className="mx-2">•</span>
          <span>By {post.author}</span>
        </div>
      </header>
      
      {/* 文章特色图片 */}
      <div className="mb-8 aspect-video w-full overflow-hidden rounded-lg bg-gray-800">
        {/* 博客图片将在未来添加 */}
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
          <span className="text-lg text-gray-400">{post.category} - Featured Image</span>
        </div>
      </div>
      
      {/* 文章内容 */}
      <article className="prose prose-invert max-w-none prose-headings:text-primary prose-a:text-blue-400">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
      
      {/* 相关文章 */}
      <div className="mt-16 border-t border-gray-800 pt-8">
        <h3 className="mb-6 text-xl font-semibold">Related Articles</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {BLOG_POSTS.filter(p => p.category === post.category && p.id !== post.id)
            .slice(0, 2)
            .map(relatedPost => (
              <div key={relatedPost.id} className="overflow-hidden rounded-lg border border-gray-700 transition-all hover:border-primary">
                <div className="aspect-video w-full bg-gray-800">
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                    <span className="text-sm text-gray-400">{relatedPost.category}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="mb-2 text-base font-medium">
                    <Link href={`/blog/${relatedPost.slug}`} className="hover:text-primary">
                      {relatedPost.title}
                    </Link>
                  </h4>
                  <div className="mb-2 text-xs text-gray-400">
                    <span>{relatedPost.date}</span>
                  </div>
                  <Link
                    href={`/blog/${relatedPost.slug}`}
                    className="inline-flex items-center text-xs text-primary"
                  >
                    Read Article
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
} 