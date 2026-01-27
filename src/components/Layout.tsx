import { useState } from 'react';
import { Menu, X, Command, Code2, ChevronDown, LogOut, LayoutDashboard, Terminal, Database, Server } from 'lucide-react';
import { Outlet, Link } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Logo = () => (
    <svg width="24" height="24" viewBox="0 0 116 100" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M57.5 100L0 0H116L57.5 100Z" />
    </svg>
);

const MegaMenu = ({ items }: { items: any[] }) => (
    <div className="absolute top-12 left-0 w-[600px] bg-black border border-[#333] rounded-xl p-6 shadow-2xl grid grid-cols-2 gap-4 z-50 animate-in fade-in zoom-in-95 duration-200">
        {items.map((item, i) => (
            <Link to={item.href} key={i} className="group block p-3 rounded-lg hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 bg-[#111] border border-[#333] rounded-md group-hover:border-[#555] transition-colors">
                        <item.icon size={16} className="text-white" />
                    </div>
                    <span className="font-semibold text-sm">{item.name}</span>
                </div>
                <p className="text-[#666] text-xs ml-[44px]">{item.desc}</p>
            </Link>
        ))}
    </div>
);

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const { user, logout } = useAuth();
    let timeoutId: any = null;

    const handleMouseEnter = (item: string) => {
        if (timeoutId) clearTimeout(timeoutId);
        setHoveredItem(item);
    };

    const handleMouseLeave = () => {
        timeoutId = setTimeout(() => {
            setHoveredItem(null);
        }, 150); // Small delay to allow moving to menu
    };

    const productItems = [
        { name: 'Void', desc: 'Sovereign AI Environment', icon: Terminal, href: '/void' },
        { name: 'LamaDB', desc: 'Native Browser Database', icon: Database, href: '/lamadb' },
        { name: 'Q-Cloud', desc: 'Quantum Infrastructure', icon: Server, href: '/q-cloud' },
        { name: 'Dashboard', desc: 'Manage your projects', icon: LayoutDashboard, href: '/ide' },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-[#333] h-16 flex items-center justify-between px-6 md:px-8">
            <div className="flex items-center gap-8">
                <Link to="/" className="flex items-center gap-2">
                    <Logo />
                    <span className="font-bold text-xl tracking-tight hidden md:block">opendev-labs</span>
                </Link>

                <div className="hidden md:flex items-center gap-2 text-[14px] font-medium text-[#888]">
                    <div
                        className="relative h-16 flex items-center"
                        onMouseEnter={() => handleMouseEnter('products')}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button className={`px-3 py-2 rounded-full transition-colors flex items-center gap-1 ${hoveredItem === 'products' ? 'text-white bg-white/5' : 'hover:text-white'}`}>
                            Products <ChevronDown size={12} />
                        </button>
                        {hoveredItem === 'products' && (
                            <div className="absolute top-14 left-0 pt-4">
                                <MegaMenu items={productItems} />
                            </div>
                        )}
                    </div>

                    <Link to="/solutions" className="px-3 py-2 rounded-full hover:text-white hover:bg-white/5 transition-colors">Solutions</Link>
                    <Link to="/resources" className="px-3 py-2 rounded-full hover:text-white hover:bg-white/5 transition-colors">Resources</Link>
                    <Link to="/pricing" className="px-3 py-2 rounded-full hover:text-white hover:bg-white/5 transition-colors">Pricing</Link>
                </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
                <Link to="/contact" className="text-[#888] hover:text-white text-sm font-medium transition-colors">Contact</Link>

                {user ? (
                    <div className="flex items-center gap-4 pl-4 border-l border-[#333]">
                        <span className="text-sm font-mono text-666">{user.name}</span>
                        <Link to="/ide" className="bg-[#111] hover:bg-[#222] text-white px-4 py-1.5 rounded-full text-sm font-medium border border-[#333] transition-colors flex items-center gap-2">
                            Dashboard <LayoutDashboard size={14} />
                        </Link>
                        <button onClick={() => logout()}><LogOut size={16} className="text-[#666] hover:text-red-500" /></button>
                    </div>
                ) : (
                    <>
                        <Link to="/login" className="bg-[#111] hover:bg-[#222] text-white px-4 py-1.5 rounded-full text-sm font-medium border border-[#333] transition-colors">Log In</Link>
                        <Link to="/signup" className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">Sign Up</Link>
                    </>
                )}
            </div>

            <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X /> : <Menu />}
            </button>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="absolute top-16 left-0 w-full bg-black border-b border-[#333] flex flex-col p-6 gap-4 md:hidden">
                    <Link to="/products" className="text-[#888] hover:text-white text-sm font-medium">Products</Link>
                    <Link to="/solutions" className="text-[#888] hover:text-white text-sm font-medium">Solutions</Link>
                    <Link to="/contact" className="text-[#888] hover:text-white text-sm font-medium">Contact</Link>
                    {user ? (
                        <Link to="/void" className="text-white font-medium">Dashboard</Link>
                    ) : (
                        <div className="flex flex-col gap-2 mt-4">
                            <Link to="/login" className="bg-[#111] text-center text-white py-2 rounded-full border border-[#333]">Log In</Link>
                            <Link to="/signup" className="bg-white text-center text-black py-2 rounded-full">Sign Up</Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}

const Footer = () => (
    <footer className="border-t border-[#333] py-24 bg-black relative overflow-hidden">
        {/* Footer Grid Background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between relative z-10">
            <div className="mb-8 md:mb-0">
                <div className="flex items-center gap-2 mb-4">
                    <Logo />
                    <span className="font-bold text-xl tracking-tight">opendev-labs</span>
                </div>
                <span className="text-[#666] text-sm block mb-2">Detailed documentation for sovereign compute.</span>
                <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#111] border border-[#333] flex items-center justify-center text-[#888] hover:text-white cursor-pointer"><Command size={14} /></div>
                    <div className="w-8 h-8 rounded-full bg-[#111] border border-[#333] flex items-center justify-center text-[#888] hover:text-white cursor-pointer"><Code2 size={14} /></div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-sm">
                <div>
                    <h4 className="font-medium mb-4 text-white">Products</h4>
                    <ul className="space-y-3 text-[#666]">
                        <li><Link to="/ide" className="hover:text-white transition-colors">Void Environment</Link></li>
                        <li><Link to="/lamadb" className="hover:text-white transition-colors">LamaDB</Link></li>
                        <li><Link to="/q-cloud" className="hover:text-white transition-colors">Q-Cloud</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-medium mb-4 text-white">Socials</h4>
                    <ul className="space-y-3 text-[#666]">
                        <li><a href="https://instagram.com/opendev.labs" target="_blank" className="hover:text-white transition-colors">@opendev.labs</a></li>
                        <li><a href="https://instagram.com/iamyash.io" target="_blank" className="hover:text-white transition-colors">@iamyash.io</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-medium mb-4 text-white">Contact</h4>
                    <ul className="space-y-3 text-[#666]">
                        <li><a href="mailto:opendev.help@gmail.com" className="hover:text-white transition-colors">opendev.help@gmail.com</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-medium mb-4 text-white">Legal</h4>
                    <ul className="space-y-3 text-[#666]">
                        <li>Privacy Policy</li>
                        <li>Terms of Service</li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>
);

export default function Layout() {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black pt-16 flex flex-col">
            <NavBar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
