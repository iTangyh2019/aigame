import { Metadata } from 'next';

// 元数据配置函数
export const metadata: Metadata = {
  title: 'Game Guides & Tips | Survivor Game Online',
  description: '探索游戏指南和攻略，包括生存游戏技巧、解谜游戏入门、竞速游戏高级技巧等。通过我们的游戏博客提升您的游戏技能。',
  keywords: '游戏攻略, 游戏指南, 生存游戏技巧, 解谜游戏, 竞速游戏技巧',
  alternates: {
    canonical: '/blog',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="blog-layout">
      {children}
    </div>
  );
} 