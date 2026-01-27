import React from 'react';
import { PageWrapper } from '../common/PageWrapper';

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-void-neon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);


const PricingCard: React.FC<{plan: string, price: string, description: string, features: string[], isFeatured?: boolean}> = ({ plan, price, description, features, isFeatured }) => {
    const cardClasses = `
        border rounded-lg p-6 flex flex-col
        ${isFeatured ? 'border-void-neon bg-void-card' : 'border-void-line bg-void-card'}
    `;
    const buttonClasses = `
        w-full mt-auto py-2 px-4 font-semibold transition-colors
         ${isFeatured ? 'bg-void-neon text-black hover:opacity-90' : 'bg-white text-black hover:bg-zinc-200'}
    `;

    return (
        <div className={cardClasses}>
            {isFeatured && <span className="text-xs font-bold text-void-neon bg-void-neon/20 px-3 py-1 self-start">Most Popular</span>}
            <h3 className="text-xl font-semibold text-white mt-4">{plan}</h3>
            <p className="mt-2 text-zinc-400">{description}</p>
            <p className="mt-6">
                <span className="text-4xl font-bold tracking-tight text-white">{price}</span>
                {plan !== 'Enterprise' && <span className="text-zinc-500"> / month</span>}
            </p>
            <ul className="mt-6 space-y-3 text-sm text-zinc-300">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <CheckIcon />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
             <button className={buttonClasses}>{plan === 'Enterprise' ? 'Contact Sales' : 'Get Started'}</button>
        </div>
    );
};

export const PricingPage: React.FC = () => {
    return (
        <PageWrapper
            title="Fair, scalable pricing for all"
            subtitle="Start for free, then scale with your project. No hidden fees, no surprises."
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <PricingCard
                    plan="Hobby"
                    price="$0"
                    description="For personal projects and experiments."
                    features={[
                        'Unlimited personal projects',
                        'Automatic HTTPS/SSL',
                        'Deploy from GitHub, GitLab, and Bitbucket',
                        'Community support',
                    ]}
                />
                <PricingCard
                    plan="Pro"
                    price="$20"
                    description="For professional developers and teams."
                    features={[
                        'Everything in Hobby, plus:',
                        'Unlimited team projects',
                        'High-performance Edge Network',
                        'Serverless Functions',
                        'Email support',
                    ]}
                    isFeatured
                />
                <PricingCard
                    plan="Enterprise"
                    price="Custom"
                    description="For large-scale applications and businesses."
                    features={[
                        'Everything in Pro, plus:',
                        'Enterprise-grade security & compliance',
                        'Dedicated infrastructure',
                        '99.99% Uptime SLA',
                        'Priority support',
                    ]}
                />
            </div>
        </PageWrapper>
    );
};