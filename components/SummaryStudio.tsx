
import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, Activity, AlertTriangle, X, File as FileIcon } from 'lucide-react';
import { PainterStyle, Language, Mock510kData } from '../types';
import { TRANSLATIONS } from '../constants';
import { generateStructuredSummary } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface StudioProps {
    style: PainterStyle;
    lang: Language;
    onDataLoaded: (data: Mock510kData) => void;
}

const SummaryStudio: React.FC<StudioProps> = ({ style, lang, onDataLoaded }) => {
    const t = TRANSLATIONS[lang];
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [data, setData] = useState<Mock510kData | null>(null);
    const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [textInput, setTextInput] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleAnalyze = async () => {
        if (!file && !textInput) return;
        setIsAnalyzing(true);
        // Pass either file or text
        const result = await generateStructuredSummary(file || textInput);
        setData(result);
        onDataLoaded(result);
        setIsAnalyzing(false);
    };

    const renderHero = (d: Mock510kData) => (
        <div className={`p-6 rounded-2xl mb-6 border border-white/20 shadow-lg ${style.cardBg}`}>
            <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-bold rounded-md border border-teal-500/30">
                            TRADITIONAL
                        </span>
                        <span className={`text-sm opacity-70 ${style.textColor}`}>{d.decisionDate}</span>
                    </div>
                    <h2 className={`text-3xl font-bold mb-1 ${style.textColor}`}>{d.deviceName}</h2>
                    <h3 className={`text-xl opacity-80 ${style.textColor}`}>{d.applicant}</h3>
                </div>
                <div className="text-right">
                    <div className={`text-5xl font-mono font-bold tracking-tighter opacity-90 ${style.accentColor}`}>
                        {d.kNumber}
                    </div>
                    <div className={`text-sm opacity-60 mt-1 ${style.textColor}`}>Review Decision: CLEARED</div>
                </div>
            </div>
        </div>
    );

    // Initial Empty State with Upload/Paste
    if (!data && !isAnalyzing) {
        return (
            <div className={`p-8 rounded-3xl border border-white/20 shadow-xl ${style.cardBg} max-w-4xl mx-auto`}>
                 <div className="flex justify-center mb-8 bg-black/5 dark:bg-white/5 p-1 rounded-xl w-fit mx-auto">
                    <button 
                        onClick={() => setInputMode('upload')}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${inputMode === 'upload' ? 'bg-teal-600 text-white shadow-lg' : style.textColor + ' opacity-60'}`}
                    >
                        {t.uploadFile}
                    </button>
                    <button 
                        onClick={() => setInputMode('paste')}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${inputMode === 'paste' ? 'bg-teal-600 text-white shadow-lg' : style.textColor + ' opacity-60'}`}
                    >
                        {t.pasteText}
                    </button>
                 </div>

                 <div className="min-h-[400px] flex flex-col items-center justify-center">
                    {inputMode === 'upload' ? (
                        <div className="w-full h-full flex flex-col items-center">
                             {!file ? (
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="cursor-pointer w-full h-64 rounded-2xl border-2 border-dashed border-gray-400 hover:border-teal-500 transition-all flex flex-col items-center justify-center group bg-white/5"
                                >
                                    <Upload className="h-16 w-16 text-gray-400 group-hover:text-teal-500 mb-4 transition-colors" />
                                    <h3 className={`text-xl font-semibold mb-2 ${style.textColor}`}>{t.uploadTitle}</h3>
                                    <p className={`text-sm opacity-70 ${style.textColor}`}>{t.uploadDesc}</p>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleFileChange} 
                                        accept=".pdf,.txt,.json" 
                                        className="hidden" 
                                    />
                                </div>
                             ) : (
                                <div className="w-full space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-teal-500/10 border border-teal-500/30 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <FileIcon className="text-teal-500" />
                                            <span className={`font-medium ${style.textColor}`}>{file.name}</span>
                                            <span className="text-xs opacity-50">({(file.size / 1024).toFixed(1)} KB)</span>
                                        </div>
                                        <button onClick={() => setFile(null)} className="p-1 hover:bg-black/10 rounded-full transition-colors">
                                            <X size={18} className="text-red-500" />
                                        </button>
                                    </div>
                                    {/* PDF Preview Frame */}
                                    {file.type === 'application/pdf' && (
                                        <div className="w-full h-96 bg-gray-100 rounded-xl overflow-hidden border border-white/20">
                                            <iframe 
                                                src={URL.createObjectURL(file)} 
                                                className="w-full h-full" 
                                                title="PDF Preview"
                                            />
                                        </div>
                                    )}
                                </div>
                             )}
                        </div>
                    ) : (
                        <textarea 
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder="Paste your 510(k) summary text or JSON here..."
                            className="w-full h-96 p-4 rounded-xl bg-white/40 dark:bg-black/40 border border-white/20 resize-none outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-500"
                        />
                    )}

                    <div className="mt-8">
                        <button 
                            onClick={handleAnalyze}
                            disabled={(!file && !textInput)}
                            className={`px-8 py-3 rounded-full font-bold text-lg transition-all shadow-lg ${
                                (!file && !textInput) 
                                ? 'bg-gray-400 cursor-not-allowed opacity-50' 
                                : 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:scale-105 text-white shadow-teal-500/30'
                            }`}
                        >
                            {t.parse}
                        </button>
                    </div>
                 </div>
            </div>
        );
    }

    // Loading State
    if (isAnalyzing) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <div className="relative w-24 h-24 mb-8">
                    <div className="absolute inset-0 border-4 border-gray-200 rounded-full opacity-25"></div>
                    <div className="absolute inset-0 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Activity className="text-teal-500 animate-pulse" size={32} />
                    </div>
                </div>
                <h2 className={`text-2xl font-light animate-pulse ${style.textColor}`}>{t.analyzing}</h2>
                <p className="mt-2 text-sm opacity-60">Running Gemini 3 Pro Agentic Analysis...</p>
            </div>
        );
    }

    // Dashboard View (Existing + Updated)
    return (
        <div className="space-y-6 pb-20 animate-fade-in">
            {data && renderHero(data)}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Predicates Section */}
                <div className={`p-6 rounded-2xl border border-white/20 shadow-md ${style.cardBg}`}>
                    <div className="flex items-center gap-2 mb-4">
                        <FileText className={style.accentColor} size={20} />
                        <h3 className={`text-lg font-semibold ${style.textColor}`}>{t.predicates}</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-black/5 dark:bg-white/5 rounded-lg">
                                <tr>
                                    <th className={`px-4 py-3 rounded-l-lg ${style.textColor}`}>Device</th>
                                    <th className={`px-4 py-3 ${style.textColor}`}>Manufacturer</th>
                                    <th className={`px-4 py-3 rounded-r-lg ${style.textColor}`}>Difference</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.predicates.map((p, i) => (
                                    <tr key={i} className="border-b border-black/5 dark:border-white/5 last:border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                        <td className={`px-4 py-3 font-medium ${style.textColor}`}>{p.name}</td>
                                        <td className={`px-4 py-3 opacity-80 ${style.textColor}`}>{p.manufacturer}</td>
                                        <td className={`px-4 py-3 opacity-80 ${style.textColor}`}>{p.differences}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Testing Charts */}
                <div className={`p-6 rounded-2xl border border-white/20 shadow-md ${style.cardBg}`}>
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className={style.accentColor} size={20} />
                        <h3 className={`text-lg font-semibold ${style.textColor}`}>{t.testing}</h3>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.testing}>
                                <XAxis dataKey="category" hide />
                                <YAxis hide />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    cursor={{fill: 'transparent'}}
                                />
                                <Bar dataKey="tests" radius={[4, 4, 0, 0]}>
                                    {data?.testing.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#0d9488' : '#14b8a6'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {data?.testing.map((t, i) => (
                            <div key={i} className="flex items-center gap-1 text-xs opacity-70">
                                <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-teal-600' : 'bg-teal-500'}`}></div>
                                <span className={style.textColor}>{t.category}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Risks Section */}
                <div className={`p-6 rounded-2xl border border-white/20 shadow-md lg:col-span-2 ${style.cardBg}`}>
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="text-amber-500" size={20} />
                        <h3 className={`text-lg font-semibold ${style.textColor}`}>{t.risks}</h3>
                    </div>
                    <div className="grid gap-4">
                        {data?.risks.map((risk, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/40 dark:bg-black/20">
                                <CheckCircle className="text-teal-500 mt-0.5 shrink-0" size={16} />
                                <div>
                                    <div className={`font-medium text-sm ${style.textColor}`}>{risk.hazard}</div>
                                    <div className={`text-xs opacity-70 mt-1 ${style.textColor}`}>Mitigation: {risk.mitigation}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummaryStudio;
