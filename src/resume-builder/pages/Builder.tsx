import React, { useState } from 'react';
import { useResumeData } from '../hooks/useResumeData';
import {
    Plus,
    Database,
    Eye,
    Trash2,
    ShieldCheck,
    AlertCircle,
    Sparkles,
    X,
    ChevronDown,
    ChevronUp,
    Github,
    ExternalLink,
    Loader2,
    Check
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ACTION_VERBS = ['Built', 'Developed', 'Designed', 'Implemented', 'Led', 'Improved', 'Created', 'Optimized', 'Automated'];

const BulletGuidance: React.FC<{ text: string }> = ({ text }) => {
    if (!text) return null;

    const bullets = text.split('\n').filter(b => b.trim());
    const warnings: string[] = [];

    bullets.forEach(bullet => {
        const trimmed = bullet.trim().replace(/^[-•*]\s*/, '');
        if (!trimmed) return;

        const firstWord = trimmed.split(' ')[0];
        const hasActionVerb = ACTION_VERBS.some(v => v.toLowerCase() === firstWord.toLowerCase());
        const hasNumbers = /\d+(%|k|x|X|m)?/.test(trimmed);

        if (!hasActionVerb) warnings.push("Start with a strong action verb (e.g., Developed, Led).");
        if (!hasNumbers) warnings.push("Add measurable impact (numbers like 20%, 5k, etc.).");
    });

    if (warnings.length === 0) return null;

    const uniqueWarnings = Array.from(new Set(warnings)).slice(0, 2);

    return (
        <div className="flex flex-col gap-1 mt-2">
            {uniqueWarnings.map((w, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[10px] text-amber-700 font-medium font-sans">
                    <AlertCircle className="w-3 h-3" />
                    <span>{w}</span>
                </div>
            ))}
        </div>
    );
};

const TagInput: React.FC<{
    tags: string[],
    onAdd: (tag: string) => void,
    onRemove: (tag: string) => void,
    placeholder?: string
}> = ({ tags, onAdd, onRemove, placeholder = "Type and press Enter..." }) => {
    const [input, setInput] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && input.trim()) {
            e.preventDefault();
            onAdd(input.trim());
            setInput('');
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2 mb-1">
                {tags.map((tag, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 border border-gray-200 rounded-md text-xs font-bold text-gray-700">
                        {tag}
                        <button onClick={() => onRemove(tag)} className="hover:text-red-600">
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
            </div>
            <input
                className="kn-input mb-0 h-9 text-xs"
                placeholder={placeholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
};

export const Builder: React.FC = () => {
    const {
        data,
        score,
        suggestions,
        loadSample,
        updatePersonalInfo,
        updateSummary,
        updateTemplate,
        updateColorTheme,
        addEducation,
        addExperience,
        addProject,
        removeSectionItem,
        updateEducation,
        updateExperience,
        updateProject,
        toggleProjectOpen,
        addSkill,
        removeSkill,
        suggestSkills
    } = useResumeData();

    const [isSuggesting, setIsSuggesting] = useState(false);

    const handleSuggest = async () => {
        setIsSuggesting(true);
        await suggestSkills();
        setIsSuggesting(false);
    };


    return (
        <div className="kn-page">
            <div className="kn-context-header flex justify-between items-end">
                <div>
                    <h1>Resume Builder</h1>
                    <p>Draft your professional story. Changes reflect in real-time.</p>
                </div>
                <div className="flex gap-4 mb-4">
                    <button className="kn-btn kn-btn-secondary" onClick={loadSample}>
                        <Database className="w-4 h-4 mr-2" />
                        Load Sample Data
                    </button>
                    <Link to="/preview" className="kn-btn kn-btn-primary">
                        <Eye className="w-4 h-4 mr-2" />
                        Full Preview
                    </Link>
                </div>
            </div>


            <div className="kn-content-grid">
                <section className="kn-workspace flex flex-col gap-8 pb-32">

                    {/* Personal Info */}
                    <div className="kn-card">
                        <h3 className="mb-6 border-b pb-2 font-sans font-black uppercase tracking-widest text-sm">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="kn-label">Full Name</label>
                                <input className="kn-input" value={data.personalInfo.fullName} onChange={(e) => updatePersonalInfo('fullName', e.target.value)} />
                            </div>
                            <div>
                                <label className="kn-label">Email Address</label>
                                <input className="kn-input" value={data.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} />
                            </div>
                            <div>
                                <label className="kn-label">Phone Number</label>
                                <input className="kn-input" value={data.personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} />
                            </div>
                            <div>
                                <label className="kn-label">Location</label>
                                <input className="kn-input" value={data.personalInfo.location} onChange={(e) => updatePersonalInfo('location', e.target.value)} />
                            </div>
                            <div>
                                <label className="kn-label">GitHub URL</label>
                                <input className="kn-input" placeholder="github.com/username" value={data.personalInfo.github} onChange={(e) => updatePersonalInfo('github', e.target.value)} />
                            </div>
                            <div>
                                <label className="kn-label">LinkedIn URL</label>
                                <input className="kn-input" placeholder="linkedin.com/in/username" value={data.personalInfo.linkedin} onChange={(e) => updatePersonalInfo('linkedin', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="kn-card">
                        <h3 className="mb-6 border-b pb-2 font-sans font-black uppercase tracking-widest text-sm">Professional Summary</h3>
                        <textarea
                            className="kn-textarea"
                            placeholder="Tell your professional story..."
                            value={data.summary}
                            onChange={(e) => updateSummary(e.target.value)}
                        />
                    </div>

                    {/* Education */}
                    <div className="kn-card">
                        <div className="flex justify-between items-center mb-6 border-b pb-2">
                            <h3 className="font-sans font-black uppercase tracking-widest text-sm">Education</h3>
                            <button className="text-red-800 flex items-center text-sm font-bold hover:opacity-70" onClick={addEducation}>
                                <Plus className="w-4 h-4 mr-1" /> Add
                            </button>
                        </div>
                        {data.education.map((edu, idx) => (
                            <div key={idx} className="mb-6 p-5 border border-gray-100 rounded-xl bg-gray-50/50 relative group transition-all">
                                <button className="absolute top-4 right-4 p-1.5 text-gray-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeSectionItem('education', idx)}>
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input className="kn-input mb-0" placeholder="School" value={edu.school} onChange={(e) => updateEducation(idx, 'school', e.target.value)} />
                                    <input className="kn-input mb-0" placeholder="Degree" value={edu.degree} onChange={(e) => updateEducation(idx, 'degree', e.target.value)} />
                                    <input className="kn-input mb-0" placeholder="Date/Range" value={edu.date} onChange={(e) => updateEducation(idx, 'date', e.target.value)} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Experience */}
                    <div className="kn-card">
                        <div className="flex justify-between items-center mb-6 border-b pb-2">
                            <h3 className="font-sans font-black uppercase tracking-widest text-sm">Professional Experience</h3>
                            <button className="text-red-800 flex items-center text-sm font-bold hover:opacity-70" onClick={addExperience}>
                                <Plus className="w-4 h-4 mr-1" /> Add
                            </button>
                        </div>
                        {data.experience.map((exp, idx) => (
                            <div key={idx} className="mb-6 p-5 border border-gray-100 rounded-xl bg-gray-50/50 relative group transition-all">
                                <button className="absolute top-4 right-4 p-1.5 text-gray-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeSectionItem('experience', idx)}>
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label className="kn-label">Company</label>
                                        <input className="kn-input mb-0" placeholder="e.g. Google" value={exp.company} onChange={(e) => updateExperience(idx, 'company', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="kn-label">Role</label>
                                        <input className="kn-input mb-0" placeholder="e.g. Software Engineer" value={exp.role} onChange={(e) => updateExperience(idx, 'role', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="kn-label">Date Range</label>
                                        <input className="kn-input mb-0" placeholder="Jan 2022 - Present" value={exp.date} onChange={(e) => updateExperience(idx, 'date', e.target.value)} />
                                    </div>
                                </div>
                                <label className="kn-label">Accomplishments</label>
                                <textarea
                                    className="kn-input mb-1 min-h-[100px]"
                                    placeholder="Describe your impact... Use bullet points for better ATS readability."
                                    value={exp.description}
                                    onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                                />
                                <BulletGuidance text={exp.description} />
                            </div>
                        ))}
                    </div>

                    {/* Projects - Accordion Section */}
                    <div className="kn-card">
                        <div className="flex justify-between items-center mb-6 border-b pb-2">
                            <h3 className="font-sans font-black uppercase tracking-widest text-sm">Projects</h3>
                            <button className="text-red-800 flex items-center text-sm font-bold hover:opacity-70" onClick={addProject}>
                                <Plus className="w-4 h-4 mr-1" /> Add Project
                            </button>
                        </div>
                        <div className="flex flex-col gap-4">
                            {data.projects.map((proj, idx) => (
                                <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                                    <div
                                        className="bg-gray-50 px-5 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-100"
                                        onClick={() => toggleProjectOpen(idx)}
                                    >
                                        <div className="flex items-center gap-3">
                                            {proj.isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                            <span className="font-bold text-sm tracking-tight">{proj.name || `Project ${idx + 1}`}</span>
                                        </div>
                                        <button
                                            className="p-1 px-2 text-xs font-bold text-gray-400 hover:text-red-600 flex items-center gap-1"
                                            onClick={(e) => { e.stopPropagation(); removeSectionItem('projects', idx); }}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" /> Delete
                                        </button>
                                    </div>

                                    {proj.isOpen && (
                                        <div className="p-6 bg-white flex flex-col gap-5 animate-in fade-in">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="kn-label">Project Title</label>
                                                    <input className="kn-input mb-0" placeholder="Project Name" value={proj.name} onChange={(e) => updateProject(idx, 'name', e.target.value)} />
                                                </div>
                                                <div>
                                                    <label className="kn-label">Live URL (Optional)</label>
                                                    <input className="kn-input mb-0" placeholder="https://example.com" value={proj.liveUrl} onChange={(e) => updateProject(idx, 'liveUrl', e.target.value)} />
                                                </div>
                                                <div>
                                                    <label className="kn-label">GitHub URL (Optional)</label>
                                                    <input className="kn-input mb-0" placeholder="github.com/user/repo" value={proj.githubUrl} onChange={(e) => updateProject(idx, 'githubUrl', e.target.value)} />
                                                </div>
                                                <div>
                                                    <label className="kn-label">Tech Stack (Enter to add)</label>
                                                    <TagInput
                                                        tags={proj.techStack || []}
                                                        onAdd={(tag) => updateProject(idx, 'techStack', [...(proj.techStack || []), tag])}
                                                        onRemove={(tag) => updateProject(idx, 'techStack', (proj.techStack || []).filter(t => t !== tag))}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between items-end mb-1">
                                                    <label className="kn-label mb-0">Description</label>
                                                    <span className={`text-[10px] font-bold ${(proj.description?.length || 0) > 200 ? 'text-red-600' : 'text-gray-400'}`}>
                                                        {proj.description?.length || 0}/200
                                                    </span>
                                                </div>
                                                <textarea
                                                    className="kn-textarea h-24 mb-1"
                                                    placeholder="Short impact-focused description..."
                                                    maxLength={250}
                                                    value={proj.description}
                                                    onChange={(e) => updateProject(idx, 'description', e.target.value)}
                                                />
                                                <BulletGuidance text={proj.description} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skills Section */}
                    <div className="kn-card">
                        <div className="flex justify-between items-center mb-6 border-b pb-2">
                            <h3 className="font-sans font-black uppercase tracking-widest text-sm">Skills & Proficiencies</h3>
                            <button
                                className="kn-btn kn-btn-secondary h-8 py-0 px-3 text-[10px] flex items-center gap-1.5 border-dashed border-red-800/30 text-red-800"
                                onClick={handleSuggest}
                                disabled={isSuggesting}
                            >
                                {isSuggesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                                ✨ Suggest Skills
                            </button>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div>
                                <label className="kn-label flex justify-between items-center mb-3">
                                    <span>Technical Skills ({data.skills.technical.length})</span>
                                    <span className="text-[10px] opacity-40 italic">Languages, Frameworks, Infrastructure</span>
                                </label>
                                <TagInput
                                    tags={data.skills.technical}
                                    onAdd={(tag) => addSkill('technical', tag)}
                                    onRemove={(tag) => removeSkill('technical', tag)}
                                />
                            </div>

                            <div>
                                <label className="kn-label flex justify-between items-center mb-3">
                                    <span>Soft Skills ({data.skills.soft.length})</span>
                                    <span className="text-[10px] opacity-40 italic">Leadership, Communication, Critical Thinking</span>
                                </label>
                                <TagInput
                                    tags={data.skills.soft}
                                    onAdd={(tag) => addSkill('soft', tag)}
                                    onRemove={(tag) => removeSkill('soft', tag)}
                                />
                            </div>

                            <div>
                                <label className="kn-label flex justify-between items-center mb-3">
                                    <span>Tools & Technologies ({data.skills.tools.length})</span>
                                    <span className="text-[10px] opacity-40 italic">Design tools, IDEs, Version Control</span>
                                </label>
                                <TagInput
                                    tags={data.skills.tools}
                                    onAdd={(tag) => addSkill('tools', tag)}
                                    onRemove={(tag) => removeSkill('tools', tag)}
                                />
                            </div>
                        </div>
                    </div>

                </section>

                {/* Right: Live Preview Panel */}
                <aside className="kn-secondary-panel sticky top-32 h-fit">

                    {/* Template Picker */}
                    <div className="mb-6">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Choose Template</label>
                        <div className="template-grid">
                            {[
                                { id: 'classic', label: 'Classic', sketch: 'single' },
                                { id: 'modern', label: 'Modern', sketch: 'two' },
                                { id: 'minimal', label: 'Minimal', sketch: 'clean' }
                            ].map(t => (
                                <div
                                    key={t.id}
                                    className={`template-card ${data.template === t.id ? 'active' : ''}`}
                                    onClick={() => updateTemplate(t.id as any)}
                                >
                                    {data.template === t.id && <div className="checkmark"><Check className="w-3 h-3" /></div>}
                                    <div className="template-thumb">
                                        {t.sketch === 'single' && (
                                            <>
                                                <div className="thumb-header" />
                                                <div className="thumb-line" />
                                                <div className="thumb-line short" />
                                                <div className="thumb-line" style={{ marginTop: '8px', height: '1px' }} />
                                                <div className="thumb-line" />
                                            </>
                                        )}
                                        {t.sketch === 'two' && (
                                            <div className="flex h-full gap-2">
                                                <div className="thumb-sidebar bg-gray-100/50" />
                                                <div className="thumb-content">
                                                    <div className="thumb-line" style={{ height: '8px' }} />
                                                    <div className="thumb-line" />
                                                    <div className="thumb-line short" />
                                                </div>
                                            </div>
                                        )}
                                        {t.sketch === 'clean' && (
                                            <>
                                                <div className="thumb-line" style={{ height: '6px', width: '40%' }} />
                                                <div className="thumb-line" />
                                                <div className="thumb-line" />
                                                <div className="thumb-line" />
                                            </>
                                        )}
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-tighter mt-1 block text-center">{t.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Color Picker */}
                    <div className="mb-8">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Accent Color</label>
                        <div className="color-picker">
                            {[
                                'hsl(168, 60%, 40%)',
                                'hsl(220, 60%, 35%)',
                                'hsl(345, 60%, 35%)',
                                'hsl(150, 50%, 30%)',
                                'hsl(0, 0%, 25%)'
                            ].map(color => (
                                <div
                                    key={color}
                                    className={`color-circle ${data.colorTheme === color ? 'active' : ''}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => updateColorTheme(color)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* ATS Score Meter */}
                    <div className="kn-panel-box bg-white mb-6 font-sans" style={{ borderColor: data.colorTheme, borderWidth: '2px', borderStyle: 'solid' }}>
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest" style={{ color: data.colorTheme }}>
                                <ShieldCheck className="w-5 h-5" />
                                <span>ATS Readiness</span>
                            </div>
                            <span className="text-2xl font-black tracking-tighter" style={{ color: data.colorTheme }}>{score}%</span>
                        </div>

                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-6">
                            <div className="h-full transition-all duration-500 ease-in-out" style={{ width: `${score}%`, backgroundColor: data.colorTheme }} />
                        </div>

                        {suggestions.length > 0 && (
                            <div className="flex flex-col gap-3">
                                <label className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-black">Top 3 Improvements</label>
                                {suggestions.map((s, i) => (
                                    <div key={i} className="flex gap-2 text-[11px] leading-tight text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 shadow-sm animate-in fade-in slide-in-from-left-2 transition-all">
                                        <AlertCircle className="w-3.5 h-3.5 text-red-800 shrink-0" />
                                        <span>{s}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Live Snapshot Preview */}
                    <div className="kn-panel-box min-h-[500px] flex flex-col p-8 bg-white shadow-xl font-serif border border-gray-200">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl m-0 uppercase tracking-tighter font-black">{data.personalInfo.fullName || 'YOUR NAME'}</h2>
                            <div className="text-[9px] opacity-50 flex flex-wrap justify-center gap-x-3 gap-y-1 mt-3 font-sans font-bold uppercase tracking-widest">
                                {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                                {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                                {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
                            </div>
                        </div>

                        {data.skills.technical.length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-[10px] uppercase tracking-widest mb-3 pb-1 font-sans font-black" style={{ borderBottom: `1px solid ${data.colorTheme}` }}>Skills</h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {[...data.skills.technical, ...data.skills.soft, ...data.skills.tools].slice(0, 12).map((s, i) => (
                                        <span key={i} className="text-[8px] bg-gray-100 px-2 py-0.5 rounded font-sans font-bold uppercase tracking-tighter">{s}</span>
                                    ))}
                                    {([...data.skills.technical, ...data.skills.soft, ...data.skills.tools].length > 12) && <span className="text-[8px] opacity-30 font-sans">+{([...data.skills.technical, ...data.skills.soft, ...data.skills.tools].length - 12)} more</span>}
                                </div>
                            </div>
                        )}

                        {data.projects.length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-[10px] uppercase tracking-widest mb-3 pb-1 font-sans font-black" style={{ borderBottom: `1px solid ${data.colorTheme}` }}>Latest Project</h4>
                                {data.projects.slice(0, 1).map((proj, idx) => (
                                    <div key={idx} className="bg-gray-50/50 p-4 rounded-lg border border-gray-100">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[11px] font-bold">{proj.name || 'Untitled Project'}</span>
                                            <div className="flex gap-2">
                                                {proj.githubUrl && <Github className="w-3 h-3 opacity-40" />}
                                                {proj.liveUrl && <ExternalLink className="w-3 h-3 opacity-40" />}
                                            </div>
                                        </div>
                                        <p className="text-[10px] opacity-70 leading-relaxed italic mb-3">"{proj.description || 'No description provided.'}"</p>
                                        <div className="flex flex-wrap gap-1">
                                            {proj.techStack?.slice(0, 4).map((tech, i) => (
                                                <span key={i} className="text-[7px] bg-white border border-gray-200 px-1.5 py-0.5 rounded uppercase font-black">{tech}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-auto pt-6 text-[8px] text-center opacity-30 italic font-sans uppercase tracking-[0.2em] font-bold">
                            Live Content Stream — Template: {data.template}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};
