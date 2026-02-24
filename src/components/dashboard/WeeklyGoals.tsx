import React from 'react';
import { Card } from '../ui/Card';
import { Progress } from '../ui/Progress';
import { cn } from '../../lib/utils'; // Keep path import consistent? lib/utils is at same level as components in src usually? wait, components/dashboard -> ../../lib/utils is correct.

const days = [
    { label: 'M', active: true },
    { label: 'T', active: true },
    { label: 'W', active: false },
    { label: 'T', active: true },
    { label: 'F', active: true },
    { label: 'S', active: false },
    { label: 'S', active: false },
];

export const WeeklyGoals: React.FC = () => {
    return (
        <Card title="Weekly Goals" className="h-full">
            <div className="flex flex-col gap-6">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">Problems Solved</span>
                        <span className="text-sm font-bold text-[var(--color-primary)]">12/20</span>
                    </div>
                    <Progress value={(12 / 20) * 100} className="h-2" />
                </div>

                <div className="flex justify-between items-center">
                    {days.map((day, index) => (
                        <div key={index} className="flex flex-col items-center gap-1">
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
                                day.active
                                    ? "bg-[var(--color-accent)] text-white"
                                    : "bg-gray-100 text-gray-400"
                            )}>
                                {day.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};
