import {
    Terminal,
    Zap,
    Activity,
    Code2,
    Cpu,
    Globe
} from 'lucide-react';

const FeatureCard = ({ title, desc, icon: Icon, large = false }: any) => (
    <div className={`
    relative overflow-hidden border border-[#333] bg-black p-8 group
    ${large ? 'col-span-12 md:col-span-8' : 'col-span-12 md:col-span-4'}
  `}>
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10">
            <div className="mb-6 p-3 bg-[#111] rounded-lg w-fit border border-[#222]">
                <Icon size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-semibold tracking-tight mb-3">{title}</h3>
            <p className="text-[#888] text-sm leading-relaxed">{desc}</p>
        </div>
    </div>
);

export default function Products() {
    return (
        <section className="max-w-[1400px] mx-auto px-6 border-x border-[#333] grid grid-cols-12 min-h-screen">
            <div className="col-span-12 py-24 text-center border-b border-[#333]">
                <h2 className="text-4xl font-bold tracking-tight mb-4">Our Ecosystem</h2>
                <p className="text-[#666] max-w-xl mx-auto">Develop with your favorite tools. Launch globally, instantly. Keep pushing.</p>
            </div>

            <FeatureCard
                title="QBET Engine"
                desc="A custom-built language for sovereign data verification and reality simulation."
                icon={Terminal}
                large={true}
            />
            <FeatureCard
                title="AgentBash"
                desc="Expert AI Bash Agents for high-level automation."
                icon={Zap}
            />
            <FeatureCard
                title="ScanTrade Pro"
                desc="Real-time deterministic multi-asset intelligence."
                icon={Activity}
            />
            <FeatureCard
                title="Void Environment"
                desc="Local AI capability with seamless SyncStack integration."
                icon={Cpu}
                large={true}
            />
            <FeatureCard
                title="Poly CLI"
                desc="Advanced trading analysis and agent creation."
                icon={Code2}
            />
            <FeatureCard
                title="Open-URLs"
                desc="Global link redirection service."
                icon={Globe}
            />
        </section>
    );
}
