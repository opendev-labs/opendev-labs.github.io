import React, { useState } from "react"
import { Bot, Zap, Globe, Smartphone, Shield, Plus, Info, ExternalLink, ChevronRight, ChevronLeft, Check } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/shadcn/dialog"
import { Button } from "../../../components/ui/shadcn/button"
import { Input } from "../../../components/ui/shadcn/input"
import { Label } from "../../../components/ui/shadcn/label"
import { Textarea } from "../../../components/ui/shadcn/textarea"
import { Badge } from "../../../components/ui/shadcn/badge"
import { motion, AnimatePresence } from "framer-motion"

interface BotCreatorProps {
    isOpen: boolean;
    onClose: () => void;
    onCreated: (bot: any) => void;
}

export const BotCreator: React.FC<BotCreatorProps> = ({ isOpen, onClose, onCreated }) => {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        platform: "discord" as "discord" | "telegram" | "whatsapp",
        appId: "",
        publicKey: "",
        iconUrl: ""
    })

    const platforms = [
        { id: 'discord', name: 'Discord', icon: Zap, color: 'text-indigo-400', desc: 'Enterprise interaction bot' },
        { id: 'telegram', name: 'Telegram', icon: Globe, color: 'text-blue-400', desc: 'Secure messaging agent' },
        { id: 'whatsapp', name: 'WhatsApp', icon: Smartphone, color: 'text-emerald-400', desc: 'Direct business conduit' },
    ]

    const handleNext = () => setStep(step + 1)
    const handleBack = () => setStep(step - 1)

    const handleSubmit = () => {
        onCreated(formData)
        setStep(1)
        setFormData({
            name: "",
            description: "",
            platform: "discord",
            appId: "",
            publicKey: "",
            iconUrl: ""
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] bg-zinc-950 border-zinc-900 text-white p-0 overflow-hidden rounded-none border-t-4 border-t-orange-600">
                <div className="p-8">
                    <DialogHeader className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-orange-500">{step}/3</span>
                            </div>
                            <DialogTitle className="text-3xl font-bold tracking-tighter lowercase">
                                {step === 1 && "Select Mesh Channel"}
                                {step === 2 && "Bot Credentials"}
                                {step === 3 && "Identity Protocol"}
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-zinc-500 text-xs uppercase tracking-widest font-bold">
                            {step === 1 && "Choose the primary substrate for your autonomous agent."}
                            {step === 2 && "Configure the cryptographic bridge to the platform."}
                            {step === 3 && "Establish the visual and narrative profile."}
                        </DialogDescription>
                    </DialogHeader>

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="grid grid-cols-1 gap-2"
                            >
                                {platforms.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => setFormData({ ...formData, platform: p.id as any })}
                                        className={`flex items-center gap-4 p-4 border transition-all text-left group ${formData.platform === p.id
                                                ? 'bg-zinc-900 border-orange-500'
                                                : 'bg-black border-zinc-900 hover:border-zinc-700'
                                            }`}
                                    >
                                        <div className={`p-3 bg-zinc-950 border ${formData.platform === p.id ? 'border-orange-500/50' : 'border-zinc-800'}`}>
                                            <p.icon size={20} className={p.color} />
                                        </div>
                                        <div>
                                            <p className="font-bold uppercase tracking-widest text-[11px]">{p.name}</p>
                                            <p className="text-[10px] text-zinc-500">{p.desc}</p>
                                        </div>
                                        {formData.platform === p.id && (
                                            <Check size={16} className="ml-auto text-orange-500" />
                                        )}
                                    </button>
                                ))}
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">Application ID</Label>
                                        <Input
                                            placeholder="Found in Developer Portal"
                                            value={formData.appId}
                                            onChange={(e) => setFormData({ ...formData, appId: e.target.value })}
                                            className="bg-black border-zinc-900 focus:border-orange-500 rounded-none h-12 text-sm font-mono"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">Public Key</Label>
                                        <Input
                                            placeholder="Cryptographic key for interaction signing"
                                            value={formData.publicKey}
                                            onChange={(e) => setFormData({ ...formData, publicKey: e.target.value })}
                                            className="bg-black border-zinc-900 focus:border-orange-500 rounded-none h-12 text-sm font-mono"
                                        />
                                    </div>
                                </div>
                                <div className="p-4 bg-zinc-900 border border-zinc-800 flex items-start gap-4">
                                    <Info size={16} className="text-orange-500 mt-1 shrink-0" />
                                    <div>
                                        <p className="text-[10px] text-zinc-400 leading-relaxed font-medium">
                                            Need the credentials? Access the <a href="https://discord.com/developers/applications" target="_blank" className="text-white underline hover:text-orange-500 transition-colors">Discord Developer Portal</a> to materialize your application ID and public key.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">Bot Name</Label>
                                        <Input
                                            placeholder="e.g. opendev-bots"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="bg-black border-zinc-900 focus:border-orange-500 rounded-none h-12 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500">Description</Label>
                                        <Textarea
                                            placeholder="Transmission summary..."
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="bg-black border-zinc-900 focus:border-orange-500 rounded-none text-sm min-h-[100px]"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <DialogFooter className="bg-zinc-900/50 p-6 flex flex-row justify-between items-center sm:justify-between border-t border-zinc-900">
                    <Button
                        variant="ghost"
                        onClick={step === 1 ? onClose : handleBack}
                        className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white"
                    >
                        {step === 1 ? "Abort" : "Back"}
                    </Button>
                    <Button
                        onClick={step === 3 ? handleSubmit : handleNext}
                        disabled={(step === 2 && (!formData.appId || !formData.publicKey)) || (step === 3 && !formData.name)}
                        className="bg-orange-600 hover:bg-orange-500 text-white font-bold uppercase tracking-widest text-[10px] h-10 px-8 rounded-none transition-all"
                    >
                        {step === 3 ? "Initialize Protocol" : "Advance"}
                        <ChevronRight size={14} className="ml-2" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
