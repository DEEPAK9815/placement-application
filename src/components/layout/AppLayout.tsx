import React from 'react';
import { TopBar } from './TopBar';
import { ProofFooter } from './ProofFooter';

interface AppLayoutProps {
    children: React.ReactNode;
    panel: React.ReactNode;
    header: React.ReactNode;
    stepCurrent: number;
    stepTotal: number;
    status: 'Not Started' | 'In Progress' | 'Shipped';
    projectName: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
    children,
    panel,
    header,
    stepCurrent,
    stepTotal,
    status,
    projectName
}) => {
    return (
        <div className="min-h-screen bg-[var(--color-background)] font-sans antialiased text-[var(--color-primary)]">
            {/* Top Bar - Fixed */}
            <TopBar
                projectName={projectName}
                currentStep={stepCurrent}
                totalSteps={stepTotal}
                status={status}
            />

            {/* Main Content Area */}
            <div className="pt-24 pb-32 px-8 max-w-[1600px] mx-auto">
                {/* Context Header */}
                {header}

                {/* Workspace + Panel Split */}
                <div className="flex gap-8 items-start">
                    {/* Primary Workspace (70%) */}
                    <main className="flex-grow w-[70%]">
                        {children}
                    </main>

                    {/* Secondary Panel (30%) */}
                    <aside className="w-[30%] sticky top-24">
                        {panel}
                    </aside>
                </div>
            </div>

            {/* Proof Footer - Persistent */}
            <ProofFooter />
        </div>
    );
};
