# Maia CRMA Exam Platform - Layout Features & Content Schemas

## Overview

This document provides a comprehensive overview of the layout components, features, and content schemas for the Maia CRMA (Certification in Risk Management Assurance) exam preparation platform.

## Layout Architecture

### 1. Root Layout (`app/layout.tsx`)

**Purpose**: Global application wrapper with base HTML structure

**Features**:
- Global CSS imports and font configuration
- Next.js metadata setup
- Font variable management (Inter font family)
- Root HTML structure with proper lang attribute

**Schema**:
```typescript
interface RootLayoutProps {
  children: React.ReactNode
}
```

### 2. Dashboard Layout (`app/dashboard/layout.tsx`)

**Purpose**: Main dashboard container with responsive sidebar and header

**Features**:
- Responsive sidebar with toggle functionality
- Integrated chat widget (Maia AI tutor)
- Layout header with contextual information
- Mobile-responsive design with sidebar state management
- Backdrop blur effects and modern glassmorphism design

**Schema**:
```typescript
interface DashboardLayoutProps {
  children: React.ReactNode
}

interface DashboardLayoutState {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}
```

## Core Components

### 3. Layout Header (`components/ui/layout-header.tsx`)

**Purpose**: Contextual header component for different page types

**Features**:
- Dynamic variant support (dashboard/unit)
- Breadcrumb navigation
- Search functionality
- Exam countdown timer
- Notification system
- User profile dropdown
- Responsive design with mobile optimization

**Schema**:
```typescript
interface LayoutHeaderProps {
  variant: 'dashboard' | 'unit'
  unitTitle?: string
  showBreadcrumbs?: boolean
  showSearch?: boolean
  examDaysLeft?: number
  onMenuClick?: () => void
}
```

### 4. Sidebar (`components/Sidebar.tsx`)

**Purpose**: Main navigation sidebar with AI integration

**Features**:
- Primary navigation links (Dashboard, Content, Test Builder, Mock Exams)
- AI Agent "Maia" quick-prompt menu with predefined prompts
- Quick action buttons (Progress Report, Quick Practice, Review Mistakes)
- Responsive design with mobile support
- Modern gradient styling and hover effects

**Schema**:
```typescript
interface SidebarProps {
  // No specific props - uses internal state
}

interface NavigationItem {
  label: string
  href: string
  icon: React.ComponentType
}

interface QuickAction {
  label: string
  description: string
  icon: React.ComponentType
  action: () => void
}
```

### 5. Chat Widget (`components/ChatWidget.tsx`)

**Purpose**: AI tutor chat interface

**Features**:
- Real-time chat with Maia AI tutor
- Keyword-based response simulation
- Message history management
- Typing indicators
- Contextual responses for readiness, improvement, study focus, and quiz generation

**Schema**:
```typescript
interface ChatWidgetProps {
  // No specific props - self-contained
}

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}
```

## Dashboard Components

### 6. Exam Readiness Overview (`components/dashboard/ExamReadinessOverview.tsx`)

**Purpose**: Visual representation of exam preparation progress

**Features**:
- Circular progress indicator with gradient styling
- Module-specific readiness breakdown
- Trend indicators (+5% from last week)
- Expandable detailed view
- SVG-based progress visualization

**Schema**:
```typescript
interface ExamReadinessProps {
  overallReadiness: number
  moduleReadiness: ModuleReadiness[]
  weeklyTrend: number
}

interface ModuleReadiness {
  name: string
  accuracy: number
  color: string
}
```

### 7. Modules Progress (`components/dashboard/ModulesProgress.tsx`)

**Purpose**: Learning module progress tracking

**Features**:
- Module cards with progress bars
- Difficulty level indicators (Easy, Intermediate, High)
- Status tracking (not-started, in-progress, completed)
- Estimated time requirements
- Action buttons based on module status
- Color-coded difficulty system

**Schema**:
```typescript
interface ModulesProgressProps {
  modules: Module[]
}

interface Module {
  id: string
  title: string
  description: string
  progress: number
  difficulty: 'Easy' | 'Intermediate' | 'High'
  estimatedHours: number
  status: 'not-started' | 'in-progress' | 'completed'
}
```

### 8. Exam Test Section (`components/dashboard/ExamTestSection.tsx`)

**Purpose**: Interactive testing and examination interface

**Features**:
- Custom Test Builder with AI-powered question selection
- Mock Exam cards with comprehensive statistics
- Adaptive difficulty based on performance
- Time tracking and user statistics
- Performance history and scoring

**Schema**:
```typescript
interface ExamTestSectionProps {
  // No specific props - uses static data
}

interface TestOption {
  id: string
  title: string
  description: string
  duration: string
  questionCount: number
  userStats?: {
    lastScore?: number
    attempts: number
    averageScore: number
  }
}
```

