'use client'

import { FormEvent, useState } from 'react'

export default function Page() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpError, setotpError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setIsLoading(true)
    setotpError('')

    try {
      const endpoint = otpSent ? '/otp' : '/'

      const res = await fetch(`http://localhost:4000/auth${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          otp,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.status) {
        setotpError(data.message || 'Something went wrong.')
        return
      }
      if(data.redirect) {
        window.location.href = data.redirect 
        return
      }

      if (!otpSent) {
        setOtpSent(true)
      } else {
        alert('Login Successful')
      }
    } catch (err) {
      console.error(err)
      setotpError('Unable to connect to server.')
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
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={otpSent}
              required
              style={styles.input}
            />
          </label>

          {otpSent && (
            <label style={styles.label}>
              {otpError && (
                <p
                  style={{
                    color: 'red',
                    margin: 0,
                    fontSize: '14px',
                  }}
                >
                  {otpError}
                </p>
              )}

              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter OTP"
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
              : otpSent
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