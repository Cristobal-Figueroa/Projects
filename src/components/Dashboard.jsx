import { useMemo } from 'react'

/**
 * Renders a statistics dashboard showing totals, charts, and insights.
 * Uses reduce() to calculate totals and computes completion percentages.
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

  /**
   * Tasks by category stats.
   */
  const categoryStats = useMemo(() => {
    const stats = tasks.reduce((acc, task) => {
      const cat = task.category || 'General'
      if (!acc[cat]) {
        acc[cat] = { total: 0, completed: 0 }
      }
      acc[cat].total += 1 + (task.subtasks?.length || 0)
      acc[cat].completed += (task.completed ? 1 : 0) + (task.subtasks?.filter(st => st.completed).length || 0)
      return acc
    }, {})
    return Object.entries(stats).map(([cat, data]) => ({
      category: cat,
      total: data.total,
      completed: data.completed,
      percentage: data.total ? (data.completed / data.total) * 100 : 0,
    }))
  }, [tasks])

  /**
   * Recent tasks (last 5 created).
   */
  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
  }, [tasks])

  /**
   * Overdue tasks (created before today and not completed).
   */
  const overdueTasks = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return tasks.filter(task => 
      !task.completed && task.createdAt && task.createdAt < today
    )
  }, [tasks])

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
        <div className="stat-card">
          <p className="stat-label">Overdue</p>
          <p className="stat-value">{overdueTasks.length}</p>
        </div>
      </div>

      <div className="progress-section">
        <p className="progress-label">Overall completion progress</p>
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

      <div className="dashboard__grid">
        <div className="dashboard__panel">
          <h3>Completion by Category</h3>
          <div className="category-stats">
            {categoryStats.map(({ category, total, completed, percentage }) => (
              <div key={category} className="category-stat">
                <div className="category-header">
                  <span className="category-name">{category}</span>
                  <span className="category-fraction">{completed}/{total}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="category-percentage">{percentage.toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard__panel">
          <h3>Recent Tasks</h3>
          <ul className="recent-tasks">
            {recentTasks.map((task) => (
              <li key={task.id} className={`recent-task ${task.completed ? 'completed' : ''}`}>
                <span className="task-title">{task.title}</span>
                <span className="task-date">
                  {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {overdueTasks.length > 0 && (
        <div className="dashboard__panel overdue-panel">
          <h3>Overdue Tasks</h3>
          <ul className="overdue-tasks">
            {overdueTasks.map((task) => (
              <li key={task.id} className="overdue-task">
                <span className="task-title">{task.title}</span>
                <span className="task-date">
                  Created: {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

export default Dashboard
