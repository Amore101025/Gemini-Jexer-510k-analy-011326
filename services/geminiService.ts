
import { GoogleGenAI } from "@google/genai";
import { MOCK_510K_RESULT } from '../constants';
import { Mock510kData } from '../types';

// In a real implementation, this would use process.env.API_KEY
// For this UI demo, we will simulate the delay and return structure.

export const generateStructuredSummary = async (input: string | File): Promise<Mock510kData> => {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Logic to handle File vs String would go here (e.g. read file to base64)
    // const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // ...
    
    return MOCK_510K_RESULT;
};

export const chatWithContext = async (message: string, contextData: any): Promise<string> => {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (message.toLowerCase().includes('predicate')) {
        return "Based on the document, the primary predicate is the Stimulator X1 by Global Neuro. The subject device shares the same waveform characteristics but features wireless charging capabilities.";
    }
    if (message.toLowerCase().includes('risk')) {
        return "Key risks identified include battery overheating and infection. Mitigations cite IEC 60601-1 thermal cutoffs and sterile packaging procedures.";
    }

    return "I can answer questions about the indications, predicates, testing, or risks found in this 510(k) summary. What would you like to know?";
};

export const executeAgent = async (agentId: string, prompt: string, model: string, docContent: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate varied responses based on agent role
    if (agentId === '1') { // Orchestrator
        return `## Review Plan for Subject Device\n\n**Phase 1: Administrative Review**\n- Verify Truthful and Accurate Statement.\n- Confirm User Fee Payment.\n\n**Phase 2: Substantial Equivalence (SE)**\n- Deep dive into 'Wireless Charging' technological difference.\n- **Action**: Run Predicate Analyst agent on Section 5.\n\n**Phase 3: Performance Data**\n- Review Biocompatibility (ISO 10993) for new patient contact materials.\n- Verify Software Cybersecurity risk assessment.`;
    }
    if (agentId === '2') { // Predicate
        return `## Predicate Comparison Table\n\n| Feature | Subject Device | Predicate (K123456) | Difference | Significance |\n|---|---|---|---|---|\n| Intended Use | Pain Relief | Pain Relief | Identical | None |\n| Power Source | Rechargeable Li-Ion | Primary Cell | **Different** | Requires safety testing per IEC 62133 |\n| Frequency | 10-100Hz | 10-100Hz | Identical | None |`;
    }
    
    return `Analysis complete using **${model}**.\n\nBased on your prompt: "${prompt}"\n\nI have reviewed the document and found the following key points relevant to the regulatory submission...`;
};

export const generateInteractivePageCode = async (content: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return a full HTML string that can be rendered in an iframe
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: sans-serif; padding: 20px; background: #f8fafc; color: #334155; }
          .card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); margin-bottom: 20px; }
          h1 { color: #0f766e; }
          h2 { border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-top: 0; }
          .stat { font-size: 24px; font-weight: bold; color: #0d9488; }
          .tag { display: inline-block; background: #ccfbf1; color: #0f766e; padding: 4px 8px; border-radius: 999px; font-size: 12px; margin-right: 5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { text-align: left; padding: 12px; border-bottom: 1px solid #e2e8f0; }
          th { color: #64748b; font-size: 14px; }
        </style>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      </head>
      <body>
        <div class="card">
          <h1>Interactive 510(k) Summary Report</h1>
          <p>Generated dynamically from uploaded documentation.</p>
          <div style="display: flex; gap: 20px; margin-top: 20px;">
            <div>
              <div class="stat">K234567</div>
              <div style="font-size: 12px; color: #64748b;">SUBMISSION NUMBER</div>
            </div>
             <div>
              <div class="stat">Class II</div>
              <div style="font-size: 12px; color: #64748b;">DEVICE CLASS</div>
            </div>
             <div>
              <div class="stat">GXY</div>
              <div style="font-size: 12px; color: #64748b;">PRODUCT CODE</div>
            </div>
          </div>
        </div>

        <div class="card">
          <h2>Key Entities Extracted</h2>
          <div>
            <span class="tag">Biocompatibility</span>
            <span class="tag">ISO 14971</span>
            <span class="tag">Wireless Power Transfer</span>
            <span class="tag">Cybersecurity</span>
            <span class="tag">Neurostimulation</span>
          </div>
        </div>

        <div class="card">
            <h2>Testing Distribution</h2>
            <canvas id="myChart" style="max-height: 200px;"></canvas>
        </div>

        <div class="card">
            <h2>Regulatory Conclusion</h2>
            <p>The subject device is substantially equivalent to the predicate. Differences in power management raise new questions of safety and effectiveness which have been addressed through electrical safety and thermal testing.</p>
        </div>

        <script>
          const ctx = document.getElementById('myChart');
          new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ['Biocompatibility', 'Electrical', 'Software', 'Animal', 'Clinical'],
              datasets: [{
                label: '# of Tests',
                data: [12, 19, 3, 5, 2],
                backgroundColor: '#14b8a6',
                borderRadius: 4
              }]
            },
            options: {
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } }
            }
          });
        </script>
      </body>
      </html>
    `;
}
