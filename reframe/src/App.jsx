import { useState, useEffect } from 'react'
import ChatView from './components/ChatView'
import HistoryView from './components/HistoryView'
import { loadSessions, saveSession, generateId } from './utils/storage'

function App() {
  const [view, setView] = useState('chat') // 'chat' or 'history'
  const [sessions, setSessions] = useState([])
  const [currentSession, setCurrentSession] = useState(null)

  useEffect(() => {
    setSessions(loadSessions())
  }, [])

  const startNewSession = () => {
    const newSession = {
      id: generateId(),
      timestamp: Date.now(),
      messages: []
    }
    setCurrentSession(newSession)
    setView('chat')
  }

  const updateCurrentSession = (messages) => {
    if (!currentSession) return

    const updated = { ...currentSession, messages }
    setCurrentSession(updated)
    saveSession(updated)
    setSessions(loadSessions())
  }

  const viewSessionFromHistory = (session) => {
    setCurrentSession(session)
    setView('chat')
  }

  return (
    <div className="h-full gradient-bg text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="glass-header flex items-center justify-between px-5 py-4 relative z-10">
        <h1 className="text-xl font-semibold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Reframe
        </h1>
        <nav className="flex gap-1">
          <button
            onClick={() => { startNewSession(); setView('chat'); }}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
              view === 'chat'
                ? 'bg-white/10 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            New
          </button>
          <button
            onClick={() => setView('history')}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
              view === 'history'
                ? 'bg-white/10 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            History
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative z-0">
        {view === 'chat' ? (
          <ChatView
            session={currentSession}
            onUpdateSession={updateCurrentSession}
            onStartSession={startNewSession}
          />
        ) : (
          <HistoryView
            sessions={sessions}
            onSelectSession={viewSessionFromHistory}
          />
        )}
      </main>
    </div>
  )
}

export default App
