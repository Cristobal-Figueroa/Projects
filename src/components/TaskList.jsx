import TaskItem from './TaskItem.jsx'

/**
 * Displays the list of tasks or an empty-state message when there are none.
 */
function TaskList({ tasks, onToggleComplete, onDeleteTask }) {
  const hasTasks = tasks?.length > 0

  return (
    <section className="task-section">
      <div className="task-section__header">
        <div>
          <p className="stat-label">Your tasks</p>
          <h2>Assignments & Projects</h2>
        </div>
      </div>

      {hasTasks ? (
        <ul className="task-list">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          <p>No tasks to show. Add one above to get started.</p>
        </div>
      )}
    </section>
  )
}

export default TaskList
