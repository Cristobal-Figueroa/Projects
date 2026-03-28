/**
 * Renders a single task row including buttons to complete or delete it.
 * Shows category, creation date, description, and nested subtasks with compact icon buttons.
 */
function TaskItem({ task, level = 0, onToggleComplete, onDeleteTask }) {
  const indent = { paddingLeft: `${8 + level * 16}px` }

  return (
    <li className="task-item" style={indent}>
      <div className="task-main">
        <label className="checkbox-control">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
          />
          <span className="checkbox-visual" aria-hidden="true"></span>
          <span className={`checkbox-label ${task.completed ? 'completed' : ''}`}>
            {task.title}
          </span>
        </label>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        <div className="task-meta">
          {task.category && <span className="task-category">{task.category}</span>}
          {task.createdAt && (
            <span className="task-date">
              {new Date(task.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      <div className="task-actions">
        <button
          type="button"
          className="small icon-only"
          onClick={() => onToggleComplete(task.id)}
          aria-label={task.completed ? 'Undo' : 'Complete'}
        >
          {task.completed ? '↶' : '✓'}
        </button>
        <button
          type="button"
          className="secondary small icon-only delete-red"
          onClick={() => onDeleteTask(task.id)}
          aria-label="Delete"
        >
          🗑
        </button>
      </div>

      {Array.isArray(task.subtasks) && task.subtasks.length > 0 && (
        <ul className="task-list nested">
          {task.subtasks.map((subtask) => (
            <TaskItem
              key={subtask.id}
              task={subtask}
              level={level + 1}
              onToggleComplete={onToggleComplete}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

export default TaskItem
