import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'default',
    isLoading = false,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center px-6 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-[var(--color-accent)] text-white hover:opacity-90 focus:ring-[var(--color-accent)]",
        secondary: "border border-[var(--color-accent)] text-[var(--color-accent)] bg-transparent hover:bg-[#8B00001A] focus:ring-[var(--color-accent)]",
        ghost: "bg-transparent text-[var(--color-primary)] hover:bg-gray-100 focus:ring-[var(--color-accent)]",
        outline: "border border-gray-300 bg-transparent text-[var(--color-primary)] hover:bg-gray-50 focus:ring-[var(--color-accent)]"
    };

    const sizes = {
        default: "px-6 py-2",
        sm: "px-3 py-1.5 text-sm",
        lg: "px-8 py-3 text-lg",
        icon: "p-2"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {children}
        </button>
    );
};
