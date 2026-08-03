'use client'

import { FormEvent, useState } from 'react'

export default function Page() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [response, setResponse] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setIsLoading(true)

    try {
      const endpoint = otp ? '/otp' : '/'

      const res = await fetch(`http://localhost:4000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: otp || null,
        }),
      })

      const data = await res.json()
      setResponse(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Login</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Email
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!!response}
              required
              style={styles.input}
            />
          </label>

          {response && (
            <label style={styles.label}>
              OTP
              <input
                type="number"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                style={styles.input}
              />
            </label>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={styles.button}
          >
            {isLoading
              ? 'Loading...'
              : response
              ? 'Verify OTP'
              : 'Send OTP'}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f4f4f5',
  },

  card: {
    width: '380px',
    padding: '32px',
    borderRadius: '12px',
    background: '#ffffff',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  },

  title: {
    marginBottom: '24px',
    textAlign: 'center' as const,
  },

  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '18px',
  },

  label: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
    fontWeight: 500,
  },

  input: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '15px',
  },

  button: {
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    background: '#2563eb',
    color: '#fff',
    fontSize: '15px',
    cursor: 'pointer',
  },
}