import React from 'react';

interface PageWrapperProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ title, subtitle, children }) => {
  return (
    <div className="py-12 sm:py-20">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter text-white">{title}</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-zinc-400">{subtitle}</p>
      </div>
      <div className="mt-12 max-w-5xl mx-auto">
        {children}
      </div>
    </div>
  );
};
