import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CheckCircle, AlertTriangle, RefreshCcw, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const TESTS = [
    { id: 'jd-validation', label: 'JD required validation works', hint: 'Try submitting empty JD form.' },
    { id: 'short-jd-warning', label: 'Short JD warning shows for <200 chars', hint: 'Paste a short text and check for yellow warning.' },
    { id: 'skills-grouping', label: 'Skills extraction groups correctly', hint: 'Verify skills appear in correct categories (Web, Data, etc.).' },
    { id: 'round-mapping', label: 'Round mapping changes based on company + skills', hint: 'Compare "Google" (DSA) vs "Startup" (Dev) outputs.' },
    { id: 'deterministic-score', label: 'Score calculation is deterministic', hint: 'Same input should always give same score.' },
    { id: 'skill-toggles', label: 'Skill toggles update score live', hint: 'Click skills and watch score change.' },
    { id: 'refresh-persistence', label: 'Changes persist after refresh', hint: 'Reload page and check if state is restored.' },
    { id: 'history-save', label: 'History saves and loads correctly', hint: 'Check the History tab for past analyses.' },
    { id: 'export-content', label: 'Export buttons copy the correct content', hint: 'Test "Copy Plan" and "Download TXT".' },
    { id: 'no-console-errors', label: 'No console errors on core pages', hint: 'Open DevTools and check Console.' }
];

export const TestChecklist = () => {
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const saved = localStorage.getItem('prp_test_checklist');
        if (saved) {
            try {
                setCheckedItems(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse checklist", e);
            }
        }
    }, []);

    const handleToggle = (id: string) => {
        const updated = { ...checkedItems, [id]: !checkedItems[id] };
        setCheckedItems(updated);
        localStorage.setItem('prp_test_checklist', JSON.stringify(updated));
    };

    const handleReset = () => {
        if (confirm('Are you sure you want to reset the checklist?')) {
            setCheckedItems({});
            localStorage.removeItem('prp_test_checklist');
        }
    };

    const passedCount = TESTS.filter(t => checkedItems[t.id]).length;
    const allPassed = passedCount === TESTS.length;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Pre-Shipment Testing</h1>
                    <p className="text-gray-500 mt-1">Verify all features before shipping.</p>
                </div>
                <Button variant="outline" onClick={handleReset} className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200">
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Reset Checklist
                </Button>
            </div>

            <Card className={`p-6 border-l-4 ${allPassed ? 'border-l-green-500 bg-green-50' : 'border-l-yellow-500 bg-yellow-50'}`}>
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${allPassed ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                        {allPassed ? <CheckCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            Tests Passed: {passedCount} / {TESTS.length}
                        </h2>
                        <p className="text-gray-600">
                            {allPassed
                                ? "All systems go! You are ready to ship."
                                : "Please fix issues and verify all items before shipping."}
                        </p>
                    </div>
                    {allPassed && (
                        <div className="ml-auto">
                            <Link to="/prp/08-ship">
                                <Button className="bg-green-600 hover:bg-green-700 text-white">
                                    Proceed to Ship
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {TESTS.map((test) => (
                    <div
                        key={test.id}
                        onClick={() => handleToggle(test.id)}
                        className={`p-4 rounded-xl border border-gray-200 cursor-pointer transition-all duration-200 flex items-start gap-4 hover:shadow-md ${checkedItems[test.id] ? 'bg-indigo-50 border-indigo-200' : 'bg-white'}`}
                    >
                        <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors ${checkedItems[test.id] ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 bg-white'}`}>
                            {checkedItems[test.id] && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <div>
                            <h3 className={`font-semibold ${checkedItems[test.id] ? 'text-indigo-900' : 'text-gray-700'}`}>
                                {test.label}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">{test.hint}</p>
                        </div>
                    </div>
                ))}
            </div>

            {!allPassed && (
                <div className="flex justify-center mt-8">
                    <span className="flex items-center text-gray-400 gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm">
                        <Lock className="w-4 h-4" />
                        Shipping Locked until all tests pass
                    </span>
                </div>
            )}
        </div>
    );
};
