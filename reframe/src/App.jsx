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
    <div className="h-full bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <h1 className="text-lg font-medium tracking-tight text-zinc-100">Reframe</h1>
        <nav className="flex gap-2">
          <button
            onClick={() => { startNewSession(); setView('chat'); }}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              view === 'chat'
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            New
          </button>
          <button
            onClick={() => setView('history')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              view === 'history'
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            History
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
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
