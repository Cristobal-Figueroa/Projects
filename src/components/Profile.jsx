import { useState, useEffect } from 'react'

/**
 * Renders a user profile page allowing display name changes.
 * Shows username from localStorage and total completed tasks.
 */
function Profile({ tasks }) {
  const [displayName, setDisplayName] = useState('')
  const [tempName, setTempName] = useState('')
  const [saved, setSaved] = useState(false)

  /**
   * Loads the stored display name on component mount.
   */
  useEffect(() => {
    const stored = localStorage.getItem('week2_user')
    if (stored) {
      setDisplayName(stored)
      setTempName(stored)
    }
  }, [])

  /**
   * Saves the new display name to localStorage.
   */
  const handleSave = () => {
    const trimmed = tempName.trim()
    if (!trimmed) return
    localStorage.setItem('week2_user', trimmed)
    setDisplayName(trimmed)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  /**
   * Calculates total completed tasks (including subtasks).
   */
  const totalCompleted = tasks.reduce((acc, task) => {
    const subCompleted = task.subtasks
      ? task.subtasks.filter((st) => st.completed).length
      : 0
    return acc + (task.completed ? 1 : 0) + subCompleted
  }, 0)

  return (
    <section className="profile">
      <h2>Profile</h2>
      <div className="profile__card">
        <div className="profile__field">
          <label htmlFor="displayName">Display name</label>
          <div className="profile__input-row">
            <input
              id="displayName"
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
            />
            <button type="button" onClick={handleSave}>
              {saved ? 'Saved!' : 'Save'}
            </button>
          </div>
        </div>

        <div className="profile__stats">
          <p className="stat-label">Tasks completed</p>
          <p className="stat-value">{totalCompleted}</p>
        </div>
      </div>
    </section>
  )
}

export default Profile
