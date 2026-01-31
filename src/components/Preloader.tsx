import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HUDLines = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        {/* Monochromatic Scanning Grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        {/* Horizontal Scanlines */}
        <motion.div
            className="absolute inset-0 z-0"
            style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.05) 50%)', backgroundSize: '100% 4px' }}
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 0.1, repeat: Infinity }}
        />
        {/* Static noise / grain (Monochrome) */}
        <div className="absolute inset-0 opacity-[0.03] grayscale pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
);

const CentralLogo = ({ show }: { show: boolean }) => (
    <motion.div
        className="relative z-20 flex flex-col items-center justify-center p-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
            scale: show ? 1.1 : 0.8,
            opacity: show ? 1 : 0,
            filter: show ? ["brightness(0)", "brightness(4)", "brightness(1)"] : "brightness(0)"
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
    >
        <motion.svg
            width="180"
            height="180"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="filter drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
        >
            <motion.path
                d="M10 25H90L50 90L10 25Z"
                stroke="white"
                strokeWidth="1.5"
                style={{ opacity: 0.2 }}
                animate={show ? { opacity: [0.2, 0.5, 0.2] } : {}}
                transition={{ duration: 0.2, repeat: Infinity }}
            />
            <motion.path
                d="M22.5 35H77.5L50 80L22.5 35Z"
                stroke="white"
                strokeWidth="1"
                style={{ opacity: 0.4 }}
            />
            <motion.path
                d="M42.5 52.5H57.5L50 65L42.5 52.5Z"
                fill="white"
                stroke="white"
                strokeWidth="2"
                initial={{ scale: 0.5 }}
                animate={show ? {
                    scale: [0.9, 1.2, 1],
                    filter: [
                        "drop-shadow(0 0 0px #fff)",
                        "drop-shadow(0 0 80px #fff)",
                        "drop-shadow(0 0 20px #fff)"
                    ]
                } : {}}
                transition={{ duration: 0.6, times: [0, 0.5, 1] }}
            />
        </motion.svg>

        {/* Photonic Surge Ring */}
        {show && (
            <motion.div
                className="absolute inset-0 rounded-full border border-white opacity-20"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: [1, 2], opacity: [0.4, 0] }}
                transition={{ duration: 0.5 }}
            />
        )}
    </motion.div>
);

const ALL_BOOT_LINES = [
    "0x7f4e2 [ OK ] SYSTEM_PREINIT: LOAD_TITAN_KERNEL",
    "0x7f4e5 [ OK ] MEMORY_MAP: NEURAL_RESERVATION_COMPLETE",
    "0x7f4e9 [ OK ] ENCLAVE_INIT: SECURE_ENVIRONMENT_READY",
    "0x8a2d1 [ OK ] QUANTUM_STABILIZER: 1.02e-9_VARIANCE",
    "0x8a2d4 [ OK ] NETWORK_MESH: GLOBAL_NODE_HANDSHAKE",
    "0x8a2d7 [ OK ] SOVEREIGN_PROTOCOL: VERSION_2026_ACTIVE",
    "0x9b1f2 [ OK ] DATA_INTEGRITY: LAMADB_REPLICATION_SYNC",
    "0x9b1f5 [ OK ] ASSET_PIPELINE: HYDRATING_MONOCHROME_MESH",
    "0x9b1f9 [ OK ] SHARD_RECOVERY: BALANCING_ENTROPY_FIELDS",
    "0xb2c3d [ OK ] NEURAL_BRIDGE: HANDSHAKE_LEVEL_4_READY",
    "0xb2c4a [ OK ] TITAN_CORE: ESTABLISHING_PHOTONIC_SESSIONS",
    "0xc3d2e [ OK ] COMPONENT_TREE: MOUNTING_Sovereign_Logic",
    "0xd4e5f [ OK ] PROTOCOL_RECONCILER: BOOTSTRAP_COMPLETE",
    "0xe1f2a [ SUCCESS ] TITAN_CORE_STABILIZED"
];

const BootLog = ({ onComplete }: { onComplete: () => void }) => {
    const [lines, setLines] = useState<string[]>([]);
    const logRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        let currentLine = 7; // Start where index.html ends
        setLines(ALL_BOOT_LINES.slice(0, 7));

        const interval = setInterval(() => {
            if (currentLine < ALL_BOOT_LINES.length) {
                setLines(prev => [...prev, ALL_BOOT_LINES[currentLine]]);
                currentLine++;
                if (currentLine === Math.floor(ALL_BOOT_LINES.length * 0.8)) {
                    onComplete();
                }
            } else {
                clearInterval(interval);
            }
        }, 80);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    }, [lines]);

    return (
        <div ref={logRef} className="w-full h-48 overflow-hidden font-mono text-[11px] text-zinc-500 text-left flex flex-col gap-1 p-6 bg-zinc-950/80 border border-zinc-800 rounded-none backdrop-blur-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
            {lines.map((line, i) => {
                if (!line) return null;
                const parts = line.split(' ');
                const isSuccess = line.includes("SUCCESS");
                return (
                    <motion.div key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.1 }} className="flex gap-4">
                        <span className="opacity-30 flex-shrink-0">{parts[0]}</span>
                        <span className={isSuccess ? "text-white font-bold" : "text-zinc-400"}>{parts[2]}</span>
                        <span className="opacity-70">{parts.slice(3).join(' ')}</span>
                    </motion.div>
                );
            })}
        </div>
    );
};

export const Preloader: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [isLogoActive, setIsLogoActive] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(false), 4000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        backgroundColor: "#fff",
                        filter: "brightness(5) blur(40px)",
                        transition: { duration: 0.8, ease: "circIn" }
                    }}
                    className="fixed inset-0 z-[1000] bg-black flex items-center justify-center overflow-hidden"
                >
                    {/* Titan Grid Background */}
                    <div className="absolute inset-0 z-0">
                        <HUDLines />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none" />
                    </div>

                    <div className="flex flex-col items-center gap-12 w-full max-w-xl relative z-10 px-6">
                        <CentralLogo show={isLogoActive} />
                        <BootLog onComplete={() => setIsLogoActive(true)} />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
