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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-3xl p-6 w-full max-w-md border border-white/10 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              OpenAI API Key
            </h2>
            <p className="text-zinc-500 text-sm">
              Stored locally, never shared
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={key}
            onChange={(e) => { setKey(e.target.value); setError(''); }}
            placeholder="sk-..."
            className="input-field w-full rounded-xl px-4 py-3.5 text-zinc-100 placeholder-zinc-600 focus:outline-none mb-2"
            autoFocus
          />

          {error && (
            <p className="text-rose-400 text-sm mb-3 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          )}

          <div className="flex gap-3 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 py-3.5 rounded-xl text-white font-medium"
            >
              Save Key
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
