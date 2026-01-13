import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileSearch, 
  FileText, 
  GitBranch, 
  Users, 
  Menu, 
  X,
  Dices,
  Moon,
  Sun,
  Languages
} from 'lucide-react';
import { PAINTER_STYLES, TRANSLATIONS, MOCK_AGENTS } from './constants';
import { PainterStyle, Theme, Language, Tab, Mock510kData, Agent } from './types';
import SummaryStudio from './components/SummaryStudio';
import AgentsConfig from './components/AgentsConfig';
import ChatInterface from './components/ChatInterface';
import PDFTools from './components/PDFTools';
import Orchestration from './components/Orchestration';

function App() {
  const [theme, setTheme] = useState<Theme>('light');
  const [lang, setLang] = useState<Language>('en');
  const [painterStyle, setPainterStyle] = useState<PainterStyle>(PAINTER_STYLES[0]);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loadedData, setLoadedData] = useState<Mock510kData | null>(null);
  const [agents, setAgents] = useState<Agent[]>(MOCK_AGENTS);

  const t = TRANSLATIONS[lang];

  // Apply dark mode class to html element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const handleJackpot = () => {
    // Exclude default style (index 0) from jackpot
    const randomIndex = Math.floor(Math.random() * (PAINTER_STYLES.length - 1)) + 1;
    setPainterStyle(PAINTER_STYLES[randomIndex]);
  };

  const NavItem = ({ id, icon: Icon, label }: { id: Tab, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mb-1 ${
        activeTab === id
          ? `bg-teal-600 text-white shadow-lg shadow-teal-500/30`
          : `hover:bg-white/10 dark:hover:bg-white/5 ${painterStyle.textColor} opacity-70 hover:opacity-100`
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className={`min-h-screen transition-colors duration-500 ease-in-out ${painterStyle.gradient}`}>
      
      {/* Mobile Overlay */}
      {!isSidebarOpen && (
        <div className="lg:hidden fixed top-4 left-4 z-50">
           <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-white/20 backdrop-blur-md rounded-lg shadow-lg">
             <Menu className={painterStyle.textColor} />
           </button>
        </div>
      )}

      <div className="flex h-screen overflow-hidden">
        
        {/* Sidebar */}
        <aside 
          className={`
            fixed lg:static inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            ${painterStyle.cardBg} border-r border-white/10 backdrop-blur-xl
          `}
        >
          <div className="h-full flex flex-col p-6">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-white font-bold shadow-lg">
                  FDA
                </div>
                <h1 className={`font-bold text-lg leading-tight ${painterStyle.textColor}`}>
                  Agentic<br/><span className="font-light opacity-80">Reviewer</span>
                </h1>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 opacity-60">
                <X size={20} className={painterStyle.textColor} />
              </button>
            </div>

            <nav className="flex-1 space-y-1">
              <NavItem id="dashboard" icon={LayoutDashboard} label={t.dashboard} />
              <NavItem id="studio" icon={FileSearch} label={t.summaryStudio} />
              <NavItem id="pdf" icon={FileText} label={t.pdfTools} />
              <NavItem id="orchestration" icon={GitBranch} label={t.orchestration} />
              <NavItem id="agents" icon={Users} label={t.agentsConfig} />
            </nav>

            <div className="pt-6 border-t border-white/10 space-y-4">
              {/* Style Selector */}
              <div className="relative group">
                <button 
                  onClick={handleJackpot}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-lg transform hover:scale-105 transition-all"
                >
                  <Dices size={18} />
                  {t.jackpot}
                </button>
                <div className="absolute bottom-full left-0 w-full mb-2 hidden group-hover:block">
                  <div className={`p-2 rounded-lg text-xs text-center ${painterStyle.cardBg} ${painterStyle.textColor} shadow-xl`}>
                    Current: {painterStyle.name}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          
          {/* Header */}
          <header className={`h-16 flex items-center justify-end px-6 gap-4 ${painterStyle.cardBg} border-b border-white/10`}>
            
            <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 p-1 rounded-full">
               <button 
                 onClick={() => setLang('en')} 
                 className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${lang === 'en' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'opacity-50'}`}
               >
                 EN
               </button>
               <button 
                 onClick={() => setLang('zh')} 
                 className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${lang === 'zh' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'opacity-50'}`}
               >
                 繁中
               </button>
            </div>

            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className={`p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${painterStyle.textColor}`}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </header>

          {/* Scrollable Area */}
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 lg:p-8">
              <div className="max-w-7xl mx-auto">
                {activeTab === 'dashboard' && (
                  <div className={`p-10 rounded-3xl text-center space-y-6 ${painterStyle.cardBg} shadow-xl border border-white/20`}>
                    <h2 className={`text-4xl font-bold ${painterStyle.textColor}`}>Welcome to Agentic Reviewer</h2>
                    <p className={`text-lg opacity-70 max-w-2xl mx-auto ${painterStyle.textColor}`}>
                      Orchestrate your FDA 510(k) reviews with the power of multi-agent AI. 
                      Select the <strong>510(k) Studio</strong> tab to begin analyzing submissions.
                    </p>
                    <div className="flex justify-center gap-4 pt-4">
                      <div className="p-4 rounded-2xl bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 w-32">
                        <div className="text-3xl font-bold">{agents.length}</div>
                        <div className="text-xs uppercase mt-1">Active Agents</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 w-32">
                        <div className="text-3xl font-bold">85%</div>
                        <div className="text-xs uppercase mt-1">Efficiency</div>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'studio' && (
                  <SummaryStudio 
                    style={painterStyle} 
                    lang={lang} 
                    onDataLoaded={setLoadedData}
                  />
                )}
                {activeTab === 'pdf' && (
                  <PDFTools style={painterStyle} lang={lang} />
                )}
                {activeTab === 'orchestration' && (
                  <Orchestration style={painterStyle} lang={lang} agents={agents} />
                )}
                {activeTab === 'agents' && (
                  <AgentsConfig 
                    style={painterStyle} 
                    lang={lang} 
                    agents={agents}
                    onUpdateAgents={setAgents}
                  />
                )}
              </div>
            </div>

            {/* Contextual Chat Sidebar (Right) - Visible on desktop when data loaded or always active in studio */}
            <div className="hidden xl:block w-80 p-4 border-l border-white/10 backdrop-blur-lg">
                <ChatInterface style={painterStyle} lang={lang} contextData={loadedData} />
            </div>
          </div>
          
        </main>
      </div>
    </div>
  );
}

export default App;