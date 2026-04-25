import type { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from '@/components/forms/LoginForm'

export const metadata: Metadata = {
  title: 'Login — PlayaStays',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <Link href="/" className="login-brand__logo">PlayaStays</Link>
        </div>

        <h1 className="login-title">Sign in to your account</h1>
        <p className="login-sub">
          Access your dashboard to manage properties, view reports, and track performance.
        </p>

        <LoginForm />

        <div className="login-divider" />

        <div className="login-portals">
          <div className="login-portal">
            <div className="login-portal__icon">📊</div>
            <div>
              <div className="login-portal__title">Admin &amp; Operations</div>
              <div className="login-portal__desc">Internal team — listing management, portfolio overview, operations.</div>
            </div>
          </div>
          <div className="login-portal">
            <div className="login-portal__icon">🏠</div>
            <div>
              <div className="login-portal__title">Owner Portal</div>
              <div className="login-portal__desc">Property owners — performance reports, availability, statements.</div>
            </div>
          </div>
        </div>

        <div className="login-footer">
          <Link href="/">← Back to PlayaStays.com</Link>
        </div>
      </div>
    </div>
  )
}
