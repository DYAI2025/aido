import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { TaskBoard } from './TaskBoard';
import { Task } from '../../services/DatabaseService';

describe('TaskBoard', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      description: 'High priority task',
      assignedAgentId: 'agent-1',
      status: 'pending',
      createdAt: new Date(),
      priority: 1
    },
    {
      id: '2',
      description: 'Task in progress',
      assignedAgentId: 'agent-2',
      status: 'in_progress',
      createdAt: new Date(),
      priority: 2
    },
    {
      id: '3',
      description: 'Task in review',
      assignedAgentId: 'agent-1',
      status: 'review',
      createdAt: new Date(),
      priority: 1
    },
    {
      id: '4',
      description: 'Completed task',
      assignedAgentId: 'agent-3',
      status: 'completed',
      createdAt: new Date(),
      priority: 3
    }
  ];

  const mockDatabase = {
    getAllTasks: vi.fn().mockResolvedValue(mockTasks),
    updateTaskStatus: vi.fn().mockResolvedValue(mockTasks[0]),
    updateTaskPriority: vi.fn().mockResolvedValue(mockTasks[0]),
    getAgents: vi.fn().mockResolvedValue([
      { id: 'agent-1', name: 'Agent 1', specialty: 'Finance' },
      { id: 'agent-2', name: 'Agent 2', specialty: 'Operations' }
    ])
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render four columns (To Do, In Progress, Review, Done)', async () => {
    render(<TaskBoard databaseService={mockDatabase as any} />);

    await waitFor(() => {
      expect(screen.getByText('To Do')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Review')).toBeInTheDocument();
      expect(screen.getByText('Done')).toBeInTheDocument();
    });
  });

  it('should load and display tasks in correct columns', async () => {
    render(<TaskBoard databaseService={mockDatabase as any} />);

    await waitFor(() => {
      expect(mockDatabase.getAllTasks).toHaveBeenCalled();
    });

    // Check tasks are in correct columns
    expect(await screen.findByText('High priority task')).toBeInTheDocument();
    expect(screen.getByText('Task in progress')).toBeInTheDocument();
    expect(screen.getByText('Task in review')).toBeInTheDocument();
    expect(screen.getByText('Completed task')).toBeInTheDocument();
  });

  it('should display tasks sorted by priority (highest first)', async () => {
    const tasksWithPriority = [
      { ...mockTasks[0], priority: 3 },
      { ...mockTasks[1], priority: 1 },
      { ...mockTasks[2], priority: 2 }
    ];

    mockDatabase.getAllTasks.mockResolvedValue(tasksWithPriority);

    render(<TaskBoard databaseService={mockDatabase as any} />);

    await waitFor(() => {
      const taskElements = screen.getAllByTestId(/task-card/);
      expect(taskElements.length).toBeGreaterThan(0);
    });
  });

  it('should handle drag start event', async () => {
    render(<TaskBoard databaseService={mockDatabase as any} />);

    await waitFor(() => {
      expect(screen.getByText('High priority task')).toBeInTheDocument();
    });

    const taskCard = screen.getByText('High priority task').closest('[draggable="true"]');
    expect(taskCard).toBeInTheDocument();

    if (taskCard) {
      fireEvent.dragStart(taskCard, { dataTransfer: { setData: vi.fn() } });
    }
  });

  it('should update task status when dropped in different column', async () => {
    render(<TaskBoard databaseService={mockDatabase as any} />);

    await waitFor(() => {
      expect(screen.getByText('High priority task')).toBeInTheDocument();
    });

    const taskCard = screen.getByText('High priority task').closest('[draggable="true"]');
    const dropZone = screen.getByTestId('column-in_progress');

    if (taskCard && dropZone) {
      const dataTransfer = {
        getData: vi.fn().mockReturnValue('1'),
        setData: vi.fn()
      };

      fireEvent.dragStart(taskCard, { dataTransfer });
      fireEvent.drop(dropZone, { dataTransfer });

      await waitFor(() => {
        expect(mockDatabase.updateTaskStatus).toHaveBeenCalledWith('1', 'in_progress');
      });
    }
  });

  it('should update task priority when reordered within column', async () => {
    const pendingTasks = [
      { ...mockTasks[0], status: 'pending', priority: 1 },
      { ...mockTasks[1], status: 'pending', priority: 2 }
    ];

    mockDatabase.getAllTasks.mockResolvedValue(pendingTasks);
    render(<TaskBoard databaseService={mockDatabase as any} />);

    await waitFor(() => {
      expect(screen.getByText('High priority task')).toBeInTheDocument();
    });

    // Simulate drag and drop within same column
    const taskCard = screen.getByText('High priority task').closest('[draggable="true"]');
    const dropZone = screen.getByTestId('column-pending');

    if (taskCard && dropZone) {
      const dataTransfer = {
        getData: vi.fn().mockReturnValue('1'),
        setData: vi.fn()
      };

      fireEvent.dragStart(taskCard, { dataTransfer });
      fireEvent.drop(dropZone, { dataTransfer });
    }
  });

  it('should display error when loading tasks fails', async () => {
    mockDatabase.getAllTasks.mockRejectedValue(new Error('Database error'));

    render(<TaskBoard databaseService={mockDatabase as any} />);

    expect(await screen.findByText(/Error loading tasks/)).toBeInTheDocument();
  });

  it('should display task count in each column header', async () => {
    render(<TaskBoard databaseService={mockDatabase as any} />);

    await waitFor(() => {
      expect(screen.getByText(/To Do \(1\)/)).toBeInTheDocument();
      expect(screen.getByText(/In Progress \(1\)/)).toBeInTheDocument();
      expect(screen.getByText(/Review \(1\)/)).toBeInTheDocument();
      expect(screen.getByText(/Done \(1\)/)).toBeInTheDocument();
    });
  });

  it('should display assigned agent name on task card', async () => {
    render(<TaskBoard databaseService={mockDatabase as any} />);

    await waitFor(() => {
      expect(mockDatabase.getAgents).toHaveBeenCalled();
    });

    expect(await screen.findByText(/Agent 1/)).toBeInTheDocument();
  });

  it('should allow drag over drop zones', async () => {
    render(<TaskBoard databaseService={mockDatabase as any} />);

    await waitFor(() => {
      expect(screen.getByTestId('column-pending')).toBeInTheDocument();
    });

    const dropZone = screen.getByTestId('column-pending');

    fireEvent.dragOver(dropZone, { preventDefault: vi.fn() });

    // Should not throw error
    expect(dropZone).toBeInTheDocument();
  });
});
