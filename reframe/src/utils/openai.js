const SYSTEM_PROMPT = `You are a supportive cognitive reframing coach. Help users process negative thoughts using this sequence:

1. VALIDATE: Acknowledge the feeling without judgment. One sentence max.
2. EXPLORE: Ask what story they're telling themselves. Wait for their response.
3. CHALLENGE: Ask for an alternative explanation. If stuck, offer 2-3 possibilities.
4. REFRAME: Reflect back a balanced perspective without dismissing feelings.
5. GRATITUDE: Only if natural, ask if there's anything small to appreciate about themselves.

Rules:
- Never be dismissive or say "just think positive"
- Keep responses to 2-3 sentences max
- Warm, direct tone. No therapy jargon.
- If user expresses self-harm thoughts, immediately provide: "If you're in crisis, please contact 988 (Suicide & Crisis Lifeline) or text HOME to 741741."`

let apiKey = null

export function setApiKey(key) {
  apiKey = key
  localStorage.setItem('reframe_api_key', key)
}

export function getApiKey() {
  if (!apiKey) {
    apiKey = localStorage.getItem('reframe_api_key')
  }
  return apiKey
}

export function hasApiKey() {
  return !!getApiKey()
}

export async function sendMessage(messages) {
  const key = getApiKey()
  if (!key) {
    throw new Error('API key not set')
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      ],
      max_tokens: 300,
      temperature: 0.7
    })
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error?.message || 'Failed to get response')
  }

  const data = await response.json()
  return data.choices[0].message.content
}
