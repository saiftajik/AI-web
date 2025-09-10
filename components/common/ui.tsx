
import React, { ReactNode } from 'react';

// Card
interface CardProps {
    children: ReactNode;
    className?: string;
}
export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
    <div className={`bg-dark-card/50 backdrop-blur-sm border border-dark-border rounded-2xl p-6 shadow-lg ${className}`}>
        {children}
    </div>
);


// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    // FIX: Add size prop to support different button sizes
    size?: 'default' | 'sm';
    children: ReactNode;
}
export const Button: React.FC<ButtonProps> = ({ children, className = '', variant = 'primary', size = 'default', ...props }) => {
    // FIX: Decouple padding from base styles to allow for size variations
    const baseStyles = 'font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';
    
    // FIX: Define styles for different button sizes
    const sizeStyles = {
        default: 'px-6 py-2.5',
        sm: 'p-2'
    };

    const variantStyles = {
        primary: 'bg-violet-600 text-white hover:bg-violet-500 focus:ring-violet-500 shadow-md hover:shadow-lg hover:shadow-violet-600/30',
        secondary: 'bg-dark-border text-gray-300 hover:bg-gray-700 focus:ring-gray-500',
        danger: 'bg-red-600 text-white hover:bg-red-500 focus:ring-red-500'
    };
    
    return (
        // FIX: Apply size styles to the button
        <button className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

// Input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}
export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, id, className, ...props }, ref) => {
    return (
        <div className="w-full">
            {label && <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-2">{label}</label>}
            <input
                id={id}
                ref={ref}
                className={`w-full bg-dark-card border border-dark-border rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all ${className}`}
                {...props}
            />
        </div>
    );
});

// Textarea
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
}
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, id, className, ...props }, ref) => {
    return (
        <div className="w-full">
            {label && <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-2">{label}</label>}
            <textarea
                id={id}
                ref={ref}
                className={`w-full bg-dark-card border border-dark-border rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all ${className}`}
                {...props}
            />
        </div>
    );
});


// Modal
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300" onClick={onClose}>
            <div className="bg-dark-card border border-dark-border rounded-2xl shadow-neon-violet w-full max-w-md m-4 p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">&times;</button>
                </div>
                <div>{children}</div>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};