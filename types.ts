
export type Language = 'en' | 'zh';
export type Theme = 'light' | 'dark';

export interface PainterStyle {
  id: string;
  name: string;
  gradient: string;
  textColor: string;
  accentColor: string;
  cardBg: string; // Tailored semi-transparent background for glassmorphism
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  model: string;
  temperature: number;
  status: 'idle' | 'running' | 'completed' | 'error';
  systemPrompt?: string;
}

export interface Mock510kData {
  kNumber: string;
  deviceName: string;
  applicant: string;
  decisionDate: string;
  indications: string[];
  predicates: { name: string; manufacturer: string; similarities: string; differences: string }[];
  risks: { hazard: string; mitigation: string }[];
  testing: { category: string; tests: number }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export type Tab = 'dashboard' | 'studio' | 'pdf' | 'orchestration' | 'agents';

export interface OrchestrationStep {
  id: string;
  agentId: string;
  customPrompt: string;
  selectedModel: string;
  result?: string;
  status: 'pending' | 'running' | 'completed' | 'error';
}
