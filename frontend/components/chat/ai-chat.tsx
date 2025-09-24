"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BarChart3, Bot, Crown, Image as ImageIcon, Lightbulb, Mic, Send, TrendingUp, User, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  suggestions?: string[]
  images?: { id: string; url: string; fileName: string }[]
}

const initialMessages: Message[] = [
  {
    id: "1",
    content:
      "Hello! I'm your AI business assistant. I can help you validate ideas, analyze markets, create business models, and provide strategic guidance. What would you like to explore today?",
    sender: "ai",
    timestamp: new Date(),
    suggestions: [
      "Analyze my eco-packaging idea",
      "What's the market size for language learning apps?",
      "Help me create a business model",
      "Show me competitor analysis",
    ],
  },
]

const quickPrompts = [
  { icon: Lightbulb, text: "Validate my business idea", category: "Validation" },
  { icon: TrendingUp, text: "Analyze market opportunity", category: "Market Research" },
  { icon: BarChart3, text: "Create financial projections", category: "Finance" },
  { icon: User, text: "Define target customers", category: "Strategy" },
]

export interface AIChatProps {
  seedPrompt?: string
  title?: string
}

export function AIChat({ seedPrompt, title }: AIChatProps = {}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messageCount, setMessageCount] = useState(1)
  const [pendingImages, setPendingImages] = useState<{ id: string; url: string; file: File; fileName: string }[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const seededRef = useRef(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-seed the chat with context once
  useEffect(() => {
    if (seedPrompt && !seededRef.current) {
      seededRef.current = true
      // Tiny delay to let initial AI message render first
      const t = setTimeout(() => handleSendMessage(seedPrompt), 200)
      return () => clearTimeout(t)
    }
  }, [seedPrompt])

  const handleSendMessage = async (content: string) => {
    if (!content.trim() && pendingImages.length === 0) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: "user",
      timestamp: new Date(),
      images: pendingImages.map(img => ({ id: img.id, url: img.url, fileName: img.fileName }))
    }

    setMessages((prev) => [...prev, userMessage])
  setInputValue("")
  setPendingImages([])
    setIsLoading(true)
    setMessageCount((prev) => prev + 1)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(content),
        sender: "ai",
        timestamp: new Date(),
        suggestions: generateSuggestions(content),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string): string => {
    const responses = [
      "That's an interesting business idea! Based on my analysis, I can see several opportunities in this market. Let me break down the key factors you should consider...",
      "Great question! Market analysis shows promising trends in this sector. Here are the key insights I've gathered from current market data...",
      "I'd be happy to help you develop a comprehensive business model. Let's start by identifying your value proposition and target market segments...",
      "Based on similar successful businesses, I can provide you with strategic recommendations. Here's what the data suggests...",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const generateSuggestions = (userInput: string): string[] => {
    const suggestions = [
      "Tell me more about the target market",
      "What are the main competitors?",
      "How much funding would I need?",
      "What's the timeline to launch?",
      "Show me financial projections",
    ]
    return suggestions.slice(0, 3)
  }

  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt)
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const next: { id: string; url: string; file: File; fileName: string }[] = []
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue
      next.push({ id: crypto.randomUUID(), url: URL.createObjectURL(file), file, fileName: file.name })
    }
    setPendingImages(prev => [...prev, ...next])
    // Reset input so same file can be picked again
    e.target.value = ''
  }

  const removePendingImage = (id: string) => {
    setPendingImages(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{title || "AI Business Assistant"}</h1>
          <p className="text-muted-foreground mt-1">Get instant insights and guidance for your business ideas.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs">
            {messageCount}/50 messages used
          </Badge>
          <Badge className="bg-primary/10 text-primary border-primary/20">
            <Crown className="w-3 h-3 mr-1" />
            Free Plan
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quick Prompts Sidebar */}
        <div className="lg:col-span-1">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Quick Prompts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left h-auto p-3 bg-transparent"
                  onClick={() => handleQuickPrompt(prompt.text)}
                >
                  <div className="flex items-start gap-3">
                    <prompt.icon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">{prompt.text}</div>
                      <div className="text-xs text-muted-foreground">{prompt.category}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Upgrade Prompt */}
          <Card className="border-primary/20 bg-primary/5 mt-6">
            <CardContent className="p-4">
              <div className="text-center">
                <Crown className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-1">Upgrade to Pro</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Get unlimited AI chat and advanced business insights
                </p>
                <Button size="sm" className="w-full">
                  Upgrade Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="border-border h-[600px] flex flex-col">
            <CardHeader className="border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">BizPilot AI</CardTitle>
                  <p className="text-sm text-muted-foreground">Your intelligent business advisor</p>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender === "ai" && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary/10">
                        <Bot className="w-4 h-4 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className={`max-w-[80%] ${message.sender === "user" ? "order-first" : ""}`}>
                    <div
                      className={`rounded-lg p-3 ${
                        message.sender === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      {message.images && message.images.length > 0 && (
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          {message.images.map(img => (
                            <div key={img.id} className="relative group border rounded overflow-hidden">
                              <img src={img.url} alt={img.fileName} className="w-full h-20 object-cover" />
                              <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-[10px] text-white px-1 truncate">
                                {img.fileName}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {message.suggestions && (
                      <div className="mt-2 space-y-1">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            className="text-xs h-auto p-2 text-left justify-start bg-background hover:bg-muted"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>

                  {message.sender === "user" && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-secondary">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary/10">
                      <Bot className="w-4 h-4 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Pending image previews (before send) */}
            {pendingImages.length > 0 && (
              <div className="border-t border-border px-4 pt-4">
                <div className="grid grid-cols-5 gap-3">
                  {pendingImages.map(img => (
                    <div key={img.id} className="relative group">
                      <img src={img.url} alt={img.fileName} className="w-full h-24 object-cover rounded border" />
                      <button
                        onClick={() => removePendingImage(img.id)}
                        className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        aria-label="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-[10px] text-white px-1 truncate rounded-b">
                        {img.fileName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Ask me anything about your business ideas..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
                    className="pr-10"
                  />
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                    <label className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md hover:bg-muted cursor-pointer border border-transparent hover:border-border transition">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      <ImageIcon className="w-4 h-4 text-muted-foreground" />
                    </label>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Mic className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={(!inputValue.trim() && pendingImages.length === 0) || isLoading}
                  className="glow-primary"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {50 - messageCount} messages remaining this month •{" "}
                <span className="text-primary cursor-pointer">Upgrade for unlimited</span>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
