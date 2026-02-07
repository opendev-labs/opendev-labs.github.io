import React, { useState, useEffect } from "react"
import { useLocation, Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Bot, MessageSquare, Zap, Shield, Trash2, ExternalLink, Settings, Globe, Smartphone, Power, LayoutGrid } from "lucide-react"
import { LamaDB } from "../lib/lamaDB"
import { useAuth } from "../features/void/hooks/useAuth"

// UI Components
import { Badge } from "../components/ui/shadcn/badge"
import { Button } from "../components/ui/shadcn/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/shadcn/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/shadcn/tabs"
import { BotCreator } from "../features/bots/components/BotCreator"

interface BotEntity {
    id: string;
    name: string;
    platform: 'discord' | 'telegram' | 'whatsapp';
    status: 'active' | 'offline' | 'draft';
    description: string;
    appId?: string;
    publicKey?: string;
    lastActive: Date;
}

export default function BotsDashboard() {
    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [bots, setBots] = useState<BotEntity[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreating, setIsCreating] = useState(false)
    const [activeTab, setActiveTab] = useState("all")

    useEffect(() => {
        const fetchBots = async () => {
            if (!isAuthenticated || !user) {
                // Mock data for unauthenticated or first-time users
                setBots([
                    {
                        id: "1",
                        name: "opendev-bots",
                        platform: 'discord',
                        status: 'draft',
                        description: "The official open-source utility bot for opendev-labs.",
                        appId: "1469485333073891369",
                        publicKey: "5c2c4185d41a5dbf83c4cefb70bd1d078fa4f39d0773fcc79c38816deab1f38d",
                        lastActive: new Date()
                    }
                ])
                setIsLoading(false)
                return
            }

            try {
                const userContext = { uid: user.email, email: user.email }
                const storedBots = await LamaDB.store.collection('bots', userContext).get() as BotEntity[]
                if (storedBots.length > 0) {
                    setBots(storedBots)
                } else {
                    setBots([])
                }
            } catch (err) {
                console.error("Failed to fetch bots from LamaDB:", err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchBots()
    }, [isAuthenticated, user])

    const handleDeleteBot = async (id: string) => {
        if (isAuthenticated && user) {
            const userContext = { uid: user.email, email: user.email }
            await LamaDB.store.collection('bots', userContext).delete(id)
        }
        setBots(bots.filter(b => b.id !== id))
    }

    const filteredBots = activeTab === "all" ? bots : bots.filter(b => b.platform === activeTab)

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    }

    return (
        <div className="p-8 md:p-12 animate-in fade-in duration-700 max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div className="flex flex-col">
                    <div className="inline-flex items-center gap-4 mb-8">
                        <Link to="/" className="text-[10px] font-bold text-zinc-600 hover:text-orange-500 transition-colors uppercase tracking-[0.4em]">
                            &larr; Return to Mesh
                        </Link>
                        <div className="w-1 h-1 rounded-full bg-zinc-800" />
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">
                            Product: <span className="text-white">Bots // Interface</span>
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-bold text-zinc-500 mb-6 uppercase tracking-[0.3em] w-fit">
                        <Globe size={12} />
                        <span>Multi-Channel // Bot Mesh</span>
                    </div>
                    <h1 className="text-5xl font-bold tracking-tighter lowercase leading-none">
                        bot<br /><span className="text-zinc-600">orchestrator.</span>
                    </h1>
                </div>

                <Button
                    size="lg"
                    onClick={() => setIsCreating(true)}
                    className="bg-orange-600 text-white font-bold hover:bg-orange-500 transition-colors uppercase tracking-[0.2em] text-[10px] h-12 px-8"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Initialize New Bot
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                <TabsList className="grid w-full grid-cols-4 bg-zinc-950 border border-zinc-900 rounded-none h-12 p-1">
                    <TabsTrigger value="all" className="rounded-none data-[state=active]:bg-zinc-900 data-[state=active]:text-white text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">All Channels</TabsTrigger>
                    <TabsTrigger value="discord" className="rounded-none data-[state=active]:bg-zinc-900 data-[state=active]:text-white text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">Discord</TabsTrigger>
                    <TabsTrigger value="telegram" className="rounded-none data-[state=active]:bg-zinc-900 data-[state=active]:text-white text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">Telegram</TabsTrigger>
                    <TabsTrigger value="whatsapp" className="rounded-none data-[state=active]:bg-zinc-900 data-[state=active]:text-white text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">WhatsApp</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4">
                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center">
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                <Settings className="h-12 w-12 text-orange-500 opacity-50" />
                            </motion.div>
                            <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mt-4">Polling Active Channels...</span>
                        </div>
                    ) : filteredBots.length === 0 ? (
                        <Card className="bg-zinc-950 border-zinc-900 rounded-none border-dashed py-20">
                            <CardContent className="flex flex-col items-center justify-center text-center">
                                <Bot className="h-16 w-16 text-zinc-800 mb-6" />
                                <p className="text-zinc-500 mb-8 font-medium">No active bots found on the {activeTab === 'all' ? 'mesh' : `${activeTab} channel`}.</p>
                                <Button
                                    variant="outline"
                                    className="border-zinc-800 text-zinc-400 hover:text-white"
                                    onClick={() => setIsCreating(true)}
                                >
                                    Initialize First Bot
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <AnimatePresence>
                                {filteredBots.map((bot) => (
                                    <motion.div
                                        key={bot.id}
                                        variants={fadeInUp}
                                        initial="hidden"
                                        animate="visible"
                                        layout
                                        className="bg-zinc-950 border border-zinc-900/50 hover:border-zinc-700 transition-all p-6 group"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="p-3 bg-zinc-900 border border-zinc-800">
                                                {bot.platform === 'discord' && <Zap className="h-6 w-6 text-indigo-400" />}
                                                {bot.platform === 'telegram' && <Globe className="h-6 w-6 text-blue-400" />}
                                                {bot.platform === 'whatsapp' && <Smartphone className="h-6 w-6 text-emerald-400" />}
                                            </div>
                                            <Badge variant="outline" className={`rounded-none text-[8px] tracking-widest uppercase py-1 ${bot.status === 'active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                                bot.status === 'offline' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                                    'bg-zinc-500/10 border-zinc-500/20 text-zinc-400'
                                                }`}>
                                                {bot.status}
                                            </Badge>
                                        </div>

                                        <h3 className="text-xl font-bold tracking-tight mb-2 uppercase">{bot.name}</h3>
                                        <p className="text-zinc-500 text-xs mb-6 line-clamp-2">{bot.description}</p>

                                        <div className="grid grid-cols-2 gap-2 mb-6">
                                            <div className="bg-black p-2 border border-zinc-900">
                                                <span className="text-[8px] text-zinc-600 block uppercase font-bold">App ID</span>
                                                <span className="text-[10px] text-zinc-400 font-mono truncate block">{bot.appId || 'Not Configured'}</span>
                                            </div>
                                            <div className="bg-black p-2 border border-zinc-900">
                                                <span className="text-[8px] text-zinc-600 block uppercase font-bold">Latency</span>
                                                <span className="text-[10px] text-zinc-400 font-mono block">-- ms</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" className="flex-1 border-zinc-800 text-[10px] font-bold uppercase tracking-widest h-8 rounded-none">
                                                <Settings size={12} className="mr-2" />
                                                Config
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDeleteBot(bot.id)}
                                                className="w-10 border-zinc-800 text-zinc-600 hover:text-red-500 hover:border-red-500/50 h-8 rounded-none px-0"
                                            >
                                                <Trash2 size={12} />
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            <BotCreator
                isOpen={isCreating}
                onClose={() => setIsCreating(false)}
                onCreated={(newBot: any) => {
                    setBots([...bots, { ...newBot, id: Date.now().toString(), status: 'draft', lastActive: new Date() }])
                    setIsCreating(false)
                }}
            />
        </div>
    )
}
