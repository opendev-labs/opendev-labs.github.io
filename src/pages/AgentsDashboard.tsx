import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { Plus, Bot, Sparkles, Brain, Zap, Globe, Search, MessageSquare, Loader2 } from "lucide-react"
import { LamaDB } from "../lib/lamaDB"
import { useAuth } from "../features/void/hooks/useAuth"

// Ported Shadcn-like components
import { Badge } from "../components/ui/shadcn/badge"
import { Button } from "../components/ui/shadcn/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/shadcn/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/shadcn/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../components/ui/shadcn/dialog"
import { Input } from "../components/ui/shadcn/input"
import { Label } from "../components/ui/shadcn/label"
import { Textarea } from "../components/ui/shadcn/textarea"

// Ported Agents components
import { AgentBuilder } from "../components/agents/agent-builder"
import { AgentCard } from "../components/agents/agent-card"

// Sample agent templates
const agentTemplates = [
    {
        id: "customer-service",
        name: "Customer Service Agent",
        description: "Handle customer inquiries and support requests",
        icon: <MessageSquare className="h-10 w-10 text-blue-500" />,
        skills: ["FAQ answering", "Issue resolution", "Ticket creation"],
        color: "blue",
    },
    {
        id: "data-analyst",
        name: "Data Analysis Agent",
        description: "Process and analyze data, generate insights",
        icon: <Brain className="h-10 w-10 text-purple-500" />,
        skills: ["Data processing", "Data visualization", "Report generation"],
        color: "purple",
    },
    {
        id: "content-creator",
        name: "Content Creation Agent",
        description: "Generate blog posts, social media content, and marketing copy",
        icon: <Sparkles className="h-10 w-10 text-pink-500" />,
        skills: ["Blog writing", "Social media posts", "SEO optimization"],
        color: "pink",
    },
    {
        id: "translation",
        name: "Translation Agent",
        description: "Translate content between multiple languages",
        icon: <Globe className="h-10 w-10 text-green-500" />,
        skills: ["Multi-language support", "Context preservation", "Technical terminology"],
        color: "green",
    },
    {
        id: "research",
        name: "Research Assistant",
        description: "Find information and summarize research findings",
        icon: <Search className="h-10 w-10 text-amber-500" />,
        skills: ["Web search", "Information synthesis", "Citation management"],
        color: "amber",
    },
]

// Sample user agents
const initialAgents = [
    {
        id: "1",
        name: "Support Bot",
        description: "Handles customer support inquiries for our product",
        lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: "active",
        type: "customer-service",
    },
    {
        id: "2",
        name: "Data Processor",
        description: "Analyzes CSV files and generates reports",
        lastModified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: "active",
        type: "data-analyst",
    },
]

