'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

import BaseImage from '../image/BaseImage';
import LocaleSwitcher from '../LocaleSwitcher';
import MenuBtn from './MenuBtn';
import NavigationDrawer from './NavigationDrawer';

// 定义导航链接接口
interface NavLink {
  code: string;
  href: string;
  label: string;
}

export default function Navigation() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  // 定义一个空的导航链接数组
  const NavLinks: NavLink[] = [];

  return (
    <>
      <header className='bg-frosted-glass sticky left-0 top-0 z-50 flex h-[64px] bg-[#252A464A] px-5 blur-[60%] filter lg:px-0'>
        <nav className='mx-auto flex max-w-pc flex-1 items-center'>
          <div>
            <Link className='hover:opacity-80' href='/' title={t('title')}>
              <BaseImage
                src='/images/logo.svg'
                alt={t('title')}
                title={t('title')}
                width={150}
                height={40}
                className='h-10 w-[150px] lg:h-10 lg:w-[150px]'
              />
            </Link>
          </div>
          {/* pc */}
          <div className='ml-auto flex h-full items-center gap-x-[46px]'>
            <ul className='hidden h-full flex-1 capitalize lg:flex lg:gap-x-12'>
              {NavLinks.map((item) => (
                <Link key={item.code} href={item.href} title={item.code}>
                  <li
                    className={cn(
                      'flex h-full items-center text-white/40 hover:text-white',
                      pathname === item.href && 'text-white',
                      pathname.includes(item.href) && item.href !== '/' && 'text-white',
                    )}
                  >
                    {item.label}
                  </li>
                </Link>
              ))}
            </ul>
            <div className='flex items-center gap-x-3'>
              <LocaleSwitcher />
            </div>
          </div>
          {/* mobile */}
          <div className='mx-3 flex items-center gap-x-4 lg:hidden'>
            <MenuBtn open={open} onClick={() => setOpen(!open)} />
          </div>
        </nav>
      </header>
      <NavigationDrawer open={open} setOpen={setOpen} />
    </>
  );
}
