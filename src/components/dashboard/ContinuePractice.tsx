import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Progress } from '../ui/Progress';
import { BookOpen } from 'lucide-react';

export const ContinuePractice: React.FC = () => {
    return (
        <Card title="Continue Practice" className="h-full">
            <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-[var(--color-bg-secondary,f1f5f9)] rounded-lg">
                        <BookOpen className="w-6 h-6 text-[var(--color-accent)]" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-lg text-[var(--color-primary)]">Dynamic Programming</h4>
                        <p className="text-sm text-gray-500 mb-3">Last topic studied</p>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-gray-600">3/10 completed</span>
                        </div>
                        <Progress value={30} className="h-2" />
                    </div>
                </div>
                <div className="mt-2">
                    <Button className="w-full">Continue</Button>
                </div>
            </div>
        </Card>
    );
};
