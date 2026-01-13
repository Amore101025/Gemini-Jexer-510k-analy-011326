
import { PainterStyle, Mock510kData, Agent } from './types';

export const PAINTER_STYLES: PainterStyle[] = [
  { id: 'default', name: 'Clinical Standard', gradient: 'bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800', textColor: 'text-slate-900 dark:text-slate-100', accentColor: 'text-teal-600', cardBg: 'bg-white/90 dark:bg-slate-800/90' },
  { id: 'vangogh', name: 'Van Gogh', gradient: 'bg-gradient-to-br from-[#1a237e] via-[#fbc02d] to-[#1565c0]', textColor: 'text-white', accentColor: 'text-yellow-300', cardBg: 'bg-[#1a237e]/40 backdrop-blur-md' },
  { id: 'monet', name: 'Monet', gradient: 'bg-gradient-to-br from-[#a5d6a7] via-[#f48fb1] to-[#81d4fa]', textColor: 'text-slate-800', accentColor: 'text-pink-600', cardBg: 'bg-white/60 backdrop-blur-md' },
  { id: 'picasso', name: 'Picasso', gradient: 'bg-gradient-to-br from-[#5d4037] via-[#ffa726] to-[#78909c]', textColor: 'text-white', accentColor: 'text-orange-300', cardBg: 'bg-stone-800/70 backdrop-blur-md' },
  { id: 'hokusai', name: 'Hokusai', gradient: 'bg-gradient-to-br from-[#e3f2fd] via-[#1565c0] to-[#0d47a1]', textColor: 'text-white', accentColor: 'text-sky-300', cardBg: 'bg-slate-900/60 backdrop-blur-md' },
  { id: 'davinci', name: 'Da Vinci', gradient: 'bg-gradient-to-br from-[#d7ccc8] via-[#a1887f] to-[#5d4037]', textColor: 'text-stone-900', accentColor: 'text-amber-700', cardBg: 'bg-[#efebe9]/80 backdrop-blur-md' },
  { id: 'dali', name: 'Dali', gradient: 'bg-gradient-to-br from-[#ffcc80] via-[#4dd0e1] to-[#bf360c]', textColor: 'text-slate-900', accentColor: 'text-orange-700', cardBg: 'bg-white/70 backdrop-blur-md' },
  { id: 'rembrandt', name: 'Rembrandt', gradient: 'bg-gradient-to-br from-[#212121] via-[#3e2723] to-[#ff6f00]', textColor: 'text-orange-50', accentColor: 'text-amber-500', cardBg: 'bg-black/60 backdrop-blur-md' },
  { id: 'vermeer', name: 'Vermeer', gradient: 'bg-gradient-to-br from-[#01579b] via-[#fffde7] to-[#fdd835]', textColor: 'text-slate-800', accentColor: 'text-blue-700', cardBg: 'bg-white/80 backdrop-blur-md' },
  { id: 'klimt', name: 'Klimt', gradient: 'bg-gradient-to-br from-[#ffd700] via-[#212121] to-[#b71c1c]', textColor: 'text-yellow-100', accentColor: 'text-yellow-400', cardBg: 'bg-black/70 backdrop-blur-md' },
  { id: 'okeeffe', name: 'O\'Keeffe', gradient: 'bg-gradient-to-br from-[#f8bbd0] via-[#f44336] to-[#d81b60]', textColor: 'text-white', accentColor: 'text-pink-100', cardBg: 'bg-white/20 backdrop-blur-md' },
  { id: 'warhol', name: 'Warhol', gradient: 'bg-gradient-to-br from-[#eeff41] via-[#e040fb] to-[#00e5ff]', textColor: 'text-slate-900', accentColor: 'text-fuchsia-700', cardBg: 'bg-white/80 backdrop-blur-md' },
  { id: 'pollock', name: 'Pollock', gradient: 'bg-gradient-to-br from-[#fafafa] via-[#212121] to-[#f44336]', textColor: 'text-slate-900', accentColor: 'text-red-600', cardBg: 'bg-white/90 backdrop-blur-md' },
  { id: 'munch', name: 'Munch', gradient: 'bg-gradient-to-br from-[#ff7043] via-[#1a237e] to-[#263238]', textColor: 'text-white', accentColor: 'text-orange-400', cardBg: 'bg-black/50 backdrop-blur-md' },
  { id: 'kahlo', name: 'Kahlo', gradient: 'bg-gradient-to-br from-[#2e7d32] via-[#c62828] to-[#fdd835]', textColor: 'text-white', accentColor: 'text-yellow-300', cardBg: 'bg-stone-900/60 backdrop-blur-md' },
  { id: 'matisse', name: 'Matisse', gradient: 'bg-gradient-to-br from-[#1976d2] via-[#ffeb3b] to-[#d32f2f]', textColor: 'text-slate-900', accentColor: 'text-blue-800', cardBg: 'bg-white/80 backdrop-blur-md' },
  { id: 'renoir', name: 'Renoir', gradient: 'bg-gradient-to-br from-[#e1bee7] via-[#b39ddb] to-[#81d4fa]', textColor: 'text-slate-800', accentColor: 'text-purple-700', cardBg: 'bg-white/60 backdrop-blur-md' },
  { id: 'cezanne', name: 'Cezanne', gradient: 'bg-gradient-to-br from-[#558b2f] via-[#ff8f00] to-[#795548]', textColor: 'text-white', accentColor: 'text-orange-200', cardBg: 'bg-stone-800/60 backdrop-blur-md' },
  { id: 'mondrian', name: 'Mondrian', gradient: 'bg-gradient-to-br from-[#b71c1c] via-[#ffffff] to-[#0d47a1]', textColor: 'text-slate-900', accentColor: 'text-red-700', cardBg: 'bg-white/90 backdrop-blur-md' },
  { id: 'hopper', name: 'Hopper', gradient: 'bg-gradient-to-br from-[#004d40] via-[#ffecb3] to-[#3e2723]', textColor: 'text-white', accentColor: 'text-teal-200', cardBg: 'bg-black/60 backdrop-blur-md' },
  { id: 'basquiat', name: 'Basquiat', gradient: 'bg-gradient-to-br from-[#212121] via-[#ffff00] to-[#d50000]', textColor: 'text-white', accentColor: 'text-yellow-400', cardBg: 'bg-black/80 backdrop-blur-md' },
];

