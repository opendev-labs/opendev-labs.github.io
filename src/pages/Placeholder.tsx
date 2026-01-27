import { Construction } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Placeholder({ title }: { title: string }) {
    return (
        <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
            <div className="p-4 bg-[#111] rounded-full border border-[#333] mb-6 animate-pulse">
                <Construction size={32} className="text-[#666]" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-4">{title}</h1>
            <p className="text-[#666] max-w-md mb-8">This module is currently under active development. Check back soon for updates.</p>
            <Link to="/" className="px-6 py-2 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors">
                Return Home
            </Link>
        </section>
    );
}
