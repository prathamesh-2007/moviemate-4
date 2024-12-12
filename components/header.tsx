'use client';

import { Film, Menu, X } from 'lucide-react';
import { ModeToggle } from './mode-toggle';
import Link from 'next/link';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Discover' },
    { href: '/trending', label: 'Trending' },
    { href: '/popular', label: 'Popular' },
    { href: '/top-rated', label: 'Top Rated' },
    { href: '/watchlist', label: 'Watchlist' },
  ];

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Film className="h-6 w-6" />
          <span className="font-bold text-xl">MovieMate</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button variant={pathname === item.href ? 'default' : 'ghost'}>
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center space-x-4 md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                    <Button
                      variant={pathname === item.href ? 'default' : 'ghost'}
                      className="w-full justify-start"
                    >
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center space-x-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}