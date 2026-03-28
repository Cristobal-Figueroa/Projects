# To-Do List Web App

## Overview
A React + Vite single‑page web app that lets users log in, manage tasks and subtasks, filter/sort by status or category, view completion progress, and navigate between Tasks, Dashboard, and Profile views—all persisted to localStorage.

## Demo Video
[Watch the demo here](https://youtu.be/tbd)

## Technologies Used
- React + Vite
- React Router DOM
- UUID
- CSS

## Development Environment
- Visual Studio Code
- Node.js
- Git / GitHub

## Useful Websites
- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [Vite Documentation](https://vitejs.dev)

## Features
- User authentication with localStorage
- Task creation with title, description, category, and date
- Subtasks with title and description
- Filter by status (all, completed, pending)
- Filter by date
- Sort by date (newest) or alphabetical
- Category-based filtering (All, School, Personal, General)
- Visual progress bars for overall and category completion
- Dashboard with statistics, recent tasks, and overdue alerts
- Profile with activity stats and name editing
- Fully responsive design (mobile, tablet, desktop)
- Icon-based action buttons with hover effects

## File Structure
```
src/
├── components/
│   ├── Login.jsx
│   ├── TaskList.jsx
│   ├── TaskItem.jsx
│   ├── Navbar.jsx
│   ├── Dashboard.jsx
│   └── Profile.jsx
├── App.jsx
├── App.css
└── index.css
```

## Future Work
- Connect to a real SQL database
- Add user authentication with a backend
- Add due dates and priorities
- Implement drag-and-drop task reordering
- Add task templates
