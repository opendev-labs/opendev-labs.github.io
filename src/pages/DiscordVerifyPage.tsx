import React, { useEffect, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { Shield, CheckCircle2, AlertCircle, Loader2, ExternalLink, Bot, Lock } from "lucide-react"
import { Button } from "../components/ui/shadcn/button"
import { motion } from "framer-motion"

export default function DiscordVerifyPage() {
    const [searchParams] = useSearchParams()
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [error, setError] = useState<string | null>(null)

    const code = searchParams.get('code')
    const state = searchParams.get('state')

    useEffect(() => {
        if (code) {
            handleVerification(code, state)
        }
    }, [code])

    const handleVerification = async (code: string, state: string | null) => {
        setStatus('loading')
        try {
            // This would call our serverless function to exchange the code for tokens and update Discord roles
            const response = await fetch('/api/verify-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, state })
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.message || 'Verification protocol failed.')
            }

            setStatus('success')
        } catch (err: any) {
            console.error(err)
            setStatus('error')
            setError(err.message)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 selection:bg-orange-500 selection:text-black">
            <div className="max-w-[500px] w-full bg-zinc-950 border border-zinc-900 p-12 relative overflow-hidden">
                {/* Visual Flair */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-600 to-transparent" />
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Shield size={120} className="text-orange-500" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                            <Bot size={20} className="text-orange-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tighter lowercase leading-none">handshake<br /><span className="text-zinc-600">protocol.</span></h1>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {status === 'idle' && (
                            <div className="space-y-6">
                                <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                                    Initialize the cryptographic link between your <span className="text-white font-bold">OpenDev ID</span> and <span className="text-white font-bold">Discord Identity</span>. This will enable advanced roles and sovereign access across the mesh.
                                </p>
                                <Button
                                    className="w-full h-12 bg-white text-black font-bold uppercase tracking-widest text-[10px] rounded-none hover:bg-orange-500 hover:text-white transition-all"
                                    onClick={() => {
                                        // Redirect to Discord OAuth URL
                                        // This URL should be generated based on your Discord App config
                                        window.location.href = "https://discord.com/api/oauth2/authorize?client_id=1469485333073891369&redirect_uri=https%3A%2F%2Fopendev-labs.github.io%2Fverify-user&response_type=code&scope=identify%20role_connections.write"
                                    }}
                                >
                                    <Lock size={14} className="mr-2" />
                                    Initiate Handshake
                                </Button>
                            </div>
                        )}

                        {status === 'loading' && (
                            <div className="flex flex-col items-center py-10 space-y-4">
                                <Loader2 size={32} className="text-orange-500 animate-spin" />
                                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em]">Synchronizing Identity...</p>
                            </div>
                        )}

                        {status === 'success' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-4 p-4 bg-emerald-500/5 border border-emerald-500/20">
                                    <CheckCircle2 size={24} className="text-emerald-500 shrink-0" />
                                    <p className="text-sm font-medium text-emerald-400">Identity linked successfully. Roles updated across the mesh.</p>
                                </div>
                                <p className="text-zinc-500 text-xs leading-relaxed">
                                    Your cryptographic handshake is complete. You may now close this terminal or return to the main console.
                                </p>
                                <Link to="/office/bots">
                                    <Button variant="outline" className="w-full h-12 border-zinc-800 text-white font-bold uppercase tracking-widest text-[10px] rounded-none mt-4">
                                        Return to Console
                                    </Button>
                                </Link>
                            </motion.div>
                        )}

                        {status === 'error' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-4 p-4 bg-red-500/5 border border-red-500/20">
                                    <AlertCircle size={24} className="text-red-500 shrink-0" />
                                    <p className="text-sm font-medium text-red-400">{error || 'Handshake failed.'}</p>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full h-12 border-zinc-800 text-white font-bold uppercase tracking-widest text-[10px] rounded-none mt-4"
                                    onClick={() => setStatus('idle')}
                                >
                                    Retry Handshake
                                </Button>
                            </motion.div>
                        )}
                    </div>

                    <div className="mt-12 pt-8 border-t border-zinc-900 flex justify-between items-center text-[9px] font-bold text-zinc-700 uppercase tracking-widest">
                        <span>Terminal: v4.2.0-LKD</span>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-orange-500 animate-pulse" />
                            <span>Mesh Online</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
