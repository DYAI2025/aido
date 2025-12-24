import React, { useState, useEffect } from 'react';
import { DatabaseService, Task, Agent } from '../../services/DatabaseService';

interface TaskBoardProps {
  databaseService?: DatabaseService;
}

type ColumnStatus = 'pending' | 'in_progress' | 'review' | 'completed';

interface Column {
  id: ColumnStatus;
  title: string;
  tasks: Task[];
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ databaseService }) => {
  const [columns, setColumns] = useState<Column[]>([
    { id: 'pending', title: 'To Do', tasks: [] },
    { id: 'in_progress', title: 'In Progress', tasks: [] },
    { id: 'review', title: 'Review', tasks: [] },
    { id: 'completed', title: 'Done', tasks: [] }
  ]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [error, setError] = useState('');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const database = databaseService || new DatabaseService();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError('');
      const [loadedTasks, loadedAgents] = await Promise.all([
        database.getAllTasks(),
        database.getAgents()
      ]);

      setAgents(loadedAgents);
      distributeTasks(loadedTasks);
    } catch (err) {
      setError(`Error loading tasks: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const distributeTasks = (tasks: Task[]) => {
    const newColumns: Column[] = [
      { id: 'pending', title: 'To Do', tasks: [] },
      { id: 'in_progress', title: 'In Progress', tasks: [] },
      { id: 'review', title: 'Review', tasks: [] },
      { id: 'completed', title: 'Done', tasks: [] }
    ];

    tasks.forEach(task => {
      const status = task.status === 'assigned' ? 'pending' : task.status;
      const column = newColumns.find(col => col.id === status);
      if (column) {
        column.tasks.push(task);
      }
    });

    // Sort tasks by priority within each column (lower number = higher priority)
    newColumns.forEach(column => {
      column.tasks.sort((a, b) => {
        const priorityA = a.priority ?? 999;
        const priorityB = b.priority ?? 999;
        return priorityA - priorityB;
      });
    });

    setColumns(newColumns);
  };

  const getAgentName = (agentId: string): string => {
    const agent = agents.find(a => a.id === agentId);
    return agent ? agent.name : 'Unknown Agent';
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, targetColumnId: ColumnStatus) => {
    e.preventDefault();

    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;

    try {
      // Find the task and its current column
      let task: Task | undefined;
      let sourceColumnId: ColumnStatus | undefined;

      for (const column of columns) {
        const foundTask = column.tasks.find(t => t.id === taskId);
        if (foundTask) {
          task = foundTask;
          sourceColumnId = column.id;
          break;
        }
      }

      if (!task || !sourceColumnId) return;

      // If dropped in same column, just reorder (would need more logic for exact position)
      if (sourceColumnId === targetColumnId) {
        // For now, just refresh - could implement fine-grained reordering later
        setDraggedTaskId(null);
        return;
      }

      // Update task status in database
      await database.updateTaskStatus(taskId, targetColumnId);

      // Reload tasks to reflect changes
      await loadData();
    } catch (err) {
      setError(`Error updating task: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setDraggedTaskId(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
  };

  return (
    <div className="task-board">
      <h1>Task Board</h1>

      {error && (
        <div className="error-message" role="alert" data-testid="error-message">
          {error}
        </div>
      )}

      <div className="kanban-board">
        {columns.map(column => (
          <div
            key={column.id}
            className="kanban-column"
            data-testid={`column-${column.id}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="column-header">
              <h2>{column.title} ({column.tasks.length})</h2>
            </div>

            <div className="column-content">
              {column.tasks.length === 0 ? (
                <div className="empty-column">
                  <p>No tasks</p>
                </div>
              ) : (
                column.tasks.map(task => (
                  <div
                    key={task.id}
                    className={`task-card ${draggedTaskId === task.id ? 'dragging' : ''}`}
                    draggable
                    data-testid={`task-card-${task.id}`}
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="task-priority">
                      {task.priority && (
                        <span className="priority-badge">P{task.priority}</span>
                      )}
                    </div>
                    <div className="task-description">
                      {task.description}
                    </div>
                    <div className="task-meta">
                      <span className="task-agent">
                        👤 {getAgentName(task.assignedAgentId)}
                      </span>
                      <span className="task-date">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
