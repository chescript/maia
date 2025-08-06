'use client'

import { useState, useEffect } from 'react'
import { Save, FileText, Clock } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface MyNotesProps {
  unitId: string
}

export function MyNotes({ unitId }: MyNotesProps) {
  const [notes, setNotes] = useState('')
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isAutoSaving, setIsAutoSaving] = useState(false)

  // Load notes on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(`notes-${unitId}`)
    if (savedNotes) {
      setNotes(savedNotes)
      const savedTime = localStorage.getItem(`notes-timestamp-${unitId}`)
      if (savedTime) {
        setLastSaved(new Date(savedTime))
      }
    }
  }, [unitId])

  // Auto-save functionality
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (notes.trim()) {
        setIsAutoSaving(true)
        localStorage.setItem(`notes-${unitId}`, notes)
        localStorage.setItem(`notes-timestamp-${unitId}`, new Date().toISOString())
        setLastSaved(new Date())
        setTimeout(() => setIsAutoSaving(false), 500)
      }
    }, 1000) // Auto-save after 1 second of inactivity

    return () => clearTimeout(timeoutId)
  }, [notes, unitId])

  const handleNotesChange = (value: string) => {
    setNotes(value)
  }

  const manualSave = () => {
    setIsAutoSaving(true)
    localStorage.setItem(`notes-${unitId}`, notes)
    localStorage.setItem(`notes-timestamp-${unitId}`, new Date().toISOString())
    setLastSaved(new Date())
    setTimeout(() => setIsAutoSaving(false), 500)
  }

  const formatLastSaved = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) {
      return 'Just now'
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
    } else {
      return date.toLocaleString()
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">My Notes</h2>
          <p className="text-sm text-gray-600">
            Take notes as you study. Your notes are automatically saved.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastSaved && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last saved: {formatLastSaved(lastSaved)}</span>
            </div>
          )}
          <Button
            onClick={manualSave}
            size="sm"
            variant="outline"
            disabled={isAutoSaving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isAutoSaving ? 'Saving...' : 'Save Now'}
          </Button>
        </div>
      </div>

      {/* Auto-save indicator */}
      {isAutoSaving && (
        <div className="mb-4">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Save className="h-3 w-3 mr-1" />
            Auto-saving...
          </Badge>
        </div>
      )}

      {/* Markdown formatting guide */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Markdown Formatting Tips:</h3>
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
          <div>
            <p><code># Heading 1</code></p>
            <p><code>## Heading 2</code></p>
            <p><code>**Bold text**</code></p>
          </div>
          <div>
            <p><code>*Italic text*</code></p>
            <p><code>- Bullet point</code></p>
            <p><code>1. Numbered list</code></p>
          </div>
        </div>
      </div>

      {/* Notes textarea */}
      <div className="space-y-4">
        <Textarea
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="Start taking notes here...

You can use Markdown formatting:
# Main Topic
## Subtopic
- Key point 1
- Key point 2

**Important concept**: Description here

*Remember*: This will be useful for the exam"
          className="min-h-[500px] font-mono text-sm leading-relaxed resize-none"
        />
        
        {/* Character count */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{notes.length} characters</span>
          <div className="flex items-center gap-2">
            <FileText className="h-3 w-3" />
            <span>Supports Markdown formatting</span>
          </div>
        </div>
      </div>

      {/* Preview section (optional) */}
      {notes.trim() && (
        <div className="mt-6 pt-6 border-t">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Preview:</h3>
          <div className="bg-white border rounded-lg p-4 prose prose-sm max-w-none">
            <div className="whitespace-pre-line">
              {notes.split('\n').map((line, index) => {
                if (line.startsWith('# ')) {
                  return <h1 key={index} className="text-lg font-bold text-gray-900 mt-4 mb-2">{line.substring(2)}</h1>
                } else if (line.startsWith('## ')) {
                  return <h2 key={index} className="text-base font-semibold text-gray-800 mt-3 mb-2">{line.substring(3)}</h2>
                } else if (line.includes('**') && line.includes('**')) {
                  const parts = line.split('**')
                  return (
                    <p key={index} className="text-gray-700 mb-2">
                      {parts.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
                    </p>
                  )
                } else if (line.includes('*') && line.includes('*')) {
                  const parts = line.split('*')
                  return (
                    <p key={index} className="text-gray-700 mb-2">
                      {parts.map((part, i) => i % 2 === 1 ? <em key={i}>{part}</em> : part)}
                    </p>
                  )
                } else if (line.trim().startsWith('-')) {
                  return <li key={index} className="ml-4 text-gray-700">{line.trim().substring(1).trim()}</li>
                } else if (line.trim().match(/^\d+\./)) {
                  return <li key={index} className="ml-4 text-gray-700 list-decimal">{line.trim().substring(line.indexOf('.') + 1).trim()}</li>
                } else if (line.trim()) {
                  return <p key={index} className="text-gray-700 mb-2">{line}</p>
                } else {
                  return <br key={index} />
                }
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}