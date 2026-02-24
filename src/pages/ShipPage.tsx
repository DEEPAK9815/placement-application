import { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Lock, Rocket, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ShipPage = () => {
    const [isLocked, setIsLocked] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem('prp_test_checklist');
        if (saved) {
            try {
                const checkedItems = JSON.parse(saved);
                const passedCount = Object.values(checkedItems).filter(Boolean).length;
                setIsLocked(passedCount < 10);
            } catch (e) {
                setIsLocked(true);
            }
        } else {
            setIsLocked(true);
        }
    }, []);

    if (isLocked) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                    <Lock className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-serif font-bold text-gray-900">Shipment Locked</h1>
                <div className="max-w-md mx-auto">
                    <p className="text-gray-600 mb-6">
                        You cannot ship the product until all 10 quality assurance tests are passed.
                        Compliance with quality standards is mandatory.
                    </p>
                    <Link to="/prp/07-test">
                        <Button className="w-full">
                            Go to Test Checklist
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center justify-center p-4 bg-green-100 text-green-600 rounded-full mb-4">
                <Rocket className="w-12 h-12" />
            </div>

            <h1 className="text-4xl font-serif font-bold text-gray-900">
                Placement Readiness Platform<br />
                <span className="text-indigo-600">Shipped Successfully!</span>
            </h1>

            <Card className="p-8 bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Deployment Manifest</h2>
                <div className="text-left space-y-4 text-gray-700">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Core Analysis Engine (v1.2.0)</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Interactive Dashboard & Analytics</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Company Intel & Round Heuristics</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Strict Validation & Hardening</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Quality Assurance Verified (10/10 Tests)</span>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-indigo-100">
                    <p className="text-sm text-gray-500">
                        Project ID: PRP-2026-X1 • Deployed via Antigravity
                    </p>
                </div>
            </Card>

            <Link to="/dashboard">
                <Button variant="outline" className="mt-8">
                    Return to Dashboard
                </Button>
            </Link>
        </div>
    );
};
