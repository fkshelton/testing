import { useState, useEffect, useRef } from 'react'
import VoiceButton from './VoiceButton'
import MessageBubble from './MessageBubble'
import ApiKeyModal from './ApiKeyModal'
import { sendMessage, hasApiKey } from '../utils/openai'

export default function ChatView({ session, onUpdateSession, onStartSession }) {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const [textInput, setTextInput] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (session?.messages) {
      setMessages(session.messages)
    } else {
      setMessages([])
    }
  }, [session?.id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (content) => {
    if (!content.trim()) return

    if (!hasApiKey()) {
      setShowApiKeyModal(true)
      return
    }

    // Start a new session if none exists
    if (!session) {
      onStartSession()
    }

    const userMessage = { role: 'user', content: content.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      const response = await sendMessage(newMessages)
      const assistantMessage = { role: 'assistant', content: response }
      const updatedMessages = [...newMessages, assistantMessage]
      setMessages(updatedMessages)
      onUpdateSession(updatedMessages)
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I had trouble responding. Please try again.'
      }
      const updatedMessages = [...newMessages, errorMessage]
      setMessages(updatedMessages)
      onUpdateSession(updatedMessages)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoiceTranscript = (transcript) => {
    handleSendMessage(transcript)
  }

  const handleTextSubmit = (e) => {
    e.preventDefault()
    if (textInput.trim()) {
      handleSendMessage(textInput)
      setTextInput('')
    }
  }

  const handleApiKeySet = () => {
    setShowApiKeyModal(false)
  }

  // Empty state - no session started
  if (!session && messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 relative">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="text-center mb-10 relative">
          <h2 className="text-3xl font-light text-white mb-3 tracking-tight">
            What's on your mind?
          </h2>
          <p className="text-zinc-400 text-base max-w-xs mx-auto">
            Share a thought, and I'll help you see it from a new perspective.
          </p>
        </div>

        <div className="relative">
          <VoiceButton
            onTranscript={handleVoiceTranscript}
            disabled={isLoading}
          />
        </div>

        <div className="mt-10 w-full max-w-md relative">
          <form onSubmit={handleTextSubmit} className="flex gap-3">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Or type your thoughts here..."
              className="input-field flex-1 rounded-2xl px-5 py-4 text-zinc-100 placeholder-zinc-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!textInput.trim() || isLoading}
              className="btn-primary text-white px-5 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>

        {!hasApiKey() && (
          <button
            onClick={() => setShowApiKeyModal(true)}
            className="mt-8 text-zinc-500 text-sm hover:text-zinc-300 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Set OpenAI API Key
          </button>
        )}

        {showApiKeyModal && (
          <ApiKeyModal onClose={() => setShowApiKeyModal(false)} onSave={handleApiKeySet} />
        )}
      </div>
    )
  }

  // Active conversation
  return (
    <div className="h-full flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="message-assistant px-5 py-4 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1.5">
                <span className="typing-dot w-2 h-2 bg-zinc-400 rounded-full" />
                <span className="typing-dot w-2 h-2 bg-zinc-400 rounded-full" />
                <span className="typing-dot w-2 h-2 bg-zinc-400 rounded-full" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="glass-header border-t-0 border-b-0 p-4">
        <div className="flex items-center gap-3 max-w-3xl mx-auto">
          <VoiceButton
            onTranscript={handleVoiceTranscript}
            disabled={isLoading}
            compact
          />

          <form onSubmit={handleTextSubmit} className="flex-1 flex gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type a message..."
              className="input-field flex-1 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!textInput.trim() || isLoading}
              className="btn-primary text-white px-4 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {showApiKeyModal && (
        <ApiKeyModal onClose={() => setShowApiKeyModal(false)} onSave={handleApiKeySet} />
      )}
    </div>
  )
}
