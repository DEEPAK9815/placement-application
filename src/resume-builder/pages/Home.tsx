import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield } from 'lucide-react';
import '../index.css';

export const Home: React.FC = () => {
    return (
        <div className="kn-page flex flex-col items-center justify-center text-center py-20">
            <div className="kn-context-header">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-red-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                        <Shield className="w-8 h-8" />
                    </div>
                </div>
                <h1>Build a Resume That Gets Read.</h1>
                <p className="mx-auto">
                    Elevate your professional narrative with our AI-powered builder,
                    designed for clarity, impact, and standard-compliant excellence.
                </p>
            </div>

            <div className="mt-12 flex flex-col items-center gap-6">
                <Link to="/builder" className="kn-btn kn-btn-primary px-10 py-5 text-lg">
                    Start Building
                    <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">Trusted by KodNest Premium Systems</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl px-6">
                <div className="kn-card">
                    <h3 className="text-xl mb-2">Clean Aesthetics</h3>
                    <p className="text-sm opacity-70">Minimalist layouts that prioritize readability and professional confidence.</p>
                </div>
                <div className="kn-card">
                    <h3 className="text-xl mb-2">AI Optimization</h3>
                    <p className="text-sm opacity-70">Intelligent content analysis to ensure your summary and experience stand out.</p>
                </div>
                <div className="kn-card">
                    <h3 className="text-xl mb-2">ATS Ready</h3>
                    <p className="text-sm opacity-70">Engineered to pass through applicant tracking systems with zero friction.</p>
                </div>
            </div>
        </div>
    );
};
