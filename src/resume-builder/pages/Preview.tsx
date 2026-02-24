import React, { useState } from 'react';
import { useResumeData } from '../hooks/useResumeData';
import { ArrowLeft, Printer, Layout, Copy, AlertTriangle, Check, Github, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Preview: React.FC = () => {
    const { data, score, suggestions, updateTemplate } = useResumeData();
    const [copied, setCopied] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleDownload = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        window.print();
    };

    const templates: Array<{ id: 'classic' | 'modern' | 'minimal'; label: string }> = [
        { id: 'classic', label: 'Classic' },
        { id: 'modern', label: 'Modern' },
        { id: 'minimal', label: 'Minimal' }
    ];

    const hasEducation = data.education.length > 0 && data.education.some(e => e.school);
    const hasExperience = data.experience.length > 0 && data.experience.some(e => e.company);
    const hasProjects = data.projects.length > 0 && data.projects.some(p => p.name);
    const hasSkills = data.skills.technical.length > 0 || data.skills.soft.length > 0 || data.skills.tools.length > 0;

    const isIncomplete = !data.personalInfo.fullName || (!hasExperience && !hasProjects);

    const copyAsText = () => {
        let text = `${data.personalInfo.fullName}\n`;
        text += `${data.personalInfo.email} | ${data.personalInfo.phone} | ${data.personalInfo.location}\n`;
        if (data.personalInfo.github) text += `GitHub: ${data.personalInfo.github}\n`;
        if (data.personalInfo.linkedin) text += `LinkedIn: ${data.personalInfo.linkedin}\n`;

        if (data.summary) {
            text += `\nSUMMARY\n${data.summary}\n`;
        }

        if (hasExperience) {
            text += `\nEXPERIENCE\n`;
            data.experience.forEach(exp => {
                if (exp.company) {
                    text += `${exp.company} - ${exp.role} (${exp.date})\n${exp.description}\n\n`;
                }
            });
        }

        if (hasEducation) {
            text += `EDUCATION\n`;
            data.education.forEach(edu => {
                if (edu.school) {
                    text += `${edu.school} - ${edu.degree} (${edu.date})\n`;
                }
            });
        }

        if (hasProjects) {
            text += `\nPROJECTS\n`;
            data.projects.forEach(proj => {
                if (proj.name) {
                    text += `${proj.name} (Tech: ${proj.techStack.join(', ')})\n${proj.description}\nLinks: ${proj.liveUrl || 'N/A'}, ${proj.githubUrl || 'N/A'}\n\n`;
                }
            });
        }

        if (hasSkills) {
            text += `SKILLS\n`;
            if (data.skills.technical.length) text += `Technical: ${data.skills.technical.join(', ')}\n`;
            if (data.skills.soft.length) text += `Soft Skills: ${data.skills.soft.join(', ')}\n`;
            if (data.skills.tools.length) text += `Tools: ${data.skills.tools.join(', ')}\n`;
        }

        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Template Renderers
    const renderClassic = () => (
        <div className="bg-white w-full max-w-[800px] aspect-[1/1.41] shadow-2xl p-16 font-serif text-black overflow-hidden flex flex-col mx-auto transition-all">
            {/* Header */}
            <div className="text-center mb-10 pb-8" style={{ borderBottom: `2px solid ${data.colorTheme}` }}>
                <h1 className="text-4xl uppercase tracking-tighter mb-4 m-0 font-black" style={{ color: data.colorTheme }}>{data.personalInfo.fullName || 'YOUR NAME'}</h1>
                <div className="flex justify-center gap-6 text-[10px] uppercase tracking-widest font-sans font-bold opacity-60">
                    {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                    {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
                    {data.personalInfo.location && <span>• {data.personalInfo.location}</span>}
                </div>
            </div>

            {/* Summary */}
            {data.summary && (
                <div className="mb-8">
                    <h3 className="text-[11px] font-sans font-black uppercase tracking-widest mb-4 pb-1" style={{ borderBottom: `1px solid ${data.colorTheme}`, color: data.colorTheme }}>Professional Summary</h3>
                    <p className="text-[12px] leading-relaxed italic opacity-90 text-justify">{data.summary}</p>
                </div>
            )}

            {/* Experience */}
            {hasExperience && (
                <div className="mb-8">
                    <h3 className="text-[11px] font-sans font-black uppercase tracking-widest mb-4 pb-1" style={{ borderBottom: `1px solid ${data.colorTheme}`, color: data.colorTheme }}>Experience</h3>
                    {data.experience.map((exp, i) => exp.company && (
                        <div key={i} className="mb-6">
                            <div className="flex justify-between font-bold text-[12px] mb-1 uppercase">
                                <span>{exp.company}</span>
                                <span>{exp.date}</span>
                            </div>
                            <div className="italic text-[11px] mb-2 font-sans font-bold opacity-70">{exp.role}</div>
                            <p className="text-[11px] opacity-80 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Projects */}
            {hasProjects && (
                <div className="mb-8">
                    <h3 className="text-[11px] font-sans font-black uppercase tracking-widest mb-4 pb-1" style={{ borderBottom: `1px solid ${data.colorTheme}`, color: data.colorTheme }}>Projects</h3>
                    {data.projects.map((proj, i) => proj.name && (
                        <div key={i} className="mb-5 last:mb-0">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-[12px] uppercase" style={{ color: data.colorTheme }}>{proj.name}</span>
                                <div className="flex gap-4">
                                    {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-[9px] font-sans font-bold italic underline" style={{ color: data.colorTheme }}>GitHub</a>}
                                    {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-[9px] font-sans font-bold italic underline" style={{ color: data.colorTheme }}>Live Demo</a>}
                                </div>
                            </div>
                            <p className="text-[11px] opacity-80 leading-relaxed mb-2 italic">"{proj.description}"</p>
                            <div className="flex flex-wrap gap-2 text-[9px] font-sans font-black uppercase tracking-tighter opacity-70">
                                {proj.techStack?.map((t, idx) => (
                                    <span key={idx}>{t}{idx < proj.techStack.length - 1 ? ' •' : ''}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Skills */}
            {hasSkills && (
                <div className="mb-8">
                    <h3 className="text-[11px] font-sans font-black uppercase tracking-widest mb-5 pb-1" style={{ borderBottom: `1px solid ${data.colorTheme}`, color: data.colorTheme }}>Skills & Tools</h3>
                    <div className="grid grid-cols-1 gap-6">
                        {Object.entries(data.skills).map(([category, skills]) => skills.length > 0 && (
                            <div key={category} className="flex gap-4 items-start">
                                <span className="text-[9px] font-sans font-black uppercase tracking-widest opacity-40 w-24 shrink-0 mt-1">{category}</span>
                                <div className="flex flex-wrap gap-x-4 gap-y-2">
                                    {skills.map((s, i) => (
                                        <span key={i} className="text-[11px] font-bold">{s}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Simple footer for all */}
            <div className="mt-auto pt-8 border-t border-gray-100 text-[8px] text-center opacity-30 italic font-sans tracking-[0.3em] font-black uppercase">
                AI Resume Builder — Generated by KodNest
            </div>
        </div>
    );

    const renderModern = () => (
        <div className="bg-white w-full max-w-[800px] aspect-[1/1.41] shadow-2xl font-sans text-black overflow-hidden flex mx-auto transition-all">
            {/* Sidebar */}
            <div className="w-[280px] p-12 text-white flex flex-col gap-10 shrink-0" style={{ backgroundColor: data.colorTheme }}>
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight m-0 mb-6 leading-none">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
                    <div className="flex flex-col gap-3 text-[10px] font-bold opacity-80 uppercase tracking-widest">
                        <span className="flex items-center gap-2">{data.personalInfo.email}</span>
                        <span className="flex items-center gap-2">{data.personalInfo.phone}</span>
                        <span className="flex items-center gap-2">{data.personalInfo.location}</span>
                    </div>
                </div>

                {/* Summary Sidebar */}
                {data.summary && (
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-50">Profile</h3>
                        <p className="text-[11px] leading-relaxed opacity-90">{data.summary}</p>
                    </div>
                )}

                {/* Skills Sidebar Grouped */}
                {hasSkills && (
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 opacity-50">Expertise</h3>
                        <div className="flex flex-col gap-6">
                            {Object.entries(data.skills).map(([cat, skills]) => skills.length > 0 && (
                                <div key={cat}>
                                    <label className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-3 block">{cat}</label>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((s, i) => (
                                            <span key={i} className="text-[9px] font-black uppercase bg-white/10 px-2 py-1 rounded">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 p-16 flex flex-col gap-12 overflow-hidden">
                {/* Experience Main */}
                {hasExperience && (
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 pb-2 border-b" style={{ color: data.colorTheme, borderColor: `${data.colorTheme}33` }}>Experience</h3>
                        <div className="flex flex-col gap-8">
                            {data.experience.map((exp, i) => exp.company && (
                                <div key={i} className="relative pl-6 border-l-2" style={{ borderColor: `${data.colorTheme}22` }}>
                                    <div className="absolute w-2 h-2 rounded-full -left-[5px] top-1" style={{ backgroundColor: data.colorTheme }} />
                                    <div className="flex justify-between items-baseline mb-1">
                                        <div className="text-[12px] font-black uppercase tracking-tight">{exp.company}</div>
                                        <div className="text-[9px] font-black text-gray-400 mt-1">{exp.date}</div>
                                    </div>
                                    <div className="text-[10px] font-bold mb-3 uppercase tracking-widest" style={{ color: data.colorTheme }}>{exp.role}</div>
                                    <p className="text-[11px] text-gray-600 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Projects Main */}
                {hasProjects && (
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 pb-2 border-b" style={{ color: data.colorTheme, borderColor: `${data.colorTheme}33` }}>Projects</h3>
                        <div className="flex flex-col gap-6">
                            {data.projects.map((proj, i) => proj.name && (
                                <div key={i} className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-[13px] font-black uppercase text-gray-800 tracking-tight">{proj.name}</div>
                                        <div className="flex gap-3">
                                            {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer"><Github className="w-4 h-4 transition-transform hover:scale-110" style={{ color: data.colorTheme }} /></a>}
                                            {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer"><ExternalLink className="w-4 h-4 transition-transform hover:scale-110" style={{ color: data.colorTheme }} /></a>}
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-gray-600 leading-relaxed italic mb-4">"{proj.description}"</p>
                                    <div className="flex flex-wrap gap-2">
                                        {proj.techStack?.map((tech, idx) => (
                                            <span key={idx} className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded" style={{ color: data.colorTheme, backgroundColor: `${data.colorTheme}11` }}>{tech}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderMinimal = () => (
        <div className="bg-white w-full max-w-[800px] aspect-[1/1.41] shadow-2xl p-20 font-sans text-stone-800 overflow-hidden flex flex-col mx-auto transition-all">
            <div className="mb-20 border-l-[1px] border-stone-200 pl-10" style={{ borderColor: data.colorTheme }}>
                <h1 className="text-4xl font-light tracking-[0.2em] uppercase mb-4 m-0" style={{ color: data.colorTheme }}>{data.personalInfo.fullName || 'YOUR NAME'}</h1>
                <div className="text-[9px] font-bold text-stone-400 space-x-6 uppercase tracking-[0.2em]">
                    <span>{data.personalInfo.email}</span>
                    <span>{data.personalInfo.phone}</span>
                    <span>{data.personalInfo.location}</span>
                </div>
            </div>

            <div className="flex flex-col gap-16">
                {hasExperience && (
                    <section>
                        <h4 className="text-[10px] uppercase tracking-[0.3em] font-black mb-10 text-stone-300">Background</h4>
                        <div className="flex flex-col gap-10">
                            {data.experience.map((exp, i) => exp.company && (
                                <div key={i} className="grid grid-cols-[140px_1fr] gap-10">
                                    <span className="text-[9px] font-black text-stone-300 mt-2 uppercase tracking-widest">{exp.date}</span>
                                    <div>
                                        <div className="text-[14px] font-black mb-1 tracking-tight" style={{ color: data.colorTheme }}>{exp.company}</div>
                                        <div className="text-[11px] italic mb-4 font-bold opacity-60 uppercase tracking-widest">{exp.role}</div>
                                        <p className="text-[11px] text-stone-500 leading-loose font-light">{exp.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {hasProjects && (
                    <section>
                        <h4 className="text-[10px] uppercase tracking-[0.3em] font-black mb-10 text-stone-300">Projects</h4>
                        <div className="grid grid-cols-2 gap-x-12 gap-y-12">
                            {data.projects.map((proj, i) => proj.name && (
                                <div key={i} className="flex flex-col pt-0">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="text-[12px] font-black uppercase tracking-widest" style={{ color: data.colorTheme }}>{proj.name}</div>
                                        <div className="flex gap-4">
                                            {proj.githubUrl && <a href={proj.githubUrl} className="text-stone-300 hover:text-stone-900"><Github className="w-3.5 h-3.5" /></a>}
                                            {proj.liveUrl && <a href={proj.liveUrl} className="text-stone-300 hover:text-stone-900"><ExternalLink className="w-3.5 h-3.5" /></a>}
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-stone-400 leading-relaxed font-light mb-4 italic line-clamp-3">"{proj.description}"</p>
                                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-auto">
                                        {proj.techStack?.map((t, idx) => (
                                            <span key={idx} className="text-[8px] font-black uppercase tracking-widest text-stone-300">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );

    return (
        <div className="kn-page flex flex-col items-center pb-32 transition-all">
            <div className="kn-context-header w-full max-w-4xl flex justify-between items-center mb-12 no-print">
                <div>
                    <h1>Resume Preview</h1>
                    <p>Verified professional high-fidelity output.</p>
                </div>
                <div className="flex gap-4">
                    <Link to="/builder" className="kn-btn kn-btn-secondary">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Editor
                    </Link>
                    <button className="kn-btn kn-btn-primary" onClick={handleDownload}>
                        <Printer className="w-4 h-4 mr-2" />
                        Print / Save as PDF
                    </button>
                </div>
            </div>

            {/* ATS Score & Suggestions Panel */}
            <div className="w-full max-w-4xl mb-12 grid grid-cols-1 md:grid-cols-3 gap-8 no-print animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center shadow-sm">
                    <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="64"
                                cy="64"
                                r="58"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-gray-100"
                            />
                            <circle
                                cx="64"
                                cy="64"
                                r="58"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={364.4}
                                strokeDashoffset={364.4 - (364.4 * score) / 100}
                                strokeLinecap="round"
                                className={`transition-all duration-1000 ease-out ${score <= 40 ? 'text-red-500' :
                                        score <= 70 ? 'text-amber-500' : 'text-green-500'
                                    }`}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black">{score}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Score</span>
                        </div>
                    </div>
                    <div className={`text-sm font-black uppercase tracking-widest ${score <= 40 ? 'text-red-500' :
                            score <= 70 ? 'text-amber-500' : 'text-green-500'
                        }`}>
                        {score <= 40 ? 'Needs Work' :
                            score <= 70 ? 'Getting There' : 'Strong Resume'}
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-8 col-span-2 shadow-sm">
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        Improvement Suggestions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {suggestions.length > 0 ? (
                            suggestions.map((s: string, i: number) => (
                                <div key={i} className="flex gap-3 text-xs leading-relaxed text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100 items-start">
                                    <div className="w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                                        {i + 1}
                                    </div>
                                    <span>{s}</span>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 flex items-center justify-center py-8 text-green-600 font-bold text-sm gap-2">
                                <Check className="w-5 h-5" />
                                Your resume is optimized for ATS!
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Template Selector Tabs */}
            <div className="w-full max-w-4xl px-10 mb-10 no-print">
                <div className="flex items-center gap-4 border-b border-gray-200 bg-white/50 p-1 px-4 rounded-t-lg">
                    <div className="flex items-center gap-2 text-gray-400 mr-4 py-4">
                        <Layout className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-widest">Select Template</span>
                    </div>
                    {templates.map(t => (
                        <button
                            key={t.id}
                            className={`py-4 px-6 text-xs font-black uppercase tracking-[0.15em] transition-all border-b-2 ${data.template === t.id
                                ? 'border-red-800 text-red-800'
                                : 'border-transparent text-gray-400 hover:text-gray-900'
                                }`}
                            onClick={() => updateTemplate(t.id)}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Layout Switcher */}
            <div className="w-full">
                {data.template === 'classic' && renderClassic()}
                {data.template === 'modern' && renderModern()}
                {data.template === 'minimal' && renderMinimal()}
            </div>

            {/* Export Actions & Support */}
            <div className="w-full max-w-4xl mt-12 no-print">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col gap-2">
                        {isIncomplete ? (
                            <div className="flex items-center gap-2 text-amber-700 font-bold text-sm animate-in slide-in-from-left-2">
                                <AlertTriangle className="w-4 h-4" />
                                <span>Your resume may look incomplete. Add your name and at least one experience or project.</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-green-700 font-bold text-sm">
                                <Check className="w-4 h-4" />
                                <span>Resume structure looks solid!</span>
                            </div>
                        )}
                        <p className="text-xs text-gray-400">Finalize your draft by choosing an export format.</p>
                    </div>
                    <div className="flex gap-4 shrink-0">
                        <button className="kn-btn kn-btn-secondary" onClick={copyAsText}>
                            {copied ? (
                                <><Check className="w-4 h-4 mr-2" /> Copied!</>
                            ) : (
                                <><Copy className="w-4 h-4 mr-2" /> Copy as Text</>
                            )}
                        </button>
                        <button className="kn-btn kn-btn-primary" onClick={handleDownload}>
                            <Printer className="w-4 h-4 mr-2" />
                            Print / Save as PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 z-50">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-bold">PDF export ready! Check your downloads.</span>
                </div>
            )}
        </div>
    );
};
