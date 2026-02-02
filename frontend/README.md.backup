# 🎓 IPI Smart Academic System - Frontend

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

Modern React APP SPA for Academic with implementation AI.

## ✨ Features

-   🔐 **Multi-Role Authentication** - Student, Profesor, Admin dashboards
-   👨‍🎓 **Student Portal** - Exam schedule, enrollment, grade tracking
-   👨‍🏫 **Professor Dashboard** - Subject management, exam creation, grading
-   🛡️ **Admin Panel** - User management, system configuration
-   💬 **AI Chatbot** - Integrated NLP service za akademske upite
-   🎨 **Modern UI** - TailwindCSS + Framer Motion animations
-   📱 **Responsive Design** - Mobile-first approach
-   ⚡ **Fast Performance** - Vite HMR, code splitting, lazy loading

## 🛠️ Tech Stack

| Category          | Technology             |
| ----------------- | ---------------------- |
| **Framework**     | React 18.3.1           |
| **Build Tool**    | Vite 5.4.10            |
| **Language**      | TypeScript 5.6.2       |
| **Styling**       | TailwindCSS 3.4.15     |
| **Routing**       | React Router 7.1.1     |
| **Animations**    | Framer Motion 11.15.0  |
| **UI Components** | Radix UI, Lottie React |
| **HTTP Client**   | Fetch API              |

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## ⚙️ Configuration

Create `.env` file:

```env
# Backend API URL
VITE_BACKEND_URL=http://localhost:3001

# NLP Service URL
VITE_NLP_URL=http://localhost:5000

# Environment
VITE_NODE_ENV=development
```

**Production (.env.production):**

```env
VITE_BACKEND_URL=https://ipi-smart-academic-system-dzhc.vercel.app
VITE_NLP_URL=https://amartubic.pythonanywhere.com
```

## 🚀 Running the App

```bash
# Development mode (HMR enabled)
npm run dev
# → http://localhost:5173

# Production build
npm run build
# → Output: dist/

# Preview production build
npm run preview
# → http://localhost:4173
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Auth/              # Authentication components
│   │   │   ├── Login.tsx
│   │   │   └── NotFound.tsx
│   │   │
│   │   ├── Dashboard/         # Role-based dashboards
│   │   │   ├── MainBoard.tsx          # Student dashboard
│   │   │   ├── ProfessorBoard.tsx     # Professor dashboard
│   │   │   ├── AdminBoard.tsx         # Admin dashboard
│   │   │   ├── Profile/
│   │   │   │   ├── Profile.tsx
│   │   │   │   └── ProfileSettings.tsx
│   │   │   └── Sidebar/
│   │   │       └── Dashboard.tsx
│   │   │
│   │   ├── Faculty/           # Academic features
│   │   │   ├── StudentExams.tsx
│   │   │   ├── StudentSchedule.tsx
│   │   │   └── AdminProfessorManagement.tsx
│   │   │
│   │   ├── Chat.tsx           # AI chatbot component
│   │   ├── HeroSite.tsx       # Landing page hero
│   │   └── ui/                # Reusable UI components
│   │
│   ├── contexts/
│   │   ├── Context.tsx        # Global auth state
│   │   └── ChatContext.tsx    # Chat state management
│   │
│   ├── constants/
│   │   └── storage.ts         # API URLs, localStorage keys
│   │
│   ├── types/
│   │   ├── auth.ts            # Authentication types
│   │   ├── user.ts            # User model types
│   │   └── chat.ts            # Chat message types
│   │
│   ├── assets/                # Images, animations
│   ├── App.tsx                # Main app component & routing
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles
│
├── public/
│   └── _redirects             # Netlify SPA routing
│
├── vite.config.ts             # Vite configuration
├── tailwind.config.js         # TailwindCSS config
└── tsconfig.json              # TypeScript config
```

## 🔑 Key Components

### Authentication Flow

**Login.tsx:**

```typescript
const handleLogin = async (email: string, password: string) => {
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (data.message === 'Success') {
        localStorage.setItem(STORAGE_KEYS.USER_EMAIL, data.userEmail)
        localStorage.setItem(STORAGE_KEYS.USER_TYPE, data.TipUsera)
        setUserType(data.TipUsera) // STUDENT | PROFESOR | ADMIN
        navigate('/dashboard')
    }
}
```

### Protected Routes

**App.tsx:**

```typescript
function App() {
  const { userType } = useUserContext();

  return (
    <Routes>
      <Route path="/" element={<HeroSite />} />
      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={
        userType === "STUDENT" ? <MainBoard /> :
        userType === "PROFESOR" ? <ProfessorBoard /> :
        <AdminBoard />
      }>
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<ProfileSettings />} />
        <Route path="exams" element={<StudentExams />} />
      </Route>
    </Routes>
  );
}
```

### Context Pattern

**Context.tsx:**

