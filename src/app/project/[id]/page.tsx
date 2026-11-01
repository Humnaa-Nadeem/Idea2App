'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProjectBlueprint } from '@/types';
import { FileText, Download, Edit, Users, Server, Box, Target, CalendarDays, Key, Settings, Network, TerminalSquare } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function ProjectBlueprintPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [project, setProject] = useState<ProjectBlueprint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{project.project.name}</h1>
              <p className="text-xl text-slate-500 dark:text-slate-400 mt-2">{project.project.tagline}</p>
              <div className="flex gap-4 mt-4 text-sm text-slate-500">
                <span className="flex items-center gap-1"><Server className="w-4 h-4"/> Tech Stack Generated</span>
                <span className="flex items-center gap-1"><FileText className="w-4 h-4"/> SRS Available</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={`/project/${project.id}/srs`}>
                <Button className="gap-2" size="lg" variant="outline"><FileText className="w-5 h-5"/> View Full SRS Document</Button>
              </Link>
              <Link href={`/project/${project.id}/prompt`}>
                <Button className="gap-2" size="lg"><TerminalSquare className="w-5 h-5"/> Generate AGY Prompt</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 space-y-8">
        
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 rounded-lg flex items-center justify-center"><Users className="w-6 h-6"/></div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">User Roles</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{project.roles.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 dark:bg-green-900/50 dark:text-green-400 rounded-lg flex items-center justify-center"><Box className="w-6 h-6"/></div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Features</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{project.features.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400 rounded-lg flex items-center justify-center"><Settings className="w-6 h-6"/></div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Requirements</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{project.functionalRequirements.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400 rounded-lg flex items-center justify-center"><CalendarDays className="w-6 h-6"/></div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Dev Phases</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{project.roadmap.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Overview */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 dark:text-white"><Target className="text-primary"/> Project Overview</h2>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">Summary</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-1">{project.project.summary}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">Problem Statement</h3>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">{project.project.problemStatement}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">Proposed Solution</h3>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">{project.project.proposedSolution}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Roles & Features */}
        <div className="grid lg:grid-cols-3 gap-8">
          <section className="lg:col-span-1 space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2 dark:text-white"><Users className="text-primary"/> User Roles</h2>
            <div className="space-y-3">
              {project.roles.map(role => (
                <Card key={role.name}>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100">{role.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{role.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2 dark:text-white"><Box className="text-primary"/> Key Features</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {project.features.map(f => (
                <Card key={f.name} className="h-full">
                  <CardContent className="p-4 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{f.name}</h3>
                      <Badge variant={f.priority === 'High' ? 'default' : f.priority === 'Medium' ? 'secondary' : 'outline'}>
                        {f.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500 flex-1">{f.description}</p>
                    <div className="mt-4 text-xs font-medium text-primary">Role: {f.relatedRole}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Database Visualization */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 dark:text-white"><Network className="text-primary"/> Database Architecture</h2>
          <Card className="overflow-x-auto bg-slate-900 text-slate-50 border-slate-800 dark:bg-slate-950 dark:border-slate-800">
            <CardContent className="p-8">
              <div className="flex flex-wrap gap-8 justify-center min-w-[600px]">
                {project.database.entities.map(entity => (
                  <div key={entity.name} className="bg-slate-800 border border-slate-700 rounded-lg w-64 shadow-xl">
                    <div className="bg-primary/20 text-primary-300 border-b border-slate-700 p-2 text-center font-bold font-mono">
                      {entity.name}
                    </div>
                    <div className="p-3 text-sm font-mono text-slate-400 space-y-1">
                      {entity.fields.map((f, idx) => (
                        <div key={f.name || idx} className="flex items-center gap-2">
                          <Key className="w-3 h-3 text-slate-500"/>
                          {f.name}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-slate-800">
                <h4 className="text-sm text-slate-400 font-medium mb-3 uppercase tracking-wider">Relationships</h4>
                <ul className="text-sm font-mono space-y-1">
                  {project.database.relationships.map((rel, i) => (
                    <li key={i} className="text-slate-300">
                      <span className="text-blue-400">{rel.source}</span> <span className="text-slate-500 italic">-- {rel.relationship} --&gt;</span> <span className="text-green-400">{rel.target}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Roadmap */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 dark:text-white"><CalendarDays className="text-primary"/> Development Roadmap</h2>
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 dark:before:via-slate-700 before:to-transparent">
            {project.roadmap.map((phase, index) => (
              <div key={phase.name} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -translate-x-1/2">
                  {index + 1}
                </div>
                <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-4 shadow-sm ml-14 md:ml-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-900">{phase.name}</h3>
                    <Badge variant="secondary">{phase.effort}</Badge>
                  </div>
                  <p className="text-sm text-slate-600 font-medium mt-1">{phase.goal}</p>
                  <ul className="list-disc list-inside text-sm text-slate-500 mt-2 space-y-1">
                    {phase.tasks.map((task, i) => <li key={i}>{task}</li>)}
                  </ul>
                </Card>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
