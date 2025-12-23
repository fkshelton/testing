import { groupSessionsByDay } from '../utils/storage'

export default function HistoryView({ sessions, onSelectSession }) {
  if (sessions.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg text-zinc-300 mb-1">No sessions yet</h3>
        <p className="text-zinc-500 text-sm">
          Your conversations will appear here.
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
          <div className="sticky top-0 bg-zinc-950 px-4 py-2 border-b border-zinc-800">
            <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              {day}
            </h3>
          </div>

          <div className="divide-y divide-zinc-900">
            {daySessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectSession(session)}
                className="w-full text-left px-4 py-4 hover:bg-zinc-900/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-zinc-200 text-[15px] leading-snug flex-1">
                    {getPreview(session)}
                  </p>
                  <span className="text-zinc-600 text-xs whitespace-nowrap">
                    {formatTime(session.timestamp)}
                  </span>
                </div>
                <p className="text-zinc-600 text-xs mt-1">
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
