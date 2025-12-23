import { useState, useRef, useEffect } from 'react'

export default function VoiceButton({ onTranscript, disabled, compact = false }) {
  const [isListening, setIsListening] = useState(false)
  const [interimText, setInterimText] = useState('')
  const recognitionRef = useRef(null)

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      let interim = ''
      let final = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += transcript
        } else {
          interim += transcript
        }
      }

      setInterimText(interim)

      if (final) {
        onTranscript(final.trim())
        setInterimText('')
      }
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      setInterimText('')
    }

    recognition.onend = () => {
      setIsListening(false)
      setInterimText('')
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [onTranscript])

  const toggleListening = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      setInterimText('')
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window

  if (!isSupported) {
    return (
      <div className="text-center text-zinc-500 text-sm py-4">
        Voice input not supported in this browser.
        <br />
        Try Chrome or Safari.
      </div>
    )
  }

  const buttonSize = compact ? 'w-12 h-12' : 'w-24 h-24'
  const iconSize = compact ? 'w-5 h-5' : 'w-9 h-9'

  return (
    <div className={`flex flex-col items-center ${compact ? 'gap-0' : 'gap-4'}`}>
      {interimText && !compact && (
        <div className="text-zinc-400 text-sm italic px-4 text-center max-w-xs">
          "{interimText}..."
        </div>
      )}

      <button
        onClick={toggleListening}
        disabled={disabled}
        className={`
          voice-btn ${buttonSize} rounded-full flex items-center justify-center
          ${isListening ? 'listening' : ''}
          ${disabled
            ? 'bg-zinc-800/50 text-zinc-600 cursor-not-allowed'
            : isListening
              ? 'bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/25'
              : 'bg-gradient-to-br from-zinc-800 to-zinc-900 text-zinc-300 hover:text-white border border-white/10'
          }
        `}
        aria-label={isListening ? 'Stop recording' : 'Start recording'}
      >
        {isListening ? (
          <svg className={`${iconSize} animate-pulse`} fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        ) : (
          <svg className={iconSize} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        )}
      </button>

      {!compact && (
        <p className={`text-sm font-medium ${isListening ? 'text-rose-400' : 'text-zinc-500'}`}>
          {isListening ? 'Listening... tap to stop' : 'Tap to speak'}
        </p>
      )}
    </div>
  )
}
