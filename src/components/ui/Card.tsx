import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    description?: string;
    actions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, description, actions }) => {
    return (
        <div className={`bg-white border border-[var(--color-border)] rounded-lg p-6 ${className}`}>
            {(title || description || actions) && (
                <div className="flex justify-between items-start mb-6">
                    <div>
                        {title && <h3 className="text-xl font-serif font-semibold text-[var(--color-primary)]">{title}</h3>}
                        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
                    </div>
                    {actions && <div>{actions}</div>}
                </div>
            )}
            <div className="text-[var(--color-primary)]">
                {children}
            </div>
        </div>
    );
};
