import { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import AddTaskModal from './components/AddTaskModal';
import PreferenceModal from './components/PreferenceModal';
import { Edit2, Trash2 } from 'lucide-react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[400px] text-black">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full border-2 border-yellow-500 flex items-center justify-center">
            <span className="text-2xl">!</span>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-center mb-4">
          Are you sure you want to delete this task?
        </h3>
        <div className="flex items-center gap-2 mb-4">
          <input type="checkbox" id="noShow" className="rounded" />
          <label htmlFor="noShow" className="text-sm text-gray-600">Do not show again</label>
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Yes, I'm sure
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            No, cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {

  


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

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  }, [tasks]);

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
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      <header className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="grid grid-cols-2 gap-1">
            <div className="w-2 h-2 bg-green-500"></div>
            <div className="w-2 h-2 bg-blue-500"></div>
            <div className="w-2 h-2 bg-yellow-500"></div>
            <div className="w-2 h-2 bg-red-500"></div>
          </div>
          <h1 className="text-xl font-bold">supertasks.io</h1>
          <span className="px-2 py-1 text-xs bg-gray-700 rounded">BETA</span>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-2 relative">
        <div className="border-r border-b border-gray-800 p-4 overflow-auto">
          <TaskList 
            title="DO FIRST"
            titleColor="text-green-400"
            tasks={tasks.doFirst}
            onDelete={(id) => handleDeleteClick('doFirst', id)}
            onEdit={(task) => handleEditTask('doFirst', task)}
            onToggleComplete={(id) => handleToggleComplete('doFirst', id)}
          />
        </div>
        <div className="border-b border-gray-800 p-4 overflow-auto">
          <TaskList 
            title="DO LATER"
            titleColor="text-blue-400"
            tasks={tasks.doLater}
            onDelete={(id) => handleDeleteClick('doLater', id)}
            onEdit={(task) => handleEditTask('doLater', task)}
            onToggleComplete={(id) => handleToggleComplete('doLater', id)}
          />
        </div>
        <div className="border-r border-gray-800 p-4 overflow-auto">
          <TaskList 
            title="DELEGATE"
            titleColor="text-yellow-500"
            tasks={tasks.delegate}
            onDelete={(id) => handleDeleteClick('delegate', id)}
            onEdit={(task) => handleEditTask('delegate', task)}
            onToggleComplete={(id) => handleToggleComplete('delegate', id)}
          />
        </div>
        <div className="p-4 overflow-auto">
          <TaskList 
            title="ELIMINATE"
            titleColor="text-red-500"
            tasks={tasks.eliminate}
            onDelete={(id) => handleDeleteClick('eliminate', id)}
            onEdit={(task) => handleEditTask('eliminate', task)}
            onToggleComplete={(id) => handleToggleComplete('eliminate', id)}
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
      />

      <PreferenceModal
        isOpen={isPrefModalOpen}
        onClose={() => {
          setIsPrefModalOpen(false);
          setCurrentTask('');
        }}
        onSelect={handleSetPreference}
      />

      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteTask(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default App;