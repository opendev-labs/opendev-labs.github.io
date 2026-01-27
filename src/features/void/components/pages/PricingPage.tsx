import React from 'react';

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);


const PricingCard: React.FC<{ plan: string, price: string, description: string, features: string[], isFeatured?: boolean }> = ({ plan, price, description, features, isFeatured }) => {
    return (
        <div className={`p-8 border border-zinc-900 bg-black flex flex-col h-full relative overflow-hidden transition-all duration-500 hover:bg-zinc-950 ${isFeatured ? 'ring-1 ring-zinc-800' : ''}`}>
            {isFeatured && (
                <div className="absolute top-0 right-0 py-1.5 px-4 bg-white text-black text-[9px] font-bold tracking-[0.2em] uppercase">
                    Core Standard
                </div>
            )}

            <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-zinc-500 mb-6">{plan}</h3>

            <div className="mb-6 flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tighter text-white">{price}</span>
                {plan !== 'Enterprise' && <span className="text-zinc-600 font-bold text-sm">/mo</span>}
            </div>

            <p className="text-zinc-500 text-sm font-medium mb-12 leading-relaxed h-12">{description}</p>

            <ul className="mb-12 space-y-4">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-[13px] font-bold text-zinc-400">
                        <CheckIcon />
                        {feature}
                    </li>
                ))}
            </ul>

            <button className={`w-full h-11 text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-300 rounded-full hover:scale-105 active:scale-95 shadow-lg ${isFeatured ? 'bg-white text-black hover:bg-zinc-200 shadow-white/5' : 'bg-black text-white border border-zinc-900 hover:bg-zinc-900'}`}>
                {plan === 'Enterprise' ? 'Contact Intelligence' : 'Initialize Node'}
            </button>
        </div>
    );
};

export const PricingPage: React.FC = () => {
    return (
        <div className="max-w-[1240px] mx-auto px-6 py-24">
            <div className="text-center mb-24">
                <span className="inline-block px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-8">
                    Protocol Economics
                </span>
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-6">Scalable Infrastructure.</h1>
                <p className="text-zinc-500 max-w-xl mx-auto text-lg font-medium">Start for free, then scale your intelligence across our global edge mesh. No hidden cycles.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
                <PricingCard
                    plan="Hobby"
                    price="$0"
                    description="For individual pioneers and early experiments."
                    features={[
                        'Unlimited core nodes',
                        'Automatic TLS rotation',
                        'Global Git integration',
                        'Edge assets delivery',
                    ]}
                />
                <PricingCard
                    plan="Node Pro"
                    price="$20"
                    description="For professional systems and scaled intelligence."
                    features={[
                        'Everything in Hobby, plus:',
                        'Unlimited team nodes',
                        'Neural edge routing',
                        'Serverless logic primitives',
                        'Dedicated queue support',
                    ]}
                    isFeatured
                />
                <PricingCard
                    plan="Enterprise"
                    price="Custom"
                    description="For sovereign global architectures and scale."
                    features={[
                        'Everything in Pro, plus:',
                        'Dedicated node clusters',
                        'Customized uptime SLA',
                        'Identity mesh (SSO)',
                        'Protocol advisory support',
                    ]}
                />
            </div>

            <div className="mt-24 pt-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-center md:text-left">
                    <h4 className="text-white font-bold tracking-tight mb-2">Need a custom node configuration?</h4>
                    <p className="text-zinc-500 text-sm font-medium">Talk to our architecture team for specialized requirements.</p>
                </div>
                <button className="h-12 px-8 bg-zinc-900 text-white text-xs font-bold tracking-[0.2em] uppercase border border-zinc-800 hover:bg-zinc-800 transition-all">
                    Contact Architecture
                </button>
            </div>
        </div>
    );
};