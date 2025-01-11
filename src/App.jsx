import { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import AddTaskModal from './components/AddTaskModal';
import PreferenceModal from './components/PreferenceModal';
import { Edit2, Trash2 } from 'lucide-react';

const App = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPrefModalOpen, setIsPrefModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [tasks, setTasks] = useState({
    doFirst: [],
    doLater: [],
    delegate: [],
    eliminate: []
  });

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (task) => {
    setCurrentTask(task);
    setIsAddModalOpen(false);
    setIsPrefModalOpen(true);
  };

  const handleSetPreference = (preference) => {
    if (editingTask) {
      // Update existing task
      setTasks(prev => ({
        ...prev,
        [editingTask.category]: prev[editingTask.category].map(task =>
          task.id === editingTask.id ? { ...task, text: currentTask } : task
        )
      }));
      setEditingTask(null);
    } else {
      // Add new task
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

  const handleDeleteTask = (preference, taskId) => {
    setTasks(prev => ({
      ...prev,
      [preference]: prev[preference].filter(task => task.id !== taskId)
    }));
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
    <div className="min-h-screen bg-[#0A1323] text-white">
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

      <main className="grid grid-cols-2 gap-4 p-4">
        <div className="space-y-4">
          <TaskList 
            title="DO FIRST"
            titleColor="text-green-400"
            tasks={tasks.doFirst}
            onDelete={(id) => handleDeleteTask('doFirst', id)}
            onEdit={(task) => handleEditTask('doFirst', task)}
            onToggleComplete={(id) => handleToggleComplete('doFirst', id)}
          />
          <TaskList 
            title="DELEGATE"
            titleColor="text-yellow-500"
            tasks={tasks.delegate}
            onDelete={(id) => handleDeleteTask('delegate', id)}
            onEdit={(task) => handleEditTask('delegate', task)}
            onToggleComplete={(id) => handleToggleComplete('delegate', id)}
          />
        </div>
        <div className="space-y-4">
          <TaskList 
            title="DO LATER"
            titleColor="text-blue-400"
            tasks={tasks.doLater}
            onDelete={(id) => handleDeleteTask('doLater', id)}
            onEdit={(task) => handleEditTask('doLater', task)}
            onToggleComplete={(id) => handleToggleComplete('doLater', id)}
          />
          <TaskList 
            title="ELIMINATE"
            titleColor="text-red-500"
            tasks={tasks.eliminate}
            onDelete={(id) => handleDeleteTask('eliminate', id)}
            onEdit={(task) => handleEditTask('eliminate', task)}
            onToggleComplete={(id) => handleToggleComplete('eliminate', id)}
          />
        </div>
      </main>

      <button
        className="fixed bottom-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full text-black text-2xl flex items-center justify-center"
        onClick={() => setIsAddModalOpen(true)}
      >
        +
      </button>

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
    </div>
  );
};

export default App;