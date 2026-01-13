import React, { useState, useEffect, useRef } from 'react';
import { Settings, Cpu, Edit3, Save, Download, Upload, Plus, Trash2, RefreshCw, FileCode, Monitor } from 'lucide-react';
import { PainterStyle, Agent, Language } from '../types';
import { TRANSLATIONS, AVAILABLE_MODELS } from '../constants';
import { load, dump } from 'js-yaml';

interface ConfigProps {
    style: PainterStyle;
    lang: Language;
    agents: Agent[];
    onUpdateAgents: (agents: Agent[]) => void;
}

const AgentsConfig: React.FC<ConfigProps> = ({ style, lang, agents, onUpdateAgents }) => {
    const t = TRANSLATIONS[lang];
    const [viewMode, setViewMode] = useState<'ui' | 'yaml'>('ui');
    const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
    const [yamlContent, setYamlContent] = useState('');
    const [yamlError, setYamlError] = useState<string | null>(null);
    
    // Form State for UI editing
    const [editForm, setEditForm] = useState<Partial<Agent>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync YAML when agents change (if in UI mode or initial load)
    useEffect(() => {
        if (viewMode === 'ui') {
            try {
                const y = dump(agents);
                setYamlContent(y);
            } catch (e) {
                console.error("YAML Dump Error", e);
            }
        }
    }, [agents, viewMode]);

    const handleSelectAgent = (agent: Agent) => {
        setActiveAgentId(agent.id);
        setEditForm({ ...agent });
    };

    const handleFormChange = (field: keyof Agent, value: any) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    const saveAgent = () => {
        if (!editForm.id) return;
        const updatedAgents = agents.map(a => a.id === editForm.id ? { ...a, ...editForm } as Agent : a);
        onUpdateAgents(updatedAgents);
        setYamlContent(dump(updatedAgents)); // Keep yaml sync
    };

    const deleteAgent = (id: string) => {
        const updated = agents.filter(a => a.id !== id);
        onUpdateAgents(updated);
        if (activeAgentId === id) {
            setActiveAgentId(null);
            setEditForm({});
        }
    };

    const createAgent = () => {
        const newAgent: Agent = {
            id: Date.now().toString(),
            name: 'New Agent',
            role: 'Generalist',
            model: 'gemini-2.5-flash',
            temperature: 0.5,
            status: 'idle',
            systemPrompt: 'You are a helpful assistant.'
        };
        onUpdateAgents([...agents, newAgent]);
        handleSelectAgent(newAgent);
    };

    const handleYamlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setYamlContent(e.target.value);
        try {
            const parsed = load(e.target.value) as Agent[];
            if (Array.isArray(parsed) && parsed.every(a => a.id && a.name)) {
                setYamlError(null);
                // Don't auto update state on every keystroke to prevent jumping, 
                // but user can click "Sync" or we update on blur/tab switch
            } else {
                setYamlError("Invalid YAML structure: Must be a list of agents.");
            }
        } catch (e: any) {
            setYamlError(e.message);
        }
    };

    const applyYaml = () => {
        try {
            const parsed = load(yamlContent) as Agent[];
            if (Array.isArray(parsed)) {
                onUpdateAgents(parsed);
                setYamlError(null);
                alert("Agents updated from YAML!");
            } else {
                alert("Invalid YAML: Root must be a list.");
            }
        } catch (e) {
            alert("Failed to parse YAML.");
        }
    };

    const downloadYaml = () => {
        const blob = new Blob([yamlContent], { type: 'text/yaml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'agents.yaml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            setYamlContent(content);
            try {
                const parsed = load(content) as Agent[];
                if (Array.isArray(parsed)) {
                    onUpdateAgents(parsed);
                }
            } catch (err) {
                console.error(err);
                alert("Error parsing uploaded YAML file");
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-6 animate-fade-in pb-20 h-[calc(100vh-140px)] flex flex-col">
            <div className={`p-4 rounded-2xl border border-white/20 shadow-lg ${style.cardBg} flex justify-between items-center shrink-0`}>
                <div>
                    <h2 className={`text-2xl font-bold ${style.textColor}`}>{t.agentsConfig}</h2>
                    <p className={`opacity-70 text-sm ${style.textColor}`}>Manage and orchestrate your review workforce</p>
                </div>
                <div className="flex gap-2 bg-black/5 p-1 rounded-lg">
                    <button 
                        onClick={() => setViewMode('ui')} 
                        className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${viewMode === 'ui' ? 'bg-white shadow text-teal-700' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Monitor size={16} /> Visual Editor
                    </button>
                    <button 
                        onClick={() => setViewMode('yaml')}
                        className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${viewMode === 'yaml' ? 'bg-white shadow text-teal-700' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <FileCode size={16} /> YAML Source
                    </button>
                </div>
            </div>

            {viewMode === 'ui' ? (
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
                    {/* List Column */}
                    <div className={`col-span-1 rounded-2xl border border-white/20 shadow-lg ${style.cardBg} flex flex-col overflow-hidden`}>
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h3 className={`font-semibold ${style.textColor}`}>Agent Roster</h3>
                            <button onClick={createAgent} className="p-2 hover:bg-teal-500/20 text-teal-600 rounded-lg transition-colors">
                                <Plus size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {agents.map((agent) => (
                                <div 
                                    key={agent.id} 
                                    onClick={() => handleSelectAgent(agent)}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                        activeAgentId === agent.id 
                                        ? 'border-teal-500 bg-teal-500/10 shadow-md' 
                                        : 'border-white/10 bg-white/20 hover:bg-white/40'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${activeAgentId === agent.id ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                                <Cpu size={18} />
                                            </div>
                                            <div>
                                                <div className={`font-medium ${style.textColor}`}>{agent.name}</div>
                                                <div className="text-xs opacity-60">{agent.role}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Edit Column */}
                    <div className={`col-span-2 rounded-2xl border border-white/20 shadow-lg ${style.cardBg} flex flex-col overflow-hidden`}>
                        {activeAgentId ? (
                            <div className="flex flex-col h-full">
                                <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                                    <h3 className={`font-semibold ${style.textColor}`}>Editing: {editForm.name}</h3>
                                    <div className="flex gap-2">
                                        <button onClick={() => deleteAgent(activeAgentId!)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                            <Trash2 size={18} />
                                        </button>
                                        <button onClick={saveAgent} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex items-center gap-2 text-sm font-medium">
                                            <Save size={16} /> Save Changes
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={`block text-xs uppercase font-bold opacity-60 mb-2 ${style.textColor}`}>Name</label>
                                            <input 
                                                type="text" 
                                                value={editForm.name || ''} 
                                                onChange={(e) => handleFormChange('name', e.target.value)}
                                                className="w-full p-3 rounded-xl bg-white/40 border border-white/20 focus:ring-2 focus:ring-teal-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-xs uppercase font-bold opacity-60 mb-2 ${style.textColor}`}>Role</label>
                                            <input 
                                                type="text" 
                                                value={editForm.role || ''} 
                                                onChange={(e) => handleFormChange('role', e.target.value)}
                                                className="w-full p-3 rounded-xl bg-white/40 border border-white/20 focus:ring-2 focus:ring-teal-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={`block text-xs uppercase font-bold opacity-60 mb-2 ${style.textColor}`}>Model</label>
                                            <select 
                                                value={editForm.model || ''}
                                                onChange={(e) => handleFormChange('model', e.target.value)}
                                                className="w-full p-3 rounded-xl bg-white/40 border border-white/20 focus:ring-2 focus:ring-teal-500 outline-none"
                                            >
                                                {AVAILABLE_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className={`block text-xs uppercase font-bold opacity-60 mb-2 ${style.textColor}`}>Temperature ({editForm.temperature})</label>
                                            <input 
                                                type="range" 
                                                min="0" max="1" step="0.1"
                                                value={editForm.temperature || 0.5} 
                                                onChange={(e) => handleFormChange('temperature', parseFloat(e.target.value))}
                                                className="w-full mt-3 accent-teal-600"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className={`block text-xs uppercase font-bold opacity-60 mb-2 ${style.textColor}`}>System Prompt</label>
                                        <textarea 
                                            value={editForm.systemPrompt || ''}
                                            onChange={(e) => handleFormChange('systemPrompt', e.target.value)}
                                            className="w-full h-48 p-4 rounded-xl bg-white/40 border border-white/20 focus:ring-2 focus:ring-teal-500 outline-none resize-none font-mono text-sm leading-relaxed"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40">
                                <Settings size={48} className="mb-4" />
                                <p>Select an agent to edit properties</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className={`flex-1 rounded-2xl border border-white/20 shadow-lg ${style.cardBg} flex flex-col overflow-hidden`}>
                     <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                        <h3 className={`font-semibold ${style.textColor}`}>agents.yaml</h3>
                        <div className="flex gap-2">
                             <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleUpload} 
                                accept=".yaml,.yml" 
                                className="hidden" 
                            />
                            <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 border border-white/20 hover:bg-white/10 rounded-lg flex items-center gap-2 text-sm">
                                <Upload size={16} /> Upload
                            </button>
                            <button onClick={downloadYaml} className="px-4 py-2 border border-white/20 hover:bg-white/10 rounded-lg flex items-center gap-2 text-sm">
                                <Download size={16} /> Download
                            </button>
                            <button onClick={applyYaml} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex items-center gap-2 text-sm font-medium shadow-lg">
                                <RefreshCw size={16} /> Apply & Sync
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        <textarea 
                            value={yamlContent}
                            onChange={handleYamlChange}
                            className="w-full h-full p-6 bg-slate-900 text-slate-300 font-mono text-sm resize-none outline-none"
                            spellCheck={false}
                        />
                        {yamlError && (
                            <div className="absolute bottom-4 right-4 bg-red-500/90 text-white px-4 py-2 rounded-lg text-xs font-mono shadow-lg backdrop-blur">
                                {yamlError}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgentsConfig;