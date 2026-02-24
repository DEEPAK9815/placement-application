import React from 'react';
import { OverallReadiness } from '../components/dashboard/OverallReadiness';
import { SkillBreakdown } from '../components/dashboard/SkillBreakdown';
import { ContinuePractice } from '../components/dashboard/ContinuePractice';
import { WeeklyGoals } from '../components/dashboard/WeeklyGoals';
import { UpcomingAssessments } from '../components/dashboard/UpcomingAssessments';

const Dashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-serif font-bold text-[var(--color-primary)]">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Row */}
                <OverallReadiness />
                <SkillBreakdown />

                {/* Middle Row */}
                <ContinuePractice />
                <WeeklyGoals />

                {/* Bottom Row - Full Width on Mobile, Spans 2 cols on Desktop if desired, or just flow naturally */}
                <div className="md:col-span-2">
                    <UpcomingAssessments />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
