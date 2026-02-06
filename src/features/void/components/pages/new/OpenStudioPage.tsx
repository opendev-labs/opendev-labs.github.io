import React from 'react';
import OpenStudio from './open-studio/App';

export const OpenStudioPage: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[60] bg-black">
            <OpenStudio />
        </div>
    );
};
