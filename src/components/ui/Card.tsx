import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    hover = true,
    glass = true
}) => {
    const baseStyles = "relative overflow-hidden border transition-all duration-500 rounded-none";
    const glassStyles = glass ? "bg-zinc-950/40 border-zinc-900 backdrop-blur-3xl" : "bg-black border-zinc-900";
    const hoverStyles = hover ? "hover:border-zinc-700/50 hover:bg-zinc-900/40" : "";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`${baseStyles} ${glassStyles} ${hoverStyles} ${className}`}
        >
            {children}
        </motion.div>
    );
};
