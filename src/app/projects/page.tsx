'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ProjectBlueprint } from '@/types';
import { FolderOpen, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function Projects() {
  const [projects, setProjects] = useState<ProjectBlueprint[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    import('@/lib/storage').then(({ storage }) => {
      setProjects(storage.getProjects().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
    });
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    const { storage } = await import('@/lib/storage');
    storage.deleteProject(id);
    setProjects(projects.filter(p => p.id !== id));
    toast({
      title: 'Project deleted',
      type: 'success'
    });
  };

  return (
    <div className="flex-1 container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Projects</h1>
          <p className="text-slate-500 mt-1">Manage your AI-generated software blueprints.</p>
        </div>
        <Link href="/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Project
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 rounded-xl border border-slate-200 border-dashed">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
            <FolderOpen className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">Your project workspace is empty</h3>
          <p className="text-slate-500 max-w-sm mt-2 mb-6">Create your first software blueprint with AI to get started.</p>
          <Link href="/new">
            <Button>Create Project</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="line-clamp-1">{project.project.name || 'Untitled Project'}</CardTitle>
                <CardDescription className="line-clamp-2 mt-1">
                  {project.project.tagline || project.project.summary}
                </CardDescription>
                <div className="text-xs text-slate-400 mt-2">
                  Updated: {new Date(project.updatedAt).toLocaleDateString()}
                </div>
              </CardHeader>
              <div className="flex-1" />
              <CardFooter className="flex justify-between border-t border-slate-100 p-4 bg-slate-50 rounded-b-xl">
                <Link href={`/project/${project.id}`}>
                  <Button variant="secondary" size="sm">Open</Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(project.id, project.project.name || 'Untitled Project')}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
