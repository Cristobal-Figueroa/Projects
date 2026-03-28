import { useState, useEffect } from 'react'

/**
 * Renders a user profile page allowing display name changes.
 * Shows username from localStorage, total completed tasks, achievements, and activity stats.
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

  /**
   * Tasks created in the last 7 days.
   */
  const recentTasks = tasks.filter(task => {
    if (!task.createdAt) return false
    const taskDate = new Date(task.createdAt)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return taskDate >= weekAgo
  })

  /**
   * Completion streak (consecutive days with at least one completed task).
   */
  const completionStreak = (() => {
    const completedDates = new Set()
    tasks.forEach(task => {
      if (task.completed && task.createdAt) {
        completedDates.add(new Date(task.createdAt).toDateString())
      }
      if (task.subtasks) {
        task.subtasks.forEach(st => {
          if (st.completed && task.createdAt) {
            completedDates.add(new Date(task.createdAt).toDateString())
          }
        })
      }
    })
    if (completedDates.size === 0) return 0
    const sortedDates = Array.from(completedDates).sort((a, b) => new Date(b) - new Date(a))
    let streak = 1
    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1])
      const curr = new Date(sortedDates[i])
      const diffDays = Math.floor((prev - curr) / (1000 * 60 * 60 * 24))
      if (diffDays === 1) streak++
      else break
    }
    return streak
  })()

  /**
   * Most productive category.
   */
  const productiveCategory = (() => {
    const counts = {}
    tasks.forEach(task => {
      const cat = task.category || 'General'
      counts[cat] = (counts[cat] || 0) + 1 + (task.subtasks?.length || 0)
    })
    const entries = Object.entries(counts)
    if (entries.length === 0) return 'None'
    return entries.reduce((a, b) => a[1] > b[1] ? a : b)[0]
  })()

  /**
   * Achievement badges based on stats.
   */
  const achievements = []
  if (totalCompleted >= 10) achievements.push('First Decade')
  if (totalCompleted >= 50) achievements.push('Task Master')
  if (completionStreak >= 7) achievements.push('Week Warrior')
  if (tasks.length > 0 && tasks.every(t => t.completed)) achievements.push('Clean Slate')
  if (recentTasks.length >= 5) achievements.push('Productive Week')

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

      <div className="profile__grid">
        <div className="profile__panel">
          <h3>Activity Stats</h3>
          <div className="stat-list">
            <div className="stat-item">
              <span className="stat-label">Current streak</span>
              <span className="stat-value">{completionStreak} days</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tasks this week</span>
              <span className="stat-value">{recentTasks.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Top category</span>
              <span className="stat-value">{productiveCategory}</span>
            </div>
          </div>
        </div>

        <div className="profile__panel">
          <h3>Achievements</h3>
          <div className="achievements">
            {achievements.length > 0 ? (
              achievements.map((badge, i) => (
                <div key={i} className="achievement-badge">
                  🏆 {badge}
                </div>
              ))
            ) : (
              <p className="no-achievements">Complete more tasks to unlock achievements!</p>
            )}
          </div>
        </div>
      </div>

      <div className="profile__panel">
        <h3>Recent Activity</h3>
        <ul className="activity-list">
          {tasks.slice(0, 5).map((task) => (
            <li key={task.id} className={`activity-item ${task.completed ? 'completed' : ''}`}>
              <span className="activity-title">{task.title}</span>
              <span className="activity-meta">
                {task.category && <span className="activity-category">{task.category}</span>}
                <span className="activity-date">
                  {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Profile
