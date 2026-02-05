"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/shadcn/card"
import { Button } from "../ui/shadcn/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/shadcn/dropdown-menu"
import { Badge } from "../ui/shadcn/badge"
import { Bot, Copy, MoreHorizontal, Pencil, Play, Trash } from "lucide-react"
import { toast } from "../../hooks/shadcn/use-toast"

interface AgentCardProps {
  agent: {
    id: string
    name: string
    description: string
    lastModified: Date
    status: string
    type: string
  }
  template?: {
    icon: React.ReactNode
    color: string
  }
  onDelete: () => void
}

export function AgentCard({ agent, template, onDelete }: AgentCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const handleCopy = () => {
    toast({
      title: "Agent copied",
      description: "A copy of this agent has been created.",
    })
  }

  const handleDeploy = () => {
    toast({
      title: "Agent deployed",
      description: "Your agent is now live and ready to use.",
    })
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className="hover-card"
    >
      <Card className="h-full overflow-hidden">
        <CardHeader className={`pb-2 ${template ? `bg-${template.color}-500/10` : ""}`}>
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="mr-3">{template?.icon || <Bot className="h-8 w-8 text-primary" />}</div>
              <div>
                <CardTitle className="text-lg">{agent.name}</CardTitle>
                <CardDescription>Last modified: {formatDate(agent.lastModified)}</CardDescription>
              </div>
            </div>
            <div className="flex items-center">
              <Badge variant={agent.status === "active" ? "default" : "secondary"} className="mr-2">
                {agent.status === "active" ? "Active" : "Draft"}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleCopy}>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Duplicate</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Pencil className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={onDelete}>
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground">{agent.description}</p>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
            onClick={handleDeploy}
          >
            <Play className="mr-2 h-4 w-4" />
            {agent.status === "active" ? "Test Agent" : "Deploy Agent"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
