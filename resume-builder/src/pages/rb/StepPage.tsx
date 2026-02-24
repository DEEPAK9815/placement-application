import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, ExternalLink, Check, AlertCircle, Upload } from 'lucide-react';

interface StepPageProps {
    step: number;
    title: string;
    description: string;
    prompt: string;
    nextPath: string;
}

export const StepPage: React.FC<StepPageProps> = ({ step, title, description, prompt, nextPath }) => {
    const navigate = useNavigate();
    const artifactKey = `rb_step_${step}_artifact`;
    const [artifact, setArtifact] = useState<string>(localStorage.getItem(artifactKey) || '');
    const [isCopied, setIsCopied] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [isUploaded, setIsUploaded] = useState(!!localStorage.getItem(artifactKey));

    // Gating logic: check if previous step is completed
    useEffect(() => {
        if (step > 1) {
            const prevStepKey = `rb_step_${step - 1}_artifact`;
            if (!localStorage.getItem(prevStepKey)) {
                navigate(`/rb/0${step - 1}-` + getStepSlug(step - 1));
            }
        }
    }, [step, navigate]);

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleArtifactSubmit = () => {
        if (artifact.trim()) {
            localStorage.setItem(artifactKey, artifact);
            setStatus('success');
            setIsUploaded(true);
        } else {
            setStatus('error');
        }
    };

    const isNextDisabled = !isUploaded;

    return (
        <div className="kn-page">
            <div className="kn-context-header">
                <h1>{title}</h1>
                <p>{description}</p>
            </div>

            <div className="kn-content-grid">
                {/* Main Workspace (70%) */}
                <section className="kn-workspace">
                    <div className="kn-card">
                        <h3>Step {step} Artifact</h3>
                        <p className="mb-4">Complete the build in Lovable and paste the resulting artifact or a confirmation message below.</p>

                        <textarea
                            className="kn-textarea"
                            placeholder="Paste artifact content here..."
                            value={artifact}
                            onChange={(e) => setArtifact(e.target.value)}
                        />

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                className="kn-btn kn-btn-primary"
                                onClick={handleArtifactSubmit}
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Artifact
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-8">
                        <button
                            className="kn-btn kn-btn-secondary"
                            onClick={() => navigate(-1)}
                        >
                            Previous
                        </button>
                        <button
                            className="kn-btn kn-btn-primary"
                            disabled={isNextDisabled}
                            onClick={() => navigate(nextPath)}
                        >
                            Next Step
                        </button>
                    </div>
                </section>

                {/* Secondary Build Panel (30%) */}
                <aside className="kn-secondary-panel">
                    <div className="kn-panel-box">
                        <label className="kn-label">Copy This Into Lovable</label>
                        <div className="kn-prompt-box">
                            {prompt}
                        </div>
                        <button
                            className="kn-btn kn-btn-secondary kn-btn-sm kn-btn-full mb-3"
                            onClick={handleCopy}
                        >
                            {isCopied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                            {isCopied ? 'Copied!' : 'Copy Prompt'}
                        </button>

                        <a
                            href="https://lovable.dev"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="kn-btn kn-btn-primary kn-btn-sm kn-btn-full"
                        >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Build in Lovable
                        </a>
                    </div>

                    <div className="kn-panel-box">
                        <label className="kn-label">Build Status</label>
                        <div className="flex flex-col gap-2">
                            <button
                                className={`kn-btn kn-btn-sm kn-btn-full ${status === 'success' ? 'bg-green-100 text-green-800' : 'kn-btn-secondary'}`}
                                onClick={() => setStatus('success')}
                            >
                                <Check className="w-4 h-4 mr-2" />
                                It Worked
                            </button>
                            <button
                                className={`kn-btn kn-btn-sm kn-btn-full ${status === 'error' ? 'bg-red-100 text-red-800' : 'kn-btn-secondary'}`}
                                onClick={() => setStatus('error')}
                            >
                                <AlertCircle className="w-4 h-4 mr-2" />
                                Error
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

function getStepSlug(step: number): string {
    const slugs = [
        '',
        'problem',
        'market',
        'architecture',
        'hld',
        'lld',
        'build',
        'test',
        'ship'
    ];
    return slugs[step] || '';
}