## Unit-Specific Components

### 9. Unit Page Header (`components/unit/UnitPageHeader.tsx`)

**Purpose**: Unit-specific header with progress and smart mode

**Features**:
- Breadcrumb navigation
- Unit title and progress display
- Smart Mode toggle with visual indicator
- Progress bar with lesson tracking
- Responsive design with mobile optimization
- Gradient styling and animations

**Schema**:
```typescript
interface UnitPageHeaderProps {
  unitTitle: string
  unitProgress: number
  onSmartModeToggle?: (enabled: boolean) => void
}
```

### 10. Tabs Container (`components/unit/TabsContainer.tsx`)

**Purpose**: Tabbed interface for unit content organization

**Features**:
- Six main tabs: Unit Content, My Notes, Flashcards, Key Takeaways, Retention Tips, Unit Quiz
- Icon-based navigation with responsive labels
- Glassmorphism design with backdrop blur
- Active state management
- Component-based tab content loading

**Schema**:
```typescript
interface TabsContainerProps {
  unitId: string
}

interface TabDefinition {
  id: string
  label: string
  icon: React.ComponentType
  component: React.ComponentType<{unitId: string}>
}
```

### 11. AI Tutor Sidebar (`components/unit/AiTutorSidebar.tsx`)

**Purpose**: Context-aware AI tutoring interface

**Features**:
- Minimizable/expandable sidebar
- Text selection explanation
- Quick prompt categories (explain, summarize, tips, quiz)
- Real-time chat with contextual responses
- Smart mode integration
- Progress-aware tutoring

**Schema**:
```typescript
interface AiTutorSidebarProps {
  unitId: string
  unitProgress: number
  selectedText: string
  onTextExplanation: (text: string) => void
  onClose?: () => void
}

interface QuickPrompt {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  prompt: string
  category: 'explain' | 'summarize' | 'tips' | 'quiz'
}

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  isTyping?: boolean
}
```

## Design System Features

### Visual Design Elements
- **Glassmorphism**: Backdrop blur effects with semi-transparent backgrounds
- **Gradient Styling**: Blue-to-purple gradients for primary elements
- **Responsive Design**: Mobile-first approach with breakpoint-specific layouts
- **Animation**: Smooth transitions and hover effects
- **Color Coding**: Semantic colors for different states and difficulty levels

### Accessibility Features
- Proper ARIA labels and semantic HTML
- Keyboard navigation support
- Screen reader compatibility
- High contrast color schemes
- Responsive text sizing

### Performance Optimizations
- Component lazy loading
- Efficient state management
- Optimized re-renders
- SVG icons for scalability
- Minimal bundle size

## Content Type Schemas

### Learning Content Schema
```typescript
interface LearningContent {
  id: string
  unitId: string
  type: 'text' | 'video' | 'interactive' | 'quiz'
  title: string
  content: string | VideoContent | InteractiveContent
  metadata: {
    estimatedReadTime: number
    difficulty: 'Easy' | 'Intermediate' | 'High'
    tags: string[]
    lastUpdated: Date
  }
}
```

### Assessment Schema
```typescript
interface Assessment {
  id: string
  type: 'quiz' | 'mock-exam' | 'custom-test'
  title: string
  questions: Question[]
  timeLimit: number
  passingScore: number
  metadata: {
    difficulty: string
    domain: string[]
    createdAt: Date
  }
}

interface Question {
  id: string
  type: 'multiple-choice' | 'true-false' | 'scenario'
  question: string
  options: string[]
  correctAnswer: string | string[]
  explanation: string
  difficulty: number
  domain: string
}
```

### User Progress Schema
```typescript
interface UserProgress {
  userId: string
  moduleProgress: {
    [moduleId: string]: {
      progress: number
      status: 'not-started' | 'in-progress' | 'completed'
      timeSpent: number
      lastAccessed: Date
    }
  }
  assessmentResults: {
    [assessmentId: string]: {
      score: number
      attempts: number
      bestScore: number
      completedAt: Date
    }
  }
  overallReadiness: number
}
```

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Components**: Custom React components with TypeScript
- **Icons**: Lucide React icon library
- **State Management**: React hooks (useState, useEffect)
- **Responsive Design**: Mobile-first Tailwind breakpoints

## Future Enhancements

1. **Real AI Integration**: Replace simulated responses with actual AI API
2. **Advanced Analytics**: Detailed learning analytics and insights
3. **Collaborative Features**: Study groups and peer interaction
4. **Offline Support**: Progressive Web App capabilities
5. **Personalization**: Advanced adaptive learning algorithms
6. **Accessibility**: Enhanced screen reader and keyboard navigation support

This documentation serves as a comprehensive guide for understanding the current layout architecture and provides schemas for future content development and feature expansion.