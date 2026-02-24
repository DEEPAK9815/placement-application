import React, { useState } from 'react';

interface ProofItem {
    id: string;
    label: string;
}

const PROOF_ITEMS: ProofItem[] = [
    { id: 'ui', label: 'UI Built' },
    { id: 'logic', label: 'Logic Working' },
    { id: 'test', label: 'Test Passed' },
    { id: 'deployed', label: 'Deployed' },
];

export const ProofFooter: React.FC = () => {
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    const toggleItem = (id: string) => {
        setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--color-border)] py-4 px-8 flex items-center justify-between z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-8">
                Proof of Work
            </div>

            <div className="flex space-x-8">
                {PROOF_ITEMS.map((item) => (
                    <label key={item.id} className="flex items-center space-x-3 cursor-pointer group">
                        <div
                            className={`w-5 h-5 border-2 rounded transition-colors duration-200 flex items-center justify-center
                ${checkedItems[item.id]
                                    ? 'bg-[var(--color-accent)] border-[var(--color-accent)]'
                                    : 'border-gray-300 group-hover:border-[var(--color-accent)]'
                                }`}
                        >
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={!!checkedItems[item.id]}
                                onChange={() => toggleItem(item.id)}
                            />
                            {checkedItems[item.id] && (
                                <svg className="w-3 h-3 text-white" fill="none" strokeWidth="3" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                        <span className={`text-sm font-medium transition-colors ${checkedItems[item.id] ? 'text-[var(--color-primary)]' : 'text-gray-500'}`}>
                            {item.label}
                        </span>
                    </label>
                ))}
            </div>

            <div className="text-xs text-gray-400">
                {Object.values(checkedItems).filter(Boolean).length} / {PROOF_ITEMS.length} Verified
            </div>
        </div>
    );
};
