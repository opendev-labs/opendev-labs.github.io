import React from 'react';
import { OpendevLabsLogo } from './icons/Icons';

export function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 p-4 z-10">
      <div className="container mx-auto flex items-center justify-between">
         <div className="flex items-center">
            <div className="flex items-center gap-2">
                <OpendevLabsLogo className="h-7 w-7 text-white" />
                <span className="text-lg font-semibold text-white">opendev-labs</span>
            </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Sign In
          </button>
          <button className="px-4 py-2 text-sm font-medium bg-white text-black rounded-lg hover:bg-gray-200 transition-colors">
            Start for Free
          </button>
        </div>
      </div>
    </header>
  );
}