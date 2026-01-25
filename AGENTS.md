# Development Guide for Agentic Coding Agents

This document provides essential information for agentic coding agents working with this React + Vite frontend project.

## Build/Lint/Test Commands

### Package Management
This project uses pnpm for package management. Always use pnpm instead of npm.

```bash
# Install dependencies
pnpm install

# Add a new dependency
pnpm add package-name

# Add a development dependency
pnpm add -D package-name

# Remove a dependency
pnpm remove package-name
```

### Development Server
```bash
# Start development server with hot module replacement
pnpm run dev
```

### Build Commands
```bash
# Build for production
pnpm run build

# Preview production build locally
pnpm run preview
```

### Linting Commands
```bash
# Run ESLint to check for code style issues
pnpm run lint

# Run ESLint with automatic fixing
pnpm run lint --fix
```

### Testing Commands
This project currently does not have a testing framework configured. When adding tests:

1. Install a testing framework like vitest or jest:
```bash
pnpm add -D vitest
# or
pnpm add -D jest @testing-library/react
```

2. Add test scripts to package.json:
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

3. Run individual tests:
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run specific test file
pnpm test --testNamePattern="ComponentName"
```

## Code Style Guidelines

### File Structure and Organization
- Components are located in `src/components/` organized by domain/purpose
- Pages are in `src/pages/` organized by feature/module
- Reusable UI components are in `src/components/ui/`
- API service files are in `src/api/`
- Utility functions are in `src/lib/` and `src/utils/`
- Custom hooks are in `src/hooks/`
- Routes are defined in `src/routes/`

### Imports
1. Use absolute imports with `@/` alias for src directory:
   ```javascript
   import { Button } from '@/components/ui/button'
   import { useAuth } from '@/hooks/useAuth'
   ```

2. Import order:
   - React core imports first
   - External libraries
   - Internal project imports
   - Component-specific imports
   - Type imports (if using TypeScript)
   - Styles/CSS imports last

3. Destructure imports when possible:
   ```javascript
   // Good
   import { useState, useEffect } from 'react'
   import { Button } from '@/components/ui/button'
   
   // Avoid
   import React from 'react'
   import * as Button from '@/components/ui/button'
   ```

### Formatting
- Use Prettier with default settings (no custom configuration found)
- Component files use .jsx extension
- Files should be formatted with 2 space indentation
- Use semicolons consistently
- Use single quotes for strings where possible

### Component Structure
1. Prefer functional components with hooks:
   ```javascript
   import { useState, useEffect } from 'react'
   
   const MyComponent = ({ initialCount = 0 }) => {
     const [count, setCount] = useState(initialCount)
     
     useEffect(() => {
       // side effects
     }, [dependencies])
     
     return (
       <div>
         {/* Component JSX */}
       </div>
     )
   }
   
   export default MyComponent
   ```

2. Destructure props in the component signature:
   ```javascript
   const UserCard = ({ name, email, avatar }) => {
     // Use name, email, avatar directly
   }
   ```

### Naming Conventions
- Component names: PascalCase (e.g., UserProfile, Button)
- Function names: camelCase (e.g., handleClick, fetchData)
- Variable names: camelCase (e.g., userName, productList)
- File names: PascalCase for components (Button.jsx), camelCase for utilities
- CSS classes: Use Tailwind utility classes with `cn()` function for conditional classes

### Types and Type Checking
This project currently does not use TypeScript. When adding type safety:

1. Install TypeScript and related dependencies:
   ```bash
   pnpm add -D typescript @types/react @types/node
   ```

2. Rename files from .jsx to .tsx

3. Add type annotations for props and function parameters:
   ```javascript
   const Button = ({ children, onClick, variant = 'default' }) => {
     // Implementation
   }
   
   // With TypeScript
   const Button = ({ 
     children, 
     onClick, 
     variant = 'default' 
   }: { 
     children: React.ReactNode, 
     onClick: () => void, 
     variant: 'default' | 'outline' | 'ghost' 
   }) => {
     // Implementation
   }
   ```

### Error Handling
1. Use try/catch blocks for API calls:
   ```javascript
   const fetchData = async () => {
     try {
       const response = await api.get('/data')
       setData(response.data)
     } catch (error) {
       console.error('Error fetching data:', error)
       // Handle error appropriately
     }
   }
   ```

2. Use error boundaries for component-level error handling:
   ```javascript
   import { ErrorBoundary } from '@/components/common/ErrorBoundary'
   
   <ErrorBoundary>
     <MyComponent />
   </ErrorBoundary>
   ```

### API Integration
1. API calls are centralized in `src/api/` files
2. Use axios for HTTP requests (as seen in existing API files)
3. Handle loading states and error states in components:
   ```javascript
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState(null)
   
   const fetchData = async () => {
     setLoading(true)
     setError(null)
     try {
       const response = await api.get('/endpoint')
       setData(response.data)
     } catch (err) {
       setError(err.message)
     } finally {
       setLoading(false)
     }
   }
   ```

### State Management
1. Use React Context API for global state (as seen with AuthContext)
2. Use useState and useReducer for local component state
3. Use custom hooks to encapsulate state logic

### UI Components
1. UI components follow the shadcn/ui pattern:
   - Use Tailwind CSS for styling
   - Use Radix UI primitives for accessibility
   - Use class-variance-authority for variant management
   - Use `cn()` utility for conditional class names

2. Component structure:
   ```javascript
   import { cn } from '@/lib/utils'
   
   const Card = ({ className, ...props }) => {
     return (
       <div className={cn('bg-white rounded-lg shadow', className)} {...props} />
     )
   }
   ```

### Styling
1. Use Tailwind CSS classes exclusively
2. Use the `cn()` utility for conditional classes:
   ```javascript
   <div className={cn('text-red-500', isActive && 'font-bold')} />
   ```

3. Use the existing color palette defined in tailwind.config.js

### Performance
1. Use React.memo for components that render frequently
2. Use useMemo and useCallback for expensive computations
3. Implement code splitting with React.lazy and Suspense for large components
4. Optimize images with appropriate formats and sizing

### Accessibility
1. Use semantic HTML elements
2. Provide proper alt text for images
3. Ensure sufficient color contrast
4. Use ARIA attributes when necessary
5. Implement keyboard navigation support

## Cursor/Copilot Rules
There are currently no specific Cursor or Copilot rules files in the project. When adding such configurations, place them in:
- `.cursor/rules/` for Cursor-specific instructions
- `.github/copilot-instructions.md` for Copilot-specific guidance

## Project Specifics
- This is a React 18+ project using the new JSX transform
- Uses Vite as the build tool
- Uses Tailwind CSS for styling
- Uses shadcn/ui components built on Radix UI primitives
- Authentication is handled through a custom context
- API calls are made using axios with interceptors

## Best Practices
1. Always check for existing patterns in the codebase before implementing new features
2. Follow the existing component structure and patterns
3. Use the established error handling patterns
4. Maintain consistency with existing naming conventions
5. Ensure all new components are accessible
6. Write components to be reusable and properly typed
7. Use proper prop drilling prevention techniques (context/hooks)
8. Implement proper loading and error states for all data-fetching operations