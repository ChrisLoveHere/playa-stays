'use client'

export function LoginForm() {
  return (
    <form className="login-form" onSubmit={e => e.preventDefault()}>
      <label className="login-field">
        <span className="login-field__label">Email</span>
        <input
          type="email"
          className="login-field__input"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </label>
      <label className="login-field">
        <span className="login-field__label">Password</span>
        <input
          type="password"
          className="login-field__input"
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
      </label>
      <button type="submit" className="login-btn" disabled>
        Sign in
      </button>
      <p className="login-notice">
        Authentication is being configured. Contact <strong>Chris@PlayaStays.com</strong> for access.
      </p>
    </form>
  )
}
