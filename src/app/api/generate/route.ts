import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { generateDemoBlueprint } from '@/lib/demo';
import { ProjectBlueprint } from '@/types';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { idea, platform, complexity, additionalRequirements, apiKey: clientApiKey } = await req.json();

    if (!idea || idea.trim().length < 10) {
      return NextResponse.json(
        { error: 'Please provide a more detailed software idea.' },
        { status: 400 }
      );
    }

    const apiKey = clientApiKey || process.env.AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API Key is missing. Please provide a Google Gemini API Key to generate custom projects.' },
        { status: 401 }
      );
    }

    const systemPrompt = `You are an experienced software architect and requirements engineer following professional software requirements engineering practices.
    The user will provide a software idea. You must return a complete software development blueprint strictly in JSON format.
    The JSON must strictly follow this exact structure without any markdown blocks around it.

    CRITICAL RULES:
    1. Distinguish requirements from assumptions. Do not hallucinate facts.
    2. Write testable requirements with measurable values where appropriate, avoiding vague terms like "fast" or "secure".
    3. Use unique IDs (FR-XXX, SEC-XXX).
    4. Ensure traceability and consistency across all sections.

    {
      "project": { "name": "", "tagline": "", "summary": "", "problemStatement": "", "proposedSolution": "", "objectives": [""], "targetUsers": [""] },
      "roles": [ { "name": "", "description": "" } ],
      "features": [ { "name": "", "description": "", "priority": "Must Have|Should Have|Could Have", "relatedRole": "" } ],
      "functionalRequirements": [ { "id": "FR-001", "title": "", "description": "", "priority": "Must Have|Should Have|Could Have", "actor": "", "preconditions": [""], "trigger": "", "mainBehavior": [""], "alternativeFlow": [""], "postconditions": [""], "acceptanceCriteria": [""] } ],
      "nonFunctionalRequirements": [ { "id": "NFR-001", "category": "", "description": "" } ],
      "userStories": [ { "id": "US-001", "role": "", "action": "", "benefit": "", "acceptanceCriteria": [""] } ],
      "useCases": [ { "id": "UC-001", "name": "", "actor": "", "goal": "", "description": "", "preconditions": [""], "trigger": "", "mainSuccessScenario": [""], "alternativeFlows": [""], "exceptionFlows": [""], "postconditions": [""], "relatedRequirements": [""] } ],
      "database": { "entities": [ { "name": "", "fields": [ { "name": "", "type": "", "description": "" } ] } ], "relationships": [ { "source": "", "relationship": "", "target": "" } ] },
      "techStack": [ { "name": "", "technologies": [ { "name": "", "reason": "" } ] } ],
      "roadmap": [ { "name": "", "goal": "", "tasks": [""], "dependencies": [""], "effort": "" } ],
      "srs": {
        "documentControl": { "projectName": "", "documentVersion": "1.0", "status": "Draft / Proposed", "date": "", "preparedBy": "Idea2App AI", "revisionHistory": [ { "version": "1.0", "date": "", "description": "Initial SRS Generation" } ] },
        "introduction": { "purpose": "", "scope": "", "intendedAudience": [""], "productOverview": "", "definitionsAndAcronyms": [ { "term": "", "definition": "" } ], "references": [""] },
        "overallDescription": { "productPerspective": "", "productFunctions": "", "userClassesAndCharacteristics": [ { "role": "", "description": "", "responsibilities": [""], "accessLevel": "" } ], "operatingEnvironment": "", "designConstraints": [""], "assumptions": [""], "dependencies": [""] },
        "systemFeatures": [],
        "functionalRequirements": [],
        "nonFunctionalRequirements": [],
        "interfaces": { "userInterface": "", "softwareInterfaces": "", "hardwareInterfaces": "Not applicable to the current system scope.", "communicationInterfaces": "" },
        "dataRequirements": { "dataEntities": [], "relationships": [], "dataValidation": "", "dataIntegrity": "", "dataRetention": "" },
        "userStories": [],
        "useCases": [],
        "architecture": { "description": "", "components": [ { "name": "", "responsibility": "" } ] },
        "workflows": [ { "name": "", "steps": [""] } ],
        "securityRequirements": [ { "id": "SEC-001", "category": "", "description": "" } ],
        "traceability": [ { "feature": "", "userStory": "", "functionalRequirement": "", "useCase": "", "acceptanceCriteria": "" } ],
        "verification": { "approach": "", "methods": [ { "requirementId": "", "method": "" } ] },
        "constraints": { "confirmed": [""], "assumed": [""] },
        "assumptions": [ { "id": "A-001", "description": "" } ],
        "dependencies": [ { "id": "D-001", "description": "" } ],
        "futureEnhancements": [""],
        "appendices": [ { "title": "", "content": "" } ]
      }
    }
    
    Make the project robust, realistic, and proportional to the user's idea. Do not invent unnecessary features or third-party dependencies unless explicitly needed. Populate the srs object fully using the generated arrays from above so the SRS is completely self-contained.`;

    const userPrompt = `Idea: ${idea}\nPlatform: ${platform}\nComplexity: ${complexity}\nAdditional Requirements: ${additionalRequirements}`;

    // Use the official Google GenAI SDK
    const ai = new GoogleGenAI({ apiKey });

    const getValidModels = async (key: string) => {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        if (!response.ok) return [];
        const data = await response.json();
        return data.models
          .filter((m: any) => m.name.includes('gemini') && m.supportedGenerationMethods.includes('generateContent'))
          .map((m: any) => m.name.replace('models/', ''));
      } catch (e) {
        return [];
      }
    };

    console.log('Calling Gemini via raw HTTP fetch...');

    const generateWithRetry = async (prompt: string, sysPrompt: string) => {
      let modelsToTry = await getValidModels(apiKey);
      if (!modelsToTry || modelsToTry.length === 0) {
        modelsToTry = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-pro']; 
      }
      
      const preferredOrder = ['gemini-3.5-pro', 'gemini-3.1-pro', 'gemini-1.5-pro-latest', 'gemini-1.5-pro', 'gemini-1.5-flash'];
      modelsToTry.sort((a, b) => {
        const indexA = preferredOrder.indexOf(a);
        const indexB = preferredOrder.indexOf(b);
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });

      console.log('Models to try:', modelsToTry);
      const maxRetriesPerModel = 2;
      const baseDelayMs = 2000;
      let lastError: any = null;

      for (const model of modelsToTry) {
        for (let attempt = 1; attempt <= maxRetriesPerModel; attempt++) {
          try {
            console.log(`[Attempt ${attempt}/${maxRetriesPerModel}] Trying model: ${model}...`);
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            const payload = {
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              systemInstruction: { parts: [{ text: sysPrompt }] },
              generationConfig: { responseMimeType: "application/json" }
            };

            const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
              const err = new Error(data.error?.message || 'Unknown API Error');
              (err as any).status = data.error?.code || res.status;
              throw err;
            }
            
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              console.log(`Success with model: ${model}`);
              return text;
            }
          } catch (err: any) {
            const status = err?.status || err?.response?.status;
            console.error(`Error on ${model} (attempt ${attempt}):`, err?.message || err);
            lastError = err;

            // Stop completely for invalid API keys
            if (status === 400 && err.message?.includes('API key')) {
              throw new Error('Invalid API key or authentication failed.');
            }
            if (status === 401 || status === 403) {
              throw new Error('Invalid API key or authentication failed.');
            }

            // Move to next model if model is not found or doesn't support the feature
            if (status === 404 || err.message?.includes('not found') || err.message?.includes('not supported')) {
              break; 
            }

            // Retry for rate limits or server errors
            if (status === 503 || status === 429 || attempt < maxRetriesPerModel) {
              const delay = baseDelayMs * Math.pow(2, attempt - 1);
              console.log(`Waiting ${delay}ms before next attempt...`);
              await new Promise(resolve => setTimeout(resolve, delay));
            } else if (attempt === maxRetriesPerModel) {
               break;
            }
          }
        }
      }
      throw new Error(`Generation Failed after trying models: ${modelsToTry.join(', ')}. Last error: ${lastError?.message || 'Unknown error'}`);
    };

    const generatedJsonString = await generateWithRetry(userPrompt, systemPrompt);

    console.log('Gemini SDK response received, parsing JSON...');

    let generatedData;
    try {
      generatedData = JSON.parse(generatedJsonString);
    } catch (parseError) {
      console.error('Failed to parse AI JSON response:', generatedJsonString.substring(0, 500));
      throw new Error('AI returned invalid JSON. Please try again.');
    }
    
    // Ensure the SRS arrays are populated with the same references
    if (!generatedData.srs) {
      generatedData.srs = {};
    }
    if (!generatedData.srs.functionalRequirements || generatedData.srs.functionalRequirements.length === 0) {
      generatedData.srs.functionalRequirements = generatedData.functionalRequirements || [];
    }
    if (!generatedData.srs.nonFunctionalRequirements || generatedData.srs.nonFunctionalRequirements.length === 0) {
      generatedData.srs.nonFunctionalRequirements = generatedData.nonFunctionalRequirements || [];
    }
    if (!generatedData.srs.systemFeatures || generatedData.srs.systemFeatures.length === 0) {
      generatedData.srs.systemFeatures = generatedData.features || [];
    }
    if (!generatedData.srs.userStories || generatedData.srs.userStories.length === 0) {
      generatedData.srs.userStories = generatedData.userStories || [];
    }
    if (!generatedData.srs.useCases || generatedData.srs.useCases.length === 0) {
      generatedData.srs.useCases = generatedData.useCases || [];
    }
    if (!generatedData.srs.dataRequirements) {
      generatedData.srs.dataRequirements = {};
    }
    if (!generatedData.srs.dataRequirements.dataEntities || generatedData.srs.dataRequirements.dataEntities.length === 0) {
      generatedData.srs.dataRequirements.dataEntities = generatedData.database?.entities || [];
      generatedData.srs.dataRequirements.relationships = generatedData.database?.relationships || [];
    }

    const project: ProjectBlueprint = {
      ...generatedData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('Blueprint generated successfully:', project.project?.name);
    return NextResponse.json({ project });
    
  } catch (error) {
    const err = error as Error;
    console.error('Generation error:', err.message);
    return NextResponse.json(
      { error: err.message || 'An error occurred while generating the blueprint.' },
      { status: 500 }
    );
  }
}
