import { useState, useEffect } from 'react';

const AddTaskModal = ({ isOpen, onClose, onSubmit, initialValue = '' }) => {
  const [task, setTask] = useState(initialValue);

  useEffect(() => {
    setTask(initialValue);
  }, [initialValue]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.trim()) {
      onSubmit(task);
      setTask('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-[#1A2333] p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add tasks</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Add your super task"
            className="w-full p-2 mb-4 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-red-500"
            >
              CLOSE
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
            >
              SUBMIT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;