import gamesData from '../games.json';

export interface Game {
  title: string;
  description: string;
  cover_image: string;
  game_url: string;
  tags: string;
  views?: number;
}

export interface Tag {
  name: string;
  count: number;
}

// 本地存储键
const GAME_VIEWS_KEY = 'game_views';

// 获取所有游戏数据
export function getAllGames(): Game[] {
  // 从本地存储获取游戏点击数据
  const games = gamesData as Game[];
  
  if (typeof window !== 'undefined') {
    try {
      const viewsData = localStorage.getItem(GAME_VIEWS_KEY);
      if (viewsData) {
        const views = JSON.parse(viewsData) as Record<string, number>;
        
        // 将存储的点击数添加到游戏数据中
        games.forEach(game => {
          if (views[game.title]) {
            game.views = views[game.title];
          }
        });
      }
    } catch (error) {
      console.error('Error loading game views from localStorage:', error);
    }
  }
  
  return games;
}

// 增加游戏点击次数
export function incrementGameViews(gameTitle: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    // 从本地存储获取现有数据
    const viewsData = localStorage.getItem(GAME_VIEWS_KEY) || '{}';
    const views = JSON.parse(viewsData) as Record<string, number>;
    
    // 增加该游戏的点击次数
    views[gameTitle] = (views[gameTitle] || 0) + 1;
    
    // 保存回本地存储
    localStorage.setItem(GAME_VIEWS_KEY, JSON.stringify(views));
  } catch (error) {
    console.error('Error updating game views in localStorage:', error);
  }
}

// 获取游戏的点击次数
export function getGameViews(gameTitle: string): number {
  if (typeof window === 'undefined') return 0;
  
  try {
    const viewsData = localStorage.getItem(GAME_VIEWS_KEY) || '{}';
    const views = JSON.parse(viewsData) as Record<string, number>;
    return views[gameTitle] || 0;
  } catch (error) {
    console.error('Error getting game views from localStorage:', error);
    return 0;
  }
}

// 提取所有标签并统计每个标签的游戏数量
export function extractTags(): Tag[] {
  const games = getAllGames();
  const tagMap = new Map<string, number>();
  
  games.forEach(game => {
    const tags = game.tags.split(',').map(tag => tag.trim());
    tags.forEach(tag => {
      if (tag) {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      }
    });
  });
  
  // 转换为标签数组并按游戏数量排序
  const tagArray = Array.from(tagMap.entries()).map(([name, count]) => ({
    name,
    count
  }));
  
  return tagArray.sort((a, b) => b.count - a.count);
}

// 按标签获取游戏
export function getGamesByTag(tagName: string, limit: number = 20, offset: number = 0): Game[] {
  const games = getAllGames();
  const filtered = games.filter(game => {
    const tags = game.tags.split(',').map(tag => tag.trim());
    return tags.includes(tagName);
  });
  
  // 按点击量降序排序，热门游戏优先显示
  return filtered
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(offset, offset + limit);
}

// 增强的搜索游戏函数，支持多字段搜索
export function searchGames(query: string): Game[] {
  if (!query) return [];
  
  const games = getAllGames();
  const searchTerm = query.toLowerCase();
  
  return games.filter(game => {
    // 检查游戏标题
    if (game.title.toLowerCase().includes(searchTerm)) {
      return true;
    }
    
    // 检查游戏描述
    if (game.description.toLowerCase().includes(searchTerm)) {
      return true;
    }
    
    // 检查游戏标签
    const tags = game.tags.split(',').map(tag => tag.trim().toLowerCase());
    if (tags.some(tag => tag.includes(searchTerm))) {
      return true;
    }
    
    return false;
  }).sort((a, b) => {
    // 标题匹配优先级最高
    const titleA = a.title.toLowerCase().includes(searchTerm);
    const titleB = b.title.toLowerCase().includes(searchTerm);
    
    if (titleA && !titleB) return -1;
    if (!titleA && titleB) return 1;
    
    // 其次是按点击量排序
    return (b.views || 0) - (a.views || 0);
  });
} 