'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Wand2, CheckCircle2, Circle, Key, ArrowRight, ExternalLink } from 'lucide-react';
import { storage } from '@/lib/storage';

const LOADING_STEPS = [
  'Analyzing your idea...',
  'Identifying target users...',
  'Extracting core features...',
  'Generating requirements...',
  'Designing database architecture...',
  'Building SRS document...',
  'Finalizing development roadmap...',
];

export default function NewProject() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [idea, setIdea] = useState('');
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState('Web');
  const [complexity, setComplexity] = useState('Medium');
  const [additional, setAdditional] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [showApiModal, setShowApiModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');

  const simulateProgress = () => {
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < LOADING_STEPS.length) {
        setCurrentStep(step);
      } else {
        clearInterval(interval);
      }
    }, 1500);
    return interval;
  };

  const handleGenerate = async () => {
    if (!idea || idea.trim().length < 5) {
      toast({
        title: 'Input Required',
        description: 'Please describe your software idea first.',
        type: 'error'
      });
      return;
    }

    const savedApiKey = storage.getApiKey();
    if (!savedApiKey) {
      setShowApiModal(true);
      return;
    }

    executeGeneration(savedApiKey);
  };

  const executeGeneration = async (keyToUse: string) => {
    setIsGenerating(true);
    setCurrentStep(0);
    setShowApiModal(false);
    const progressInterval = simulateProgress();

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea,
          name,
          platform,
          complexity,
          additionalRequirements: additional,
          apiKey: keyToUse
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to generate blueprint');
      }

      const data = await res.json();
      
      const { storage } = await import('@/lib/storage');
      storage.saveProject(data.project);

      clearInterval(progressInterval);
      setCurrentStep(LOADING_STEPS.length); // All complete

      setTimeout(() => {
        router.push(`/project/${data.project.id}`);
      }, 500);

    } catch (error) {
      const err = error as Error;
      clearInterval(progressInterval);
      setIsGenerating(false);
      
      // If it was an unauthorized error (invalid key), remove it from storage so they can re-enter
      if (err.message.includes('API Key') || err.message.includes('valid')) {
        storage.saveApiKey(''); // clear bad key
      }
      
      toast({
        title: 'Generation Failed',
        description: err.message || 'Something went wrong while generating your blueprint. Please try again.',
        type: 'error'
      });
    }
  };

  const handleSaveApiKeyAndGenerate = () => {
    if (!apiKeyInput || apiKeyInput.trim().length < 10) {
      toast({ title: 'Invalid Key', description: 'Please enter a valid Gemini API Key.', type: 'error' });
      return;
    }
    storage.saveApiKey(apiKeyInput.trim());
    executeGeneration(apiKeyInput.trim());
  };

  return (
    <div className="flex-1 flex justify-center py-12 px-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">What do you want to build?</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Describe your idea below, and our AI will engineer the blueprint.</p>
        </div>

        {!isGenerating ? (
          <Card className="shadow-md">
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 dark:text-slate-200">
                  Your Software Idea <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <Textarea 
                  placeholder="Example: I want to build a platform where university students can find tutors, compare their profiles, book sessions, and leave reviews."
                  className="min-h-[150px] resize-y text-base"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Project Name (Optional)</label>
                  <Input 
                    placeholder="e.g. TutorConnect" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900">Platform</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                  >
                    <option value="Web">Web</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Desktop">Desktop</option>
                    <option value="Web + Mobile">Web + Mobile</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Complexity / Scope</label>
                <div className="flex gap-4">
                  {['Small', 'Medium', 'Large'].map((lvl) => (
                    <label key={lvl} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="complexity" 
                        value={lvl} 
                        checked={complexity === lvl}
                        onChange={() => setComplexity(lvl)}
                        className="text-primary focus:ring-primary h-4 w-4"
                      />
                      <span className="text-sm text-slate-700">{lvl}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Additional Requirements (Optional)</label>
                <Textarea 
                  placeholder="Example: Students should receive email notifications before a session."
                  className="min-h-[80px]"
                  value={additional}
                  onChange={(e) => setAdditional(e.target.value)}
                />
              </div>

              <Button 
                className="w-full h-12 text-base gap-2"
                onClick={handleGenerate}
              >
                <Wand2 className="w-5 h-5" />
                Generate Project Blueprint
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-md overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-6 text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Wand2 className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <CardTitle className="text-2xl">Engineering your Blueprint...</CardTitle>
              <CardDescription>This usually takes 15-30 seconds.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 pb-8 px-8">
              <div className="space-y-6 max-w-md mx-auto">
                {LOADING_STEPS.map((step, index) => {
                  const isCompleted = currentStep > index;
                  const isCurrent = currentStep === index;
                  
                  return (
                    <div 
                      key={step} 
                      className={`flex items-center gap-4 transition-all duration-300 ${
                        isCompleted ? 'opacity-100' : isCurrent ? 'opacity-100 translate-x-2' : 'opacity-40'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                      ) : isCurrent ? (
                        <div className="w-6 h-6 border-2 border-slate-200 border-t-primary rounded-full animate-spin flex-shrink-0" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-300 flex-shrink-0" />
                      )}
                      <span className={`font-medium ${isCompleted ? 'text-slate-900' : isCurrent ? 'text-primary' : 'text-slate-500'}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {showApiModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-white overflow-hidden shadow-2xl border-0 animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center">
              <div className="mx-auto w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3">
                <Key className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Connect AI Engine</h2>
              <p className="text-blue-100 mt-1">Idea2App requires a free Gemini API key to generate your software blueprints.</p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm text-slate-600">
                <strong className="text-slate-900 block mb-1">How to get your free key:</strong>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-medium inline-flex items-center">Google AI Studio <ExternalLink className="w-3 h-3 ml-1"/></a></li>
                  <li>Sign in with your Google account.</li>
                  <li>Click <strong>"Create API Key"</strong> and copy it.</li>
                </ol>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Your Gemini API Key</label>
                <Input 
                  type="password"
                  placeholder="AIzaSy..." 
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <p className="text-xs text-slate-500">Your key is stored securely in your browser and never shared.</p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowApiModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleSaveApiKeyAndGenerate}>
                  Save & Generate <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
