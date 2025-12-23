import { groupSessionsByDay } from '../utils/storage'

export default function HistoryView({ sessions, onSelectSession }) {
  if (sessions.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/3 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl" />
        </div>

        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/5 flex items-center justify-center mb-5">
          <svg className="w-9 h-9 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl text-zinc-200 mb-2 font-medium">No sessions yet</h3>
        <p className="text-zinc-500 text-sm max-w-xs">
          Your reframing conversations will appear here once you start one.
        </p>
      </div>
    )
  }

  const groupedSessions = groupSessionsByDay(sessions)

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getPreview = (session) => {
    const firstUserMessage = session.messages.find(m => m.role === 'user')
    if (!firstUserMessage) return 'Empty session'

    const text = firstUserMessage.content
    return text.length > 80 ? text.slice(0, 80) + '...' : text
  }

  return (
    <div className="h-full overflow-y-auto">
      {Object.entries(groupedSessions).map(([day, daySessions]) => (
        <div key={day}>
          <div className="sticky top-0 glass-header px-5 py-3">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {day}
            </h3>
          </div>

          <div className="px-3 py-2 space-y-2">
            {daySessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectSession(session)}
                className="w-full text-left px-4 py-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-zinc-200 text-[15px] leading-snug flex-1">
                    {getPreview(session)}
                  </p>
                  <span className="text-zinc-600 text-xs whitespace-nowrap bg-white/5 px-2 py-1 rounded-md">
                    {formatTime(session.timestamp)}
                  </span>
                </div>
                <p className="text-zinc-500 text-xs mt-2 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {session.messages.length} messages
                </p>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
