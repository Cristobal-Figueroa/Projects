import { useState } from 'react'

/**
 * Renders a login form that stores the entered name and notifies the parent.
 */
function Login({ onLogin }) {
  const [name, setName] = useState('')

  /**
   * Handles the submit action by validating the name and calling onLogin.
   */
  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      return
    }
    onLogin(trimmed)
    setName('')
  }

  return (
    <div className="login-card">
      <h1>Welcome back</h1>
      <p className="tagline">Sign in to manage your weekly tasks.</p>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="userName">Full name</label>
        <input
          id="userName"
          type="text"
          placeholder="Cristobal Figueroa"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <button type="submit">Enter workspace</button>
      </form>
    </div>
  )
}

export default Login
