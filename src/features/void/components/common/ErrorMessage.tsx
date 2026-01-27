
import React from 'react';

export const ErrorMessage: React.FC<{ message: string }> = ({ message }) => {
    if (!message) return null;
    return (
        <div className="bg-red-900/50 border border-red-500/50 text-red-300 text-sm p-3 text-center rounded-md">
            {message}
        </div>
    );
};
