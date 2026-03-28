import { useState } from 'react'
import TaskItem from './TaskItem.jsx'

/**
 * Renders the main task view with filters, sorting, category selection,
 * a progress bar, and the task list itself.
 */
function TaskList({
  tasks,
  onToggleComplete,
  onDeleteTask,
  filter,
  sortBy,
  selectedCategory,
  onFilterChange,
  onSortChange,
  onCategoryChange,
  onAddTask,
  newTaskTitle,
  onNewTaskTitleChange,
  newTaskDescription,
  onNewTaskDescriptionChange,
  newTaskCategory,
  onNewTaskCategoryChange,
  newTaskDate,
  onNewTaskDateChange,
  filterDate,
  onFilterDateChange,
}) {
  const [subtaskInput, setSubtaskInput] = useState('')
  const [subtaskDescInput, setSubtaskDescInput] = useState('')
  const [subtasks, setSubtasks] = useState([])

  const hasTasks = tasks?.length > 0
  const completedCount = tasks.reduce((acc, t) => acc + (t.completed ? 1 : 0), 0)
  const completionPercentage = tasks.length ? (completedCount / tasks.length) * 100 : 0

  const categories = ['All', 'School', 'Personal', 'General']

  /**
   * Adds a subtask title and description to the temporary list when Enter is pressed.
   */
  const handleAddSubtask = () => {
    const trimmedTitle = subtaskInput.trim()
    if (!trimmedTitle) return
    setSubtasks((prev) => [...prev, { title: trimmedTitle, description: subtaskDescInput.trim() }])
    setSubtaskInput('')
    setSubtaskDescInput('')
  }

  /**
   * Removes a subtask from the temporary list.
   */
  const handleRemoveSubtask = (index) => {
    setSubtasks((prev) => prev.filter((_, i) => i !== index))
  }

  /**
 * Calls the parent's onAddTask with the current subtasks and clears the temp list.
 */
const handleCreateTask = () => {
  onAddTask(subtasks)
  setSubtasks([])
}

  return (
    <section className="task-section">
      <div className="task-section__header">
        <div>
          <p className="stat-label">Your tasks</p>
          <h2>Assignments & Projects</h2>
        </div>
      </div>

      <div className="task-controls">
        <div className="control-group">
          <label>Status</label>
          <div className="filter-buttons">
            {['all', 'pending', 'completed'].map((opt) => (
              <button
                key={opt}
                type="button"
                className={filter === opt ? 'active' : ''}
                onClick={() => onFilterChange(opt)}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="control-group">
          <label>Sort by</label>
          <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
            <option value="date">Date (newest)</option>
            <option value="alpha">Alphabetical</option>
          </select>
        </div>

        <div className="control-group">
          <label>Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Date</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => onFilterDateChange(e.target.value)}
          />
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

      <div className="builder">
        <label htmlFor="newTask">Add a task</label>
        <div className="builder-main">
          <div className="input-row">
            <input
              id="newTask"
              type="text"
              placeholder="Task title..."
              value={newTaskTitle}
              onChange={(e) => onNewTaskTitleChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateTask()
                }
              }}
            />
          </div>
          <div className="input-row">
            <input
              type="text"
              placeholder="Task description..."
              value={newTaskDescription}
              onChange={(e) => onNewTaskDescriptionChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateTask()
                }
              }}
            />
          </div>
          <div className="input-row">
            <select
              value={newTaskCategory}
              onChange={(e) => onNewTaskCategoryChange(e.target.value)}
            >
              <option value="General">General</option>
              <option value="School">School</option>
              <option value="Personal">Personal</option>
            </select>
            <input
              type="date"
              value={newTaskDate}
              onChange={(e) => onNewTaskDateChange(e.target.value)}
            />
            <button type="button" onClick={handleCreateTask}>
              Add task
            </button>
          </div>
        </div>

        <div className="subtasks-builder">
          <label>Subtasks (optional)</label>
          <div className="subtask-input-row">
            <input
              type="text"
              placeholder="Subtask title..."
              value={subtaskInput}
              onChange={(e) => setSubtaskInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddSubtask()
                }
              }}
            />
            <input
              type="text"
              placeholder="Subtask description..."
              value={subtaskDescInput}
              onChange={(e) => setSubtaskDescInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddSubtask()
                }
              }}
            />
            <button type="button" onClick={handleAddSubtask}>
              Add
            </button>
          </div>
          {subtasks.length > 0 && (
            <ul className="subtasks-preview">
              {subtasks.map((st, i) => (
                <li key={i}>
                  <div>
                    <strong>{st.title}</strong>
                    {st.description && <span>{st.description}</span>}
                  </div>
                  <button
                    type="button"
                    className="secondary icon-only delete-red"
                    onClick={() => handleRemoveSubtask(i)}
                    aria-label="Remove subtask"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
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
