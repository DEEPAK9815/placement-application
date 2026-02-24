import React from 'react';
import { Card } from '../ui/Card';
import { Calendar, Clock } from 'lucide-react';

const assessments = [
    { title: "DSA Mock Test", time: "Tomorrow, 10:00 AM", type: "Test" },
    { title: "System Design Review", time: "Wed, 2:00 PM", type: "Review" },
    { title: "HR Interview Prep", time: "Friday, 11:00 AM", type: "Interview" },
];

export const UpcomingAssessments: React.FC = () => {
    return (
        <Card title="Upcoming Assessments" className="h-full">
            <div className="flex flex-col gap-4">
                {assessments.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                        <div className="mt-1 p-2 bg-[var(--color-bg-secondary,f1f5f9)] rounded-md">
                            <Calendar className="w-5 h-5 text-[var(--color-accent)]" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-[var(--color-primary)] text-sm">{item.title}</h4>
                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>{item.time}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};