```typescript
interface UserContextType {
  userType: string | null;
  setUserType: (type: string) => void;
  logout: () => void;
}

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userType, setUserType] = useState<string | null>(
    localStorage.getItem(STORAGE_KEYS.USER_TYPE)
  );

  const logout = () => {
    localStorage.clear();
    setUserType(null);
    window.location.href = '/';
  };

  return (
    <UserContext.Provider value={{ userType, setUserType, logout }}>
      {children}
    </UserContext.Provider>
  );
};
```

### API Integration

**constants/storage.ts:**

```typescript
export const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

export const NLP_URL = import.meta.env.VITE_NLP_URL || 'http://localhost:5000'

export const STORAGE_KEYS = {
    USER_EMAIL: 'userEmail',
    USER_TYPE: 'userType',
    CHAT_HISTORY: 'chatHistory',
} as const
```

### AI Chatbot

**Chat.tsx:**

```typescript
const sendMessage = async (message: string) => {
    const response = await fetch(`${NLP_URL}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: message }),
    })

    const data = await response.json()

    // Typing animation effect
    setMessages([
        ...messages,
        {
            text: data.response,
            sender: 'bot',
            timestamp: new Date(),
        },
    ])
}
```

## 🎨 Styling

### TailwindCSS

**tailwind.config.js:**

```javascript
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#3B82F6',
                secondary: '#8B5CF6',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
            },
        },
    },
    plugins: [],
}
```

### Component Example

```tsx
export const Button: React.FC<{ variant: 'primary' | 'secondary' }> = ({
    variant,
}) => (
    <button
        className={`
    px-4 py-2 rounded-lg font-semibold transition-colors
    ${
        variant === 'primary'
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
    }
  `}
    >
        Click me
    </button>
)
```

## 📱 Responsive Design

```tsx
// Mobile-first approach
<div
    className="
  flex flex-col          // Mobile: column layout
  md:flex-row            // Tablet+: row layout
  gap-4                  // Spacing
  p-4 md:p-8             // Responsive padding
"
>
    <aside className="w-full md:w-64">Sidebar</aside>
    <main className="flex-1">Content</main>
</div>
```

## 🚀 Deployment

### Netlify

1. **Build command:** `npm run build`
2. **Publish directory:** `dist`
3. **Environment variables:**

    - `VITE_BACKEND_URL` = `https://ipi-smart-academic-system-dzhc.vercel.app`
    - `VITE_NLP_URL` = `https://amartubic.pythonanywhere.com`

4. **netlify.toml:**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**vercel.json:**

```json
{
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## 🧪 Testing

```bash
# Run tests (if configured)
npm run test

# Lint
npm run lint

# Type checking
npx tsc --noEmit
```

## 📊 Performance Optimization

### Code Splitting

```tsx
// Lazy load routes
const AdminBoard = lazy(() => import('./components/Dashboard/AdminBoard'))

;<Suspense fallback={<LoadingSpinner />}>
    <AdminBoard />
</Suspense>
```

### Image Optimization

```tsx
// Use WebP with fallback
<picture>
    <source srcSet="/image.webp" type="image/webp" />
    <img src="/image.jpg" alt="Description" loading="lazy" />
</picture>
```

### Vite Optimization

**vite.config.ts:**

```typescript
export default defineConfig({
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom'],
                    ui: ['framer-motion', '@radix-ui/react-dialog'],
                },
            },
        },
    },
})
```

## 🔍 Troubleshooting

### "Cannot find module" errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Environment variables not working

-   Ensure variables start with `VITE_`
-   Restart dev server after `.env` changes
-   Use `import.meta.env.VITE_VAR_NAME` (not `process.env`)

### Routing issues on Netlify

-   Add `_redirects` file: `/* /index.html 200`
-   Or use `netlify.toml` with redirect rules

### CORS errors

-   Check `VITE_BACKEND_URL` points to correct API
-   Ensure backend has CORS enabled for frontend origin

## 📚 Scripts Reference

```json
{
    "dev": "vite", // Start dev server
    "build": "tsc && vite build", // Production build
    "preview": "vite preview", // Preview prod build
    "lint": "eslint . --ext ts,tsx", // Lint code
    "format": "prettier --write src/" // Format code
}
```

## 🎯 Development Tips

1. **Use TypeScript strictly** - Enable strict mode in tsconfig.json
2. **Component organization** - Group by feature, not file type
3. **Custom hooks** - Extract logic from components
4. **Error boundaries** - Wrap routes with error handlers
5. **Loading states** - Always show feedback during async operations

## 🤝 Contributing

1. Branch naming: `feature/chat-ui`, `fix/login-redirect`
2. Follow existing code style (Prettier config)
3. Add TypeScript types for all props
4. Test on mobile devices before PR
5. Update this README if adding new features

## 📄 License

See [main README](../README.md) for license information.

---

**Live Demo:** Coming soon
