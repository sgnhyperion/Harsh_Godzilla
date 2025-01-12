// App.jsx
import { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import AddTaskModal from './components/AddTaskModal';
import PreferenceModal from './components/PreferenceModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';

const App = () => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? JSON.parse(savedTheme) : true;
  });

  // Task management states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPrefModalOpen, setIsPrefModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTask, setDeleteTask] = useState(null);
  const [currentTask, setCurrentTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks);
      } catch (error) {
        console.error('Error parsing tasks from localStorage:', error);
        return {
          doFirst: [],
          doLater: [],
          delegate: [],
          eliminate: []
        };
      }
    }
    return {
      doFirst: [],
      doLater: [],
      delegate: [],
      eliminate: []
    };
  });

  // Theme persistence
  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Tasks persistence
  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  }, [tasks]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleAddTask = (task) => {
    setCurrentTask(task);
    setIsAddModalOpen(false);
    setIsPrefModalOpen(true);
  };

  const handleSetPreference = (preference) => {
    if (editingTask) {
      setTasks(prev => ({
        ...prev,
        [editingTask.category]: prev[editingTask.category].map(task =>
          task.id === editingTask.id ? { ...task, text: currentTask } : task
        )
      }));
      setEditingTask(null);
    } else {
      setTasks(prev => ({
        ...prev,
        [preference]: [...prev[preference], { 
          id: Date.now(), 
          text: currentTask,
          completed: false,
          createdAt: new Date().toISOString()
        }]
      }));
    }
    setIsPrefModalOpen(false);
    setCurrentTask('');
  };

  const handleDeleteClick = (preference, taskId) => {
    setDeleteTask({ preference, taskId });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTask) {
      setTasks(prev => ({
        ...prev,
        [deleteTask.preference]: prev[deleteTask.preference].filter(task => task.id !== deleteTask.taskId)
      }));
      setIsDeleteModalOpen(false);
      setDeleteTask(null);
    }
  };

  const handleEditTask = (category, task) => {
    setCurrentTask(task.text);
    setEditingTask({ ...task, category });
    setIsAddModalOpen(true);
  };

  const handleToggleComplete = (category, taskId) => {
    setTasks(prev => ({
      ...prev,
      [category]: prev[category].map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    }));
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-[#121212] text-white' : 'bg-white text-gray-900'}`}>
      <header className={`p-4 flex items-center justify-between ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} border-b`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="grid grid-cols-2 gap-1">
              <div className="w-2 h-2 bg-green-500"></div>
              <div className="w-2 h-2 bg-blue-500"></div>
              <div className="w-2 h-2 bg-yellow-500"></div>
              <div className="w-2 h-2 bg-red-500"></div>
            </div>
            <h1 className="text-xl font-bold">supertasks.io</h1>
            <span className="px-2 py-1 text-xs bg-gray-700 rounded">BETA</span>
            <span className="text-[#00BDB4] px-2">Quick decision making tool</span>
          </div>
        </div>
        
        <div className="flex justify-center gap-10">
          <button 
            onClick={toggleTheme}
            className={`${isDarkMode ? 'text-white' : 'text-gray-900'} hover:text-gray-500`}
          >
            {isDarkMode ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <button className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-bold`}>Workspaces</button>
          <button className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-bold`}>About</button>
          <button className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-bold`}>Pricing</button>
          <button className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-bold`}>Feedback</button>
          <button className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-bold`}>Login</button>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-2 relative">
        <div className={`border-r border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} p-4 overflow-auto`}>
          <TaskList 
            title="DO FIRST"
            titleColor={isDarkMode ? "text-green-400" : "text-green-600"}
            tasks={tasks.doFirst}
            onDelete={(id) => handleDeleteClick('doFirst', id)}
            onEdit={(task) => handleEditTask('doFirst', task)}
            onToggleComplete={(id) => handleToggleComplete('doFirst', id)}
            isDarkMode={isDarkMode}
          />
        </div>
        <div className={`border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} p-4 overflow-auto`}>
          <TaskList 
            title="DO LATER"
            titleColor={isDarkMode ? "text-blue-400" : "text-blue-600"}
            tasks={tasks.doLater}
            onDelete={(id) => handleDeleteClick('doLater', id)}
            onEdit={(task) => handleEditTask('doLater', task)}
            onToggleComplete={(id) => handleToggleComplete('doLater', id)}
            isDarkMode={isDarkMode}
          />
        </div>
        <div className={`border-r ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} p-4 overflow-auto`}>
          <TaskList 
            title="DELEGATE"
            titleColor={isDarkMode ? "text-yellow-500" : "text-yellow-600"}
            tasks={tasks.delegate}
            onDelete={(id) => handleDeleteClick('delegate', id)}
            onEdit={(task) => handleEditTask('delegate', task)}
            onToggleComplete={(id) => handleToggleComplete('delegate', id)}
            isDarkMode={isDarkMode}
          />
        </div>
        <div className="p-4 overflow-auto">
          <TaskList 
            title="ELIMINATE"
            titleColor={isDarkMode ? "text-red-500" : "text-red-600"}
            tasks={tasks.eliminate}
            onDelete={(id) => handleDeleteClick('eliminate', id)}
            onEdit={(task) => handleEditTask('eliminate', task)}
            onToggleComplete={(id) => handleToggleComplete('eliminate', id)}
            isDarkMode={isDarkMode}
          />
        </div>

        <button
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full text-black text-2xl flex items-center justify-center hover:bg-gray-100"
          onClick={() => setIsAddModalOpen(true)}
        >
          +
        </button>
      </main>

      <AddTaskModal 
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTask(null);
          setCurrentTask('');
        }}
        onSubmit={handleAddTask}
        initialValue={currentTask}
        isDarkMode={isDarkMode}
      />

      <PreferenceModal
        isOpen={isPrefModalOpen}
        onClose={() => {
          setIsPrefModalOpen(false);
          setCurrentTask('');
        }}
        onSelect={handleSetPreference}
        isDarkMode={isDarkMode}
      />

      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteTask(null);
        }}
        onConfirm={handleConfirmDelete}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default App;