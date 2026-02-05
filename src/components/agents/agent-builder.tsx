"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "../ui/shadcn/button"
import { Input } from "../ui/shadcn/input"
import { Label } from "../ui/shadcn/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/shadcn/select"
import { Textarea } from "../ui/shadcn/textarea"
import { Separator } from "../ui/shadcn/separator"
import { ArrowRight, Bot, Code, Database, FileText, MessageSquare, Save, Trash, Wand2 } from "lucide-react"
import { toast } from "../../hooks/shadcn/use-toast"
import { Card } from "../ui/shadcn/card"

// Node types for the agent builder
type NodeType = "trigger" | "skill" | "condition" | "response" | "api" | "database"

interface Node {
  id: string
  type: NodeType
  x: number
  y: number
  data: {
    name: string
    description?: string
    config?: Record<string, any>
  }
}

interface Connection {
  id: string
  source: string
  target: string
}

export function AgentBuilder() {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: "trigger-1",
      type: "trigger",
      x: 100,
      y: 100,
      data: {
        name: "User Message",
        description: "Triggered when a user sends a message",
      },
    },
    {
      id: "skill-1",
      type: "skill",
      x: 400,
      y: 100,
      data: {
        name: "Process Message",
        description: "Analyze the user's message",
      },
    },
    {
      id: "response-1",
      type: "response",
      x: 700,
      y: 100,
      data: {
        name: "Send Response",
        description: "Reply to the user",
      },
    },
  ])

  const [connections, setConnections] = useState<Connection[]>([
    {
      id: "conn-1",
      source: "trigger-1",
      target: "skill-1",
    },
    {
      id: "conn-2",
      source: "skill-1",
      target: "response-1",
    },
  ])

  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isCreatingConnection, setIsCreatingConnection] = useState(false)
  const [connectionStart, setConnectionStart] = useState<{ id: string; x: number; y: number } | null>(null)
  const [connectionEnd, setConnectionEnd] = useState<{ x: number; y: number } | null>(null)

  const canvasRef = useRef<HTMLDivElement>(null)

  // Get the selected node
  const getSelectedNode = () => {
    if (!selectedNode) return null
    return nodes.find((node) => node.id === selectedNode) || null
  }

  // Handle node selection
  const handleNodeSelect = (id: string) => {
    setSelectedNode(id)
  }

  // Handle node drag start
  const handleNodeDragStart = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const node = nodes.find((n) => n.id === id)
    if (!node) return

    setDraggedNode(id)
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  // Handle node drag
  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (draggedNode) {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left - dragOffset.x
      const y = e.clientY - rect.top - dragOffset.y

      setNodes(nodes.map((node) => (node.id === draggedNode ? { ...node, x, y } : node)))
    }

    if (isCreatingConnection && connectionStart) {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      setConnectionEnd({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  // Handle node drag end
  const handleCanvasMouseUp = () => {
    setDraggedNode(null)

    if (isCreatingConnection) {
      setIsCreatingConnection(false)
      setConnectionStart(null)
      setConnectionEnd(null)
    }
  }

  // Handle canvas click (deselect nodes)
  const handleCanvasClick = () => {
    setSelectedNode(null)
  }

  // Handle connection start
  const handleConnectionStart = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const node = nodes.find((n) => n.id === id)
    if (!node) return

    setIsCreatingConnection(true)
    setConnectionStart({
      id,
      x: node.x + 200, // Assuming node width is 200
      y: node.y + 50, // Assuming node height is 100
    })
    setConnectionEnd({
      x: e.clientX,
      y: e.clientY,
    })
  }

  // Handle connection end
  const handleConnectionEnd = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!isCreatingConnection || !connectionStart) return

    // Don't connect to self
    if (connectionStart.id === id) {
      setIsCreatingConnection(false)
      setConnectionStart(null)
      setConnectionEnd(null)
      return
    }

    // Check if connection already exists
    const connectionExists = connections.some((conn) => conn.source === connectionStart.id && conn.target === id)

    if (!connectionExists) {
      const newConnection: Connection = {
        id: `conn-${Date.now()}`,
        source: connectionStart.id,
        target: id,
      }

      setConnections([...connections, newConnection])
    }

    setIsCreatingConnection(false)
    setConnectionStart(null)
    setConnectionEnd(null)
  }

  // Add a new node
  const addNode = (type: NodeType) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      x: 100,
      y: 100,
      data: {
        name: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        description: `Description for new ${type}`,
      },
    }

    setNodes([...nodes, newNode])
    setSelectedNode(newNode.id)

    toast({
      title: "Node added",
      description: `Added a new ${type} node to your agent.`,
    })
  }

  // Delete a node
  const deleteNode = (id: string) => {
    setNodes(nodes.filter((node) => node.id !== id))
    setConnections(connections.filter((conn) => conn.source !== id && conn.target !== id))

    if (selectedNode === id) {
      setSelectedNode(null)
    }

    toast({
      title: "Node deleted",
      description: "The node has been removed from your agent.",
    })
  }

  // Update node data
  const updateNodeData = (id: string, data: Partial<Node["data"]>) => {
    setNodes(nodes.map((node) => (node.id === id ? { ...node, data: { ...node.data, ...data } } : node)))
  }

  // Save the agent
  const saveAgent = () => {
    toast({
      title: "Agent saved",
      description: "Your agent has been saved successfully.",
    })
  }

  // Get node color based on type
  const getNodeColor = (type: NodeType) => {
    switch (type) {
      case "trigger":
        return "bg-orange-500/10 border-orange-500/30 dark:bg-blue-900/50 dark:border-blue-700"
      case "skill":
        return "bg-zinc-900 border-zinc-800 dark:bg-green-900/50 dark:border-green-700"
      case "condition":
        return "bg-yellow-100 border-yellow-300 dark:bg-yellow-900/50 dark:border-yellow-700"
      case "response":
        return "bg-orange-500/5 border-orange-500/20 dark:bg-purple-900/50 dark:border-purple-700"
      case "api":
        return "bg-red-100 border-red-300 dark:bg-red-900/50 dark:border-red-700"
      case "database":
        return "bg-cyan-100 border-cyan-300 dark:bg-cyan-900/50 dark:border-cyan-700"
      default:
        return "bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-700"
    }
  }

  // Get node icon based on type
  const getNodeIcon = (type: NodeType) => {
    switch (type) {
      case "trigger":
        return <MessageSquare className="h-4 w-4" />
      case "skill":
        return <Wand2 className="h-4 w-4" />
      case "condition":
        return <ArrowRight className="h-4 w-4" />
      case "response":
        return <Bot className="h-4 w-4" />
      case "api":
        return <Code className="h-4 w-4" />
      case "database":
        return <Database className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  // Add zoom and pan functionality
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [startPanPosition, setStartPanPosition] = useState({ x: 0, y: 0 })

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    const newScale = Math.min(Math.max(0.5, scale * delta), 2)
    setScale(newScale)
  }

  const handlePanStart = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      // Middle mouse button or Alt+Left click
      e.preventDefault()
      setIsPanning(true)
      setStartPanPosition({ x: e.clientX, y: e.clientY })
    }
  }

  const handlePanMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - startPanPosition.x
      const dy = e.clientY - startPanPosition.y
      setPosition({
        x: position.x + dx,
        y: position.y + dy,
      })
      setStartPanPosition({ x: e.clientX, y: e.clientY })
    }
  }

  const handlePanEnd = () => {
    setIsPanning(false)
  }

  return (
    <Card className="flex h-[calc(100vh-12rem)] overflow-hidden">
      {/* Left sidebar - Node palette */}
      <div className="w-64 border-r p-4">
        <h3 className="font-medium mb-4">Components</h3>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start" onClick={() => addNode("trigger")}>
            <MessageSquare className="mr-2 h-4 w-4 text-orange-500" />
            Trigger
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => addNode("skill")}>
            <Wand2 className="mr-2 h-4 w-4 text-zinc-400" />
            Skill
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => addNode("condition")}>
            <ArrowRight className="mr-2 h-4 w-4 text-yellow-500" />
            Condition
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => addNode("response")}>
            <Bot className="mr-2 h-4 w-4 text-orange-400" />
            Response
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => addNode("api")}>
            <Code className="mr-2 h-4 w-4 text-red-500" />
            API Call
          </Button>
          <Button variant="outline" className="w-full justify-start" onClick={() => addNode("database")}>
            <Database className="mr-2 h-4 w-4 text-cyan-500" />
            Database
          </Button>
        </div>

        <Separator className="my-4" />

        <Button
          className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
          onClick={saveAgent}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Agent
        </Button>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <Label>Zoom: {Math.round(scale * 100)}%</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setScale(1)
                setPosition({ x: 0, y: 0 })
              }}
            >
              Reset
            </Button>
          </div>
          <div className="text-xs text-zinc-500">
            <p>Middle-click or Alt+drag to pan</p>
            <p>Scroll to zoom in/out</p>
          </div>
        </div>
      </div>

      {/* Center - Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <div
          ref={canvasRef}
          className="w-full h-full agent-builder-canvas"
          onMouseMove={(e) => {
            handleCanvasMouseMove(e)
            handlePanMove(e)
          }}
          onMouseUp={() => {
            handleCanvasMouseUp()
            handlePanEnd()
          }}
          onMouseDown={handlePanStart}
          onClick={handleCanvasClick}
          onWheel={handleWheel}
          style={{ cursor: isPanning ? "grabbing" : "default" }}
        >
          {/* Render connections */}
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{
              transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
              transformOrigin: "center",
            }}
          >
            {connections.map((connection) => {
              const sourceNode = nodes.find((node) => node.id === connection.source)
              const targetNode = nodes.find((node) => node.id === connection.target)

              if (!sourceNode || !targetNode) return null

              const sourceX = sourceNode.x + 200 // Assuming node width is 200
              const sourceY = sourceNode.y + 50 // Assuming node height is 100
              const targetX = targetNode.x
              const targetY = targetNode.y + 50 // Assuming node height is 100

              return (
                <g key={connection.id}>
                  <path
                    d={`M ${sourceX} ${sourceY} C ${sourceX + 50} ${sourceY}, ${targetX - 50} ${targetY}, ${targetX} ${targetY}`}
                    fill="none"
                    className="connection-line"
                  />
                  <circle cx={targetX} cy={targetY} r="4" className="connection-point" />
                </g>
              )
            })}

            {/* Render connection being created */}
            {isCreatingConnection && connectionStart && connectionEnd && (
              <path
                d={`M ${connectionStart.x} ${connectionStart.y} C ${connectionStart.x + 50} ${connectionStart.y}, ${connectionEnd.x - 50} ${connectionEnd.y}, ${connectionEnd.x} ${connectionEnd.y}`}
                fill="none"
                className="connection-line"
                strokeDasharray="5,5"
              />
            )}
          </svg>

          {/* Render nodes */}
          <div
            style={{
              transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
              transformOrigin: "center",
            }}
          >
            {nodes.map((node) => (
              <motion.div
                key={node.id}
                className={`node absolute border-2 ${getNodeColor(node.type)} ${selectedNode === node.id ? "ring-2 ring-primary" : ""}`}
                style={{ left: `${node.x}px`, top: `${node.y}px` }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleNodeSelect(node.id)
                }}
                onMouseDown={(e) => handleNodeDragStart(e, node.id)}
              >
                <div className="flex items-center justify-between p-2 border-b border-inherit">
                  <div className="flex items-center">
                    {getNodeIcon(node.type)}
                    <span className="ml-2 font-medium text-sm">{node.data.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNode(node.id)
                    }}
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
                <div className="p-2">
                  <p className="text-xs text-zinc-500">{node.data.description}</p>
                </div>

                {/* Connection handles */}
                <div className="node-handle node-handle-right" onMouseDown={(e) => handleConnectionStart(e, node.id)} />
                <div className="node-handle node-handle-left" onMouseUp={(e) => handleConnectionEnd(e, node.id)} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right sidebar - Properties */}
      <div className="w-80 border-l p-4">
        <h3 className="font-medium mb-4">Properties</h3>
        {selectedNode ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="node-name">Name</Label>
              <Input
                id="node-name"
                value={getSelectedNode()?.data.name || ""}
                onChange={(e) => updateNodeData(selectedNode, { name: e.target.value })}
                className="glass"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="node-description">Description</Label>
              <Textarea
                id="node-description"
                value={getSelectedNode()?.data.description || ""}
                onChange={(e) => updateNodeData(selectedNode, { description: e.target.value })}
                className="glass min-h-[100px]"
              />
            </div>

            {/* Type-specific properties */}
            {getSelectedNode()?.type === "skill" && (
              <div className="space-y-2">
                <Label htmlFor="skill-type">Skill Type</Label>
                <Select
                  value={getSelectedNode()?.data.config?.skillType || "text-processing"}
                  onValueChange={(value) =>
                    updateNodeData(selectedNode, {
                      config: { ...getSelectedNode()?.data.config, skillType: value },
                    })
                  }
                >
                  <SelectTrigger id="skill-type" className="glass">
                    <SelectValue placeholder="Select skill type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text-processing">Text Processing</SelectItem>
                    <SelectItem value="image-analysis">Image Analysis</SelectItem>
                    <SelectItem value="data-extraction">Data Extraction</SelectItem>
                    <SelectItem value="sentiment-analysis">Sentiment Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {getSelectedNode()?.type === "response" && (
              <div className="space-y-2">
                <Label htmlFor="response-template">Response Template</Label>
                <Textarea
                  id="response-template"
                  placeholder="Enter response template..."
                  value={getSelectedNode()?.data.config?.template || ""}
                  onChange={(e) =>
                    updateNodeData(selectedNode, {
                      config: { ...getSelectedNode()?.data.config, template: e.target.value },
                    })
                  }
                  className="glass min-h-[100px]"
                />
              </div>
            )}

            {getSelectedNode()?.type === "api" && (
              <div className="space-y-2">
                <Label htmlFor="api-endpoint">API Endpoint</Label>
                <Input
                  id="api-endpoint"
                  placeholder="https://api.example.com/endpoint"
                  value={getSelectedNode()?.data.config?.endpoint || ""}
                  onChange={(e) =>
                    updateNodeData(selectedNode, {
                      config: { ...getSelectedNode()?.data.config, endpoint: e.target.value },
                    })
                  }
                  className="glass"
                />
                <Label htmlFor="api-method">Method</Label>
                <Select
                  value={getSelectedNode()?.data.config?.method || "GET"}
                  onValueChange={(value) =>
                    updateNodeData(selectedNode, {
                      config: { ...getSelectedNode()?.data.config, method: value },
                    })
                  }
                >
                  <SelectTrigger id="api-method" className="glass">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {getSelectedNode()?.type === "database" && (
              <div className="space-y-2">
                <Label htmlFor="db-operation">Database Operation</Label>
                <Select
                  value={getSelectedNode()?.data.config?.operation || "query"}
                  onValueChange={(value) =>
                    updateNodeData(selectedNode, {
                      config: { ...getSelectedNode()?.data.config, operation: value },
                    })
                  }
                >
                  <SelectTrigger id="db-operation" className="glass">
                    <SelectValue placeholder="Select operation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="query">Query</SelectItem>
                    <SelectItem value="insert">Insert</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="delete">DELETE</SelectItem>
                  </SelectContent>
                </Select>
                <Label htmlFor="db-query">Query</Label>
                <Textarea
                  id="db-query"
                  placeholder="Enter database query..."
                  value={getSelectedNode()?.data.config?.query || ""}
                  onChange={(e) =>
                    updateNodeData(selectedNode, {
                      config: { ...getSelectedNode()?.data.config, query: e.target.value },
                    })
                  }
                  className="glass min-h-[100px]"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-zinc-500">
            <p>Select a node to view and edit its properties</p>
          </div>
        )}
      </div>
    </Card>
  )
}
