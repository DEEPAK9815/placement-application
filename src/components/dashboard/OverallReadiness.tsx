import React from 'react';
import { Card } from '../ui/Card';

export const OverallReadiness: React.FC = () => {
    // Read from localStorage or default to 35 (initial baseline)
    const storedScore = localStorage.getItem('latest_readiness_score');
    const score = storedScore ? parseInt(storedScore, 10) : 35;

    // ... rest of component logic ...
    const radius = 80;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <Card className="flex flex-col items-center justify-center p-6 h-full min-h-[300px]" title="Overall Readiness">
            <div className="relative flex items-center justify-center">
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="rotate-[-90deg]"
                >
                    <circle
                        stroke="var(--color-border, #e2e8f0)"
                        strokeWidth={stroke}
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    <circle
                        stroke="var(--color-accent, #6366f1)"
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                        strokeLinecap="round"
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-[var(--color-primary)]">{score}/100</span>
                </div>
            </div>
            <p className="mt-4 text-sm font-medium text-gray-500">Readiness Score</p>
        </Card>
    );
};
