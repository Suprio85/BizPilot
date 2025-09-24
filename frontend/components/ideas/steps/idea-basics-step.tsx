"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DollarSign, MapPin, Mic, Upload } from "lucide-react"
import { useRef, useState, useEffect } from "react"

interface IdeaBasicsStepProps {
  formData: any
  setFormData: (data: any) => void
}

export function IdeaBasicsStep({ formData, setFormData }: IdeaBasicsStepProps) {
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleVoiceInput = () => {
    try {
      // Check if running in browser environment
      if (typeof window === 'undefined') {
        console.warn("SpeechRecognition not available in server environment")
        return
      }

      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (!SR) {
        console.warn("SpeechRecognition API not supported in this browser")
        alert("Voice input isn't supported in this browser. Try Chrome or Edge on desktop/mobile.")
        return
      }

      // If already listening, stop the recognition
      if (isListening && recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          console.warn("Failed to stop recognition", e)
          setIsListening(false)
        }
        return
      }

      // Create new recognition instance each time to avoid state issues
      const recognition = new SR()
      recognition.lang = "en-US"
      recognition.continuous = false
      recognition.interimResults = false
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        console.log("Speech recognition started")
        setIsListening(true)
      }

      recognition.onend = () => {
        console.log("Speech recognition ended")
        setIsListening(false)
        recognitionRef.current = null // Clear reference
      }

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
        recognitionRef.current = null
        
        // Provide user-friendly error messages
        switch (event.error) {
          case 'no-speech':
            alert("No speech was detected. Please try again.")
            break
          case 'audio-capture':
            alert("No microphone was found. Please check your microphone settings.")
            break
          case 'not-allowed':
            alert("Microphone access was denied. Please allow microphone access and try again.")
            break
          case 'network':
            alert("Network error occurred during speech recognition.")
            break
          default:
            alert(`Speech recognition error: ${event.error}`)
        }
      }

      recognition.onresult = (event: any) => {
        try {
          const transcript: string = Array.from(event.results)
            .map((result: any) => result[0]?.transcript || "")
            .join(" ")
            .trim()

          console.log("Speech recognition transcript:", transcript)

          if (transcript) {
            const newDescription = (formData.description || "").trim()
              ? `${formData.description}\n${transcript}`
              : transcript
            
            const newVoiceInput = formData.voiceInput 
              ? `${formData.voiceInput}\n${transcript}` 
              : transcript

            setFormData({
              ...formData,
              description: newDescription,
              voiceInput: newVoiceInput,
            })
          }
        } catch (error) {
          console.error("Error processing speech recognition result:", error)
        }
      }

      recognitionRef.current = recognition
      recognition.start()
      
    } catch (error) {
      console.error("Speech recognition error:", error)
      setIsListening(false)
      alert("Could not start voice input. Please check your microphone permissions.")
    }
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const toArray = Array.from(files)

    // Prepare metadata first
    const newUploadedFiles = toArray.map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type,
      lastModified: f.lastModified,
    }))

    // Try to read text from simple text files to auto-append
    const textReadable = toArray.filter(
      (f) => f.type.startsWith("text/") || /\.(md|txt)$/i.test(f.name)
    )

    const readTextPromises = textReadable.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(String(reader.result || ""))
          reader.onerror = () => resolve("")
          reader.readAsText(file)
        })
    )

    const texts = await Promise.all(readTextPromises)
    const combinedText = texts
      .map((t, i) => (t ? `\n\n[From ${textReadable[i].name}]\n${t.trim()}` : ""))
      .join("")

    const nextDescription = combinedText
      ? ((formData.description || "") + combinedText).trim()
      : formData.description

    setFormData({
      ...formData,
      description: nextDescription,
      uploadedFiles: [
        ...((formData.uploadedFiles as any[]) || []),
        ...newUploadedFiles,
      ],
    })

    // Allow selecting the same files again later
    if (fileInputRef.current) {
      try {
        fileInputRef.current.value = ""
      } catch {}
    }
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Business Idea Title *</Label>
        <Input
          id="title"
          placeholder="e.g., Eco-Friendly Packaging Solutions"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      {/* Description with voice/upload options */}
      <div className="space-y-2">
        <Label htmlFor="description">Brief Description *</Label>
        <div className="relative">
          <Textarea
            id="description"
            placeholder="Describe your business idea in a few sentences..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="min-h-[120px] pr-20"
            required
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <Button
              type="button"
              variant={isListening ? "secondary" : "ghost"}
              size="sm"
              onClick={handleVoiceInput}
              aria-pressed={isListening}
              title={isListening ? "Listening... click to stop" : "Use voice input"}
            >
              <Mic className={`w-4 h-4 ${isListening ? "text-primary" : ""}`} />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={handleFileUpload} title="Upload files">
              <Upload className="w-4 h-4" />
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            accept="text/plain,.md,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/rtf,image/*"
            onChange={(e) => handleFilesSelected(e.target.files)}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          You can use voice input or upload documents to describe your idea
        </p>
      </div>

      {/* Category and Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Business Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="retail">Retail & E-commerce</SelectItem>
              <SelectItem value="food">Food & Beverage</SelectItem>
              <SelectItem value="health">Health & Wellness</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="sustainability">Sustainability</SelectItem>
              <SelectItem value="services">Services</SelectItem>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Target Location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="location"
              placeholder="e.g., Dhaka, Bangladesh"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Budget and Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="budget">Initial Budget</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Select value={formData.budget} onValueChange={(value) => setFormData({ ...formData, budget: value })}>
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-1000">$0 - $1,000</SelectItem>
                <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                <SelectItem value="10000-25000">$10,000 - $25,000</SelectItem>
                <SelectItem value="25000-50000">$25,000 - $50,000</SelectItem>
                <SelectItem value="50000+">$50,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeline">Launch Timeline</Label>
          <Select value={formData.timeline} onValueChange={(value) => setFormData({ ...formData, timeline: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select timeline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-3months">1-3 months</SelectItem>
              <SelectItem value="3-6months">3-6 months</SelectItem>
              <SelectItem value="6-12months">6-12 months</SelectItem>
              <SelectItem value="1-2years">1-2 years</SelectItem>
              <SelectItem value="2years+">2+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