export const TRANSLATIONS = {
  en: {
    dashboard: 'Dashboard',
    summaryStudio: '510(k) Studio',
    pdfTools: 'PDF Tools',
    orchestration: 'Orchestration',
    agentsConfig: 'Agents Config',
    jackpot: 'Jackpot!',
    selectStyle: 'Select Painter Style',
    uploadTitle: 'Upload 510(k) Summary or PDF',
    uploadDesc: 'Drag & drop PDF or paste text to analyze',
    parse: 'Parse & Analyze',
    analyzing: 'Analyzing with Gemini...',
    deviceInfo: 'Device Information',
    predicates: 'Predicates',
    risks: 'Risk Management',
    testing: 'Performance Testing',
    chat: 'Contextual Chat',
    chatPlaceholder: 'Ask about the submission...',
    kNumber: 'K-Number',
    decisionDate: 'Decision Date',
    applicant: 'Applicant',
    deviceName: 'Device Name',
    pasteText: 'Paste 510(k) Text',
    uploadFile: 'Upload PDF File',
    or: 'OR',
    runAgent: 'Run Agent',
    agentResults: 'Agent Results',
    selectAgent: 'Select Agent',
    configureAgent: 'Configure & Run',
    interactivePage: 'Generate Interactive Page',
  },
  zh: {
    dashboard: '儀表板',
    summaryStudio: '510(k) 工作室',
    pdfTools: 'PDF 工具',
    orchestration: '協調中心',
    agentsConfig: '代理配置',
    jackpot: '幸運輪!',
    selectStyle: '選擇畫家風格',
    uploadTitle: '上傳 510(k) 摘要或 PDF',
    uploadDesc: '拖放 PDF 文件或粘貼文本進行分析',
    parse: '解析與分析',
    analyzing: '正在使用 Gemini 分析...',
    deviceInfo: '設備信息',
    predicates: '參考設備',
    risks: '風險管理',
    testing: '性能測試',
    chat: '上下文對話',
    chatPlaceholder: '詢問有關提交的問題...',
    kNumber: 'K 編號',
    decisionDate: '決定日期',
    applicant: '申請人',
    deviceName: '設備名稱',
    pasteText: '粘貼 510(k) 文本',
    uploadFile: '上傳 PDF 文件',
    or: '或',
    runAgent: '運行代理',
    agentResults: '代理結果',
    selectAgent: '選擇代理',
    configureAgent: '配置並運行',
    interactivePage: '生成交互式頁面',
  }
};

