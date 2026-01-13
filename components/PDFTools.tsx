
import React, { useState, useRef } from 'react';
import { Upload, FileText, Code, Play, Eye } from 'lucide-react';
import { PainterStyle, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { generateInteractivePageCode } from '../services/geminiService';

interface PDFToolsProps {
    style: PainterStyle;
    lang: Language;
}

const PDFTools: React.FC<PDFToolsProps> = ({ style, lang }) => {
    const t = TRANSLATIONS[lang];
    const [file, setFile] = useState<File | null>(null);
    const [textInput, setTextInput] = useState('');
    const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleGenerate = async () => {
        if (!file && !textInput) return;
        setLoading(true);
        const html = await generateInteractivePageCode("dummy content");
        setGeneratedHtml(html);
        setLoading(false);
    };

    return (
        <div className="h-full flex flex-col gap-6 animate-fade-in pb-20">
            {/* Input Section */}
            <div className={`p-6 rounded-2xl border border-white/20 shadow-lg ${style.cardBg}`}>
                <div className="flex items-center gap-2 mb-4">
                    <Code className={style.accentColor} size={24} />
                    <div>
                        <h2 className={`text-xl font-bold ${style.textColor}`}>{t.interactivePage}</h2>
                        <p className="text-sm opacity-60">Convert PDF/Text into a live HTML Report</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="cursor-pointer border-2 border-dashed border-gray-400/50 hover:border-teal-500 rounded-xl p-8 flex flex-col items-center justify-center transition-colors bg-white/5"
                     >
                        <Upload className="mb-2 opacity-70" />
                        <span className={`text-sm ${style.textColor}`}>{file ? file.name : t.uploadFile}</span>
                        <input type="file" ref={fileInputRef} onChange={(e) => e.target.files && setFile(e.target.files[0])} accept=".pdf" className="hidden" />
                     </div>

                     <textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Or paste text here..."
                        className="w-full h-32 p-4 rounded-xl bg-white/40 dark:bg-black/40 border-0 outline-none resize-none"
                     />
                </div>

                <div className="mt-4 flex justify-end">
                    <button 
                        onClick={handleGenerate}
                        disabled={loading || (!file && !textInput)}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-white transition-all ${loading ? 'bg-gray-500' : 'bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-500/20'}`}
                    >
                        {loading ? <span className="animate-spin">⌛</span> : <Play size={16} />}
                        <span>Generate Webpage</span>
                    </button>
                </div>
            </div>

            {/* Preview Section */}
            <div className={`flex-1 rounded-2xl border border-white/20 shadow-lg overflow-hidden flex flex-col ${style.cardBg}`}>
                <div className="p-3 border-b border-white/10 flex items-center gap-2 bg-black/5">
                    <Eye size={16} className={style.textColor} />
                    <span className={`text-sm font-medium ${style.textColor}`}>Live Preview</span>
                </div>
                <div className="flex-1 bg-white relative">
                    {generatedHtml ? (
                        <iframe 
                            srcDoc={generatedHtml} 
                            className="w-full h-full border-0" 
                            title="Generated Report"
                            sandbox="allow-scripts"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                            <p>Generated content will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PDFTools;
