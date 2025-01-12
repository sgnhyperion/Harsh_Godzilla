import TaskItem from './TaskItem';

const TaskList = ({ title, titleColor, tasks, onDelete, onEdit, onToggleComplete, isDarkMode }) => {
  return (
    <div className='border border-gray-500 h-full'>
      <h2 className={`text-lg font-semibold ${titleColor} mb-4 flex justify-center`}>{title}</h2>
      <div className="space-y-2">
        {tasks.map(task => (
          <TaskItem 
            key={task.id}
            task={task}
            onDelete={onDelete}
            onEdit={onEdit}
            onToggleComplete={onToggleComplete}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;