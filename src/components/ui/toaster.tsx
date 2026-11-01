'use client';

import { useToast } from './use-toast';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5 animate-in",
            t.type === 'error' ? 'bg-red-50 text-red-900 ring-red-200' : 'bg-white text-slate-900'
          )}
        >
          <div className="p-4 flex items-start">
            <div className="flex-1">
              <h3 className="text-sm font-medium">{t.title}</h3>
              {t.description && (
                <p className="mt-1 text-sm text-slate-500">{t.description}</p>
              )}
            </div>
            <button className="ml-4 flex-shrink-0 text-slate-400 hover:text-slate-500">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
