import React, { useState } from 'react';
import { GitBranch, Play, CheckCircle, Clock, FileText, ChevronRight, Settings } from 'lucide-react';
import { PainterStyle, Language, Agent, OrchestrationStep } from '../types';
import { TRANSLATIONS, AVAILABLE_MODELS } from '../constants';
import { executeAgent } from '../services/geminiService';

interface OrchestrationProps {
    style: PainterStyle;
    lang: Language;
    agents: Agent[];
}

const Orchestration: React.FC<OrchestrationProps> = ({ style, lang, agents }) => {
    const t = TRANSLATIONS[lang];
    const [docContent, setDocContent] = useState('');
    const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
    const [steps, setSteps] = useState<OrchestrationStep[]>([]);
    
    // Config state for the currently selected agent to add
    const [configPrompt, setConfigPrompt] = useState('');
    const [configModel, setConfigModel] = useState('');

    const handleSelectAgent = (agent: Agent) => {
        setSelectedAgentId(agent.id);
        setConfigPrompt(agent.systemPrompt || "Analyze the document.");
        setConfigModel(agent.model);
    };

    const addStep = () => {
        if (!selectedAgentId) return;
        const newStep: OrchestrationStep = {
            id: Date.now().toString(),
            agentId: selectedAgentId,
            customPrompt: configPrompt,
            selectedModel: configModel,
            status: 'pending'
        };
        setSteps([...steps, newStep]);
        setSelectedAgentId(null);
    };

    const runAll = async () => {
        const newSteps = [...steps];
        
        for (let i = 0; i < newSteps.length; i++) {
            if (newSteps[i].status === 'completed') continue;
            
            newSteps[i] = { ...newSteps[i], status: 'running' };
            setSteps([...newSteps]);

            try {
                const result = await executeAgent(
                    newSteps[i].agentId, 
                    newSteps[i].customPrompt, 
                    newSteps[i].selectedModel, 
                    docContent
                );
                newSteps[i] = { ...newSteps[i], status: 'completed', result };
            } catch (e) {
                newSteps[i] = { ...newSteps[i], status: 'error', result: 'Error executing agent' };
            }
            setSteps([...newSteps]);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)] animate-fade-in">
            
            {/* Left Col: Document Input */}
            <div className={`col-span-1 flex flex-col gap-4 rounded-2xl border border-white/20 shadow-lg p-6 ${style.cardBg}`}>
                <div className="flex items-center gap-2">
                    <FileText className={style.accentColor} />
                    <h3 className={`font-bold ${style.textColor}`}>Input Document</h3>
                </div>
                <textarea 
                    className="flex-1 w-full bg-white/40 dark:bg-black/40 rounded-xl p-4 resize-none outline-none border border-transparent focus:border-teal-500"
                    placeholder="Paste regulatory text, markdown, or summary here..."
                    value={docContent}
                    onChange={(e) => setDocContent(e.target.value)}
                />
            </div>

            {/* Middle Col: Configuration */}
            <div className={`col-span-1 flex flex-col gap-4 rounded-2xl border border-white/20 shadow-lg p-6 ${style.cardBg}`}>
                <div className="flex items-center gap-2">
                    <Settings className={style.accentColor} />
                    <h3 className={`font-bold ${style.textColor}`}>Workflow Builder</h3>
                </div>

                {!selectedAgentId ? (
                    <div className="flex-1 overflow-y-auto space-y-2">
                        <p className={`text-sm opacity-60 mb-2 ${style.textColor}`}>Select an agent to add to workflow:</p>
                        {agents.map(agent => (
                            <div 
                                key={agent.id} 
                                onClick={() => handleSelectAgent(agent)}
                                className="p-3 rounded-xl bg-white/20 hover:bg-teal-500/20 cursor-pointer border border-white/10 transition-colors flex justify-between items-center group"
                            >
                                <div>
                                    <div className={`font-semibold ${style.textColor}`}>{agent.name}</div>
                                    <div className="text-xs opacity-60">{agent.role}</div>
                                </div>
                                <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
                            </div>
                        ))}
                        
                        <div className="mt-8 border-t border-white/10 pt-4">
                            <h4 className={`font-semibold mb-2 ${style.textColor}`}>Execution Queue</h4>
                            {steps.length === 0 && <p className="text-sm opacity-40 italic">No steps added.</p>}
                            <div className="space-y-2">
                                {steps.map((step, idx) => {
                                    const agent = agents.find(a => a.id === step.agentId);
                                    return (
                                        <div key={step.id} className="text-sm p-2 bg-black/5 rounded-lg flex items-center justify-between">
                                            <span className={style.textColor}>{idx + 1}. {agent?.name || 'Unknown Agent'}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded ${step.status === 'completed' ? 'bg-green-500/20 text-green-700' : 'bg-gray-500/20'}`}>
                                                {step.status}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            {steps.length > 0 && (
                                <button 
                                    onClick={runAll}
                                    className="w-full mt-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
                                >
                                    Execute Workflow
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col animate-slide-in">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className={`font-bold ${style.textColor}`}>Configure Agent</h4>
                            <button onClick={() => setSelectedAgentId(null)} className="text-xs hover:underline opacity-60">Cancel</button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className={`text-xs uppercase font-bold opacity-60 block mb-1 ${style.textColor}`}>Model</label>
                                <select 
                                    value={configModel}
                                    onChange={(e) => setConfigModel(e.target.value)}
                                    className="w-full p-2 rounded-lg bg-white/50 border border-white/20 text-sm outline-none"
                                >
                                    {AVAILABLE_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className={`text-xs uppercase font-bold opacity-60 block mb-1 ${style.textColor}`}>Prompt</label>
                                <textarea 
                                    value={configPrompt}
                                    onChange={(e) => setConfigPrompt(e.target.value)}
                                    className="w-full h-48 p-3 rounded-lg bg-white/50 border border-white/20 text-sm outline-none resize-none"
                                />
                            </div>
                            <button 
                                onClick={addStep}
                                className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium"
                            >
                                Add to Workflow
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Col: Results */}
            <div className={`col-span-1 flex flex-col gap-4 rounded-2xl border border-white/20 shadow-lg p-6 ${style.cardBg}`}>
                <div className="flex items-center gap-2">
                    <CheckCircle className={style.accentColor} />
                    <h3 className={`font-bold ${style.textColor}`}>Results</h3>
                </div>
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {steps.filter(s => s.result).map((step, idx) => {
                         const agent = agents.find(a => a.id === step.agentId);
                         return (
                            <div key={step.id} className="p-4 rounded-xl bg-white/40 dark:bg-black/20 border border-white/10">
                                <div className="flex items-center justify-between mb-2 border-b border-black/5 pb-2">
                                    <span className={`font-bold text-sm ${style.textColor}`}>{agent?.name || 'Unknown Agent'}</span>
                                    <span className="text-xs opacity-50 font-mono">{step.selectedModel}</span>
                                </div>
                                <div className={`text-sm whitespace-pre-wrap ${style.textColor} opacity-90 leading-relaxed`}>
                                    {step.result}
                                </div>
                            </div>
                         );
                    })}
                    {steps.length > 0 && !steps.some(s => s.result) && (
                        <div className="h-full flex flex-col items-center justify-center opacity-40">
                            <Clock size={48} />
                            <p className="mt-2 text-sm">Results will appear here...</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default Orchestration;