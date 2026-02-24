
import { Link } from 'react-router-dom';
import { Codesandbox, MonitorPlay, TrendingUp, Github, Linkedin, Twitter } from 'lucide-react';
import { Button } from '../components/ui/Button';

// Placeholder components for the Landing Page
const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4 text-indigo-600">
            <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
);

export const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto text-center">
                <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 tracking-tight text-indigo-950">
                    Ace Your Placement
                </h1>
                <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Practice, assess, and prepare for your dream job with industry-standard coding challenges and mock interviews.
                </p>
                <Link to="/dashboard">
                    <Button className="px-8 py-3 text-lg h-auto shadow-lg shadow-indigo-200">
                        Get Started
                    </Button>
                </Link>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-gray-50 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={Codesandbox}
                            title="Practice Problems"
                            description="Solve 500+ curated algorithmic challenges from top tech interviews."
                        />
                        <FeatureCard
                            icon={MonitorPlay}
                            title="Mock Interviews"
                            description="Real-time peer-to-peer interviews with video and collaborative coding."
                        />
                        <FeatureCard
                            icon={TrendingUp}
                            title="Track Progress"
                            description="Detailed analytics dashboard to visualize your growth and weak spots."
                        />
                    </div>
                </div>
            </section>

            {/* Additional Tools Section */}
            <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-serif font-bold text-indigo-950 mb-4">Built-in Career Tools</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">Everything you need to go from preparation to placement, all in one platform.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="bg-indigo-900 text-white p-10 rounded-2xl shadow-2xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold mb-4">AI Resume Builder</h3>
                            <p className="text-indigo-100 mb-8 max-w-md">Build a professional, ATS-optimized resume in minutes with our AI-powered editor.</p>
                            <Link to="/resume-builder">
                                <Button className="bg-white text-indigo-900 hover:bg-indigo-50 border-white shadow-none">Open Resume Builder</Button>
                            </Link>
                        </div>
                        <div className="absolute top-0 right-0 p-8 opacity-10 transform group-hover:scale-110 transition-transform">
                            <Codesandbox className="w-48 h-48" />
                        </div>
                    </div>
                    <div className="bg-emerald-900 text-white p-10 rounded-2xl shadow-2xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold mb-4">Job Notification Tracker</h3>
                            <p className="text-emerald-100 mb-8 max-w-md">Never miss an opportunity. Track your applications and get daily curated job matches.</p>
                            <Link to="/job-tracker">
                                <Button className="bg-white text-emerald-900 hover:bg-emerald-50 border-white shadow-none">Open Job Tracker</Button>
                            </Link>
                        </div>
                        <div className="absolute top-0 right-0 p-8 opacity-10 transform group-hover:scale-110 transition-transform">
                            <MonitorPlay className="w-48 h-48" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12 px-4 md:px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <span className="text-white font-serif font-bold text-xl">Placement Prep</span>
                        <p className="text-sm mt-2">© 2026 All rights reserved.</p>
                    </div>
                    <div className="flex space-x-6">
                        <Github className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                        <Linkedin className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                        <Twitter className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                    </div>
                </div>
            </footer>
        </div>
    );
};
