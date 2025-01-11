import { Edit2, Trash2 } from 'lucide-react';

const TaskItem = ({ task, onDelete, onEdit, onToggleComplete }) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-800 bg-opacity-40 rounded group">
      <input
        type="radio"
        checked={task.completed}
        onChange={() => onToggleComplete(task.id)}
        className="w-4 h-4 border-2 border-gray-400 rounded-full"
      />
      <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : ''}`}>
        {task.text}
      </span>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(task)}
          className="p-1 hover:text-green-400"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1 hover:text-red-400"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;