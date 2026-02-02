import React from 'react';
import TarsView from './tars/TarsView';

export const TarsPage: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[60] bg-black">
            <TarsView />
        </div>
    );
};
