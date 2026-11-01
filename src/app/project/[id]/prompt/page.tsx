'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProjectBlueprint } from '@/types';
import { ArrowLeft, Copy, Check, TerminalSquare } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function AgyPromptPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [project, setProject] = useState<ProjectBlueprint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    import('@/lib/storage').then(({ storage }) => {
      const found = storage.getProject(resolvedParams.id);
      if (found) setProject(found);
      else {
        toast({ title: 'Project not found', type: 'error' });
        router.push('/projects');
      }
      setIsLoading(false);
    });
  }, [resolvedParams.id, router, toast]);

  if (isLoading) return <div className="flex-1 flex justify-center items-center">Loading...</div>;
  if (!project) return null;

  const generatePrompt = (p: ProjectBlueprint) => {
    return `You are Antigravity, an expert AI coding assistant. I need you to build a complete web application based on the following Software Requirements Specification (SRS) and project blueprint.

# Project Overview
**Name:** ${p.project.name}
**Tagline:** ${p.project.tagline}
**Summary:** ${p.project.summary}

**Problem Statement:** ${p.project.problemStatement}
**Proposed Solution:** ${p.project.proposedSolution}

# User Roles
${p.roles.map(r => `- **${r.name}:** ${r.description}`).join('\n')}

# Key Features
${p.features.map(f => `- **${f.name}** (${f.priority}): ${f.description} (Target: ${f.relatedRole})`).join('\n')}

# Database Architecture
${p.database.entities.map(e => `## ${e.name}\n${e.fields.map(f => `- ${f.name} (${f.type}): ${f.description}`).join('\n')}`).join('\n\n')}

**Relationships:**
${p.database.relationships.map(r => `- ${r.source} ${r.relationship} ${r.target}`).join('\n')}

# Tech Stack Recommendations
${p.techStack.map(t => `## ${t.name}\n${t.technologies.map(tech => `- **${tech.name}**: ${tech.reason}`).join('\n')}`).join('\n\n')}

# Development Roadmap
${p.roadmap.map(r => `## ${r.name} (${r.effort})\n**Goal:** ${r.goal}\n**Tasks:**\n${r.tasks.map(t => `- ${t}`).join('\n')}`).join('\n\n')}

# Instructions for Antigravity
1. Please review this specification carefully.
2. If this requires a new project setup, initialize the project using the recommended tech stack (e.g., Next.js, Vite, etc.) with \`npx\` following your web application development guidelines.
3. Establish the foundational architecture, including the database models/schema, routing, and global state management.
4. Implement the core features, prioritizing the 'Must Have' and 'High' priority features for the first phase.
5. Create a dynamic, premium, and visually stunning UI matching modern design aesthetics.
6. Provide a detailed implementation plan and begin execution.
`;
  };

  const promptText = generatePrompt(project);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    toast({ title: 'Copied to clipboard', description: 'The prompt is ready to be pasted into Antigravity.' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 pb-20">
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-4 px-4 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/project/${project.id}`}>
              <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5"/></Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Antigravity Prompt</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">{project.project.name}</p>
            </div>
          </div>
          <Button onClick={copyToClipboard} className="gap-2">
            {copied ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
            {copied ? 'Copied!' : 'Copy Prompt'}
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 max-w-5xl">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="bg-slate-100 dark:bg-slate-950 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <TerminalSquare className="w-5 h-5 text-slate-500"/>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Prompt for AGY</span>
          </div>
          <div className="p-0">
            <textarea 
              readOnly 
              value={promptText} 
              className="w-full h-[600px] p-6 bg-transparent border-none resize-none focus:ring-0 font-mono text-sm text-slate-700 dark:text-slate-300 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
