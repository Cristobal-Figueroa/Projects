import { useEffect, useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import './App.css'
import Login from './components/Login.jsx'
import TaskList from './components/TaskList.jsx'

const TASKS_KEY = 'week2_tasks'
const USER_KEY = 'week2_user'

/**
 * Creates an initial list of tasks with sample subtasks to populate the UI.
 */
function createSeedTasks() {
  return [
    {
      id: uuidv4(),
      title: 'Prepare CS 310 discussion post',
      completed: false,
      subtasks: [
        { id: uuidv4(), title: 'Outline key ideas', completed: true },
        { id: uuidv4(), title: 'Record video summary', completed: false },
      ],
    },
    {
      id: uuidv4(),
      title: 'Finish data structures homework',
      completed: false,
      subtasks: [
        { id: uuidv4(), title: 'Implement linked list', completed: true },
        { id: uuidv4(), title: 'Write tests', completed: false },
      ],
    },
    {
      id: uuidv4(),
      title: 'Plan mentorship meeting',
      completed: true,
      subtasks: [
        { id: uuidv4(), title: 'Send agenda', completed: true },
        { id: uuidv4(), title: 'Collect questions', completed: true },
      ],
    },
  ]
}

/**
 * Reads tasks stored in localStorage or falls back to the seeded list.
 */
function getStoredTasks() {
  if (typeof window === 'undefined') {
    return createSeedTasks()
  }

  try {
    const stored = window.localStorage.getItem(TASKS_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch (error) {
    console.error('Unable to read tasks from storage', error)
  }
  return createSeedTasks()
}

/**
 * Retrieves the stored user name so the login screen can be skipped.
 */
function getStoredUser() {
  if (typeof window === 'undefined') {
    return ''
  }
  return window.localStorage.getItem(USER_KEY) || ''
}

/**
 * Recursively counts every task and subtask included in the provided list.
 */
export function countNestedTasks(taskList) {
  if (!Array.isArray(taskList)) {
    return 0
  }

  return taskList.reduce((total, task) => {
    const subTotal = Array.isArray(task.subtasks)
      ? countNestedTasks(task.subtasks)
      : 0
    return total + 1 + subTotal
  }, 0)
}

/**
 * Uses reduce to count how many tasks (including subtasks) are completed.
 */
function countCompletedTasks(taskList) {
  if (!Array.isArray(taskList)) {
    return 0
  }

  return taskList.reduce((sum, task) => {
    const nested = Array.isArray(task.subtasks)
      ? countCompletedTasks(task.subtasks)
      : 0
    return sum + (task.completed ? 1 : 0) + nested
  }, 0)
}

/**
 * Toggles the completion state for the task that matches the provided id.
 */
function toggleTaskCompletion(taskList, taskId) {
  return taskList.map((task) => {
    if (task.id === taskId) {
      return { ...task, completed: !task.completed }
    }
    if (Array.isArray(task.subtasks) && task.subtasks.length > 0) {
      return {
        ...task,
        subtasks: toggleTaskCompletion(task.subtasks, taskId),
      }
    }
    return task
  })
}

/**
 * Removes the task whose id matches taskId, searching nested subtasks too.
 */
function deleteTaskById(taskList, taskId) {
  return taskList
    .filter((task) => task.id !== taskId)
    .map((task) => {
      if (Array.isArray(task.subtasks) && task.subtasks.length > 0) {
        return { ...task, subtasks: deleteTaskById(task.subtasks, taskId) }
      }
      return task
    })
}

/**
 * React component that renders the entire to-do application experience.
 */
function App() {
  const [userName, setUserName] = useState(() => getStoredUser())
  const [tasks, setTasks] = useState(() => getStoredTasks())
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
    }
  }, [tasks])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    if (userName) {
      window.localStorage.setItem(USER_KEY, userName)
    } else {
      window.localStorage.removeItem(USER_KEY)
    }
  }, [userName])

  /**
   * Adds a new task to the list when the input has a non-empty value.
   */
  const handleAddTask = () => {
    const trimmed = newTaskTitle.trim()
    if (!trimmed) {
      return
    }
    setTasks((prev) => [
      {
        id: uuidv4(),
        title: trimmed,
        completed: false,
        subtasks: [],
      },
      ...prev,
    ])
    setNewTaskTitle('')
  }

  /**
   * Deletes the task that matches the provided id.
   */
  const handleDeleteTask = (taskId) => {
    setTasks((prev) => deleteTaskById(prev, taskId))
  }

  /**
   * Toggles the completion state for the matching task id.
   */
  const handleToggleComplete = (taskId) => {
    setTasks((prev) => toggleTaskCompletion(prev, taskId))
  }

  /**
   * Persists the user name after the login form is submitted.
   */
  const handleLogin = (name) => {
    setUserName(name)
  }

  /**
   * Clears the stored user so the login screen appears again.
   */
  const handleLogout = () => {
    setUserName('')
  }

  /**
   * Changes the current view filter (all, completed, or pending).
   */
  const handleFilterChange = (value) => {
    setFilter(value)
  }

  /**
   * Filters tasks according to the currently selected status.
   */
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filter === 'completed') {
        return task.completed
      }
      if (filter === 'pending') {
        return !task.completed
      }
      return true
    })
  }, [tasks, filter])

  /**
   * Computes the total number of completed tasks using reduce.
   */
  const completedTotal = useMemo(() => countCompletedTasks(tasks), [tasks])

  /**
   * Computes the recursive count of all tasks, including subtasks.
   */
  const nestedTotal = useMemo(() => countNestedTasks(tasks), [tasks])

  if (!userName) {
    return (
      <div className="app-shell">
        <Login onLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="welcome">Bienvenido, {userName}</p>
          <h1>Week 2 To-Do Tracker</h1>
          <p className="tagline">
            Track homework, projects, and subtasks with local persistence.
          </p>
        </div>
        <button className="secondary" type="button" onClick={handleLogout}>
          Log out
        </button>
      </header>

      <section className="summary-panel">
        <div>
          <p className="stat-label">Completed tasks</p>
          <p className="stat-value">{completedTotal}</p>
        </div>
        <div>
          <p className="stat-label">Total tasks (with subtasks)</p>
          <p className="stat-value">{nestedTotal}</p>
        </div>
        <div>
          <p className="stat-label">Filter</p>
          <div className="filter-buttons">
            <button
              type="button"
              className={filter === 'all' ? 'active' : ''}
              onClick={() => handleFilterChange('all')}
            >
              All
            </button>
            <button
              type="button"
              className={filter === 'completed' ? 'active' : ''}
              onClick={() => handleFilterChange('completed')}
            >
              Completed
            </button>
            <button
              type="button"
              className={filter === 'pending' ? 'active' : ''}
              onClick={() => handleFilterChange('pending')}
            >
              Pending
            </button>
          </div>
        </div>
      </section>

      <section className="builder">
        <label htmlFor="newTask">Add a task</label>
        <div className="input-row">
          <input
            id="newTask"
            type="text"
            placeholder="Describe the task..."
            value={newTaskTitle}
            onChange={(event) => setNewTaskTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleAddTask()
              }
            }}
          />
          <button type="button" onClick={handleAddTask}>
            Add task
          </button>
        </div>
      </section>

      <TaskList
        tasks={filteredTasks}
        onToggleComplete={handleToggleComplete}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  )
}

export default App
