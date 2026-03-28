import { useMemo } from 'react'

/**
 * Renders a statistics dashboard showing totals and a visual progress bar.
 * Uses reduce() to calculate totals and computes completion percentage.
 */
function Dashboard({ tasks }) {
  /**
   * Counts total tasks including subtasks using reduce().
   */
  const totalTasks = useMemo(() => {
    return tasks.reduce((acc, task) => {
      const subTotal = task.subtasks ? task.subtasks.length : 0
      return acc + 1 + subTotal
    }, 0)
  }, [tasks])

  /**
   * Counts completed tasks including subtasks using reduce().
   */
  const completedTasks = useMemo(() => {
    return tasks.reduce((acc, task) => {
      const subCompleted = task.subtasks
        ? task.subtasks.filter((st) => st.completed).length
        : 0
      return acc + (task.completed ? 1 : 0) + subCompleted
    }, 0)
  }, [tasks])

  const pendingTasks = totalTasks - completedTasks
  const completionPercentage = totalTasks ? (completedTasks / totalTasks) * 100 : 0

  return (
    <section className="dashboard">
      <h2>Dashboard</h2>
      <div className="dashboard__cards">
        <div className="stat-card">
          <p className="stat-label">Total tasks</p>
          <p className="stat-value">{totalTasks}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Completed</p>
          <p className="stat-value">{completedTasks}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Pending</p>
          <p className="stat-value">{pendingTasks}</p>
        </div>
      </div>

      <div className="progress-section">
        <p className="progress-label">Completion progress</p>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <p className="progress-text">
          {completionPercentage.toFixed(1)}% complete
        </p>
      </div>
    </section>
  )
}

export default Dashboard
