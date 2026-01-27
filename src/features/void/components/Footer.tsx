import React from 'react';
import { DiscordIcon, GitHubIcon, XIconSocial } from './common/Icons';

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} onClick={e => e.preventDefault()} className="text-zinc-400 hover:text-void-neon transition-colors">{children}</a>
);

const SocialLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
     <a href={href} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
        {children}
    </a>
)

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-4 md:px-8 border-t border-void-line">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        <div className="col-span-2 lg:col-span-1">
             <h3 className="font-semibold text-white">Void</h3>
             <p className="text-sm text-zinc-500 mt-2">Next-Gen Serverless Platform</p>
        </div>
        
        <div className="space-y-3">
             <h4 className="font-semibold text-zinc-400 text-sm">Platform</h4>
             <ul className="space-y-2 text-sm">
                <li><FooterLink href="#/new">Deploy</FooterLink></li>
                <li><FooterLink href="#/cli">CLI</FooterLink></li>
                <li><FooterLink href="#/docs#serverless-functions">Functions</FooterLink></li>
                <li><FooterLink href="#/docs#storage">Databases</FooterLink></li>
             </ul>
        </div>
        
        <div className="space-y-3">
             <h4 className="font-semibold text-zinc-400 text-sm">Resources</h4>
             <ul className="space-y-2 text-sm">
                <li><FooterLink href="#/docs">Documentation</FooterLink></li>
                <li><FooterLink href="#">Status</FooterLink></li>
                <li><FooterLink href="#">Support</FooterLink></li>
             </ul>
        </div>

        <div className="space-y-3">
             <h4 className="font-semibold text-zinc-400 text-sm">Company</h4>
             <ul className="space-y-2 text-sm">
                <li><FooterLink href="#">About</FooterLink></li>
                <li><FooterLink href="#">Careers</FooterLink></li>
                <li><FooterLink href="#/pricing">Pricing</FooterLink></li>
             </ul>
        </div>

      </div>
      <div className="container mx-auto mt-12 pt-8 border-t border-void-line flex flex-col sm:flex-row justify-between items-center text-sm text-zinc-500">
        <p>&copy; {new Date().getFullYear()} Void Technologies Inc.</p>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <SocialLink href="https://x.com"><XIconSocial /></SocialLink>
            <SocialLink href="https://github.com"><GitHubIcon /></SocialLink>
            <SocialLink href="https://discord.com"><DiscordIcon /></SocialLink>
        </div>
      </div>
    </footer>
  );
};
