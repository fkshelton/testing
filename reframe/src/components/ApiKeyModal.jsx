import { useState } from 'react'
import { setApiKey, getApiKey } from '../utils/openai'

export default function ApiKeyModal({ onClose, onSave }) {
  const [key, setKey] = useState(getApiKey() || '')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!key.trim()) {
      setError('Please enter an API key')
      return
    }

    if (!key.startsWith('sk-')) {
      setError('Invalid API key format')
      return
    }

    setApiKey(key.trim())
    onSave()
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-900 rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-lg font-medium text-zinc-100 mb-2">
          OpenAI API Key
        </h2>
        <p className="text-zinc-400 text-sm mb-4">
          Your key is stored locally and never sent anywhere except OpenAI.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={key}
            onChange={(e) => { setKey(e.target.value); setError(''); }}
            placeholder="sk-..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 mb-2"
            autoFocus
          />

          {error && (
            <p className="text-rose-400 text-sm mb-3">{error}</p>
          )}

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
