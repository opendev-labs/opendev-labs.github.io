import React from 'react';
import { Link } from 'react-router-dom';
import { DiscordIcon, GitHubIcon, XIconSocial } from './common/Icons';

const FooterLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <Link to={to} className="text-zinc-500 hover:text-white transition-colors text-xs font-medium">{children}</Link>
);

const SocialLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-white transition-colors">
    {children}
  </a>
)

export const Footer: React.FC = () => {
  return (
    <footer className="py-16 border-t border-zinc-900 bg-black">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 px-6">
        <div className="col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 bg-white rotate-45 flex items-center justify-center overflow-hidden">
              <div className="w-3 h-3 bg-black rotate-[-45deg]"></div>
            </div>
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-white">opendev-labs</h3>
          </div>
          <p className="text-[11px] font-medium text-zinc-500 leading-relaxed max-w-[180px]">
            The standard for modern neural infrastructure and global application logic.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Platform</h4>
          <ul className="space-y-3 flex flex-col">
            <FooterLink to="/void/new">Deploy</FooterLink>
            <FooterLink to="/void/cli">CLI</FooterLink>
            <FooterLink to="/void/docs">Functions</FooterLink>
            <FooterLink to="/void/docs">Databases</FooterLink>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Resources</h4>
          <ul className="space-y-3 flex flex-col">
            <FooterLink to="/void/docs">Documentation</FooterLink>
            <FooterLink to="/void/docs">Status</FooterLink>
            <FooterLink to="/">Home</FooterLink>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Company</h4>
          <ul className="space-y-3 flex flex-col">
            <FooterLink to="/void/about">About</FooterLink>
            <FooterLink to="/void/pricing">Pricing</FooterLink>
            <FooterLink to="/void/legal">Privacy</FooterLink>
          </ul>
        </div>

      </div>
      <div className="container mx-auto px-6 mt-16 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-600">
        <p>&copy; {new Date().getFullYear()} opendev-labs inc.</p>
        <div className="flex items-center gap-6 mt-6 sm:mt-0">
          <SocialLink href="https://x.com"><XIconSocial /></SocialLink>
          <SocialLink href="https://github.com"><GitHubIcon /></SocialLink>
          <SocialLink href="https://discord.com"><DiscordIcon /></SocialLink>
        </div>
      </div>
    </footer>
  );
};