export const MOCK_AGENTS: Agent[] = [
  { 
    id: '1', 
    name: 'Orchestrator', 
    role: 'Manager', 
    model: 'gemini-3-pro-preview', 
    temperature: 0.7, 
    status: 'idle',
    systemPrompt: 'You are a senior FDA reviewer. Analyze the input document and provide a high-level review plan, identifying key areas of concern and recommended next steps.' 
  },
  { 
    id: '2', 
    name: 'Predicate Analyst', 
    role: 'Comparison', 
    model: 'gemini-2.5-flash', 
    temperature: 0.3, 
    status: 'idle',
    systemPrompt: 'You are a predicate device specialist. Extract all predicate devices mentioned, compare their indications and technological characteristics with the subject device.' 
  },
  { 
    id: '3', 
    name: 'Risk Reviewer', 
    role: 'QA/RA', 
    model: 'gemini-3-pro-preview', 
    temperature: 0.5, 
    status: 'idle',
    systemPrompt: 'You are a risk management expert. Review the risk analysis section. Identify hazards, harms, and mitigation strategies. Assess compliance with ISO 14971.' 
  },
  { 
    id: '4', 
    name: 'Guidance Checker', 
    role: 'Compliance', 
    model: 'gemini-2.5-flash', 
    temperature: 0.2, 
    status: 'idle',
    systemPrompt: 'Check the document against relevant FDA guidance documents. List missing elements and non-compliant sections.' 
  },
];

export const AVAILABLE_MODELS = [
  'gemini-2.5-flash',
  'gemini-3-flash-preview',
  'gemini-3-pro-preview'
];

export const MOCK_510K_RESULT: Mock510kData = {
  kNumber: 'K234567',
  deviceName: 'NeuroPulse Stimulator',
  applicant: 'MediTech Innovations Inc.',
  decisionDate: '2024-03-15',
  indications: [
    'Relief of chronic intractable pain',
    'Post-surgical pain management',
    'Traumatic injury pain relief'
  ],
  predicates: [
    { name: 'Stimulator X1', manufacturer: 'Global Neuro', similarities: 'Same waveform, voltage', differences: 'Wireless charging vs Wired' },
    { name: 'PainAway Pro', manufacturer: 'Health Corp', similarities: 'Identical lead placement', differences: 'Smaller IPG size' }
  ],
  risks: [
    { hazard: 'Battery overheating', mitigation: 'Thermal cutoff circuit (IEC 60601-1)' },
    { hazard: 'Infection at implant site', mitigation: 'Sterile packaging, antibiotic coating' },
    { hazard: 'Software malfunction', mitigation: 'Watchdog timer, redundant processing' }
  ],
  testing: [
    { category: 'Biocompatibility', tests: 5 },
    { category: 'Electrical Safety', tests: 8 },
    { category: 'Software V&V', tests: 12 },
    { category: 'Animal Study', tests: 1 },
    { category: 'Usability', tests: 3 }
  ]
};
