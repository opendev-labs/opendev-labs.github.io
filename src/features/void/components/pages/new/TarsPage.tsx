import React from 'react';
import TARSV2 from './tars_v2/App';

export const TarsPage: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[60] bg-black">
            <TARSV2 />
        </div>
    );
};
