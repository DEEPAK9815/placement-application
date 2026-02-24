import React from 'react';

interface HeaderProps {
    title: string;
    subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
    return (
        <div className="mb-10 animate-fade-in">
            <h1 className="text-4xl font-serif font-bold text-[var(--color-primary)] mb-3 tracking-tight">
                {title}
            </h1>
            {subtitle && (
                <p className="text-lg text-gray-500 max-w-2xl font-light leading-relaxed">
                    {subtitle}
                </p>
            )}
        </div>
    );
};
