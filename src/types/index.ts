export interface ProjectSummary {
  name: string;
  tagline: string;
  summary: string;
  problemStatement: string;
  proposedSolution: string;
  objectives: string[];
  targetUsers: string[];
}

export interface UserRole {
  name: string;
  description: string;
}

export interface Feature {
  name: string;
  description: string;
  priority: 'Must Have' | 'Should Have' | 'Could Have' | 'High' | 'Medium' | 'Low';
  relatedRole: string;
}

export interface FunctionalRequirement {
  id: string;
  title: string;
  description: string;
  priority: 'Must Have' | 'Should Have' | 'Could Have' | 'High' | 'Medium' | 'Low';
  actor?: string;
  preconditions?: string[];
  trigger?: string;
  mainBehavior?: string[];
  alternativeFlow?: string[];
  postconditions?: string[];
  acceptanceCriteria?: string[];
}

export interface NonFunctionalRequirement {
  id: string;
  category: string;
  description: string;
}

export interface UserStory {
  id: string;
  role: string;
  action: string;
  benefit: string;
  acceptanceCriteria: string[];
}

export interface UseCase {
  id: string;
  name: string;
  actor: string;
  goal: string;
  description: string;
  preconditions: string[];
  trigger: string;
  mainSuccessScenario: string[];
  alternativeFlows: string[];
  exceptionFlows: string[];
  postconditions: string[];
  relatedRequirements: string[];
}

export interface DatabaseEntity {
  name: string;
  fields: { name: string; type: string; description: string }[];
}

export interface DatabaseRelationship {
  source: string;
  relationship: string;
  target: string;
}

export interface DatabaseDesign {
  entities: DatabaseEntity[];
  relationships: DatabaseRelationship[];
}

export interface TechStackCategory {
  name: string;
  technologies: { name: string; reason: string }[];
}

export interface RoadmapPhase {
  name: string;
  goal: string;
  tasks: string[];
  dependencies: string[];
  effort: string;
}

export interface TraceabilityItem {
  feature: string;
  userStory: string;
  functionalRequirement: string;
  useCase: string;
  acceptanceCriteria: string;
}

export interface DocumentControl {
  projectName: string;
  documentVersion: string;
  status: string;
  date: string;
  preparedBy: string;
  revisionHistory: { version: string; date: string; description: string }[];
}

export interface Introduction {
  purpose: string;
  scope: string;
  intendedAudience: string[];
  productOverview: string;
  definitionsAndAcronyms: { term: string; definition: string }[];
  references: string[];
}

export interface OverallDescription {
  productPerspective: string;
  productFunctions: string;
  userClassesAndCharacteristics: { role: string; description: string; responsibilities: string[]; accessLevel: string }[];
  operatingEnvironment: string;
  designConstraints: string[];
  assumptions: string[];
  dependencies: string[];
}

export interface Interfaces {
  userInterface: string;
  softwareInterfaces: string;
  hardwareInterfaces: string;
  communicationInterfaces: string;
}

export interface DataRequirements {
  dataEntities: DatabaseEntity[];
  relationships: DatabaseRelationship[];
  dataValidation: string;
  dataIntegrity: string;
  dataRetention: string;
}

export interface Architecture {
  description: string;
  components: { name: string; responsibility: string }[];
}

export interface Workflow {
  name: string;
  steps: string[];
}

export interface SecurityRequirement {
  id: string;
  category: string;
  description: string;
}

export interface Verification {
  approach: string;
  methods: { requirementId: string; method: string }[];
}

export interface SRSModel {
  documentControl: DocumentControl;
  introduction: Introduction;
  overallDescription: OverallDescription;
  systemFeatures: Feature[];
  functionalRequirements: FunctionalRequirement[];
  nonFunctionalRequirements: NonFunctionalRequirement[];
  interfaces: Interfaces;
  dataRequirements: DataRequirements;
  userStories: UserStory[];
  useCases: UseCase[];
  architecture: Architecture;
  workflows: Workflow[];
  securityRequirements: SecurityRequirement[];
  traceability: TraceabilityItem[];
  verification: Verification;
  constraints: { confirmed: string[]; assumed: string[] };
  assumptions: { id: string; description: string }[];
  dependencies: { id: string; description: string }[];
  futureEnhancements: string[];
  appendices: { title: string; content: string }[];
}

export interface ProjectBlueprint {
  id: string;
  createdAt: string;
  updatedAt: string;
  project: ProjectSummary;
  roles: UserRole[];
  features: Feature[];
  functionalRequirements: FunctionalRequirement[];
  nonFunctionalRequirements: NonFunctionalRequirement[];
  userStories: UserStory[];
  useCases: UseCase[];
  database: DatabaseDesign;
  techStack: TechStackCategory[];
  roadmap: RoadmapPhase[];
  srs: SRSModel;
}
