'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lightbulb, Play, Layers, Code, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const handleDemo = async () => {
    setIsDemoLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: 'Demo', // triggers the Demo Mode fallback if no key or we specifically want to simulate
          platform: 'Web',
          complexity: 'Medium',
          additionalRequirements: ''
        }),
      });

      if (!res.ok) throw new Error('Failed to load demo project');

      const data = await res.json();
      
      // Save to local storage
      const { storage } = await import('@/lib/storage');
      storage.saveProject(data.project);
      
      toast({
        title: 'Demo project generated!',
        type: 'success',
      });

      router.push(`/project/${data.project.id}`);
    } catch (error) {
      toast({
        title: 'Error loading demo',
        description: 'Please try again later.',
        type: 'error',
      });
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
      
      <div className="max-w-3xl text-center space-y-8 py-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-sm font-medium text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Lightbulb className="w-4 h-4 text-primary" />
          <span>Think it. Specify it. Build it.</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white animate-in fade-in slide-in-from-bottom-6 duration-700">
          Turn Your Software Idea Into a Complete <span className="text-primary">Development Blueprint</span>.
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          Describe your idea. Let AI transform it into requirements, architecture, an SRS document, and a development roadmap.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          <Link href="/new">
            <Button size="lg" className="w-full sm:w-auto gap-2 text-base h-14 px-8 rounded-full shadow-lg shadow-primary/20">
              Create New Project
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full sm:w-auto gap-2 text-base h-14 px-8 rounded-full"
            onClick={handleDemo}
            disabled={isDemoLoading}
          >
            {isDemoLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-900 dark:border-slate-600 dark:border-t-white rounded-full animate-spin" />
                Loading Demo...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Play className="w-5 h-5 text-primary" />
                Try Demo
              </span>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left">
          <div className="flex flex-col items-center text-center space-y-3 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Structured Requirements</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Automatically generate user stories, use cases, and non-functional requirements.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Code className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Architecture & Database</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Get a recommended tech stack and a complete database entity relationship design.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Ready-to-Print SRS</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Export a professional Software Requirements Specification document instantly.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
