import Link from 'next/link';
import { Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <Lightbulb className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Idea2App</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/new" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            New Project
          </Link>
          <Link href="/projects" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Projects
          </Link>
          <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/new">
            <Button size="sm" className="hidden md:flex">Create Project</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
