import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    isLoading?: boolean;
    icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon,
    children,
    className = '',
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed select-none";

    const variants = {
        primary: "bg-white text-black hover:bg-zinc-200 shadow-lg shadow-white/5",
        secondary: "bg-zinc-900 text-white border border-zinc-800 hover:bg-zinc-800",
        outline: "bg-transparent text-white border border-zinc-800 hover:border-zinc-500 hover:bg-zinc-900/50",
        ghost: "bg-transparent text-zinc-500 hover:text-white hover:bg-zinc-900/50"
    };

    const sizes = {
        sm: "h-8 px-4 text-[9px] rounded-none",
        md: "h-11 px-6 text-[10px] rounded-none",
        lg: "h-12 px-8 text-[11px] rounded-none",
        xl: "h-14 px-10 text-[12px] rounded-none"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
                <>
                    {icon && <span className="flex-shrink-0">{icon}</span>}
                    {children}
                </>
            )}
        </motion.button>
    );
};
