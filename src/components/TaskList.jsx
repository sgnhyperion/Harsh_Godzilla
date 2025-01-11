import TaskItem from './TaskItem';

const TaskList = ({ title, titleColor, tasks, onDelete, onEdit, onToggleComplete }) => {
  return (
    <div>
      <h2 className={`text-lg font-semibold ${titleColor} mb-4`}>{title}</h2>
      <div className="space-y-2">
        {tasks.map(task => (
          <TaskItem 
            key={task.id}
            task={task}
            onDelete={onDelete}
            onEdit={onEdit}
            onToggleComplete={onToggleComplete}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;