import React from 'react';
import { Card } from '../ui/Card';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const data = [
    { subject: 'DSA', A: 75, fullMark: 100 },
    { subject: 'System Design', A: 60, fullMark: 100 },
    { subject: 'Communication', A: 80, fullMark: 100 },
    { subject: 'Resume', A: 85, fullMark: 100 },
    { subject: 'Aptitude', A: 70, fullMark: 100 },
];

export const SkillBreakdown: React.FC = () => {
    return (
        <Card className="h-full min-h-[300px]" title="Skill Breakdown">
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid stroke="var(--color-border, #e2e8f0)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-primary)', fontSize: 12 }} />
                        <Radar
                            name="Skills"
                            dataKey="A"
                            stroke="var(--color-accent, #6366f1)"
                            fill="var(--color-accent, #6366f1)"
                            fillOpacity={0.4}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};
