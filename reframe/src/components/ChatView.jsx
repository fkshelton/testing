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
      <div className="h-full flex flex-col items-center justify-center p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-light text-zinc-200 mb-2">
            What's on your mind?
          </h2>
          <p className="text-zinc-500 text-sm">
            Share a thought, and I'll help you see it differently.
          </p>
        </div>

        <VoiceButton
          onTranscript={handleVoiceTranscript}
          disabled={isLoading}
        />

        <div className="mt-8 w-full max-w-md">
          <form onSubmit={handleTextSubmit} className="flex gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Or type here..."
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
            />
            <button
              type="submit"
              disabled={!textInput.trim() || isLoading}
              className="bg-zinc-800 text-zinc-300 px-4 rounded-xl hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>

        <button
          onClick={() => setShowApiKeyModal(true)}
          className="mt-6 text-zinc-600 text-xs hover:text-zinc-400"
        >
          {hasApiKey() ? 'Change API Key' : 'Set OpenAI API Key'}
        </button>

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
            <div className="bg-zinc-800 text-zinc-400 px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-zinc-800 p-4 bg-zinc-950">
        <div className="flex items-center gap-3">
          <VoiceButton
            onTranscript={handleVoiceTranscript}
            disabled={isLoading}
          />

          <form onSubmit={handleTextSubmit} className="flex-1 flex gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
            />
            <button
              type="submit"
              disabled={!textInput.trim() || isLoading}
              className="bg-blue-600 text-white px-4 rounded-xl hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
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
