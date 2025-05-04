'use client';

import { useEffect, useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    // 当路径改变时
    if (pathname) {
      setIsAnimating(true);
      
      // 动画持续时间后更新显示的内容
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        setIsAnimating(false);
      }, 300); // 与CSS过渡时间匹配
      
      return () => clearTimeout(timer);
    }
  }, [pathname, children]);

  return (
    <div
      className={`transition-opacity duration-300 ease-in-out ${
        isAnimating ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {displayChildren}
    </div>
  );
} 