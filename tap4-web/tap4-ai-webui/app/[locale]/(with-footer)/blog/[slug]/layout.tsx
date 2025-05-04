import { Metadata } from 'next';

// 模拟博客文章数据，仅用于元数据生成
const BLOG_POSTS = [
  {
    title: "10 Tips to Master Survival Games",
    content: `<h2>Introduction to Survival Games</h2><p>Survival games challenge players to stay alive in hostile environments with limited resources...</p>`,
    slug: "master-survival-games",
    date: "2024-05-10",
    category: "Survival",
    author: "Alex Survivor"
  },
  {
    title: "Beginner's Guide to Puzzle Games",
    content: `<h2>Understanding Puzzle Games</h2><p>Puzzle games challenge your problem-solving abilities and critical thinking skills...</p>`,
    slug: "beginners-puzzle-guide",
    date: "2024-05-08",
    category: "Puzzle",
    author: "Emily Puzzler"
  },
  {
    title: "How to Improve Your Racing Game Skills",
    content: `<h2>Introduction</h2><p>Whether you're playing arcade racers, realistic simulators, or something in between...</p>`,
    slug: "improve-racing-skills",
    date: "2024-05-05",
    category: "Racing",
    author: "Michael Speedster"
  },
  // 其他文章简化数据...
];

// 为每篇文章生成动态元数据
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = BLOG_POSTS.find(post => post.slug === params.slug);
  
  if (!post) {
    return {
      title: '文章未找到 | Survivor Game Online',
      description: '您查找的文章不存在或已被移除。',
    };
  }
  
  // 从文章内容中提取纯文本作为描述
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = post.content;
  const textContent = tempDiv.textContent || tempDiv.innerText;
  const description = textContent.substring(0, 160).trim() + '...';
  
  return {
    title: `${post.title} | Survivor Game Online`,
    description: description,
    keywords: `${post.category}, 游戏攻略, ${post.title}, 游戏技巧`,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: description,
      type: 'article',
      authors: [post.author],
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: description,
    }
  };
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="blog-post-layout">
      {children}
    </div>
  );
} 