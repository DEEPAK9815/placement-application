import React from 'react';

interface TopBarProps {
    projectName: string;
    currentStep: number;
    totalSteps: number;
    status: 'Not Started' | 'In Progress' | 'Shipped';
}

export const TopBar: React.FC<TopBarProps> = ({ projectName, currentStep, totalSteps, status }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Shipped': return 'bg-[var(--color-success)] text-white';
            case 'In Progress': return 'bg-[var(--color-warning)] text-white';
            default: return 'bg-gray-200 text-gray-600';
        }
    };

    return (
        <div className="h-16 border-b border-[var(--color-border)] flex items-center justify-between px-8 bg-white fixed top-0 left-0 right-0 z-10 font-sans">
            <div className="font-semibold text-[var(--color-primary)] text-lg">
                {projectName}
            </div>

            <div className="text-sm text-gray-500 font-medium tracking-wide">
                STEP {currentStep} <span className="text-gray-300 mx-2">/</span> {totalSteps}
            </div>

            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(status)}`}>
                {status}
            </div>
        </div>
    );
};
