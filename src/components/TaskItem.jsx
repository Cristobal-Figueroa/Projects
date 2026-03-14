/**
 * Renders a single task row including buttons to complete or delete it.
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
      </div>
      <div className="task-actions">
        <button type="button" onClick={() => onToggleComplete(task.id)}>
          {task.completed ? 'Undo' : 'Complete'}
        </button>
        <button
          type="button"
          className="secondary"
          onClick={() => onDeleteTask(task.id)}
        >
          Delete
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
