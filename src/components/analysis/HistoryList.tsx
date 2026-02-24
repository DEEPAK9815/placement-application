import React from 'react';
import type { AnalysisResult } from '../../lib/analysis';
import { Clock, ArrowRight } from 'lucide-react';

interface HistoryListProps {
    history: AnalysisResult[];
    onSelect: (result: AnalysisResult) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect }) => {
    if (history.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No History Yet</h3>
                <p className="text-gray-500">Analyze a job description to see it here.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {history.map((item) => (
                <div
                    key={item.id}
                    onClick={() => onSelect(item)}
                    className="group bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-[var(--color-accent)] transition-all cursor-pointer relative"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h4 className="font-bold text-[var(--color-primary)] line-clamp-1">{item.role || 'Unknown Role'}</h4>
                            <p className="text-xs text-gray-500">{item.company || 'Unknown Company'}</p>
                        </div>
                        <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-bold ${item.readinessScore > 70 ? 'bg-green-100 text-green-700' :
                            item.readinessScore > 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                            }`}>
                            {item.readinessScore}%
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3 h-6 overflow-hidden">
                        {Object.values(item.extractedSkills).flat().slice(0, 3).map((skill, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                                {skill}
                            </span>
                        ))}
                        {Object.values(item.extractedSkills).flat().length > 3 && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-gray-50 text-gray-400 rounded">...</span>
                        )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400 mt-2 pt-2 border-t border-gray-50 group-hover:border-gray-100">
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        <ArrowRight className="w-3 h-3 group-hover:text-[var(--color-accent)] transition-colors" />
                    </div>
                </div>
            ))}
        </div>
    );
};
