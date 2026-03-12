import { useState, useRef, useCallback, useEffect } from 'react'
import Head from 'next/head'
import Script from 'next/script'
import styles from '../styles/Home.module.css'
import contactStyles from '../styles/Contact.module.css'

function ContactModal({ onClose }) {
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('')
  const turnstileRef = useRef(null)
  const turnstileWidgetId = useRef(null)

  const renderTurnstile = useCallback(() => {
    if (turnstileRef.current && window.turnstile && turnstileWidgetId.current === null) {
      turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
      })
    }
  }, [])

  useEffect(() => {
    if (window.turnstile) {
      renderTurnstile()
    }
  }, [renderTurnstile])

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    const form = e.target
    const turnstileToken = window.turnstile?.getResponse(turnstileWidgetId.current)

    if (!turnstileToken) {
      setStatus('error')
      setErrorMsg('Please complete the verification.')
      return
    }

    const body = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
      honeypot: form.website.value,
      turnstileToken,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        setStatus('success')
      } else {
        const data = await res.json()
        setStatus('error')
        setErrorMsg(data.error || 'Something went wrong.')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong.')
    }
  }

  return (
    <div className={contactStyles.overlay} onClick={onClose}>
      <div className={contactStyles.modal} onClick={e => e.stopPropagation()}>
        <button className={contactStyles.close} onClick={onClose} aria-label="Close">&times;</button>

        {status === 'success' ? (
          <div className={contactStyles.successMessage}>
            <p className={contactStyles.success}>Thank you! Your message has been sent.</p>
            <button className={contactStyles.button} onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <h2 className={contactStyles.modalTitle}>Get in Touch</h2>
            <form className={contactStyles.form} onSubmit={handleSubmit}>
              {/* Honeypot — hidden from real users */}
              <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
                <input type="text" name="website" tabIndex={-1} autoComplete="off" />
              </div>

              <div className={contactStyles.field}>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" required />
              </div>

              <div className={contactStyles.field}>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
              </div>

              <div className={contactStyles.field}>
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" required />
              </div>

              <div ref={turnstileRef} />

              {status === 'error' && <p className={contactStyles.error}>{errorMsg}</p>}

              <button type="submit" className={contactStyles.button} disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className={styles.container}>
      <Head>
        <title>Seattle Cloud Consulting</title>
        <meta name="description" content="Full stack, front end, back end, and cloud consulting." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />

      <main className={styles.main}>
        <h1 className={styles.title}>Seattle Cloud Consulting</h1>
        <p className={styles.subtitle}>We help clients do great things.</p>

        <div className={styles.description}>
          <p>Proven industry expertise in backend, frontend, and cloud infrastructure --</p>
          <p>We help clients create beautiful user experiences in <span className={styles.emphasis}>React and Solid.js</span></p>
          <p>We help clients build reliable and performant applications in <span className={styles.emphasis}>Javascript, Java, Python, and C#</span></p>
          <p>We help clients deliver their applications on <span className={styles.emphasis}>AWS, Azure, and GCP</span></p>
        </div>

        <div className={styles.final}>
          <p>We help clients <span className={styles.italic}>succeed.</span></p>
        </div>

        <button className={contactStyles.contactButton} onClick={() => setShowModal(true)}>
          Contact Us
        </button>

        {showModal && <ContactModal onClose={() => setShowModal(false)} />}
      </main>
    </div>
  )
}
