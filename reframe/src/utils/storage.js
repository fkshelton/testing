const STORAGE_KEY = 'reframe_sessions'

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function loadSessions() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveSession(session) {
  const sessions = loadSessions()
  const index = sessions.findIndex(s => s.id === session.id)

  if (index >= 0) {
    sessions[index] = session
  } else {
    sessions.unshift(session)
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
}

export function deleteSession(sessionId) {
  const sessions = loadSessions().filter(s => s.id !== sessionId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
}

export function groupSessionsByDay(sessions) {
  const groups = {}

  sessions.forEach(session => {
    const date = new Date(session.timestamp)
    const dayKey = date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    })

    if (!groups[dayKey]) {
      groups[dayKey] = []
    }
    groups[dayKey].push(session)
  })

  return groups
}
