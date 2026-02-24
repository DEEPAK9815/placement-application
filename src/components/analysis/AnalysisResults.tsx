import React, { useState, useEffect } from 'react';
import { updateAnalysis, type AnalysisResult } from '../../lib/analysis';
import { Card } from '../ui/Card';
import { Calendar, Target, HelpCircle, ArrowLeft, Check, Copy, Download, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface AnalysisResultsProps {
    result: AnalysisResult;
    onBack: () => void;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, onBack }) => {
    const [confidenceMap, setConfidenceMap] = useState<Record<string, 'know' | 'practice'>>(
        result.skillConfidenceMap || {}
    );
    // Use finalScore if available, otherwise readinessScore (backward compat)
    const [currentScore, setCurrentScore] = useState(result.finalScore !== undefined ? result.finalScore : result.readinessScore);
    const [baseScore] = useState(result.baseScore || result.readinessScore);

    useEffect(() => {
        // Recalculate score based on confidence
        let adjustment = 0;
        Object.values(confidenceMap).forEach(status => {
            if (status === 'know') adjustment += 2;
            else if (status === 'practice') adjustment -= 2;
        });

        // Clamp between 0 and 100
        const newScore = Math.min(100, Math.max(0, baseScore + adjustment));
        setCurrentScore(newScore);

        // Persist changes
        const updatedResult = {
            ...result,
            skillConfidenceMap: confidenceMap,
            finalScore: newScore, // Update finalScore
            readinessScore: newScore, // Keep legacy field in sync
            baseScore // Ensure baseScore is preserved
        };
        updateAnalysis(updatedResult);
    }, [confidenceMap, baseScore, result.id]); // Removed result object from dependency to avoid loops, used result.id instead

    const toggleSkill = (skill: string) => {
        setConfidenceMap(prev => {
            const current = prev[skill] || 'practice';
            return { ...prev, [skill]: current === 'know' ? 'practice' : 'know' };
        });
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add a toast here
    };

    const downloadTxt = () => {
        const content = `
Job Analysis Report
Role: ${result.role}
Company: ${result.company}
Readiness Score: ${currentScore}/100

-- Top Skills --
${Object.entries(result.extractedSkills).map(([cat, skills]) => `${cat}: ${skills.join(', ')}`).join('\n')}

-- 7-Day Study Plan --
${result.plan.map(d => `Day ${d.day}: ${d.focus}\n- ${d.activities.join('\n- ')}`).join('\n\n')}

-- Interview Checklist --
${result.checklist.map(r => `${r.round}\n- ${r.items.join('\n- ')}`).join('\n\n')}

-- Top 10 Questions --
${result.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}
        `;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analysis-${result.role.replace(/\s+/g, '-')}.txt`;
        a.click();
    };

    // Identify weak skills for "Action Next"
    const practiceSkills = Object.keys(confidenceMap).filter(s => confidenceMap[s] === 'practice');
    const topWeakSkills = practiceSkills.slice(0, 3);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            <Button variant="ghost" className="mb-4 pl-0 hover:pl-2 transition-all" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Analysis
            </Button>

            <div className="flex gap-6 items-stretch">
                {/* Score Card */}
                <Card className="w-1/3 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
                    <div className="relative">
                        <svg className="w-40 h-40 transform -rotate-90">
                            <circle
                                cx="80"
                                cy="80"
                                r="70"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="transparent"
                                className="text-gray-200"
                            />
                            <circle
                                cx="80"
                                cy="80"
                                r="70"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="transparent"
                                strokeDasharray={440}
                                strokeDashoffset={440 - (440 * currentScore) / 100}
                                className={cn(
                                    "transition-all duration-1000 ease-out",
                                    currentScore >= 70 ? "text-green-500" :
                                        currentScore >= 40 ? "text-yellow-500" : "text-red-500"
                                )}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-4xl font-bold">{Math.round(currentScore)}</span>
                            <span className="text-xs text-gray-500 uppercase tracking-wider">Score</span>
                        </div>
                    </div>
                </Card>

                {/* Key Skills & Company Intel */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* Company Intel Card */}
                    {result.companyIntel && (
                        <Card className="p-6 bg-gradient-to-r from-slate-50 to-white border-slate-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-bold text-xl text-slate-800">{result.companyIntel.name}</h3>
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-full text-xs font-medium border",
                                            result.companyIntel.size === 'Enterprise' ? "bg-purple-100 text-purple-700 border-purple-200" :
                                                result.companyIntel.size === 'Mid-size' ? "bg-blue-100 text-blue-700 border-blue-200" :
                                                    "bg-orange-100 text-orange-700 border-orange-200"
                                        )}>
                                            {result.companyIntel.size}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 mb-3">{result.companyIntel.description}</p>
                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        <Target className="w-4 h-4" />
                                        Hiring Focus: <span className="text-indigo-600">{result.companyIntel.focus}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    <Card className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Target className="w-5 h-5 text-indigo-600" />
                                Key Skills Extracted
                            </h3>
                            <div className="flex gap-2">
                                <Button variant="outline" className="h-8 text-xs" onClick={downloadTxt}>
                                    <Download className="w-3 h-3 mr-1" /> TXT
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {Object.entries(result.extractedSkills).map(([category, skills]) => (
                                skills.length > 0 && (
                                    <div key={category}>
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{category}</span>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {skills.map(skill => (
                                                <button
                                                    key={skill}
                                                    onClick={() => toggleSkill(skill)}
                                                    className={cn(
                                                        "px-3 py-1 rounded-full text-sm border transition-all duration-200",
                                                        confidenceMap[skill] === 'know'
                                                            ? "bg-green-100 border-green-200 text-green-700 hover:bg-green-200"
                                                            : "bg-red-50 border-red-100 text-red-600 hover:bg-red-100"
                                                    )}
                                                    title={confidenceMap[skill] === 'know' ? "Stats: I know this (+2)" : "Stats: Need practice (-2)"}
                                                >
                                                    {skill}
                                                    {confidenceMap[skill] === 'know' ? <Check className="w-3 h-3 inline ml-1" /> : null}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Action Next Box */}
            <div className="bg-indigo-900 text-white rounded-xl p-6 flex justify-between items-center shadow-lg">
                <div>
                    <h4 className="flex items-center gap-2 font-semibold text-lg mb-1">
                        <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        Action Next
                    </h4>
                    <p className="text-indigo-200 text-sm">
                        {topWeakSkills.length > 0
                            ? `Focus on: ${topWeakSkills.join(', ')}`
                            : "You're doing great! Ready for mock interviews?"}
                    </p>
                </div>
                <Button className="bg-white text-indigo-900 hover:bg-indigo-50">
                    Start Day 1 Plan Now
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 7-Day Plan */}
                <Card className="p-6 h-fit">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-indigo-600" />
                            7-Day Study Plan
                        </h3>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(JSON.stringify(result.plan, null, 2))}>
                            <Copy className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="relative border-l-2 border-indigo-100 ml-3 space-y-8">
                        {result.plan.map((day) => (
                            <div key={day.day} className="relative pl-6">
                                <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-indigo-600"></span>
                                <h4 className="font-medium text-gray-900">Day {day.day}: {day.focus}</h4>
                                <ul className="mt-2 space-y-1">
                                    {day.activities.map((activity, i) => (
                                        <li key={i} className="text-sm text-gray-600">• {activity}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Round Mapping & Questions */}
                <div className="space-y-6">
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Target className="w-5 h-5 text-indigo-600" />
                                {result.roundFlow ? "Projected Round Flow" : "Round Checklist"}
                            </h3>
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(JSON.stringify(result.roundFlow || result.checklist, null, 2))}>
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>

                        {result.roundFlow ? (
                            <div className="space-y-0">
                                {result.roundFlow.map((round, i) => (
                                    <div key={i} className="relative pl-8 pb-8 last:pb-0 border-l border-indigo-100 last:border-0">
                                        <div className="absolute -left-3 top-0 flex items-center justify-center w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-600">
                                            {round.order}
                                        </div>
                                        <div>
                                            <h5 className="font-semibold text-gray-900">{round.title}</h5>
                                            <p className="text-sm text-gray-600 mt-1">{round.description}</p>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">
                                                    Focus: {round.focus}
                                                </span>
                                            </div>
                                            <p className="mt-2 text-xs text-gray-500 italic">
                                                "Why: {round.whyItMatters}"
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {result.checklist.map((round, i) => (
                                    <div key={i} className="bg-gray-50 p-3 rounded-lg">
                                        <h5 className="font-medium text-gray-800 text-sm mb-2">{round.round}</h5>
                                        <div className="flex flex-wrap gap-2">
                                            {round.items.map((item, j) => (
                                                <span key={j} className="text-xs bg-white px-2 py-1 rounded border border-gray-200 text-gray-600">
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-indigo-600" />
                                Likely Interview Questions
                            </h3>
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.questions.join('\n'))}>
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                        <ul className="space-y-3">
                            {result.questions.map((q, i) => (
                                <li key={i} className="flex gap-3 text-sm text-gray-700">
                                    <span className="font-mono text-indigo-400 font-bold shrink-0">{i + 1}.</span>
                                    {q}
                                </li>
                            ))}
                        </ul>
                    </Card>

                    {/* Disclaimer */}
                    <p className="text-center text-xs text-gray-400 mt-4">
                        Demo Mode: Company intel generated heuristically.
                    </p>
                </div>
            </div>
        </div>
    );
};
