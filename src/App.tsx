import { useEffect, useRef, useState } from 'react'
import './App.css'
import useStartSession from './hooks/useStartSession'
import useSendQuestion from './hooks/useSendQuestion'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { mutate: startSession, data: sessionData, isPending: isConnecting, isError: isConnectionError } = useStartSession()
  const sessionId = sessionData?.session_id ?? ''
  const { mutate: sendQuestion, isPending: isSending } = useSendQuestion(sessionId)

  useEffect(() => {
    startSession()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isSending])

  const submit = () => {
    const question = input.trim()
    if (!question || !sessionId || isSending) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: question }])
    sendQuestion(question, {
      onSuccess: (data) => {
        setMessages(prev => [...prev, { role: 'assistant', content: data.answer }])
      }
    })
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const isReady = !!sessionId
  const badgeClass = isConnecting ? 'connecting' : isReady ? 'ready' : 'error'
  const badgeLabel = isConnecting ? 'Connecting...' : isReady ? 'Session active' : 'Disconnected'

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-brand">
          <span className="app-logo">{'<T/>'}</span>
          <div>
            <p className="app-title">RAG Translator Dictionary</p>
            <p className="app-subtitle">Mbochi - Francais</p>
          </div>
        </div>
        <span className={`session-badge session-badge--${badgeClass}`}>{badgeLabel}</span>
      </header>

      <main className="conversation">
        {messages.length === 0 && isReady && (
          <div className="empty-state">
            <span className="empty-mark">*</span>
            <p className="empty-title">Ready to translate</p>
            <p className="empty-hint">Ask a translation question — e.g. "How do you say good morning in Mbochi?" or "What does Oyolo mean?</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`message message--${msg.role}`}>
            <span className="message-label">{msg.role === 'user' ? 'You' : 'AI'}</span>
            <div className="message-bubble">{msg.content}</div>
          </div>
        ))}

        {isSending && (
          <div className="message message--assistant">
            <span className="message-label">AI</span>
            <div className="message-bubble message-bubble--typing">
              <span /><span /><span />
            </div>
          </div>
        )}

        {isConnectionError && (
          <div className="error-banner">
            <span>Could not connect to the backend. Please try again.</span>
            <button className="error-retry" onClick={() => startSession()}>Retry</button>
          </div>
        )}

        <div ref={bottomRef} />
      </main>

      <footer className="input-area">
        <form className="input-form" onSubmit={e => { e.preventDefault(); submit() }}>
          <textarea
            ref={textareaRef}
            className="input-textarea"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isReady ? 'Type text to translate...  (Enter to send, Shift+Enter for new line)' : 'Waiting for session...'}
            disabled={!isReady || isSending}
            rows={3}
          />
          <button
            className="submit-btn"
            type="submit"
            disabled={!input.trim() || !isReady || isSending}
          >
            {isSending ? '...' : 'Translate'}
          </button>
        </form>
      </footer>
    </div>
  )
}

export default App
