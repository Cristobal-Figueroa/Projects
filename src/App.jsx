import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import './App.css'
import Login from './components/Login.jsx'
import TaskList from './components/TaskList.jsx'
import Dashboard from './components/Dashboard.jsx'
import Profile from './components/Profile.jsx'
import Navbar from './components/Navbar.jsx'

const TASKS_KEY = 'week2_tasks'
const USER_KEY = 'week2_user'

/**
 * Creates an initial list of tasks with sample subtasks to populate the UI.
 */
function createSeedTasks() {
  const now = new Date().toISOString()
  return [
    {
      id: uuidv4(),
      title: 'Prepare CS 310 discussion post',
      description: 'Outline key ideas and record a 2‑minute video summary for the weekly discussion.',
      completed: false,
      category: 'School',
      createdAt: now,
      subtasks: [
        { id: uuidv4(), title: 'Outline key ideas', description: 'List 3 main points', completed: true },
        { id: uuidv4(), title: 'Record video summary', description: '2‑minute clip', completed: false },
      ],
    },
    {
      id: uuidv4(),
      title: 'Finish data structures homework',
      description: 'Implement linked list and write unit tests.',
      completed: false,
      category: 'School',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      subtasks: [
        { id: uuidv4(), title: 'Implement linked list', description: 'Singly linked list', completed: true },
        { id: uuidv4(), title: 'Write tests', description: 'Cover edge cases', completed: false },
      ],
    },
    {
      id: uuidv4(),
      title: 'Plan mentorship meeting',
      description: 'Send agenda and collect questions before the meeting.',
      completed: true,
      category: 'Personal',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      subtasks: [
        { id: uuidv4(), title: 'Send agenda', description: 'Email with topics', completed: true },
        { id: uuidv4(), title: 'Collect questions', description: 'Gather from mentees', completed: true },
      ],
    },
  ]
}

/**
 * Reads tasks stored in localStorage or falls back to the seeded list.
 */
function getStoredTasks() {
  // Always return fresh seed tasks for now
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
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [newTaskCategory, setNewTaskCategory] = useState('General')
  const [newTaskDate, setNewTaskDate] = useState(new Date().toISOString().split('T')[0])
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [filterDate, setFilterDate] = useState('')

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
   * Accepts an optional array of subtask titles and descriptions.
   */
  const handleAddTask = (subtaskData = []) => {
    const trimmed = newTaskTitle.trim()
    if (!trimmed) {
      return
    }
    setTasks((prev) => [
      {
        id: uuidv4(),
        title: trimmed,
        description: newTaskDescription.trim(),
        completed: false,
        category: newTaskCategory,
        createdAt: newTaskDate ? new Date(newTaskDate).toISOString() : new Date().toISOString(),
        subtasks: subtaskData.map(({ title, description }) => ({
          id: uuidv4(),
          title,
          description,
          completed: false,
        })),
      },
      ...prev,
    ])
    setNewTaskTitle('')
    setNewTaskDescription('')
    setNewTaskCategory('General')
    setNewTaskDate(new Date().toISOString().split('T')[0])
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
    window.localStorage.removeItem(USER_KEY)
  }

  /**
   * Changes the current view filter (all, completed, or pending).
   */
  const handleFilterChange = (value) => {
    setFilter(value)
  }

  /**
   * Filters and sorts tasks according to the current settings.
   */
  const filteredAndSortedTasks = useMemo(() => {
    let result = tasks.filter((task) => {
      if (filter === 'completed') return task.completed
      if (filter === 'pending') return !task.completed
      return true
    })

    if (selectedCategory !== 'All') {
      result = result.filter((task) => task.category === selectedCategory)
    }

    if (filterDate) {
      result = result.filter((task) => {
        const taskDate = new Date(task.createdAt).toISOString().split('T')[0]
        return taskDate === filterDate
      })
    }

    if (sortBy === 'date') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } else if (sortBy === 'alpha') {
      result.sort((a, b) => a.title.localeCompare(b.title))
    }

    return result
  }, [tasks, filter, sortBy, selectedCategory, filterDate])

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
      <Router>
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    )
  }

  return (
    <Router>
      <Navbar userName={userName} />
      <div className="app-shell">
        <Routes>
          <Route
            path="/tasks"
            element={
              <TaskList
                tasks={filteredAndSortedTasks}
                onToggleComplete={handleToggleComplete}
                onDeleteTask={handleDeleteTask}
                filter={filter}
                sortBy={sortBy}
                selectedCategory={selectedCategory}
                onFilterChange={handleFilterChange}
                onSortChange={setSortBy}
                onCategoryChange={setSelectedCategory}
                onAddTask={handleAddTask}
                newTaskTitle={newTaskTitle}
                onNewTaskTitleChange={setNewTaskTitle}
                newTaskDescription={newTaskDescription}
                onNewTaskDescriptionChange={setNewTaskDescription}
                newTaskCategory={newTaskCategory}
                onNewTaskCategoryChange={setNewTaskCategory}
                newTaskDate={newTaskDate}
                onNewTaskDateChange={setNewTaskDate}
                filterDate={filterDate}
                onFilterDateChange={setFilterDate}
              />
            }
          />
          <Route path="/dashboard" element={<Dashboard tasks={tasks} />} />
          <Route path="/profile" element={<Profile tasks={tasks} onLogout={handleLogout} />} />
          <Route path="*" element={<Navigate to="/tasks" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