export default function AgentsDashboard() {
    const location = useLocation()
    const { user, isAuthenticated } = useAuth()
    const [agents, setAgents] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreating, setIsCreating] = useState(false)
    const [newAgentName, setNewAgentName] = useState("")
    const [newAgentDescription, setNewAgentDescription] = useState("")
    const [activeTab, setActiveTab] = useState(location.pathname.endsWith('/new') ? "builder" : "my-agents")
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

    useEffect(() => {
        const fetchAgents = async () => {
            if (!isAuthenticated || !user) {
                setAgents(initialAgents)
                setIsLoading(false)
                return
            }

            try {
                const userContext = { uid: user.email, email: user.email }
                const storedAgents = await LamaDB.store.collection('agents', userContext).get()
                if (storedAgents.length > 0) {
                    setAgents(storedAgents)
                } else {
                    setAgents(initialAgents)
                }
            } catch (err) {
                console.error("Failed to fetch agents from LamaDB:", err)
                setAgents(initialAgents)
            } finally {
                setIsLoading(false)
            }
        }

        fetchAgents()
    }, [isAuthenticated, user])

    useEffect(() => {
        if (location.pathname.endsWith('/new')) {
            setActiveTab("builder")
        }
    }, [location.pathname])

    const handleCreateAgent = async () => {
        if (!newAgentName) return

        const newAgent = {
            id: Date.now().toString(),
            name: newAgentName,
            description: newAgentDescription || "No description provided",
            lastModified: new Date(),
            status: "draft",
            type: selectedTemplate || "custom",
        }

        if (isAuthenticated && user) {
            const userContext = { uid: user.email, email: user.email }
            await LamaDB.store.collection('agents', userContext).add(newAgent)
        }

        setAgents([...agents, newAgent])
        setNewAgentName("")
        setNewAgentDescription("")
        setSelectedTemplate(null)
        setIsCreating(false)
    }

    const handleDeleteAgent = async (id: string) => {
        if (isAuthenticated && user) {
            // Logic for deleting from LamaDB if available
        }
        setAgents(agents.filter((agent) => agent.id !== id))
    }

    const handleUseTemplate = (templateId: string) => {
        const template = agentTemplates.find((t) => t.id === templateId)
        if (template) {
            setNewAgentName(template.name)
            setNewAgentDescription(template.description)
            setSelectedTemplate(templateId)
            setIsCreating(true)
        }
    }

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3 },
        },
    }

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    return (
        <div className="p-8 md:p-12 animate-in fade-in duration-700 max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-bold text-zinc-500 mb-6 uppercase tracking-[0.3em]">
                        <Bot size={12} />
                        <span>Autonomous // Agentic Node</span>
                    </div>
                    <h1 className="text-5xl font-bold tracking-tighter lowercase leading-none">
                        agent<br /><span className="text-zinc-600">dashboard.</span>
                    </h1>
                </div>
                <Dialog open={isCreating} onOpenChange={setIsCreating}>
                    <DialogTrigger asChild>
                        <Button size="lg" className="bg-orange-600 text-white font-bold hover:bg-orange-500 transition-colors uppercase tracking-[0.2em] text-[10px] h-12 px-8">
                            <Plus className="mr-2 h-4 w-4" />
                            Build Agent
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-900 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-2xl tracking-tighter font-bold">Create New Agent</DialogTitle>
                            <DialogDescription className="text-zinc-500">
                                {selectedTemplate
                                    ? "Customize this template to create your agent."
                                    : "Give your agent a name and description to get started."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            {selectedTemplate && (
                                <div className="flex items-center gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-none">
                                    {agentTemplates.find((t) => t.id === selectedTemplate)?.icon}
                                    <div>
                                        <h4 className="font-bold text-sm">
                                            Template: {agentTemplates.find((t) => t.id === selectedTemplate)?.name}
                                        </h4>
                                        <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Ready for initialization</p>
                                    </div>
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Customer Support Bot"
                                    value={newAgentName}
                                    onChange={(e) => setNewAgentName(e.target.value)}
                                    className="bg-black border-zinc-900 rounded-none focus:border-orange-500 transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="What does this agent do?"
                                    value={newAgentDescription}
                                    onChange={(e) => setNewAgentDescription(e.target.value)}
                                    className="bg-black border-zinc-900 rounded-none focus:border-orange-500 transition-colors min-h-[100px]"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsCreating(false)
                                    setSelectedTemplate(null)
                                }}
                                className="border-zinc-800 text-zinc-400 hover:text-white"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreateAgent}
                                disabled={!newAgentName}
                                className="bg-orange-600 hover:bg-orange-500 text-white font-bold uppercase tracking-widest text-[10px]"
                            >
                                Initialize Agent
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                <TabsList className="grid w-full grid-cols-3 bg-zinc-950 border border-zinc-900 rounded-none h-12 p-1">
                    <TabsTrigger value="my-agents" className="rounded-none data-[state=active]:bg-zinc-900 data-[state=active]:text-white text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">My Agents</TabsTrigger>
                    <TabsTrigger value="templates" className="rounded-none data-[state=active]:bg-zinc-900 data-[state=active]:text-white text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">Templates</TabsTrigger>
                    <TabsTrigger value="builder" className="rounded-none data-[state=active]:bg-zinc-900 data-[state=active]:text-white text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">Architect</TabsTrigger>
                </TabsList>

                <TabsContent value="my-agents" className="space-y-4">
                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center">
                            <Loader2 className="h-12 w-12 text-orange-500 animate-spin mb-4" />
                            <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Synchronizing with Mesh...</span>
                        </div>
                    ) : agents.length === 0 ? (
                        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                            <Card className="bg-zinc-950 border-zinc-900 rounded-none border-dashed py-20">
                                <CardContent className="flex flex-col items-center justify-center">
                                    <Bot className="h-16 w-16 text-zinc-800 mb-6" />
                                    <p className="text-center text-zinc-500 mb-8 font-medium">No active agents in this node.</p>
                                    <Button
                                        className="bg-orange-600 hover:bg-orange-500 text-white font-bold uppercase tracking-widest text-[10px] h-12 px-8"
                                        onClick={() => setIsCreating(true)}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Deploy your first agent
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            className="grid gap-1 md:grid-cols-2 lg:grid-cols-3 bg-zinc-900 border border-zinc-900"
                        >
                            {agents.map((agent: any) => (
                                <div key={agent.id} className="bg-black h-full">
                                    <AgentCard
                                        agent={agent}
                                        template={agentTemplates.find((t: any) => t.id === agent.type)}
                                        onDelete={() => handleDeleteAgent(agent.id)}
                                    />
                                </div>
                            ))}
                        </motion.div>
                    )}
                </TabsContent>

                <TabsContent value="templates" className="space-y-4">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="grid gap-1 md:grid-cols-2 lg:grid-cols-3 bg-zinc-900 border border-zinc-900"
                    >
                        {agentTemplates.map((template) => (
                            <motion.div key={template.id} variants={fadeInUp} className="bg-black p-1">
                                <Card className="overflow-hidden h-full bg-black border-transparent rounded-none hover:bg-zinc-950 transition-colors duration-500">
                                    <CardHeader className="pb-0">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-none shadow-sm">{template.icon}</div>
                                            <Badge variant="outline" className="bg-orange-500/10 border-orange-500/20 text-orange-400 rounded-none text-[8px] tracking-widest uppercase py-1">
                                                Template
                                            </Badge>
                                        </div>
                                        <CardTitle className="tracking-tighter font-bold text-2xl lowercase">{template.name}</CardTitle>
                                        <CardDescription className="text-zinc-500 font-medium text-sm leading-relaxed mt-2">{template.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-8">
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Capabilities</h4>
                                            <ul className="grid grid-cols-1 gap-2">
                                                {template.skills.map((skill, index) => (
                                                    <li key={index} className="flex items-center text-xs font-medium text-zinc-400">
                                                        <Zap className="mr-3 h-3 w-3 text-orange-500" />
                                                        {skill}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="pt-8">
                                        <Button
                                            className="w-full bg-white text-black font-bold hover:bg-orange-500 hover:text-white transition-all duration-300 uppercase tracking-widest text-[10px] h-12 rounded-none"
                                            onClick={() => handleUseTemplate(template.id)}
                                        >
                                            <Sparkles className="mr-2 h-4 w-4" />
                                            Initialize From Template
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </TabsContent>

                <TabsContent value="builder" className="space-y-4">
                    <div className="bg-zinc-950 border border-zinc-900 p-1">
                        <AgentBuilder />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
