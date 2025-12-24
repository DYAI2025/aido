# CLAUDE.md - AI Assistant Guide for AIDO

This document provides comprehensive guidance for AI assistants working on the AIDO (AI-Driven Decentralized Organization) codebase.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Codebase Structure](#codebase-structure)
3. [Development Workflow](#development-workflow)
4. [Testing Strategy](#testing-strategy)
5. [Component Architecture](#component-architecture)
6. [Service Layer](#service-layer)
7. [Key Conventions](#key-conventions)
8. [Common Development Tasks](#common-development-tasks)
9. [Error Handling Patterns](#error-handling-patterns)
10. [Git and Branch Strategy](#git-and-branch-strategy)

---

## Project Overview

### What is AIDO?

AIDO is an AI-Driven Decentralized Organization that leverages artificial intelligence for autonomous decision-making, task allocation, and performance monitoring without relying on blockchain technology.

### Technology Stack

- **Frontend Framework**: React 18.2 with TypeScript
- **Build Tool**: Vite 5.1
- **Testing**: Vitest with React Testing Library
- **Backend**: Supabase (configured but not fully implemented)
- **AI Integration**: OpenAI API (abstracted through service layer)
- **State Management**: React Hooks (local component state only)
- **Styling**: Plain CSS with CSS Variables

### Project Philosophy

1. **Test-Driven Development**: London School TDD approach with outside-in development
2. **Component Isolation**: Each component is self-contained with mocked dependencies
3. **Service Abstraction**: All external dependencies abstracted through service interfaces
4. **Type Safety**: Strict TypeScript configuration throughout
5. **Autonomous Development**: Designed to support AI-driven overnight development cycles

---

## Codebase Structure

```
/home/user/aido/
├── docs/                           # Comprehensive documentation
│   ├── architecture.md             # System architecture and design
│   ├── development-guide.md        # Development setup and workflows
│   ├── testing-guide.md            # Testing examples and patterns
│   ├── test-driven-development.md  # TDD philosophy and strategy
│   ├── specification.md            # Technical specifications
│   └── ...
├── src/                            # Main application source
│   ├── components/                 # React components (one per folder)
│   │   ├── AgentNetwork/
│   │   │   ├── AgentNetwork.tsx
│   │   │   └── AgentNetwork.test.tsx
│   │   ├── DecisionMaking/
│   │   ├── ConsensusAlgorithm/
│   │   ├── TaskAllocation/
│   │   └── PerformanceMonitoring/
│   ├── services/                   # Business logic and external integrations
│   │   ├── DatabaseService.ts      # Database abstraction
│   │   └── OpenAIService.ts        # OpenAI API abstraction
│   ├── test/                       # Test configuration
│   │   ├── setup.ts                # Global test setup
│   │   └── vitest.d.ts             # Test type definitions
│   ├── App.tsx                     # Root component with routing
│   ├── main.tsx                    # Application entry point
│   ├── vite.config.ts              # Vite configuration
│   ├── vitest.config.ts            # Test configuration
│   ├── tsconfig.json               # TypeScript configuration
│   └── package.json                # Dependencies and scripts
├── auto-fixer.sh                   # Automated test fixing script
├── run_and_fix_test.sh             # Test running and fixing utility
└── README.md                       # Project documentation
```

### Key Directory Principles

1. **Colocated Tests**: Test files are placed next to the component they test
2. **Single Responsibility**: Each folder contains one component or service
3. **Clear Separation**: Components handle UI, Services handle logic
4. **No Global State**: State is managed locally within components

---

## Development Workflow

### Initial Setup

```bash
# Navigate to source directory
cd /home/user/aido/src

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests in watch mode
npm run test:watch
```

### Available NPM Scripts

```json
{
  "dev": "vite",                      // Start dev server at localhost:5173
  "build": "tsc && vite build",       // Build for production
  "lint": "eslint . --ext ts,tsx",    // Run ESLint
  "preview": "vite preview",          // Preview production build
  "test": "vitest",                   // Run tests once
  "test:ui": "vitest --ui",           // Run tests with UI
  "test:coverage": "vitest run --coverage", // Generate coverage report
  "test:watch": "vitest watch"        // Run tests in watch mode
}
```

### Development Process

1. **Read existing code first**: Always read files before modifying
2. **Write tests first**: Follow London School TDD approach
3. **Implement incrementally**: Small, focused changes
4. **Run tests frequently**: Verify behavior continuously
5. **Commit meaningful changes**: Clear commit messages

### Automated Test Fixing

The project includes automated test fixing scripts:

```bash
# Run tests and attempt automatic fixes
./run_and_fix_test.sh

# Use the auto-fixer for complex issues
./auto-fixer.sh
```

---

## Testing Strategy

### London School TDD Approach

AIDO follows the **London School** (mockist) approach to TDD:

1. **Mock All Dependencies**: Services are always mocked in component tests
2. **Test Behavior, Not Implementation**: Verify interactions with mocks
3. **Outside-In Development**: Start with high-level tests, work inward
4. **Isolated Units**: Each component tested in complete isolation

### Test Structure Pattern

```typescript
describe('ComponentName', () => {
  // Mock services at the top
  const mockOpenAI = {
    generateProposal: vi.fn().mockResolvedValue('Generated content')
  };
  const mockDatabase = {
    saveProposal: vi.fn().mockResolvedValue({ id: '1', /* ... */ })
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should describe specific behavior', async () => {
    // Arrange: Set up mocks and render component
    render(
      <ComponentName
        openAIService={mockOpenAI}
        databaseService={mockDatabase}
      />
    );

    // Act: Perform user interactions
    const input = screen.getByLabelText('Input Label');
    await userEvent.type(input, 'test value');
    await userEvent.click(screen.getByText('Submit'));

    // Assert: Verify behavior
    await waitFor(() => {
      expect(mockOpenAI.generateProposal).toHaveBeenCalledWith('test value', expect.any(String));
    });
    expect(await screen.findByText('Success message')).toBeInTheDocument();
  });

  it('should handle errors gracefully', async () => {
    // Arrange: Mock error scenario
    mockOpenAI.generateProposal.mockRejectedValue(new Error('API Error'));
    render(<ComponentName openAIService={mockOpenAI} />);

    // Act: Trigger error condition
    await userEvent.click(screen.getByText('Generate'));

    // Assert: Verify error handling
    expect(await screen.findByText(/Error.*API Error/)).toBeInTheDocument();
  });
});
```

### Testing Utilities

**Essential Imports**:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
```

**Common Queries**:
- `screen.getByText('text')` - Find by text content
- `screen.getByLabelText('label')` - Find input by label
- `screen.getByTestId('test-id')` - Find by data-testid attribute
- `screen.findByText('text')` - Async find by text
- `screen.queryByText('text')` - Find without throwing error

**Async Testing**:
- Use `await waitFor(() => { /* assertions */ })` for async state updates
- Use `await act(async () => { /* actions */ })` for async actions
- Use `findBy*` queries for elements that appear asynchronously

### Coverage Requirements

Aim for:
- **Line Coverage**: > 90%
- **Branch Coverage**: > 85%
- **Function Coverage**: > 90%
- **Statement Coverage**: > 90%

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/index.html
```

---

## Component Architecture

### Core Components

#### 1. AgentNetwork

**Location**: `/home/user/aido/src/components/AgentNetwork/AgentNetwork.tsx`

**Purpose**: Manages AI agent network and proposal generation

**Props**:
```typescript
interface AgentNetworkProps {
  openAIService?: OpenAIService;
  databaseService?: DatabaseService;
  onProposalCreated?: (proposalId: string) => void;
}
```

**Key Features**:
- Load available agents from database
- Generate proposals using OpenAI
- Save proposals to database
- Notify parent on proposal creation

**State**:
- `topic: string` - Proposal topic
- `selectedSpecialty: string` - Agent specialty
- `proposal: string` - Generated proposal content
- `error: string` - Error messages
- `success: boolean` - Success status
- `agents: Agent[]` - Available agents
- `isLoading: boolean` - Loading state
- `isInitialized: boolean` - Initialization flag

**Usage Example**:
```typescript
<AgentNetwork
  openAIService={openAI}
  databaseService={db}
  onProposalCreated={(id) => console.log(`Proposal ${id} created`)}
/>
```

#### 2. DecisionMaking

**Location**: `/home/user/aido/src/components/DecisionMaking/DecisionMaking.tsx`

**Purpose**: Evaluates proposals using AI

**Props**:
```typescript
interface DecisionMakingProps {
  proposalId: string;
}
```

**Key Features**:
- Load proposal by ID
- Evaluate using OpenAI
- Save evaluation results
- Display scores and explanations

**State**:
- `proposal: Proposal | null` - Loaded proposal
- `evaluation: Evaluation | null` - Evaluation results
- `error: string` - Error messages
- `isEvaluating: boolean` - Evaluation in progress

#### 3. ConsensusAlgorithm

**Location**: `/home/user/aido/src/components/ConsensusAlgorithm/ConsensusAlgorithm.tsx`

**Purpose**: Implements consensus mechanism for proposals

**Props**:
```typescript
interface ConsensusAlgorithmProps {
  proposalId: string;
}
```

**Key Features**:
- Calculate consensus metrics
- Determine consensus strength
- Update proposal status
- Display consensus results

**State**:
- `proposal: Proposal | null`
- `evaluations: Evaluation[]`
- `metrics: ConsensusMetrics | null`
- `error: string`
- `isProcessing: boolean`
- `consensusReached: boolean`

#### 4. TaskAllocation

**Location**: `/home/user/aido/src/components/TaskAllocation/TaskAllocation.tsx`

**Purpose**: Allocates tasks to agents using AI matching

**Key Features**:
- Match tasks to best agents
- Display agent workload
- Save task allocations
- Validate task descriptions

**State**:
- `taskDescription: string`
- `agents: Agent[]`
- `selectedAgent: Agent | null`
- `workload: AgentWorkload | null`
- `error: string`
- `success: string`
- `isAllocating: boolean`

#### 5. PerformanceMonitoring

**Location**: `/home/user/aido/src/components/PerformanceMonitoring/PerformanceMonitoring.tsx`

**Purpose**: Displays system performance metrics

**Key Features**:
- Display proposal success rates
- Show task completion metrics
- Agent performance rankings
- Date range filtering
- Multiple metric views

**State**:
- `metrics: PerformanceMetrics | null`
- `error: string`
- `currentView: 'overview' | 'agents' | 'tasks'`
- `dateRange: DateRange`

### Component Best Practices

1. **Always use TypeScript interfaces** for props
2. **Implement error boundaries** for graceful failures
3. **Provide ARIA labels** for accessibility
4. **Use semantic HTML** elements
5. **Keep components focused** on single responsibility
6. **Extract reusable logic** into custom hooks if needed

---

## Service Layer

### DatabaseService

**Location**: `/home/user/aido/src/services/DatabaseService.ts`

**Purpose**: Abstracts all database operations

**Interface**:
```typescript
interface IDatabaseService {
  saveProposal(content: string, specialty: string): Promise<Proposal>;
  getAgents(): Promise<Agent[]>;
  getProposal(id: string): Promise<Proposal | null>;
  saveEvaluation(proposalId: string, score: number, explanation: string): Promise<Evaluation>;
  getEvaluations(proposalId: string): Promise<Evaluation[]>;
  updateProposalStatus(proposalId: string, status: 'accepted' | 'rejected'): Promise<Proposal>;
  saveTask(description: string, agentId: string, explanation: string): Promise<Task>;
  getAgentWorkload(agentId: string): Promise<AgentWorkload>;
  getPerformanceMetrics(dateRange?: DateRange): Promise<PerformanceMetrics>;
}
```

**Key Types**:
```typescript
interface Agent {
  id: string;
  name: string;
  specialty: string;
}

interface Proposal {
  id: string;
  content: string;
  agentSpecialty: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

interface Evaluation {
  id: string;
  proposalId: string;
  score: number;
  explanation: string;
  createdAt: Date;
}

interface Task {
  id: string;
  description: string;
  assignedAgentId: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed';
  createdAt: Date;
}

interface AgentWorkload {
  activeTaskCount: number;
  completionRate: number;
}

interface PerformanceMetrics {
  proposals: {
    total: number;
    accepted: number;
    rejected: number;
    averageEvaluationTime: number;
  };
  tasks: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
    averageCompletionTime: number;
  };
  agents: AgentPerformance[];
}
```

**Current Implementation**: Stub implementations that return mock data. Ready for real database integration.

### OpenAIService

**Location**: `/home/user/aido/src/services/OpenAIService.ts`

**Purpose**: Abstracts OpenAI API interactions

**Interface**:
```typescript
interface IOpenAIService {
  generateProposal(topic: string, specialty: string): Promise<string>;
  evaluateProposal(content: string): Promise<{
    score: number;
    explanation: string;
  }>;
  matchTask(
    description: string,
    agents: Array<{ id: string; specialty: string }>
  ): Promise<{
    agentId: string;
    explanation: string;
  }>;
}
```

**Usage**:
```typescript
const openAI = new OpenAIService(apiKey);

// Generate proposal
const proposal = await openAI.generateProposal('Cost Reduction', 'Finance');

// Evaluate proposal
const evaluation = await openAI.evaluateProposal(proposalContent);

// Match task to agent
const match = await openAI.matchTask(taskDescription, agents);
```

**Current Implementation**: Stub implementations. Ready for OpenAI API integration.

---

## Key Conventions

### Naming Conventions

1. **Components**: PascalCase (e.g., `AgentNetwork`)
2. **Functions**: camelCase (e.g., `handleGenerateProposal`)
3. **Variables**: camelCase (e.g., `isLoading`)
4. **Interfaces**: PascalCase with `I` prefix for service interfaces (e.g., `IOpenAIService`)
5. **Types**: PascalCase (e.g., `Proposal`, `Agent`)
6. **CSS Classes**: kebab-case (e.g., `error-message`, `form-group`)
7. **Test Files**: `ComponentName.test.tsx`
8. **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`)

### File Organization

```typescript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { OpenAIService } from '../../services/OpenAIService';

// 2. Type/Interface definitions
interface ComponentProps {
  // ...
}

// 3. Component definition
export const ComponentName: React.FC<ComponentProps> = ({ props }) => {
  // 4. State declarations
  const [state, setState] = useState<Type>(initialValue);

  // 5. Effect hooks
  useEffect(() => {
    // ...
  }, [dependencies]);

  // 6. Event handlers
  const handleEvent = async () => {
    // ...
  };

  // 7. JSX return
  return (
    <div className="component-name">
      {/* content */}
    </div>
  );
};
```

### TypeScript Practices

1. **Use strict mode**: Already configured in `tsconfig.json`
2. **Explicit return types**: For all public functions
3. **Avoid `any`**: Use proper types or `unknown`
4. **Use interfaces**: For object shapes
5. **Use type aliases**: For unions and primitives
6. **Enable all strict flags**: Already done

### CSS Practices

**Design System Variables**:
```css
:root {
  --primary-color: #2563eb;      /* Blue */
  --secondary-color: #1e40af;    /* Dark Blue */
  --background-color: #f3f4f6;   /* Light Gray */
  --text-color: #1f2937;         /* Dark Gray */
  --error-color: #dc2626;        /* Red */
  --success-color: #059669;      /* Green */
  --border-color: #e5e7eb;       /* Border Gray */
}
```

**Component Styling Pattern**:
```css
.component-name {
  /* Container styles */
}

.component-name .element {
  /* Element styles */
}

@media (max-width: 768px) {
  .component-name {
    /* Mobile styles */
  }
}
```

### Accessibility

1. **Use semantic HTML**: `<button>`, `<form>`, `<nav>`, etc.
2. **Provide ARIA labels**: `aria-label`, `role`, `aria-describedby`
3. **Keyboard navigation**: Ensure all interactions work with keyboard
4. **Error announcements**: Use `role="alert"` for error messages
5. **Form labels**: Always use `<label>` with `htmlFor`

---

## Error Handling Patterns

### Standard Error Pattern

```typescript
const handleOperation = async () => {
  try {
    setError('');
    setIsLoading(true);

    // Operation
    const result = await service.operation();

    // Success handling
    setSuccess(true);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    setError(`Operation failed: ${message}`);
  } finally {
    setIsLoading(false);
  }
};
```

### Validation Pattern

```typescript
const handleSubmit = async () => {
  // Reset error state
  setError('');

  // Validate inputs
  if (!input.trim()) {
    setError('Please enter a value');
    return;
  }

  if (!selectedOption) {
    setError('Please select an option');
    return;
  }

  // Proceed with operation
  try {
    await service.operation(input, selectedOption);
  } catch (err) {
    setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
};
```

### Error Display Pattern

```typescript
// In JSX
{error && (
  <div
    className="error-message"
    role="alert"
    data-testid="error-message"
  >
    {error}
  </div>
)}
```

### Service Error Pattern

```typescript
async operation(): Promise<Result> {
  if (!this.isInitialized) {
    throw new Error('Service not initialized');
  }

  try {
    const result = await externalAPI.call();
    if (!result) {
      throw new Error('No result returned');
    }
    return result;
  } catch (err) {
    throw new Error(`API call failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
}
```

---

## Common Development Tasks

### Adding a New Component

1. **Create component folder**:
```bash
mkdir -p src/components/NewComponent
touch src/components/NewComponent/NewComponent.tsx
touch src/components/NewComponent/NewComponent.test.tsx
```

2. **Write tests first** (TDD):
```typescript
// NewComponent.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NewComponent } from './NewComponent';

describe('NewComponent', () => {
  it('should render successfully', () => {
    render(<NewComponent />);
    expect(screen.getByText('Component Title')).toBeInTheDocument();
  });
});
```

3. **Implement component**:
```typescript
// NewComponent.tsx
import React, { useState } from 'react';

interface NewComponentProps {
  // Define props
}

export const NewComponent: React.FC<NewComponentProps> = (props) => {
  const [state, setState] = useState<Type>(initialValue);

  return (
    <div className="new-component">
      <h2>Component Title</h2>
      {/* Content */}
    </div>
  );
};
```

4. **Add to App.tsx** if needed for routing

### Adding a Service Method

1. **Update interface**:
```typescript
// DatabaseService.ts
interface IDatabaseService {
  // ... existing methods
  newMethod(param: Type): Promise<Result>;
}
```

2. **Write tests**:
```typescript
// Component.test.tsx
const mockDatabase = {
  newMethod: vi.fn().mockResolvedValue(expectedResult)
};
```

3. **Implement in service**:
```typescript
export class DatabaseService implements IDatabaseService {
  async newMethod(param: Type): Promise<Result> {
    // Implementation
  }
}
```

### Fixing Test Failures

1. **Read the error message carefully**
2. **Identify the type of failure**:
   - **Behavioral**: Mock not called or called incorrectly
   - **Contract**: Wrong return type or shape
   - **Implementation**: Logic error in component

3. **Fix based on failure type**:
```typescript
// Behavioral fix: Ensure mock is called
expect(mockService.method).toHaveBeenCalledWith(expectedArgs);

// Contract fix: Update mock return value
mockService.method.mockResolvedValue(correctShape);

// Implementation fix: Update component logic
```

4. **Use automated fixer if stuck**:
```bash
./run_and_fix_test.sh
```

### Running Specific Tests

```bash
# Run tests for specific component
npm test -- AgentNetwork

# Run single test file
npm test -- AgentNetwork.test.tsx

# Run tests matching pattern
npm test -- --grep "should generate proposal"

# Run with UI for debugging
npm run test:ui
```

---

## Git and Branch Strategy

### Branch Naming Convention

All development branches MUST follow this pattern:
```
claude/<description>-<session-id>
```

**Examples**:
- `claude/add-new-feature-B4YpE`
- `claude/fix-consensus-bug-X7mK2`
- `claude/refactor-services-Q9nP4`

**CRITICAL**: The session ID at the end must match the current session, otherwise push will fail with 403 error.

### Git Workflow

```bash
# Create and switch to feature branch
git checkout -b claude/feature-name-<SESSION_ID>

# Make changes and commit
git add .
git commit -m "feat: Add feature description"

# Push to remote (ALWAYS use -u flag)
git push -u origin claude/feature-name-<SESSION_ID>
```

### Commit Message Format

Follow conventional commits:

```
<type>: <description>

[optional body]

[optional footer]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `test`: Adding or updating tests
- `refactor`: Code refactoring
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `chore`: Build process or auxiliary tool changes

**Examples**:
```
feat: Implement proposal generation in AgentNetwork

fix: Resolve async test failures in DecisionMaking

test: Add comprehensive tests for ConsensusAlgorithm

refactor: Extract service interfaces for better testability
```

### Git Safety Rules

1. **NEVER update git config**
2. **NEVER run destructive commands** (hard reset, force push) without explicit user request
3. **NEVER skip hooks** (--no-verify) unless requested
4. **NEVER force push to main/master**
5. **Check authorship before amending**: `git log -1 --format='%an %ae'`
6. **Only commit when requested**: Don't be proactive with commits

### Network Retry Strategy

Git operations may fail due to network issues. Implement retry logic:

```bash
# Push with retry (up to 4 times with exponential backoff)
# Retry delays: 2s, 4s, 8s, 16s

for i in {1..4}; do
  git push -u origin branch-name && break
  [ $i -lt 4 ] && sleep $((2 ** i))
done
```

### Creating Pull Requests

When ready to create PR:

1. **Ensure all tests pass**: `npm test`
2. **Review all changes**: `git diff origin/main...HEAD`
3. **Create PR using gh CLI**:
```bash
gh pr create --title "feat: Description" --body "$(cat <<'EOF'
## Summary
- Bullet point summary of changes

## Test Plan
- [ ] All existing tests pass
- [ ] New tests added for new functionality
- [ ] Manual testing performed

## Related Issues
Closes #123
EOF
)"
```

---

## Troubleshooting

### Common Issues

#### Build Errors

```bash
# Clear and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Type Errors

```bash
# Run type check
npm run build

# Check specific file
npx tsc --noEmit src/components/Component/Component.tsx
```

#### Test Failures

```bash
# Clear test cache
rm -rf node_modules/.vitest

# Run specific test with verbose output
npm test -- --reporter=verbose ComponentName
```

#### Vite Cache Issues

```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Restart dev server
npm run dev
```

### Debug Mode

Enable verbose logging:

```typescript
// Add to component during debugging
useEffect(() => {
  console.log('State:', { state, variables });
}, [state, variables]);
```

Run tests with debug output:
```bash
DEBUG=* npm test
```

---

## Additional Resources

### Documentation Files

- **Architecture**: `/home/user/aido/docs/architecture.md` - System design and patterns
- **Development Guide**: `/home/user/aido/docs/development-guide.md` - Setup and workflows
- **Testing Guide**: `/home/user/aido/docs/testing-guide.md` - Testing examples
- **TDD Strategy**: `/home/user/aido/docs/test-driven-development.md` - TDD philosophy
- **Specification**: `/home/user/aido/docs/specification.md` - Technical specs

### Important File Locations

- **Main App**: `/home/user/aido/src/App.tsx`
- **Entry Point**: `/home/user/aido/src/main.tsx`
- **Components**: `/home/user/aido/src/components/`
- **Services**: `/home/user/aido/src/services/`
- **Tests**: Colocated with components
- **Config**: `/home/user/aido/src/vite.config.ts`, `vitest.config.ts`, `tsconfig.json`

### Quick Reference

**Starting Development**:
```bash
cd /home/user/aido/src
npm run dev
```

**Running Tests**:
```bash
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:ui             # UI mode
npm run test:coverage       # Coverage report
```

**Building**:
```bash
npm run build               # Production build
npm run preview             # Preview build
```

**Linting**:
```bash
npm run lint                # Run ESLint
```

---

## Best Practices Checklist

Before committing code, verify:

- [ ] All tests pass (`npm test`)
- [ ] No TypeScript errors (`npm run build`)
- [ ] No linting errors (`npm run lint`)
- [ ] All new components have tests
- [ ] All props have TypeScript interfaces
- [ ] Error handling is implemented
- [ ] Accessibility attributes are present
- [ ] Code follows naming conventions
- [ ] Commit message follows format
- [ ] Branch name follows pattern

---

## Contact and Support

For questions about:
- **Architecture**: See `docs/architecture.md`
- **Testing**: See `docs/testing-guide.md`
- **Development**: See `docs/development-guide.md`
- **TDD Philosophy**: See `docs/test-driven-development.md`

---

**Last Updated**: 2025-12-24

**Version**: 1.0.0

**Maintained by**: AIDO Development Team
