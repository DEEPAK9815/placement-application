import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { analyzeJobDescription } from '../../lib/analysis';

interface AnalysisFormProps {
    onAnalyze: (result: any) => void;
}

export const AnalysisForm: React.FC<AnalysisFormProps> = ({ onAnalyze }) => {
    const [jdText, setJdText] = useState('');
    const [role, setRole] = useState('');
    const [company, setCompany] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showWarning, setShowWarning] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (jdText.length < 50) return; // Hard block for very short text

        if (jdText.length < 200 && !showWarning) {
            setShowWarning(true);
            return;
        }

        setIsAnalyzing(true);
        setShowWarning(false);

        // Simulating a brief delay for UX
        setTimeout(() => {
            const result = analyzeJobDescription(jdText, role, company);
            onAnalyze(result);
            setIsAnalyzing(false);
        }, 800);
    };

    return (
        <Card title="Analyze Job Description" className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Role / Job Title</label>
                        <input
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="e.g. Senior React Developer"
                            className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Company (Optional)</label>
                        <input
                            type="text"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="e.g. Google"
                            className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Paste Job Description <span className="text-red-500">*</span></label>
                    <textarea
                        value={jdText}
                        onChange={(e) => {
                            setJdText(e.target.value);
                            if (showWarning && e.target.value.length >= 200) setShowWarning(false);
                        }}
                        placeholder="Paste the full JD here..."
                        rows={8}
                        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-y ${showWarning ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'}`}
                        required
                    />
                    <div className="flex justify-between items-start">
                        {showWarning ? (
                            <p className="text-sm text-yellow-600">
                                ⚠️ This JD is too short to analyze deeply. Paste full JD for better output.
                                <button type="button" onClick={() => setShowWarning(false)} className="ml-2 underline hover:text-yellow-700">Ignore</button>
                            </p>
                        ) : (
                            <span></span>
                        )}
                        <p className={`text-xs text-right ${jdText.length < 50 ? 'text-red-400' : 'text-gray-500'}`}>
                            {jdText.length} characters
                        </p>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button type="submit" isLoading={isAnalyzing} disabled={jdText.length < 10}>
                        {showWarning ? "Analyze Anyway" : "Analyze JD"}
                    </Button>
                </div>
            </form>
        </Card>
    );
};
