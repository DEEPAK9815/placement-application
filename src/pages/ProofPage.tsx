import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CheckCircle, Copy, Award, Loader2 } from 'lucide-react';
import { useProjectStatus } from '../hooks/useProjectStatus';

const CONSTRUCTION_STEPS = [
    { id: 'step-setup', label: 'Project Setup & Dependencies' },
    { id: 'step-landing', label: 'Landing Page Implementation' },
    { id: 'step-routing', label: 'Dashboard Routing & Layout' },
    { id: 'step-analysis-logic', label: 'Analysis Engine Logic' },
    { id: 'step-results-ui', label: 'Interactive Results UI' },
    { id: 'step-hardening', label: 'Validation & Hardening' },
    { id: 'step-testing', label: 'Qualtiy Assurance Testing' }, // Typo intentional to match user feeling ;) Fixed: Quality
    { id: 'step-deployment', label: 'Deployment & Final Polish' }
];

export const ProofPage = () => {
    const { status, completion } = useProjectStatus();
    const [stepsStatus, setStepsStatus] = useState<Record<string, boolean>>({});

    // Artifact State
    const [links, setLinks] = useState({
        lovableUrl: '',
        githubUrl: '',
        deployedUrl: ''
    });

    const [errors, setErrors] = useState({
        lovableUrl: '',
        githubUrl: '',
        deployedUrl: ''
    });

    useEffect(() => {
        // Load Steps
        const savedSteps = localStorage.getItem('prp_steps_status');
        if (savedSteps) setStepsStatus(JSON.parse(savedSteps));

        // Load Links
        const savedLinks = localStorage.getItem('prp_final_submission');
        if (savedLinks) setLinks(JSON.parse(savedLinks));
    }, []);

    const updateStatus = () => {
        // Trigger custom event for hook update
        window.dispatchEvent(new Event('prp-status-change'));
    };

    const handleStepToggle = (id: string) => {
        const updated = { ...stepsStatus, [id]: !stepsStatus[id] };
        setStepsStatus(updated);
        localStorage.setItem('prp_steps_status', JSON.stringify(updated));
        updateStatus();
    };

    const validateUrl = (url: string) => {
        if (!url) return "URL is required";
        try {
            new URL(url);
            return "";
        } catch (_) {
            return "Invalid URL format";
        }
    };

    const handleLinkChange = (field: keyof typeof links, value: string) => {
        setLinks(prev => {
            const updated = { ...prev, [field]: value };
            // Save immediately? Or on blur? Let's save on valid change or effect.
            // Actually, let's persist everything to let user return
            localStorage.setItem('prp_final_submission', JSON.stringify(updated));
            updateStatus();
            return updated;
        });

        // Clear error if valid
        if (validateUrl(value) === "") {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const handleBlur = (field: keyof typeof links) => {
        const error = validateUrl(links[field]);
        setErrors(prev => ({ ...prev, [field]: error }));
    };

    const copyFinalSubmission = () => {
        const text = `
------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${links.lovableUrl}
GitHub Repository: ${links.githubUrl}
Live Deployment: ${links.deployedUrl}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------
`;
        navigator.clipboard.writeText(text.trim());
        alert("Submission copied to clipboard!");
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">

            {/* Header Section */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-serif font-bold text-gray-900">Proof of Work</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Validate your build. Submit your artifacts. Ship your product.
                </p>

                {/* Status Badge */}
                <div className={`inline-flex items-center px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-sm border ${status === 'Shipped'
                    ? 'bg-green-100 text-green-700 border-green-200'
                    : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}>
                    {status === 'Shipped' ? <Award className="w-5 h-5 mr-2" /> : <Loader2 className="w-4 h-4 mr-2 animate-spin-slow" />}
                    Project Status: {status}
                </div>
            </div>

            {/* Shipped Celebration */}
            {status === 'Shipped' && (
                <Card className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white border-0 p-8 text-center shadow-xl transform hover:scale-[1.01] transition-transform">
                    <h2 className="text-3xl font-bold mb-4 font-serif">You built a real product.</h2>
                    <p className="text-lg text-indigo-100 max-w-2xl mx-auto leading-relaxed">
                        Not a tutorial. Not a clone. A structured tool that solves a real problem.
                        <br />
                        <span className="font-semibold text-white mt-4 block">This is your proof of work.</span>
                    </p>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Requirements */}
                <div className="space-y-8">
                    {/* Step 1: Construction Steps */}
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-800">1. Construction Steps</h3>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{completion.steps}/8</span>
                        </div>
                        <div className="space-y-3">
                            {CONSTRUCTION_STEPS.map(step => (
                                <label key={step.id} className="flex items-center space-x-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${stepsStatus[step.id] ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 group-hover:border-indigo-400'
                                        }`}>
                                        {stepsStatus[step.id] && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={!!stepsStatus[step.id]}
                                        onChange={() => handleStepToggle(step.id)}
                                        className="hidden"
                                    />
                                    <span className={`text-sm ${stepsStatus[step.id] ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                                        {step.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </Card>

                    {/* Step 2: Quality Assurance */}
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-800">2. Quality Assurance</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${completion.tests === 10 ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'}`}>
                                {completion.tests}/10 Passed
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            All 10 validation tests must pass in the Test Checklist.
                        </p>
                        <Button variant="outline" className="w-full text-sm" onClick={() => window.location.href = '/prp/07-test'}>
                            Go to Test Checklist
                        </Button>
                    </Card>
                </div>

                {/* Right Column: Artifacts & Export */}
                <div className="space-y-8">
                    {/* Step 3: Project Artifacts */}
                    <Card className="p-6">
                        <h3 className="font-bold text-gray-800 mb-6">3. Project Artifacts</h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Lovable Project Link</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="https://lovable.dev/..."
                                        value={links.lovableUrl}
                                        onChange={(e) => handleLinkChange('lovableUrl', e.target.value)}
                                        onBlur={() => handleBlur('lovableUrl')}
                                        className={`w-full p-2 pl-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.lovableUrl ? 'border-red-300' : 'border-gray-200'}`}
                                    />
                                </div>
                                {errors.lovableUrl && <p className="text-xs text-red-500">{errors.lovableUrl}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">GitHub Repository</label>
                                <input
                                    type="text"
                                    placeholder="https://github.com/..."
                                    value={links.githubUrl}
                                    onChange={(e) => handleLinkChange('githubUrl', e.target.value)}
                                    onBlur={() => handleBlur('githubUrl')}
                                    className={`w-full p-2 pl-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.githubUrl ? 'border-red-300' : 'border-gray-200'}`}
                                />
                                {errors.githubUrl && <p className="text-xs text-red-500">{errors.githubUrl}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Deployed URL</label>
                                <input
                                    type="text"
                                    placeholder="https://"
                                    value={links.deployedUrl}
                                    onChange={(e) => handleLinkChange('deployedUrl', e.target.value)}
                                    onBlur={() => handleBlur('deployedUrl')}
                                    className={`w-full p-2 pl-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.deployedUrl ? 'border-red-300' : 'border-gray-200'}`}
                                />
                                {errors.deployedUrl && <p className="text-xs text-red-500">{errors.deployedUrl}</p>}
                            </div>
                        </div>
                    </Card>

                    {/* Final Submission */}
                    <div className="pt-4">
                        <Button
                            className={`w-full h-12 text-lg shadow-lg transition-all ${status === 'Shipped'
                                ? 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200'
                                : 'bg-gray-300 cursor-not-allowed'
                                }`}
                            onClick={status === 'Shipped' ? copyFinalSubmission : undefined}
                            disabled={status !== 'Shipped'}
                        >
                            <Copy className="w-5 h-5 mr-2" />
                            Copy Final Submission
                        </Button>
                        {status !== 'Shipped' && (
                            <p className="text-center text-xs text-gray-400 mt-3">
                                Complete all steps, pass all tests, and add all links to unlock submission.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
