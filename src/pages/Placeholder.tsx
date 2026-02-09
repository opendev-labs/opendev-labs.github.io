import { Link } from 'react-router-dom';
import { DevIcon3D } from '../components/animated/DevIcon3D';
import { DiamondLine } from '../components/ui/DiamondLine';

export default function Placeholder({ title }: { title: string }) {
    return (
        <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-6 bg-black overflow-hidden relative">
            {/* Background Grid/Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#ff550005_0%,_transparent_70%)]" />

            <div className="relative z-10 flex flex-col items-center">
                <DevIcon3D />

                <h1 className="text-4xl font-black tracking-tighter mb-4 text-white uppercase mt-4">
                    {title}
                </h1>

                <div className="w-48 mb-8">
                    <DiamondLine />
                </div>

                <p className="text-zinc-500 max-w-md mb-12 font-medium leading-relaxed uppercase tracking-wider text-[11px]">
                    This module is currently undergoing <span className="text-white">Neural Realignment</span>.
                    <br />
                    Expected materialization status: <span className="text-[#ff5500] animate-pulse">PENDING</span>
                </p>

                <Link
                    to="/"
                    className="group relative px-10 py-3 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:tracking-[0.4em] hover:bg-[#ff5500] hover:text-white"
                >
                    <span className="relative z-10">Return to Grid</span>
                    <div className="absolute inset-0 bg-white group-hover:bg-[#ff5500] transition-colors duration-300 transform scale-x-0 group-hover:scale-x-100 origin-left" />
                </Link>
            </div>

            {/* Corner Decorative Elements */}
            <div className="absolute top-10 left-10 w-20 h-20 border-l border-t border-zinc-900" />
            <div className="absolute bottom-10 right-10 w-20 h-20 border-r border-b border-zinc-900" />
        </section>
    );
}
