import { Link, useLocation } from 'react-router-dom'

/**
 * Renders a navigation bar with links to main app sections.
 * Highlights the active route based on the current location.
 */
function Navbar({ userName }) {
  const location = useLocation()
  const isLoginPage = location.pathname === '/'

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <h1>Week 4 To‑Do</h1>
      </div>
      {!isLoginPage && (
        <div className="navbar__links">
          <Link
            to="/tasks"
            className={location.pathname === '/tasks' ? 'active' : ''}
          >
            Tasks
          </Link>
          <Link
            to="/dashboard"
            className={location.pathname === '/dashboard' ? 'active' : ''}
          >
            Dashboard
          </Link>
          <Link
            to="/profile"
            className={location.pathname === '/profile' ? 'active' : ''}
          >
            Profile
          </Link>
        </div>
      )}
      {!isLoginPage && userName && (
        <div className="navbar__user">
          <span>{userName}</span>
        </div>
      )}
    </nav>
  )
}

export default Navbar
