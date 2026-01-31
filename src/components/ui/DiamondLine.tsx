import React from 'react';
import { motion } from 'framer-motion';

export const DiamondLine: React.FC<{ className?: string }> = ({ className = "" }) => {
    return (
        <div className={`relative flex items-center justify-center w-full h-[1px] ${className}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-800 to-transparent opacity-50" />
            <motion.div
                className="w-1.5 h-1.5 bg-white rotate-45 border border-zinc-700 relative z-10"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
            />
        </div>
    );
};
