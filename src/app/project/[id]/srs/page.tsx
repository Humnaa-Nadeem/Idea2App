'use client';

import { useEffect, useState, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProjectBlueprint, SRSModel } from '@/types';
import { FileText, Download, ArrowLeft, Printer, Copy, Edit, RefreshCw, FileCode, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { generateSRSMarkdown } from '@/lib/export/markdown';

const SectionHeading = ({ id, title, onRegenerate }: { id: string, title: string, onRegenerate: () => void }) => (
  <div className="flex justify-between items-end border-b border-slate-300 pb-2 mb-6 mt-16 group">
    <h2 id={id} className="text-2xl font-bold text-slate-900">{title}</h2>
    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity hide-print" onClick={onRegenerate}>
      <RefreshCw className="w-3 h-3 mr-1" /> Regenerate Section
    </Button>
  </div>
);

export default function SRSPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [project, setProject] = useState<ProjectBlueprint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showMarkdownModal, setShowMarkdownModal] = useState(false);
  const { toast } = useToast();
  const srsRef = useRef<HTMLDivElement>(null);

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

  const handleDownloadPDF = async () => {
    if (typeof window === 'undefined' || !srsRef.current) return;
    toast({ title: 'Preparing PDF...', description: 'This may take a few seconds.', type: 'info' });
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin: [15, 15, 15, 15] as [number, number, number, number],
        filename: `${project?.project.name.toLowerCase()}-srs.pdf`,
        image: { type: 'jpeg' as 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as 'portrait' }
      };
      html2pdf().set(opt).from(srsRef.current).save();
      toast({ title: 'PDF Downloaded', type: 'success' });
    } catch (error) {
      toast({ title: 'Download failed', type: 'error' });
    }
  };

  const handleDownloadMarkdown = () => {
    if (!project) return;
    const md = generateSRSMarkdown(project);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.project.name.toLowerCase()}-srs.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: 'Markdown Downloaded', type: 'success' });
  };

  const handleCopyMarkdown = () => {
    if (!project) return;
    const md = generateSRSMarkdown(project);
    navigator.clipboard.writeText(md).then(() => {
      toast({ title: 'Markdown copied to clipboard.', type: 'success' });
    });
  };

  const handleRegenerate = () => {
    toast({ title: 'Regenerating SRS...', description: 'This would trigger a targeted AI regeneration.', type: 'info' });
  };

  if (isLoading) return <div className="flex-1 flex justify-center items-center">Loading...</div>;
  if (!project || !project.srs) return <div className="p-8 text-center">Invalid SRS Data</div>;

  const { srs } = project;

  return (
    <div className="flex-1 bg-slate-100 dark:bg-slate-950 flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      
      {/* Top Action Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 shadow-sm z-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Software Requirements Specification</h1>
          <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
            <span>Project: {project.project.name}</span>
            <span>Version: {srs.documentControl?.documentVersion || '1.0'}</span>
            <span>Date: {srs.documentControl?.date || new Date().toISOString().split('T')[0]}</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800 ml-4 border border-green-200">
              <CheckCircle2 className="w-3 h-3 mr-1" /> AI Quality Check: 95%
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="w-4 h-4 mr-2" /> {isEditing ? 'View Mode' : 'Edit'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleRegenerate}>
            <RefreshCw className="w-4 h-4 mr-2" /> Regenerate
          </Button>
          <Button variant="outline" size="sm" onClick={handleCopyMarkdown}>
            <Copy className="w-4 h-4 mr-2" /> Copy
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-2" /> Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
            <FileText className="w-4 h-4 mr-2" /> Download PDF
          </Button>
          <Button variant="default" size="sm" onClick={handleDownloadMarkdown} className="bg-primary hover:bg-primary/90">
            <Download className="w-4 h-4 mr-2" /> Convert to .md
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setShowMarkdownModal(true)}>
            <FileCode className="w-4 h-4 mr-2" /> View Markdown
          </Button>
          <Link href={`/project/${project.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blueprint
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Sticky Sidebar */}
        <aside className="w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto hidden md:block hide-print">
          <nav className="p-4 space-y-1 text-sm font-medium">
            <a href="#section-1" className="block px-3 py-2 text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 rounded-md">01 Introduction</a>
            <a href="#section-2" className="block px-3 py-2 text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 rounded-md">02 Overall Description</a>
            <a href="#section-3" className="block px-3 py-2 text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 rounded-md">03 System Features</a>
            <a href="#section-4" className="block px-3 py-2 text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 rounded-md">04 Functional Req</a>
            <a href="#section-5" className="block px-3 py-2 text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 rounded-md">05 Non-Functional</a>
            <a href="#section-6" className="block px-3 py-2 text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 rounded-md">06 Interfaces</a>
            <a href="#section-7" className="block px-3 py-2 text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 rounded-md">07 Data Req</a>
            <a href="#section-8" className="block px-3 py-2 text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 rounded-md">08 User Stories</a>
            <a href="#section-9" className="block px-3 py-2 text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 rounded-md">09 Use Cases</a>
            <a href="#section-10" className="block px-3 py-2 text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 rounded-md">10 Architecture</a>
            <a href="#section-11" className="block px-3 py-2 text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 rounded-md">11 Workflows</a>
            <a href="#section-12" className="block px-3 py-2 text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 rounded-md">12 Security</a>
            <a href="#section-13" className="block px-3 py-2 text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 rounded-md">13 Traceability</a>
            <a href="#section-14" className="block px-3 py-2 text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 rounded-md">14 Verification</a>
            <a href="#section-15" className="block px-3 py-2 text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 rounded-md">15 Constraints</a>
            <a href="#section-16" className="block px-3 py-2 text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 rounded-md">16 Assumptions</a>
            <a href="#section-17" className="block px-3 py-2 text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 rounded-md">17 Enhancements</a>
            <a href="#section-18" className="block px-3 py-2 text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 rounded-md">18 Appendices</a>
          </nav>
        </aside>

        {/* Main Document Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative print:overflow-visible print:p-0">
          
          <div ref={srsRef} id="srs-container" className="max-w-4xl mx-auto bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm p-10 md:p-16 text-slate-800 dark:text-slate-200 font-sans print:shadow-none print:border-none print:m-0 print:p-0">
            
            {/* Document Cover */}
            <div className="text-center mb-24 mt-12">
              <h1 className="text-4xl font-black uppercase tracking-wider mb-8 text-slate-900 dark:text-white border-b-4 border-slate-900 dark:border-white inline-block pb-2">Software Requirements Specification</h1>
              <div className="text-xl space-y-2 text-slate-600">
                <p><strong>Project:</strong> {srs.documentControl?.projectName || project.project.name}</p>
                <p><strong>Version:</strong> {srs.documentControl?.documentVersion || '1.0'}</p>
                <p><strong>Status:</strong> {srs.documentControl?.status || 'Draft'}</p>
                <p><strong>Date:</strong> {srs.documentControl?.date}</p>
                <p><strong>Prepared By:</strong> {srs.documentControl?.preparedBy}</p>
              </div>
            </div>

            <div className="space-y-16 text-base leading-relaxed">
              
              {/* 1. Introduction */}
              <section>
                <SectionHeading id="section-1" title="1. Introduction" onRegenerate={handleRegenerate} />
                <h3 className="text-xl font-semibold mt-6 mb-2">1.1 Purpose</h3>
                <p>{srs.introduction?.purpose}</p>
                <h3 className="text-xl font-semibold mt-6 mb-2">1.2 Scope</h3>
                <p>{srs.introduction?.scope}</p>
                <h3 className="text-xl font-semibold mt-6 mb-2">1.3 Intended Audience</h3>
                <ul className="list-disc pl-6 space-y-1">
                  {srs.introduction?.intendedAudience?.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
                <h3 className="text-xl font-semibold mt-6 mb-2">1.4 Product Overview</h3>
                <p>{srs.introduction?.productOverview}</p>
                <h3 className="text-xl font-semibold mt-6 mb-2">1.5 Definitions and Acronyms</h3>
                <table className="w-full text-left border-collapse border border-slate-300 mt-2">
                  <thead className="bg-slate-100">
                    <tr><th className="border border-slate-300 p-2">Term</th><th className="border border-slate-300 p-2">Definition</th></tr>
                  </thead>
                  <tbody>
                    {srs.introduction?.definitionsAndAcronyms?.map((d, i) => (
                      <tr key={i}><td className="border border-slate-300 p-2 font-medium">{d.term}</td><td className="border border-slate-300 p-2">{d.definition}</td></tr>
                    ))}
                  </tbody>
                </table>
              </section>

              {/* 2. Overall Description */}
              <section>
                <SectionHeading id="section-2" title="2. Overall Description" onRegenerate={handleRegenerate} />
                <h3 className="text-xl font-semibold mt-6 mb-2">2.1 Product Perspective</h3>
                <p>{srs.overallDescription?.productPerspective}</p>
                <h3 className="text-xl font-semibold mt-6 mb-2">2.2 Product Functions</h3>
                <p>{srs.overallDescription?.productFunctions}</p>
                <h3 className="text-xl font-semibold mt-6 mb-2">2.3 User Classes and Characteristics</h3>
                {srs.overallDescription?.userClassesAndCharacteristics?.map((u, i) => (
                  <div key={i} className="mb-4">
                    <p><strong>Role:</strong> {u.role}</p>
                    <p><strong>Description:</strong> {u.description}</p>
                    <p><strong>Access Level:</strong> {u.accessLevel}</p>
                    <p><strong>Responsibilities:</strong></p>
                    <ul className="list-disc pl-6">
                      {u.responsibilities.map((r, j) => <li key={j}>{r}</li>)}
                    </ul>
                  </div>
                ))}
                <h3 className="text-xl font-semibold mt-6 mb-2">2.4 Operating Environment</h3>
                <p>{srs.overallDescription?.operatingEnvironment}</p>
              </section>

              {/* 3. System Features */}
              <section>
                <SectionHeading id="section-3" title="3. System Features" onRegenerate={handleRegenerate} />
                <div className="space-y-4">
                  {srs.systemFeatures?.map((f, i) => (
                    <div key={i} className="mb-4">
                      <h3 className="text-lg font-bold">3.{i+1} {f.name}</h3>
                      <p><strong>Description:</strong> {f.description}</p>
                      <p><strong>Priority:</strong> {f.priority}</p>
                      <p><strong>Related Role:</strong> {f.relatedRole}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 4. Functional Requirements */}
              <section>
                <SectionHeading id="section-4" title="4. Functional Requirements" onRegenerate={handleRegenerate} />
                {srs.functionalRequirements?.map(fr => (
                  <div key={fr.id} className="mb-8 border border-slate-200 rounded p-4 bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-900">{fr.id}: {fr.title}</h3>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      <p><strong>Description:</strong> {fr.description}</p>
                      <div className="mb-1"><strong>Priority:</strong> <Badge variant="outline">{fr.priority}</Badge></div>
                      <p><strong>Actor:</strong> {fr.actor}</p>
                      {fr.trigger && <p><strong>Trigger:</strong> {fr.trigger}</p>}
                      {fr.mainBehavior && (
                        <div>
                          <strong>Main Behavior:</strong>
                          <ul className="list-decimal pl-6 mt-1">
                            {fr.mainBehavior.map((mb, i) => <li key={i}>{mb}</li>)}
                          </ul>
                        </div>
                      )}
                      {fr.acceptanceCriteria && (
                        <div className="mt-2 p-3 bg-white border border-slate-200">
                          <strong>Acceptance Criteria:</strong>
                          <ul className="list-disc pl-5 mt-1">
                            {fr.acceptanceCriteria.map((ac, i) => <li key={i}>{ac}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </section>

              {/* 5. Non-Functional */}
              <section>
                <SectionHeading id="section-5" title="5. Non-Functional Requirements" onRegenerate={handleRegenerate} />
                <table className="w-full text-left border-collapse border border-slate-300 mt-2">
                  <thead className="bg-slate-100">
                    <tr><th className="border border-slate-300 p-2">ID</th><th className="border border-slate-300 p-2">Category</th><th className="border border-slate-300 p-2">Description</th></tr>
                  </thead>
                  <tbody>
                    {srs.nonFunctionalRequirements?.map((nfr, i) => (
                      <tr key={i}><td className="border border-slate-300 p-2 font-medium">{nfr.id}</td><td className="border border-slate-300 p-2">{nfr.category}</td><td className="border border-slate-300 p-2">{nfr.description}</td></tr>
                    ))}
                  </tbody>
                </table>
              </section>

              {/* 6. Interfaces */}
              <section>
                <SectionHeading id="section-6" title="6. External Interface Requirements" onRegenerate={handleRegenerate} />
                <h3 className="text-xl font-semibold mt-6 mb-2">6.1 User Interface</h3>
                <p>{srs.interfaces?.userInterface}</p>
                <h3 className="text-xl font-semibold mt-6 mb-2">6.2 Software Interfaces</h3>
                <p>{srs.interfaces?.softwareInterfaces}</p>
                <h3 className="text-xl font-semibold mt-6 mb-2">6.3 Hardware Interfaces</h3>
                <p>{srs.interfaces?.hardwareInterfaces}</p>
                <h3 className="text-xl font-semibold mt-6 mb-2">6.4 Communication Interfaces</h3>
                <p>{srs.interfaces?.communicationInterfaces}</p>
              </section>

              {/* 7. Data Requirements */}
              <section>
                <SectionHeading id="section-7" title="7. Data Requirements" onRegenerate={handleRegenerate} />
                <h3 className="text-xl font-semibold mt-6 mb-2">7.1 Data Entities</h3>
                {srs.dataRequirements?.dataEntities?.map((e, i) => (
                  <div key={i} className="mb-6">
                    <h4 className="font-bold mb-2">{e.name}</h4>
                    <table className="w-full text-left border-collapse border border-slate-300 text-sm">
                      <thead className="bg-slate-100">
                        <tr><th className="border border-slate-300 p-2">Field</th><th className="border border-slate-300 p-2">Type</th><th className="border border-slate-300 p-2">Description</th></tr>
                      </thead>
                      <tbody>
                        {e.fields?.map((f, j) => (
                          <tr key={j}><td className="border border-slate-300 p-2 font-mono">{f.name}</td><td className="border border-slate-300 p-2">{f.type}</td><td className="border border-slate-300 p-2">{f.description}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </section>

              {/* 8. User Stories */}
              <section>
                <SectionHeading id="section-8" title="8. User Stories" onRegenerate={handleRegenerate} />
                <div className="space-y-6">
                  {srs.userStories?.map(us => (
                    <div key={us.id} className="p-4 border border-slate-200">
                      <h4 className="font-bold text-lg mb-2">{us.id}</h4>
                      <p className="italic">As a {us.role}, I want to {us.action}, so that {us.benefit}.</p>
                      <strong className="block mt-2">Acceptance Criteria:</strong>
                      <ul className="list-disc pl-5 mt-1">
                        {us.acceptanceCriteria?.map((ac, i) => <li key={i}>{ac}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* 9. Use Cases */}
              <section>
                <SectionHeading id="section-9" title="9. Use Cases" onRegenerate={handleRegenerate} />
                <div className="space-y-6">
                  {srs.useCases?.map(uc => (
                    <div key={uc.id} className="p-4 border border-slate-200 bg-slate-50">
                      <h4 className="font-bold text-lg mb-2">{uc.id}: {uc.name}</h4>
                      <p><strong>Primary Actor:</strong> {uc.actor}</p>
                      <p><strong>Goal:</strong> {uc.goal}</p>
                      <p><strong>Trigger:</strong> {uc.trigger}</p>
                      <strong className="block mt-2">Main Success Scenario:</strong>
                      <ul className="list-decimal pl-5 mt-1">
                        {uc.mainSuccessScenario?.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* 10. Architecture */}
              <section>
                <SectionHeading id="section-10" title="10. Architecture" onRegenerate={handleRegenerate} />
                <p>{srs.architecture?.description}</p>
                <ul className="list-disc pl-5 mt-2">
                  {srs.architecture?.components?.map((c, i) => (
                    <li key={i}><strong>{c.name}:</strong> {c.responsibility}</li>
                  ))}
                </ul>
              </section>

              {/* 11. Workflows */}
              <section>
                <SectionHeading id="section-11" title="11. System Workflows" onRegenerate={handleRegenerate} />
                <div className="space-y-6">
                  {srs.workflows?.map((wf, i) => (
                    <div key={i} className="mb-4">
                      <h3 className="font-bold text-lg mb-2">{wf.name}</h3>
                      <ul className="list-decimal pl-5 mt-1">
                        {wf.steps?.map((s, j) => <li key={j}>{s}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* 12. Security */}

              <section>
                <SectionHeading id="section-12" title="12. Security Requirements" onRegenerate={handleRegenerate} />
                <table className="w-full text-left border-collapse border border-slate-300 mt-2">
                  <thead className="bg-slate-100">
                    <tr><th className="border border-slate-300 p-2">ID</th><th className="border border-slate-300 p-2">Category</th><th className="border border-slate-300 p-2">Description</th></tr>
                  </thead>
                  <tbody>
                    {srs.securityRequirements?.map((sec, i) => (
                      <tr key={i}><td className="border border-slate-300 p-2 font-medium">{sec.id}</td><td className="border border-slate-300 p-2">{sec.category}</td><td className="border border-slate-300 p-2">{sec.description}</td></tr>
                    ))}
                  </tbody>
                </table>
              </section>

              {/* 13. Traceability */}
              <section>
                <SectionHeading id="section-13" title="13. Requirements Traceability Matrix" onRegenerate={handleRegenerate} />
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse border border-slate-300 text-sm whitespace-nowrap">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="border border-slate-300 p-2">Feature</th>
                        <th className="border border-slate-300 p-2">User Story</th>
                        <th className="border border-slate-300 p-2">Functional Req</th>
                        <th className="border border-slate-300 p-2">Use Case</th>
                      </tr>
                    </thead>
                    <tbody>
                      {srs.traceability?.map((t, i) => (
                        <tr key={i}>
                          <td className="border border-slate-300 p-2 truncate max-w-[200px]">{t.feature}</td>
                          <td className="border border-slate-300 p-2 font-mono text-blue-600">{t.userStory}</td>
                          <td className="border border-slate-300 p-2 font-mono text-green-600">{t.functionalRequirement}</td>
                          <td className="border border-slate-300 p-2 font-mono text-purple-600">{t.useCase}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 14. Verification */}
              <section>
                <SectionHeading id="section-14" title="14. Verification" onRegenerate={handleRegenerate} />
                <p className="mb-4"><strong>Approach:</strong> {srs.verification?.approach}</p>
                <table className="w-full text-left border-collapse border border-slate-300 text-sm">
                  <thead className="bg-slate-100">
                    <tr><th className="border border-slate-300 p-2">Requirement ID</th><th className="border border-slate-300 p-2">Verification Method</th></tr>
                  </thead>
                  <tbody>
                    {srs.verification?.methods?.map((v, i) => (
                      <tr key={i}><td className="border border-slate-300 p-2 font-medium">{v.requirementId}</td><td className="border border-slate-300 p-2">{v.method}</td></tr>
                    ))}
                  </tbody>
                </table>
              </section>

              {/* 15. Constraints */}
              <section>
                <SectionHeading id="section-15" title="15. Constraints" onRegenerate={handleRegenerate} />
                <h3 className="text-xl font-semibold mt-6 mb-2">Confirmed Constraints</h3>
                <ul className="list-disc pl-5 mt-2">
                  {srs.constraints?.confirmed?.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
                <h3 className="text-xl font-semibold mt-6 mb-2">Assumed Constraints</h3>
                <ul className="list-disc pl-5 mt-2">
                  {srs.constraints?.assumed?.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </section>

              {/* 16. Assumptions and Dependencies */}
              <section>
                <SectionHeading id="section-16" title="16. Assumptions and Dependencies" onRegenerate={handleRegenerate} />
                <h3 className="text-xl font-semibold mt-6 mb-2">Assumptions</h3>
                <ul className="list-disc pl-5 mt-2">
                  {srs.assumptions?.map((a, i) => <li key={i}><strong>{a.id}:</strong> {a.description}</li>)}
                </ul>
                <h3 className="text-xl font-semibold mt-6 mb-2">Dependencies</h3>
                <ul className="list-disc pl-5 mt-2">
                  {srs.dependencies?.map((d, i) => <li key={i}><strong>{d.id}:</strong> {d.description}</li>)}
                </ul>
              </section>

              {/* 17. Future Enhancements */}
              <section>
                <SectionHeading id="section-17" title="17. Future Enhancements" onRegenerate={handleRegenerate} />
                <ul className="list-disc pl-5 mt-2">
                  {srs.futureEnhancements?.map((fe, i) => <li key={i}>{fe}</li>)}
                </ul>
              </section>

              {/* 18. Appendices */}
              <section>
                <SectionHeading id="section-18" title="18. Appendices" onRegenerate={handleRegenerate} />
                <div className="space-y-6">
                  {srs.appendices?.map((app, i) => (
                    <div key={i} className="mb-4">
                      <h3 className="font-bold text-lg mb-2">{app.title}</h3>
                      <p>{app.content}</p>
                    </div>
                  ))}
                </div>
              </section>

            </div>

            {/* Footer */}
            <div className="mt-24 pt-8 border-t border-slate-300 text-center text-sm text-slate-400 pb-16">
              Generated by Idea2App Engine — {new Date().getFullYear()}
            </div>

          </div>
        </main>
      </div>

      {/* Global Print Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          #srs-container, #srs-container * { visibility: visible; }
          #srs-container { position: absolute; left: 0; top: 0; width: 100%; margin: 0; }
          .hide-print { display: none !important; }
        }
      `}} />

      {/* Markdown Preview Modal */}
      {showMarkdownModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl h-[80vh] flex flex-col bg-white overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
              <h2 className="font-bold text-lg flex items-center gap-2"><FileCode className="w-5 h-5"/> Markdown Preview</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyMarkdown}><Copy className="w-4 h-4 mr-2"/> Copy</Button>
                <Button variant="default" size="sm" onClick={handleDownloadMarkdown}><Download className="w-4 h-4 mr-2"/> Download .md</Button>
                <Button variant="ghost" size="sm" onClick={() => setShowMarkdownModal(false)}>Close</Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-slate-900 text-slate-50 p-6 font-mono text-sm whitespace-pre-wrap">
              {generateSRSMarkdown(project)}
            </div>
          </Card>
        </div>
      )}

    </div>
  );
}
