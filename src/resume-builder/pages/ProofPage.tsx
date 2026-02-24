import React, { useState, useEffect } from 'react';

import { CheckCircle, AlertCircle, Copy, ShieldCheck, Globe, Github as GithubIcon, Sparkles } from 'lucide-react';

const CHECKLIST_ITEMS = [
    "All form sections save to localStorage",
    "Live preview updates in real-time",
    "Template switching preserves data",
    "Color theme persists after refresh",
    "ATS score calculates correctly",
    "Score updates live on edit",
    "Export buttons work (copy/download)",
    "Empty states handled gracefully",
    "Mobile responsive layout works",
    "No console errors on any page"
];

export const ProofPage: React.FC = () => {
    const [links, setLinks] = useState({
        lovable: '',
        github: '',
        deploy: ''
    });
    const [checklist, setChecklist] = useState<boolean[]>(new Array(10).fill(false));
    const [stepsStatus, setStepsStatus] = useState<boolean[]>(new Array(8).fill(false));
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        // Load Steps
        const sStatus = Array.from({ length: 8 }, (_, i) => !!localStorage.getItem(`rb_step_${i + 1}_artifact`));
        setStepsStatus(sStatus);

        // Load Links
        const savedLinks = JSON.parse(localStorage.getItem('rb_final_submission') || '{}');
        setLinks({
            lovable: savedLinks.lovable || '',
            github: savedLinks.github || '',
            deploy: savedLinks.deploy || ''
        });

        // Load Checklist
        const savedChecklist = JSON.parse(localStorage.getItem('rb_checklist_status') || '[]');
        if (savedChecklist.length === 10) {
            setChecklist(savedChecklist.map((item: any) => item.completed));
        }

        // Gating: Only redirect if NO steps are started (initial entrance)
        // If some steps are done but not all, we let them stay but they can't ship
    }, []);

    const handleLinkChange = (key: keyof typeof links, value: string) => {
        const newLinks = { ...links, [key]: value };
        setLinks(newLinks);
        localStorage.setItem('rb_final_submission', JSON.stringify(newLinks));
    };

    const toggleChecklist = (index: number) => {
        const newChecklist = [...checklist];
        newChecklist[index] = !newChecklist[index];
        setChecklist(newChecklist);

        const statusToSave = CHECKLIST_ITEMS.map((item, i) => ({
            task: item,
            completed: newChecklist[i]
        }));
        localStorage.setItem('rb_checklist_status', JSON.stringify(statusToSave));
    };

    const validateUrl = (url: string) => {
        try {
            return url.startsWith('http');
        } catch {
            return false;
        }
    };

    const stepsComplete = stepsStatus.every(s => s);
    const checklistComplete = checklist.every(c => c);
    const linksValid = validateUrl(links.lovable) && validateUrl(links.github) && validateUrl(links.deploy);
    const isShipped = stepsComplete && checklistComplete && linksValid;

    const handleCopyFinal = () => {
        const text = `------------------------------------------
AI Resume Builder — Final Submission

Lovable Project: ${links.lovable}
GitHub Repository: ${links.github}
Live Deployment: ${links.deploy}

Core Capabilities:
- Structured resume builder
- Deterministic ATS scoring
- Template switching
- PDF export with clean formatting
- Persistence + validation checklist
------------------------------------------`;
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="kn-page">
            <div className="kn-context-header">
                <h1>Final Proof of Work</h1>
                <p>Complete your project requirements and prepare for final shipping.</p>
            </div>

            <div className="kn-content-grid">
                <section className="kn-workspace flex flex-col gap-6">
                    {/* Step Completion */}
                    <div className="kn-card">
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" /> 8-Step Build Track
                        </h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            {stepsStatus.map((done, i) => (
                                <div key={i} className={`p-3 rounded-lg border flex flex-col gap-1 transition-all ${done ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100'}`}>
                                    <span className="text-[10px] uppercase font-black opacity-40">Step 0{i + 1}</span>
                                    <span className={`text-[11px] font-bold ${done ? 'text-green-800' : 'text-gray-400'}`}>{getStepName(i + 1)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quality Checklist */}
                    <div className="kn-card">
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-500" /> Quality Assurance Checklist
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                            {CHECKLIST_ITEMS.map((item, i) => (
                                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                    <div
                                        onClick={() => toggleChecklist(i)}
                                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${checklist[i] ? 'bg-indigo-600 border-indigo-600' : 'border-gray-200 group-hover:border-indigo-400'}`}
                                    >
                                        {checklist[i] && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                    <span className={`text-xs font-medium ${checklist[i] ? 'text-gray-900' : 'text-gray-400'}`}>{item}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Artifact URLs */}
                    <div className="kn-card">
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-blue-500" /> Deployment & Artifacts
                        </h3>
                        <div className="flex flex-col gap-5">
                            <div>
                                <label className="kn-label flex items-center gap-2">
                                    <Sparkles className="w-3 h-3" /> Lovable Project Link
                                </label>
                                <input
                                    type="text"
                                    className={`kn-input mb-0 ${links.lovable && !validateUrl(links.lovable) ? 'border-red-500' : ''}`}
                                    placeholder="https://lovable.dev/projects/..."
                                    value={links.lovable}
                                    onChange={(e) => handleLinkChange('lovable', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="kn-label flex items-center gap-2">
                                    <GithubIcon className="w-3 h-3" /> GitHub Repository Link
                                </label>
                                <input
                                    type="text"
                                    className={`kn-input mb-0 ${links.github && !validateUrl(links.github) ? 'border-red-500' : ''}`}
                                    placeholder="https://github.com/username/repo"
                                    value={links.github}
                                    onChange={(e) => handleLinkChange('github', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="kn-label flex items-center gap-2">
                                    <Globe className="w-3 h-3" /> Production Live URL
                                </label>
                                <input
                                    type="text"
                                    className={`kn-input mb-0 ${links.deploy && !validateUrl(links.deploy) ? 'border-red-500' : ''}`}
                                    placeholder="https://your-app.vercel.app"
                                    value={links.deploy}
                                    onChange={(e) => handleLinkChange('deploy', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <aside className="kn-secondary-panel flex flex-col gap-6">
                    <div className={`kn-panel-box p-8 flex flex-col items-center text-center transition-all ${isShipped ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl ${isShipped ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                            {isShipped ? <ShieldCheck className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                        </div>
                        <h4 className="text-xl m-0 mb-2 uppercase tracking-tight">{isShipped ? 'Shipped' : 'In Progress'}</h4>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 leading-relaxed">
                            {isShipped
                                ? 'Project 3 meets all KodNest Premium standards.'
                                : 'Complete all requirements to finalize shipping.'}
                        </p>

                        {isShipped && (
                            <div className="w-full animate-in fade-in slide-in-from-bottom-2">
                                <button
                                    className="kn-btn kn-btn-primary kn-btn-full py-4 rounded-xl text-sm mb-4"
                                    onClick={handleCopyFinal}
                                >
                                    <Copy className="w-4 h-4 mr-2" />
                                    {isCopied ? 'Copied Details!' : 'Copy Final Submission'}
                                </button>
                                <div className="text-[10px] font-black uppercase text-green-700 tracking-widest">
                                    Project 3 Shipped Successfully.
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="kn-panel-box bg-indigo-50 border-indigo-100 italic">
                        <div className="flex items-center gap-2 text-indigo-900 font-bold mb-4">
                            <ShieldCheck className="w-4 h-4" />
                            Shipping Rules
                        </div>
                        <ul className="text-[11px] text-indigo-800 space-y-3 pl-4 list-disc opacity-80">
                            <li>All 8 build steps must have artifacts</li>
                            <li>Critical Quality Checklist must be 100%</li>
                            <li>All URLs must be provided and valid</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
};

function getStepName(step: number): string {
    const names = [
        '',
        'Problem',
        'Market',
        'Architecture',
        'HLD',
        'LLD',
        'Build',
        'Testing',
        'Shipping'
    ];
    return names[step] || '';
}
